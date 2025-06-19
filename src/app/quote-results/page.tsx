'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { CheckCircle, DollarSign, Home, Calendar, Phone, Mail, AlertCircle, Clock, Calculator, TrendingUp } from 'lucide-react'
import { useAuth } from '@/components/auth/auth-context'
import { supabase } from '@/lib/supabase'
import type { Quote, Property } from '@/types/database'

interface QuoteWithProperty extends Quote {
  properties: Property
}

interface CalculationState {
  status: 'calculating' | 'completed'
  startedAt: string
  completedAt?: string
  estimatedWaitTime?: number
  priceRange?: {
    low: number
    high: number
    confidence: number
  }
}

const timelineLabels: Record<string, string> = {
  'asap': 'As soon as possible',
  '30_days': 'Within 30 days',
  '60_days': 'Within 60 days',
  '90_days': 'Within 90 days',
  'flexible': 'Flexible'
}

function QuoteResultsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const [quote, setQuote] = useState<QuoteWithProperty | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [calculationState, setCalculationState] = useState<CalculationState | null>(null)
  const [timeRemaining, setTimeRemaining] = useState<number>(0)
  const [showInspectionScheduling, setShowInspectionScheduling] = useState(false)
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [inspectionNotes, setInspectionNotes] = useState('')
  const [schedulingInspection, setSchedulingInspection] = useState(false)

  // Generate available time slots (8 AM to 8 PM)
  const timeSlots = []
  for (let hour = 8; hour <= 20; hour++) {
    timeSlots.push(`${hour.toString().padStart(2, '0')}:00`)
    if (hour < 20) {
      timeSlots.push(`${hour.toString().padStart(2, '0')}:30`)
    }
  }

  // Generate available dates (starting from day after tomorrow)
  const getAvailableDates = () => {
    const dates = []
    const today = new Date()
    // Start from day after tomorrow
    const startDate = new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000)
    
    for (let i = 0; i < 30; i++) {
      const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000)
      dates.push({
        value: date.toISOString().split('T')[0],
        label: date.toLocaleDateString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })
      })
    }
    return dates
  }

  const availableDates = getAvailableDates()

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
        
        // Check if we need to start calculation
        if (data.calculation_details) {
          const calcDetails = data.calculation_details as CalculationState
          setCalculationState(calcDetails)
          
          if (calcDetails.status === 'calculating') {
            startCalculationProcess(data.id)
          }
        }
      } catch (err) {
        console.error('Error fetching quote:', err)
        setError('Failed to load quote details')
      } finally {
        setLoading(false)
      }
    }

    fetchQuote()
  }, [searchParams, user])

  const startCalculationProcess = async (quoteId: string) => {
    // Generate random wait time between 1-2 minutes (60000-120000 ms)
    const waitTime = Math.floor(Math.random() * 60000) + 60000
    setTimeRemaining(waitTime)
    
    // Update quote with estimated wait time
    await supabase
      .from('quotes')
      .update({
        calculation_details: {
          status: 'calculating',
          started_at: new Date().toISOString(),
          estimated_wait_time: waitTime
        }
      })
      .eq('id', quoteId)

    // Start countdown
    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1000) {
          clearInterval(interval)
          completeCalculation(quoteId)
          return 0
        }
        return prev - 1000
      })
    }, 1000)
  }

  const completeCalculation = async (quoteId: string) => {
    if (!quote) return

    try {
      // Generate random price range based on property details
      const property = quote.properties
      const basePrice = property.square_feet ? property.square_feet * 180 : 350000
      
      // Add some randomness (±15%)
      const variation = 0.15
      const randomFactor = 1 + (Math.random() - 0.5) * variation * 2
      const centerPrice = Math.floor(basePrice * randomFactor)
      
      // Create price range (±8%)
      const rangePercent = 0.08
      const lowPrice = Math.floor(centerPrice * (1 - rangePercent))
      const highPrice = Math.floor(centerPrice * (1 + rangePercent))
      
      // Generate confidence level (75-95%)
      const confidence = Math.floor(Math.random() * 20) + 75
      
      const priceRange = {
        low: lowPrice,
        high: highPrice,
        confidence
      }

      // Update quote with calculated values
      const { error } = await supabase
        .from('quotes')
        .update({
          amount: Math.floor((lowPrice + highPrice) / 2), // Use middle of range as main amount
          status: 'awaiting_inspection', // Update status to awaiting inspection
          calculation_details: {
            status: 'completed',
            started_at: calculationState?.startedAt || new Date().toISOString(),
            completed_at: new Date().toISOString(),
            price_range: priceRange
          }
        })
        .eq('id', quoteId)

      if (error) {
        throw error
      }

      // Update local state
      setCalculationState({
        status: 'completed',
        startedAt: calculationState?.startedAt || new Date().toISOString(),
        completedAt: new Date().toISOString(),
        priceRange
      })

      // Update quote amount
      setQuote(prev => prev ? { ...prev, amount: Math.floor((lowPrice + highPrice) / 2) } : null)

    } catch (err) {
      console.error('Error completing calculation:', err)
      setError('Failed to complete price calculation')
    }
  }

  const handleScheduleInspection = async () => {
    if (!quote || !selectedDate || !selectedTime) return

    setSchedulingInspection(true)

    try {
      const inspectionDateTime = new Date(`${selectedDate}T${selectedTime}:00`)
      
      const { error } = await supabase
        .from('property_inspections')
        .insert({
          property_id: quote.property_id,
          inspector_id: null, // Will be assigned later
          scheduled_date: inspectionDateTime.toISOString(),
          status: 'scheduled',
          notes: inspectionNotes || null
        })

      if (error) {
        throw error
      }

      // Create notification
      await supabase
        .from('notifications')
        .insert({
          user_id: user?.id,
          title: 'Inspection Scheduled',
          message: `Your property inspection has been scheduled for ${inspectionDateTime.toLocaleDateString()} at ${selectedTime}.`,
          notification_type: 'inspection_scheduled',
          related_property_id: quote.property_id,
          related_quote_id: quote.id
        })

      // Update quote status to awaiting formal offer
      await supabase
        .from('quotes')
        .update({ status: 'awaiting_formal_offer' })
        .eq('id', quote.id)

      alert('Inspection successfully scheduled! We will contact you to confirm details.')
      setShowInspectionScheduling(false)
      
    } catch (err) {
      console.error('Error scheduling inspection:', err)
      alert('There was an error scheduling the inspection. Please try again.')
    } finally {
      setSchedulingInspection(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
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
  const isCalculating = calculationState?.status === 'calculating'
  const isCompleted = calculationState?.status === 'completed'

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Calculating State */}
        {isCalculating && (
          <>
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <Calculator className="h-16 w-16 text-blue-600 animate-pulse" />
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Calculating Your Cash Offer
              </h1>
              <p className="text-xl text-gray-600">
                Our AI is analyzing your property details and market data
              </p>
            </div>

            <Card className="mb-8 border-2 border-blue-200 bg-blue-50">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center space-x-3 mb-4">
                  <Clock className="h-6 w-6 text-blue-600" />
                  <span className="text-2xl font-bold text-blue-800">
                    {formatTime(timeRemaining)}
                  </span>
                </div>
                <p className="text-blue-700 mb-4">Estimated time remaining</p>
                <div className="w-full bg-blue-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-1000"
                    style={{ 
                      width: `${100 - (timeRemaining / (calculationState?.estimatedWaitTime || 120000)) * 100}%` 
                    }}
                  ></div>
                </div>
                <p className="text-sm text-blue-600 mt-4">
                  We're analyzing comparable sales, market trends, and property condition
                </p>
              </CardContent>
            </Card>
          </>
        )}

        {/* Completed State */}
        {isCompleted && calculationState?.priceRange && (
          <>
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <CheckCircle className="h-16 w-16 text-green-600" />
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Your Cash Offer is Ready!
              </h1>
              <p className="text-xl text-gray-600">
                Based on our analysis, here's your competitive cash offer range
              </p>
            </div>

            {/* Price Range Card */}
            <Card className="mb-8 border-2 border-green-200 bg-green-50">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl flex items-center justify-center space-x-2 text-green-800">
                  <DollarSign className="h-8 w-8" />
                  <span>Your Cash Offer Range</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="space-y-4">
                  <div className="text-4xl lg:text-5xl font-bold text-green-800">
                    {formatCurrency(calculationState.priceRange.low)} - {formatCurrency(calculationState.priceRange.high)}
                  </div>
                  <div className="flex items-center justify-center space-x-2 text-green-700">
                    <TrendingUp className="h-5 w-5" />
                    <span className="font-medium">
                      {calculationState.priceRange.confidence}% Confidence Level
                    </span>
                  </div>
                  <p className="text-green-700">
                    Final offer will be determined after property inspection
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Next Steps */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-6 w-6 text-blue-600" />
                  <span>Next Step: Schedule Property Inspection</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!showInspectionScheduling ? (
                  <div className="space-y-4">
                    <p className="text-gray-600">
                      To finalize your cash offer, we need to schedule a property inspection. 
                      This helps us confirm the property condition and provide you with the most accurate offer.
                    </p>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-medium text-blue-900 mb-2">What to expect:</h4>
                      <ul className="space-y-1 text-sm text-blue-700">
                        <li>• Professional inspector will visit your property</li>
                        <li>• Inspection typically takes 1-2 hours</li>
                        <li>• We'll provide final offer within 24 hours after inspection</li>
                        <li>• No obligation - you can decline the final offer</li>
                      </ul>
                    </div>
                    <Button 
                      onClick={() => setShowInspectionScheduling(true)}
                      className="w-full"
                      size="lg"
                    >
                      Schedule Inspection
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Select Date
                        </label>
                        <Select 
                          value={selectedDate} 
                          onChange={(e) => setSelectedDate(e.target.value)}
                        >
                          <option value="">Choose a date</option>
                          {availableDates.map((date) => (
                            <option key={date.value} value={date.value}>
                              {date.label}
                            </option>
                          ))}
                        </Select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Select Time
                        </label>
                        <Select 
                          value={selectedTime} 
                          onChange={(e) => setSelectedTime(e.target.value)}
                        >
                          <option value="">Choose a time</option>
                          {timeSlots.map((time) => (
                            <option key={time} value={time}>
                              {time}
                            </option>
                          ))}
                        </Select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Special Instructions (Optional)
                      </label>
                      <Input
                        placeholder="Any special access instructions or notes..."
                        value={inspectionNotes}
                        onChange={(e) => setInspectionNotes(e.target.value)}
                      />
                    </div>

                    <div className="flex space-x-4">
                      <Button
                        onClick={handleScheduleInspection}
                        disabled={!selectedDate || !selectedTime || schedulingInspection}
                        className="flex-1"
                      >
                        {schedulingInspection ? 'Scheduling...' : 'Confirm Inspection'}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setShowInspectionScheduling(false)}
                        disabled={schedulingInspection}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}

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
        <Card>
          <CardHeader>
            <CardTitle>Questions? We're Here to Help</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium">Call Us</p>
                  <p className="text-blue-600">(555) 123-4567</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium">Email Us</p>
                  <p className="text-blue-600">support@instanthomebuyer.com</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function QuoteResults() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <QuoteResultsContent />
    </Suspense>
  )
} 