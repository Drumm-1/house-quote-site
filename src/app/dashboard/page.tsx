'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ProtectedRoute } from '@/components/auth/protected-route'
import { useAuth } from '@/components/auth/auth-context'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
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
  const router = useRouter()
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')
  const [quotes, setQuotes] = useState<QuoteWithProperty[]>([])
  const [stats, setStats] = useState<DashboardStats>({
    activeQuotes: 0,
    totalOffers: 0,
    properties: 0,
    completed: 0
  })
  const [loading, setLoading] = useState(true)

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
      const activeQuotes = quotesWithProperties.filter(q => q.status === 'pending').length
      const totalOffers = quotesWithProperties.length
      const completed = quotesWithProperties.filter(q => ['accepted', 'closed'].includes(q.status)).length
      
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'reviewed': return 'bg-blue-100 text-blue-800'
      case 'offer_made': return 'bg-purple-100 text-purple-800'
      case 'accepted': return 'bg-green-100 text-green-800'
      case 'declined': return 'bg-red-100 text-red-800'
      case 'closed': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'Pending Review'
      case 'reviewed': return 'Under Review'
      case 'offer_made': return 'Offer Made'
      case 'accepted': return 'Accepted'
      case 'declined': return 'Declined'
      case 'closed': return 'Closed'
      default: return status
    }
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Welcome back! Here's an overview of your property quotes.</p>
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
                            Quote submitted on {new Date(quote.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(quote.status)}`}>
                            {getStatusLabel(quote.status)}
                          </span>
                          <span className="font-semibold text-gray-900">
                            {formatCurrency(quote.amount)}
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
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{quote.properties.address}</h3>
                          <p className="text-gray-600">
                            {quote.properties.bedrooms} bed, {quote.properties.bathrooms} bath • {quote.properties.square_feet?.toLocaleString()} sq ft
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(quote.status)}`}>
                          {getStatusLabel(quote.status)}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-600">Offer Amount</p>
                          <p className="text-xl font-bold text-green-600">{formatCurrency(quote.amount)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Submitted</p>
                          <p className="font-medium">{new Date(quote.created_at).toLocaleDateString()}</p>
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
                        {quote.status === 'pending' && (
                          <>
                            <Button size="sm" className="bg-green-600 hover:bg-green-700">
                              Accept Offer
                            </Button>
                            <Button variant="outline" size="sm">
                              Decline
                            </Button>
                          </>
                        )}
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
    </ProtectedRoute>
  )
} 