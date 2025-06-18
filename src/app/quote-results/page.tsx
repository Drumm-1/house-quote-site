'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, DollarSign, Home, Calendar, Phone, Mail, AlertCircle } from 'lucide-react'
import { useAuth } from '@/components/auth/auth-context'
import { supabase } from '@/lib/supabase'
import type { Quote, Property } from '@/types/database'

interface QuoteWithProperty extends Quote {
  properties: Property
}

const timelineLabels: Record<string, string> = {
  'asap': 'As soon as possible',
  '30_days': 'Within 30 days',
  '60_days': 'Within 60 days',
  '90_days': 'Within 90 days',
  'flexible': 'Flexible'
}

export default function QuoteResults() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const [quote, setQuote] = useState<QuoteWithProperty | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchQuote = async () => {
      const quoteId = searchParams.get('quote_id')
      
      if (!quoteId) {
        setError('No quote ID provided')
        setLoading(false)
        return
      }

      if (!user) {
        setError('User not authenticated')
        setLoading(false)
        return
      }

      try {
        const { data, error: fetchError } = await supabase
          .from('quotes')
          .select(`
            *,
            properties (*)
          `)
          .eq('id', quoteId)
          .eq('user_id', user.id)
          .single()

        if (fetchError) {
          throw fetchError
        }

        if (!data) {
          setError('Quote not found')
          setLoading(false)
          return
        }

        setQuote(data as QuoteWithProperty)
      } catch (err) {
        console.error('Error fetching quote:', err)
        setError('Failed to load quote details')
      } finally {
        setLoading(false)
      }
    }

    fetchQuote()
  }, [searchParams, user])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const handleAcceptOffer = async () => {
    if (!quote) return

    try {
      const { error } = await supabase
        .from('quotes')
        .update({ status: 'accepted' })
        .eq('id', quote.id)

      if (error) {
        throw error
      }

      // Redirect to dashboard or next steps
      router.push('/dashboard')
    } catch (err) {
      console.error('Error accepting offer:', err)
      alert('There was an error accepting the offer. Please try again.')
    }
  }

  const handleDeclineOffer = async () => {
    if (!quote) return

    try {
      const { error } = await supabase
        .from('quotes')
        .update({ status: 'declined' })
        .eq('id', quote.id)

      if (error) {
        throw error
      }

      // Redirect to dashboard
      router.push('/dashboard')
    } catch (err) {
      console.error('Error declining offer:', err)
      alert('There was an error declining the offer. Please try again.')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your cash offer...</p>
        </div>
      </div>
    )
  }

  if (error || !quote) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <AlertCircle className="h-12 w-12 mx-auto mb-2" />
            <p className="text-lg font-semibold">Error Loading Quote</p>
            <p className="text-sm">{error || 'Quote not found'}</p>
          </div>
          <Button onClick={() => router.push('/get-quote')}>
            Get New Quote
          </Button>
        </div>
      </div>
    )
  }

  const property = quote.properties
  const isExpired = quote.expires_at && new Date(quote.expires_at) < new Date()

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-600" />
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Your Cash Offer is Ready!
          </h1>
          <p className="text-xl text-gray-600">
            Based on your property details, here's our competitive cash offer
          </p>
        </div>

        {/* Expiration Warning */}
        {isExpired && (
          <Card className="mb-8 border-2 border-red-200 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 text-red-800">
                <AlertCircle className="h-5 w-5" />
                <span className="font-medium">This offer has expired</span>
              </div>
              <p className="text-red-700 mt-1">
                Please contact us to get a new quote for your property.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Cash Offer Card */}
        <Card className={`mb-8 border-2 ${isExpired ? 'border-gray-200 bg-gray-50' : 'border-green-200 bg-green-50'}`}>
          <CardHeader className="text-center">
            <CardTitle className={`text-2xl flex items-center justify-center space-x-2 ${isExpired ? 'text-gray-600' : 'text-green-800'}`}>
              <DollarSign className="h-8 w-8" />
              <span>Your Cash Offer</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className={`text-5xl font-bold mb-4 ${isExpired ? 'text-gray-500' : 'text-green-600'}`}>
              {formatCurrency(quote.amount)}
            </div>
            <p className={`text-lg mb-6 ${isExpired ? 'text-gray-600' : 'text-green-700'}`}>
              {isExpired 
                ? 'This offer was valid for 7 days and included no fees or commissions'
                : 'This offer is valid for 7 days and includes no fees or commissions'
              }
            </p>
            
            {quote.expires_at && (
              <p className="text-sm text-gray-600 mb-6">
                {isExpired 
                  ? `Expired on ${new Date(quote.expires_at).toLocaleDateString()}`
                  : `Valid until ${new Date(quote.expires_at).toLocaleDateString()}`
                }
              </p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-6">
              <div className="bg-white rounded-lg p-4">
                <div className="font-semibold text-gray-900">No Repairs Needed</div>
                <div className="text-gray-600">We buy as-is</div>
              </div>
              <div className="bg-white rounded-lg p-4">
                <div className="font-semibold text-gray-900">Fast Closing</div>
                <div className="text-gray-600">Close in 7-14 days</div>
              </div>
              <div className="bg-white rounded-lg p-4">
                <div className="font-semibold text-gray-900">No Fees</div>
                <div className="text-gray-600">Zero hidden costs</div>
              </div>
            </div>

            {/* Action Buttons */}
            {!isExpired && quote.status === 'pending' && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={handleAcceptOffer}
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
                  size="lg"
                >
                  Accept Offer
                </Button>
                <Button 
                  onClick={handleDeclineOffer}
                  variant="outline"
                  className="border-gray-300 text-gray-700 px-8 py-3"
                  size="lg"
                >
                  Decline Offer
                </Button>
              </div>
            )}

            {quote.status === 'accepted' && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800 font-medium">✓ Offer Accepted</p>
                <p className="text-blue-700 text-sm">We'll contact you shortly to begin the closing process.</p>
              </div>
            )}

            {quote.status === 'declined' && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-gray-800 font-medium">Offer Declined</p>
                <p className="text-gray-700 text-sm">Thank you for considering our offer.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Property Summary */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Home className="h-6 w-6 text-blue-600" />
              <span>Property Summary</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Address</h3>
                <p className="text-gray-600">{property.address}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Property Details</h3>
                <div className="space-y-1 text-gray-600">
                  <p>{property.bedrooms} bedrooms, {property.bathrooms} bathrooms</p>
                  <p>{property.square_feet?.toLocaleString()} sq ft</p>
                  <p>Built in {property.year_built}</p>
                  <p>Condition: {property.condition}</p>
                  {property.property_type && <p>Type: {property.property_type.replace('_', ' ')}</p>}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Phone className="h-6 w-6 text-blue-600" />
              <span>Your Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Contact Details</h3>
                <div className="space-y-2 text-gray-600">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4" />
                    <span>{user?.email}</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Timeline & Motivation</h3>
                <div className="space-y-1 text-gray-600">
                  {quote.timeline && (
                    <p>Timeline: {timelineLabels[quote.timeline] || quote.timeline}</p>
                  )}
                  {quote.motivation && (
                    <p>Motivation: {quote.motivation}</p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-6 w-6 text-blue-600" />
              <span>Next Steps</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {quote.status === 'pending' && !isExpired ? (
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                  <div>
                    <h4 className="font-medium text-gray-900">Review Your Offer</h4>
                    <p className="text-gray-600">Take your time to review the cash offer details above.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-gray-300 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                  <div>
                    <h4 className="font-medium text-gray-900">Accept or Decline</h4>
                    <p className="text-gray-600">Let us know your decision using the buttons above.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-gray-300 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                  <div>
                    <h4 className="font-medium text-gray-900">Close Quickly</h4>
                    <p className="text-gray-600">If accepted, we can close in as little as 7 days.</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Button onClick={() => router.push('/dashboard')}>
                  Go to Dashboard
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Help Section */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-2">
            Questions about your offer? Call us at{' '}
            <a 
              href="tel:+15551234567" 
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              (555) 123-4567
            </a>
          </p>
          <p className="text-sm text-gray-500">
            Available Monday - Friday, 8AM - 8PM EST
          </p>
        </div>
      </div>
    </div>
  )
} 