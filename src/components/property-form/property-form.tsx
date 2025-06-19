'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/auth/auth-context'
import { supabase } from '@/lib/supabase'
import { ProgressBar } from './progress-bar'
import { Step1Address, type AddressData } from './step1-address'
import { Step2Details, type PropertyDetailsData } from './step2-details'
import { Step3Condition, type ConditionData } from './step3-condition'
import { Step4Contact, type ContactData } from './step4-contact'

type FormData = {
  address: AddressData
  details: PropertyDetailsData
  condition: ConditionData
  contact: ContactData
}

const stepLabels = [
  'Address',
  'Details',
  'Condition & Photos',
  'Contact Preferences'
]

export function PropertyForm() {
  const router = useRouter()
  const { user } = useAuth()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<Partial<FormData>>({})

  // Debug: Log when component loads
  console.log('🏠 PropertyForm component loaded, user:', user)
  console.log('🏠 Current step:', currentStep)

  const handleStep1Complete = (data: AddressData) => {
    setFormData(prev => ({ ...prev, address: data }))
    setCurrentStep(2)
  }

  const handleStep2Complete = (data: PropertyDetailsData) => {
    setFormData(prev => ({ ...prev, details: data }))
    setCurrentStep(3)
  }

  const handleStep3Complete = (data: ConditionData) => {
    setFormData(prev => ({ ...prev, condition: data }))
    setCurrentStep(4)
  }

  const handleStep4Complete = async (data: ContactData) => {
    console.log('🏠 handleStep4Complete called with:', data)
    console.log('🏠 Current user:', user)
    console.log('🏠 Form data so far:', formData)
    
    // Add alert to make sure we're reaching this point
    console.log('🏠 Starting form submission process...')
    
    if (!user) {
      console.error('🏠 User not authenticated')
      alert('You must be logged in to submit a property. Please log in and try again.')
      return
    }

    setFormData(prev => ({ ...prev, contact: data }))
    setIsSubmitting(true)

    try {
      const completeFormData = {
        ...formData,
        contact: data
      } as FormData

      console.log('🏠 Submitting form data:', completeFormData)

      // Validate that all required form data is present
      if (!completeFormData.address || !completeFormData.details || !completeFormData.condition || !completeFormData.contact) {
        console.error('🏠 Missing form data:', {
          hasAddress: !!completeFormData.address,
          hasDetails: !!completeFormData.details,
          hasCondition: !!completeFormData.condition,
          hasContact: !!completeFormData.contact
        })
        throw new Error('Missing required form data. Please go back and complete all steps.')
      }

      // Create property record in Supabase
      console.log('🏠 Creating property record...')
      const { data: propertyData, error: propertyError } = await supabase
        .from('properties')
        .insert({
          user_id: user.id,
          address: `${completeFormData.address.address}, ${completeFormData.address.city}, ${completeFormData.address.state} ${completeFormData.address.zipCode}`,
          city: completeFormData.address.city,
          state: completeFormData.address.state,
          zip_code: completeFormData.address.zipCode,
          bedrooms: parseInt(completeFormData.details.bedrooms),
          bathrooms: parseFloat(completeFormData.details.bathrooms),
          square_feet: parseInt(completeFormData.details.squareFeet),
          year_built: parseInt(completeFormData.details.yearBuilt),
          property_type: completeFormData.details.propertyType,
          lot_size: completeFormData.details.lotSize,
          condition: completeFormData.condition.condition,
          description: completeFormData.condition.additionalNotes || null,
          status: 'active'
        })
        .select()
        .single()

      if (propertyError) {
        console.error('🏠 Property creation error:', propertyError)
        console.error('🏠 Property error details:', JSON.stringify(propertyError, null, 2))
        throw propertyError
      }

      console.log('🏠 Property created successfully:', propertyData)

      // Create quote using direct insert (since RPC function has issues)
      console.log('🏠 Creating quote...')
      
      const { data: quoteData, error: quoteError } = await supabase
        .from('quotes')
        .insert({
          property_id: propertyData.id,
          user_id: user.id,
          amount: 0, // Will be calculated later
          timeline: completeFormData.contact.timeline,
          motivation: completeFormData.contact.motivation || '',
          status: 'pending',
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
          calculation_details: {
            status: 'calculating',
            started_at: new Date().toISOString()
          }
        })
        .select()
        .single()

      if (quoteError) {
        console.error('🏠 Quote creation error:', quoteError)
        console.error('🏠 Quote error details:', JSON.stringify(quoteError, null, 2))
        throw quoteError
      }

      console.log('🏠 Quote created successfully:', quoteData)
      const quoteId = quoteData.id

      // Redirect to dashboard instead of quote results
      router.push('/dashboard?new_quote=true')
      
    } catch (error) {
      console.error('🏠 Error submitting form:', error)
      console.error('🏠 Error type:', typeof error)
      console.error('🏠 Error details:', JSON.stringify(error, null, 2))
      setIsSubmitting(false)
      
      // Show more specific error message
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      console.error('🏠 Final error message shown to user:', errorMessage)
      alert(`There was an error submitting your property: ${errorMessage}. Please try again.`)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Debug Info - Remove in production */}
        {process.env.NODE_ENV === 'development' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <h4 className="font-medium text-yellow-800">🐛 Debug Info</h4>
            <p className="text-sm text-yellow-700">
              User: {user ? `✅ ${user.email}` : '❌ Not authenticated'} | 
              Step: {currentStep}/4 | 
              Submitting: {isSubmitting ? 'Yes' : 'No'}
            </p>
            <p className="text-xs text-yellow-600 mt-1">
              Check browser console (F12) for detailed logs with 🏠 emoji
            </p>
          </div>
        )}
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Get Your Cash Offer
          </h1>
          <p className="text-xl text-gray-600">
            Tell us about your property and receive an instant cash offer
          </p>
        </div>

        {/* Progress Bar */}
        <ProgressBar 
          currentStep={currentStep} 
          totalSteps={4} 
          stepLabels={stepLabels}
        />

        {/* Form Steps */}
        <div className="mt-8">
          {currentStep === 1 && (
            <Step1Address 
              onNext={handleStep1Complete}
              initialData={formData.address}
            />
          )}
          
          {currentStep === 2 && (
            <Step2Details 
              onNext={handleStep2Complete}
              onBack={handleBack}
              initialData={formData.details}
            />
          )}
          
          {currentStep === 3 && (
            <Step3Condition 
              onNext={handleStep3Complete}
              onBack={handleBack}
              initialData={formData.condition}
            />
          )}
          
          {currentStep === 4 && (
            <Step4Contact 
              onNext={handleStep4Complete}
              onBack={handleBack}
              initialData={formData.contact}
              isSubmitting={isSubmitting}
            />
          )}
        </div>

        {/* Additional Info */}
        <div className="mt-12 text-center">
          <div className="bg-white rounded-lg shadow-sm p-6 max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Why Choose InstantHomeBuyer?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
              <div className="flex flex-col items-center space-y-2">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold">10m</span>
                </div>
                <span>Get offers in 10 minutes</span>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-bold">7d</span>
                </div>
                <span>Close in as little as 7 days</span>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 font-bold">$0</span>
                </div>
                <span>No fees or commissions</span>
              </div>
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-2">
            Need help? Call us at{' '}
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