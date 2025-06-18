import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { status } = await request.json()
    const quoteId = params.id

    if (!status || !['accepted', 'declined'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be "accepted" or "declined"' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Update quote status
    const { data: quote, error: updateError } = await supabase
      .from('quotes')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', quoteId)
      .select('*, properties(*)')
      .single()

    if (updateError) {
      console.error('Error updating quote:', updateError)
      return NextResponse.json(
        { error: 'Failed to update quote status' },
        { status: 500 }
      )
    }

    // Create notification for status change
    await supabase
      .from('notifications')
      .insert({
        user_id: quote.user_id,
        title: status === 'accepted' ? 'Offer Accepted!' : 'Offer Declined',
        message: status === 'accepted' 
          ? `You've accepted our offer of $${quote.amount.toLocaleString()} for ${quote.properties.address}. We'll contact you shortly to begin the closing process.`
          : `You've declined our offer for ${quote.properties.address}. Thank you for considering InstantHomeBuyer.`,
        notification_type: status === 'accepted' ? 'offer_accepted' : 'offer_declined',
        related_property_id: quote.property_id,
        related_quote_id: quote.id
      })

    // Log the activity
    await supabase
      .from('property_history')
      .insert({
        property_id: quote.property_id,
        changed_by: quote.user_id,
        change_type: `quote_${status}`,
        new_values: {
          quote_id: quote.id,
          status,
          timestamp: new Date().toISOString()
        }
      })

    return NextResponse.json({ 
      success: true, 
      quote: {
        id: quote.id,
        status: quote.status,
        amount: quote.amount
      }
    })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 