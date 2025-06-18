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
  'Condition',
  'Contact'
]

export function PropertyForm() {
  const router = useRouter()
  const { user } = useAuth()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<Partial<FormData>>({})

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
    if (!user) {
      console.error('User not authenticated')
      return
    }

    setFormData(prev => ({ ...prev, contact: data }))
    setIsSubmitting(true)

    try {
      const completeFormData = {
        ...formData,
        contact: data
      } as FormData

      // Create property record in Supabase
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
          status: 'active'
        })
        .select()
        .single()

      if (propertyError) {
        throw propertyError
      }

      // Create quote using the database function
      const { data: quoteId, error: quoteError } = await supabase
        .rpc('create_property_quote', {
          p_property_id: propertyData.id,
          p_user_id: user.id,
          p_timeline: completeFormData.contact.timeline,
          p_motivation: completeFormData.contact.motivation || ''
        })

      if (quoteError) {
        throw quoteError
      }

      // Redirect to quote results page with the quote ID
      router.push(`/quote-results?quote_id=${quoteId}`)
      
    } catch (error) {
      console.error('Error submitting form:', error)
      setIsSubmitting(false)
      // TODO: Show error message to user
      alert('There was an error submitting your property. Please try again.')
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