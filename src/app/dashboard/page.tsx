'use client'

import { useState, useEffect, Suspense } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { ProtectedRoute } from '@/components/auth/protected-route'
import { useAuth } from '@/components/auth/auth-context'
import { supabase } from '@/lib/supabase'
import { useRouter, useSearchParams } from 'next/navigation'
import { CheckCircle, RefreshCw, Calendar, X } from 'lucide-react'
import type { Quote, Property } from '@/types/database'

interface QuoteWithProperty extends Quote {
  properties: Property
}

interface DashboardStats {
  activeQuotes: number
  totalOffers: number
  properties: number
  completed: number
}

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <Suspense fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your dashboard...</p>
          </div>
        </div>
      }>
        <DashboardContent />
      </Suspense>
    </ProtectedRoute>
  )
}

function DashboardContent() {
  const router = useRouter()
  const { user, userInfo } = useAuth()
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState('overview')
  const [quotes, setQuotes] = useState<QuoteWithProperty[]>([])
  const [stats, setStats] = useState<DashboardStats>({
    activeQuotes: 0,
    totalOffers: 0,
    properties: 0,
    completed: 0
  })
  const [loading, setLoading] = useState(true)
  const [showNotification, setShowNotification] = useState(false)
  const [notificationMessage, setNotificationMessage] = useState('')
  const [notificationType, setNotificationType] = useState<'success' | 'info'>('success')

  // Inspection scheduling state
  const [showInspectionModal, setShowInspectionModal] = useState(false)
  const [selectedQuoteForInspection, setSelectedQuoteForInspection] = useState<QuoteWithProperty | null>(null)
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [inspectionNotes, setInspectionNotes] = useState('')
  const [schedulingInspection, setSchedulingInspection] = useState(false)

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'quotes', label: 'My Quotes' },
    { id: 'properties', label: 'Properties' },
    { id: 'documents', label: 'Documents' },
    { id: 'messages', label: 'Messages' },
    { id: 'settings', label: 'Settings' }
  ]

  useEffect(() => {
    if (user) {
      fetchDashboardData()
    }
  }, [user])

  // Check for new quote parameter and show notification
  useEffect(() => {
    if (searchParams.get('new_quote') === 'true') {
      setShowNotification(true)
      setNotificationMessage('Quote submitted! Calculating your offer...')
      setNotificationType('info')
      // Auto-hide after 3 seconds
      setTimeout(() => setShowNotification(false), 3000)
    }
  }, [searchParams])

  // Handle quote calculations on dashboard
  useEffect(() => {
    const handleCalculatingQuotes = async () => {
      // Find quotes that need calculation started
      const calculatingQuotes = quotes.filter(quote => {
        if (!quote.calculation_details) return false
        const calcDetails = quote.calculation_details as any
        return calcDetails.status === 'calculating' && !calcDetails.countdown_started
      })

      for (const quote of calculatingQuotes) {
        startQuoteCalculation(quote.id)
      }
    }

    if (quotes.length > 0) {
      handleCalculatingQuotes()
    }
  }, [quotes])

  const startQuoteCalculation = async (quoteId: string) => {
    // Generate random wait time between 1-2 minutes (60000-120000 ms)
    const waitTime = Math.floor(Math.random() * 60000) + 60000
    
    // Mark calculation as started
    await supabase
      .from('quotes')
      .update({
        calculation_details: {
          status: 'calculating',
          started_at: new Date().toISOString(),
          estimated_wait_time: waitTime,
          countdown_started: true
        }
      })
      .eq('id', quoteId)

    // Start countdown
    setTimeout(() => {
      completeQuoteCalculation(quoteId)
    }, waitTime)
  }

  const completeQuoteCalculation = async (quoteId: string) => {
    const quote = quotes.find(q => q.id === quoteId)
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
          amount: Math.floor((lowPrice + highPrice) / 2),
          status: 'awaiting_inspection',
          calculation_details: {
            status: 'completed',
            started_at: new Date().toISOString(),
            completed_at: new Date().toISOString(),
            price_range: priceRange
          }
        })
        .eq('id', quoteId)

      if (error) {
        throw error
      }

      // Refresh dashboard data to show updated quote
      fetchDashboardData()

      // Show completion notification
      setShowNotification(true)
      setNotificationMessage('Price calculation complete! Your offer is ready.')
      setNotificationType('success')
      setTimeout(() => setShowNotification(false), 4000)

    } catch (err) {
      console.error('Error completing calculation:', err)
    }
  }

  const fetchDashboardData = async () => {
    if (!user) return

    try {
      // Fetch quotes with property details
      const { data: quotesData, error: quotesError } = await supabase
        .from('quotes')
        .select(`
          *,
          properties (*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (quotesError) {
        throw quotesError
      }

      const quotesWithProperties = quotesData as QuoteWithProperty[]
      setQuotes(quotesWithProperties)

      // Calculate stats
      const activeQuotes = quotesWithProperties.filter(q => 
        ['pending', 'awaiting_inspection', 'awaiting_formal_offer', 'awaiting_customer_review'].includes(q.status || 'pending')
      ).length
      const totalOffers = quotesWithProperties.length
      const completed = quotesWithProperties.filter(q => q.status && ['accepted', 'closed'].includes(q.status)).length
      
      // Get unique properties count
      const uniqueProperties = new Set(quotesWithProperties.map(q => q.property_id)).size

      setStats({
        activeQuotes,
        totalOffers,
        properties: uniqueProperties,
        completed
      })

    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
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

  // Format price range for completed quotes
  const formatPriceRange = (quote: QuoteWithProperty) => {
    if (!quote.calculation_details) return formatCurrency(quote.amount)
    
    const calcDetails = quote.calculation_details as any
    if (calcDetails.status === 'completed' && calcDetails.price_range) {
      const { low, high } = calcDetails.price_range
      
      // Format as "500-600K" for thousands or "1.2-1.5M" for millions
      const formatShort = (amount: number) => {
        if (amount >= 1000000) {
          return `${(amount / 1000000).toFixed(1)}M`
        } else if (amount >= 1000) {
          return `${Math.round(amount / 1000)}K`
        }
        return formatCurrency(amount)
      }
      
      const lowFormatted = formatShort(low)
      const highFormatted = formatShort(high)
      
      return `$${lowFormatted} - $${highFormatted}`
    }
    
    return formatCurrency(quote.amount)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-blue-100 text-blue-800'
      case 'calculating': return 'bg-yellow-100 text-yellow-800'
      case 'awaiting_inspection': return 'bg-orange-100 text-orange-800'
      case 'awaiting_formal_offer': return 'bg-purple-100 text-purple-800'
      case 'awaiting_customer_review': return 'bg-indigo-100 text-indigo-800'
      case 'accepted': return 'bg-green-100 text-green-800'
      case 'declined': return 'bg-red-100 text-red-800'
      case 'closed': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'Calculating Price'
      case 'calculating': return 'Calculating Price'
      case 'awaiting_inspection': return 'Awaiting Inspection'
      case 'awaiting_formal_offer': return 'Awaiting Formal Offer'
      case 'awaiting_customer_review': return 'Awaiting Customer Review'
      case 'accepted': return 'Accepted'
      case 'declined': return 'Declined'
      case 'closed': return 'Closed'
      default: return status
    }
  }

  // Check if a quote is currently calculating
  const isCalculating = (quote: QuoteWithProperty) => {
    // Check if status is pending (initial state) or if calculation_details shows calculating
    if (quote.status === 'pending') return true
    
    if (!quote.calculation_details) return false
    const calcDetails = quote.calculation_details as any
    return calcDetails.status === 'calculating'
  }

  const openInspectionModal = (quote: QuoteWithProperty) => {
    console.log('🔍 Opening inspection modal for quote:', quote.id, 'Status:', quote.status)
    setSelectedQuoteForInspection(quote)
    setShowInspectionModal(true)
    console.log('🔍 Modal state set to true')
    setSelectedDate('')
    setSelectedTime('')
    setInspectionNotes('')
  }

  const closeInspectionModal = () => {
    setShowInspectionModal(false)
    setSelectedQuoteForInspection(null)
    setSelectedDate('')
    setSelectedTime('')
    setInspectionNotes('')
  }

  const handleScheduleInspection = async () => {
    if (!selectedQuoteForInspection || !selectedDate || !selectedTime) return

    setSchedulingInspection(true)

    try {
      // Convert time of day to a specific time for database storage
      let timeString = '09:00' // Default morning time
      if (selectedTime === 'afternoon') {
        timeString = '14:00' // 2 PM
      } else if (selectedTime === 'evening') {
        timeString = '17:00' // 5 PM
      }

      const inspectionDateTime = new Date(`${selectedDate}T${timeString}:00`)
      
      const { error } = await supabase
        .from('property_inspections')
        .insert({
          property_id: selectedQuoteForInspection.property_id,
          inspector_id: null, // Will be assigned later
          scheduled_date: inspectionDateTime.toISOString(),
          status: 'scheduled',
          notes: inspectionNotes || null
        })

      if (error) {
        throw error
      }

      // Create notification with time of day
      const timeOfDayLabel = selectedTime === 'morning' ? 'Morning' : 
                           selectedTime === 'afternoon' ? 'Afternoon' : 'Evening'
      
      await supabase
        .from('notifications')
        .insert({
          user_id: user?.id,
          title: 'Inspection Scheduled',
          message: `Your property inspection has been scheduled for ${inspectionDateTime.toLocaleDateString()} in the ${timeOfDayLabel}.`,
          notification_type: 'inspection_scheduled',
          related_property_id: selectedQuoteForInspection.property_id,
          related_quote_id: selectedQuoteForInspection.id
        })

      // Update quote status to awaiting formal offer
      await supabase
        .from('quotes')
        .update({ status: 'awaiting_formal_offer' })
        .eq('id', selectedQuoteForInspection.id)

      // Show success notification
      setShowNotification(true)
      setNotificationMessage('Inspection successfully scheduled!')
      setNotificationType('success')
      setTimeout(() => setShowNotification(false), 4000)

      // Close modal and refresh data
      closeInspectionModal()
      fetchDashboardData()
      
    } catch (err) {
      console.error('Error scheduling inspection:', err)
      alert('There was an error scheduling the inspection. Please try again.')
    } finally {
      setSchedulingInspection(false)
    }
  }

  const getAvailableDates = () => {
    const today = new Date()
    const minDate = new Date(today)
    minDate.setDate(today.getDate() + 2) // Day after tomorrow
    
    const maxDate = new Date(today)
    maxDate.setDate(today.getDate() + 32) // 30 days from day after tomorrow
    
    return {
      min: minDate.toISOString().split('T')[0],
      max: maxDate.toISOString().split('T')[0]
    }
  }

  const getAvailableTimeSlots = () => {
    return [
      { value: 'morning', label: 'Morning (8:00 AM - 12:00 PM)' },
      { value: 'afternoon', label: 'Afternoon (12:00 PM - 5:00 PM)' },
      { value: 'evening', label: 'Evening (5:00 PM - 8:00 PM)' }
    ]
  }

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your dashboard...</p>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Notification Popup */}
        {showNotification && (
          <div className={`fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 flex items-center space-x-2 text-white ${
            notificationType === 'success' ? 'bg-green-500' : 'bg-blue-500'
          }`}>
            <CheckCircle className="h-5 w-5" />
            <span>{notificationMessage}</span>
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              {userInfo?.first_name ? `Welcome back, ${userInfo.first_name}!` : 'Dashboard'}
            </h1>
            <p className="text-gray-600">Here's an overview of your property quotes and recent activity.</p>
          </div>

          {/* Tab Navigation */}
          <div className="border-b border-gray-200 mb-8">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="p-6">
                  <div className="flex items-center">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-600">Active Quotes</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.activeQuotes}</p>
                    </div>
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 text-sm font-bold">📋</span>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-600">Total Offers</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.totalOffers}</p>
                    </div>
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 text-sm font-bold">💰</span>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-600">Properties</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.properties}</p>
                    </div>
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-purple-600 text-sm font-bold">🏠</span>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-600">Completed</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
                    </div>
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                      <span className="text-orange-600 text-sm font-bold">✅</span>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Quick Actions */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button 
                    onClick={() => router.push('/get-quote')}
                    className="h-auto p-4 flex flex-col items-center space-y-2"
                  >
                    <span className="text-2xl">🏡</span>
                    <span>Get New Quote</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-auto p-4 flex flex-col items-center space-y-2"
                    onClick={() => setActiveTab('documents')}
                  >
                    <span className="text-2xl">📄</span>
                    <span>Upload Documents</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-auto p-4 flex flex-col items-center space-y-2"
                    onClick={() => setActiveTab('messages')}
                  >
                    <span className="text-2xl">📅</span>
                    <span>Schedule Inspection</span>
                  </Button>
                </div>
              </Card>

              {/* Recent Activity */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                {quotes.length > 0 ? (
                  <div className="space-y-4">
                    {quotes.slice(0, 5).map((quote) => (
                      <div key={quote.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{quote.properties.address}</p>
                          <p className="text-sm text-gray-600">
                            Quote submitted on {quote.created_at ? new Date(quote.created_at).toLocaleDateString() : 'N/A'}
                          </p>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(quote.status || 'pending')}`}>
                            {getStatusLabel(quote.status || 'pending')}
                          </span>
                          <span className="font-semibold text-gray-900">
                            {isCalculating(quote) ? 'Calculating...' : formatPriceRange(quote)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-600 mb-4">No quotes yet</p>
                    <Button onClick={() => router.push('/get-quote')}>
                      Get Your First Quote
                    </Button>
                  </div>
                )}
              </Card>
            </div>
          )}

          {activeTab === 'quotes' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">My Quotes</h2>
                <Button onClick={() => router.push('/get-quote')}>
                  Get New Quote
                </Button>
              </div>

              {quotes.length > 0 ? (
                <div className="grid gap-6">
                  {quotes.map((quote) => (
                    <Card key={quote.id} className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center space-x-3">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{quote.properties.address}</h3>
                            <p className="text-gray-600">
                              {quote.properties.bedrooms} bed, {quote.properties.bathrooms} bath • {quote.properties.square_feet?.toLocaleString()} sq ft
                            </p>
                          </div>
                          {isCalculating(quote) && (
                            <RefreshCw className="h-5 w-5 text-blue-600 animate-spin" />
                          )}
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(quote.status || 'pending')}`}>
                          {getStatusLabel(quote.status || 'pending')}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-600">Offer Amount</p>
                          <div className="flex items-center space-x-2">
                            <p className="text-xl font-bold text-green-600">
                              {isCalculating(quote) ? 'Calculating...' : formatPriceRange(quote)}
                            </p>
                            {isCalculating(quote) && (
                              <RefreshCw className="h-4 w-4 text-blue-600 animate-spin" />
                            )}
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Submitted</p>
                          <p className="font-medium">{quote.created_at ? new Date(quote.created_at).toLocaleDateString() : 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Expires</p>
                          <p className="font-medium">
                            {quote.expires_at ? new Date(quote.expires_at).toLocaleDateString() : 'N/A'}
                          </p>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => router.push(`/quote-results?quote_id=${quote.id}`)}
                        >
                          View Details
                        </Button>
                        {quote.status === 'awaiting_inspection' && (
                          <>
                            <Button 
                              size="sm" 
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => {
                                console.log('🔍 Schedule Inspection clicked for quote:', quote.id, 'Status:', quote.status)
                                openInspectionModal(quote)
                              }}
                            >
                              Schedule Inspection
                            </Button>
                            <Button variant="outline" size="sm">
                              Decline
                            </Button>
                          </>
                        )}
                        {quote.status === 'awaiting_customer_review' && (
                          <>
                            <Button size="sm" className="bg-green-600 hover:bg-green-700">
                              Accept Offer
                            </Button>
                            <Button variant="outline" size="sm">
                              Decline
                            </Button>
                          </>
                        )}
                        {/* Debug: Show all quote statuses */}
                        <div className="text-xs text-gray-500">
                          Status: {quote.status} | ID: {quote.id}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="p-8 text-center">
                  <p className="text-gray-600 mb-4">You haven't submitted any quotes yet.</p>
                  <Button onClick={() => router.push('/get-quote')}>
                    Get Your First Quote
                  </Button>
                </Card>
              )}
            </div>
          )}

          {activeTab === 'properties' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">My Properties</h2>
              <Card className="p-8 text-center">
                <p className="text-gray-600">Property management features coming soon.</p>
              </Card>
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Documents</h2>
              <Card className="p-8 text-center">
                <p className="text-gray-600">Document management features coming soon.</p>
              </Card>
            </div>
          )}

          {activeTab === 'messages' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Messages</h2>
              <Card className="p-8 text-center">
                <p className="text-gray-600">Messaging features coming soon.</p>
              </Card>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
              <Card className="p-8 text-center">
                <p className="text-gray-600">Settings features coming soon.</p>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Inspection Scheduling Modal */}
      {showInspectionModal && selectedQuoteForInspection && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4" style={{ zIndex: 9999 }}>
          {/* Debug indicator */}
          <div className="absolute top-4 left-4 bg-red-500 text-white p-2 rounded">
            Modal is showing! Quote: {selectedQuoteForInspection.id}
          </div>
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Schedule Property Inspection</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={closeInspectionModal}
                  className="p-1"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-2">Property Address</p>
                  <p className="font-medium">{selectedQuoteForInspection.properties.address}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Date
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={getAvailableDates().min}
                    max={getAvailableDates().max}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Time of Day
                  </label>
                  <select
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={!selectedDate}
                  >
                    <option value="">Choose a time of day...</option>
                    {getAvailableTimeSlots().map((slot) => (
                      <option key={slot.value} value={slot.value}>
                        {slot.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Special Instructions (Optional)
                  </label>
                  <textarea
                    value={inspectionNotes}
                    onChange={(e) => setInspectionNotes(e.target.value)}
                    placeholder="Any special instructions or notes for the inspector..."
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                  />
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <Calendar className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div className="text-sm text-blue-800">
                      <p className="font-medium mb-1">What to expect:</p>
                      <ul className="space-y-1 text-blue-700">
                        <li>• Inspector will arrive at scheduled time</li>
                        <li>• Inspection typically takes 1-2 hours</li>
                        <li>• You'll receive a detailed report within 24 hours</li>
                        <li>• Final offer will be presented after inspection</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <Button
                    onClick={handleScheduleInspection}
                    disabled={!selectedDate || !selectedTime || schedulingInspection}
                    className="flex-1"
                  >
                    {schedulingInspection ? 'Scheduling...' : 'Schedule Inspection'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={closeInspectionModal}
                    disabled={schedulingInspection}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </ProtectedRoute>
  )
} 