'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { User, Phone, AlertCircle, Clock, Shield, Mail } from 'lucide-react'
import { useAuth } from '@/components/auth/auth-context'

interface Step4ContactProps {
  onNext: (data: ContactData) => void
  onBack: () => void
  initialData?: ContactData
  isSubmitting?: boolean
}

export interface ContactData {
  timeline: string
  motivation: string
  preferredContact: string
  bestTimeToCall: string
}

const timelineOptions = [
  { value: 'asap', label: 'As soon as possible' },
  { value: '30_days', label: 'Within 30 days' },
  { value: '60_days', label: 'Within 60 days' },
  { value: '90_days', label: 'Within 90 days' },
  { value: 'flexible', label: 'I\'m flexible' }
]

const contactOptions = [
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Phone call' },
  { value: 'text', label: 'Text message' },
  { value: 'any', label: 'Any method is fine' }
]

const timeOptions = [
  { value: 'morning', label: 'Morning (8 AM - 12 PM)' },
  { value: 'afternoon', label: 'Afternoon (12 PM - 5 PM)' },
  { value: 'evening', label: 'Evening (5 PM - 8 PM)' },
  { value: 'anytime', label: 'Anytime' }
]

export function Step4Contact({ onNext, onBack, initialData, isSubmitting = false }: Step4ContactProps) {
  const { user } = useAuth()
  const [formData, setFormData] = useState<ContactData>({
    timeline: initialData?.timeline || '',
    motivation: initialData?.motivation || '',
    preferredContact: initialData?.preferredContact || 'email',
    bestTimeToCall: initialData?.bestTimeToCall || 'anytime'
  })
  
  const [errors, setErrors] = useState<Partial<ContactData>>({})

  const validateForm = () => {
    const newErrors: Partial<ContactData> = {}
    
    if (!formData.timeline) {
      newErrors.timeline = 'Please select your timeline'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('🏠 Step4Contact: Form submitted')
    console.log('🏠 Step4Contact: Form data:', formData)
    
    if (!validateForm()) {
      console.log('🏠 Step4Contact: Form validation failed')
      return
    }

    console.log('🏠 Step4Contact: Calling onNext with data:', formData)
    onNext(formData)
  }

  const handleInputChange = (field: keyof ContactData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center space-x-2 mb-2">
          <User className="h-6 w-6 text-blue-600" />
          <CardTitle className="text-2xl">Contact Preferences</CardTitle>
        </div>
        <p className="text-gray-600">
          We're almost done! Just need to know your timeline and how you'd like us to contact you 
          about your instant cash offer.
        </p>
        {user?.email && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-4">
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4 text-green-600" />
              <p className="text-sm text-green-800">
                <strong>Email:</strong> {user.email} ✓
              </p>
            </div>
            <p className="text-xs text-green-600 mt-1">
              Your cash offer will be sent to this verified email address.
            </p>
          </div>
        )}
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Timeline */}
          <div>
            <label htmlFor="timeline" className="block text-sm font-medium text-gray-700 mb-2">
              When do you need to sell? *
            </label>
            <div className="relative">
              <Select
                value={formData.timeline}
                onChange={(e) => handleInputChange('timeline', e.target.value)}
                disabled={isSubmitting}
                className={`pl-10 ${errors.timeline ? 'border-red-500' : ''}`}
              >
                <option value="">Select your timeline</option>
                {timelineOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
            {errors.timeline && (
              <div className="flex items-center mt-1 text-red-600 text-sm">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.timeline}
              </div>
            )}
          </div>

          {/* Preferred Contact Method */}
          <div>
            <label htmlFor="preferredContact" className="block text-sm font-medium text-gray-700 mb-2">
              How would you like us to contact you?
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {contactOptions.map((option) => (
                <div
                  key={option.value}
                  className={`
                    relative border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-md
                    ${formData.preferredContact === option.value 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 bg-white hover:border-gray-300'
                    }
                  `}
                  onClick={() => handleInputChange('preferredContact', option.value)}
                >
                  <input
                    type="radio"
                    name="preferredContact"
                    value={option.value}
                    checked={formData.preferredContact === option.value}
                    onChange={() => handleInputChange('preferredContact', option.value)}
                    className="absolute top-4 right-4 h-4 w-4 text-blue-600"
                  />
                  <p className="font-medium text-gray-900 pr-6">{option.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Best Time to Call (only show if phone/text selected) */}
          {(formData.preferredContact === 'phone' || formData.preferredContact === 'text' || formData.preferredContact === 'any') && (
            <div>
              <label htmlFor="bestTimeToCall" className="block text-sm font-medium text-gray-700 mb-2">
                Best time to call/text?
              </label>
              <div className="relative">
                <Select
                  value={formData.bestTimeToCall}
                  onChange={(e) => handleInputChange('bestTimeToCall', e.target.value)}
                  disabled={isSubmitting}
                  className="pl-10"
                >
                  {timeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          )}

          {/* Motivation */}
          <div>
            <label htmlFor="motivation" className="block text-sm font-medium text-gray-700 mb-2">
              Why are you selling? (Optional)
            </label>
            <Textarea
              id="motivation"
              placeholder="Relocating, downsizing, inherited property, facing foreclosure, etc..."
              value={formData.motivation}
              onChange={(e) => handleInputChange('motivation', e.target.value)}
              className="min-h-[100px]"
              disabled={isSubmitting}
            />
            <p className="text-sm text-gray-500 mt-1">
              This helps us understand your situation and provide better service.
            </p>
          </div>

          {/* Privacy Notice */}
          <div className="bg-gray-50 border border-gray-300 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Shield className="h-5 w-5 text-gray-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Your Privacy Matters</h4>
                <p className="text-sm text-gray-600">
                  We'll only use your contact information to discuss your property sale. 
                  We never share your information with third parties or use it for marketing purposes.
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onBack}
              className="px-8"
              disabled={isSubmitting}
            >
              Back
            </Button>
            <Button 
              type="submit"
              className="px-8"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Getting Your Offer...' : 'Get My Cash Offer'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
} 