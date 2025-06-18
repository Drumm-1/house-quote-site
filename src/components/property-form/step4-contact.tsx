'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { User, Phone, AlertCircle, Clock, Shield } from 'lucide-react'
import { useAuth } from '@/components/auth/auth-context'

interface Step4ContactProps {
  onNext: (data: ContactData) => void
  onBack: () => void
  initialData?: ContactData
  isSubmitting?: boolean
}

export interface ContactData {
  phone: string
  timeline: string
  motivation: string
}

const timelineOptions = [
  { value: 'asap', label: 'As soon as possible' },
  { value: '30_days', label: 'Within 30 days' },
  { value: '60_days', label: 'Within 60 days' },
  { value: '90_days', label: 'Within 90 days' },
  { value: 'flexible', label: 'I\'m flexible' }
]

export function Step4Contact({ onNext, onBack, initialData, isSubmitting = false }: Step4ContactProps) {
  const { user } = useAuth()
  const [formData, setFormData] = useState<ContactData>({
    phone: initialData?.phone || '',
    timeline: initialData?.timeline || '',
    motivation: initialData?.motivation || ''
  })
  
  const [errors, setErrors] = useState<Partial<ContactData>>({})

  const validateForm = () => {
    const newErrors: Partial<ContactData> = {}
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    } else if (!/^[\d\s\-\(\)\+]+$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number'
    }
    if (!formData.timeline) {
      newErrors.timeline = 'Please select your timeline'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    onNext(formData)
  }

  const handleInputChange = (field: keyof ContactData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const formatPhoneNumber = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '')
    
    // Format as (XXX) XXX-XXXX
    if (digits.length >= 10) {
      return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`
    } else if (digits.length >= 6) {
      return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
    } else if (digits.length >= 3) {
      return `(${digits.slice(0, 3)}) ${digits.slice(3)}`
    }
    return digits
  }

  const handlePhoneChange = (value: string) => {
    const formatted = formatPhoneNumber(value)
    handleInputChange('phone', formatted)
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center space-x-2 mb-2">
          <User className="h-6 w-6 text-blue-600" />
          <CardTitle className="text-2xl">Contact Information</CardTitle>
        </div>
        <p className="text-gray-600">
          We're almost done! Just need your phone number and timeline to send your 
          instant cash offer.
        </p>
        {user?.email && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-4">
            <p className="text-sm text-green-800">
              <strong>Email:</strong> {user.email} ✓
            </p>
            <p className="text-xs text-green-600 mt-1">
              Your cash offer will be sent to this verified email address.
            </p>
          </div>
        )}
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Phone Number */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number *
            </label>
            <div className="relative">
              <Input
                id="phone"
                type="tel"
                placeholder="(555) 123-4567"
                value={formData.phone}
                onChange={(e) => handlePhoneChange(e.target.value)}
                className={`pl-10 ${errors.phone ? 'border-red-500' : ''}`}
                disabled={isSubmitting}
              />
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
            {errors.phone && (
              <div className="flex items-center mt-1 text-red-600 text-sm">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.phone}
              </div>
            )}
          </div>

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
              <Shield className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-gray-900">Your Privacy is Protected</h4>
                <p className="text-sm text-gray-600 mt-1">
                  We never sell your information to third parties. Your contact details will only be used 
                  to provide your cash offer and coordinate the sale process.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
              disabled={isSubmitting}
              className="px-8"
            >
              Back
            </Button>
            
            <Button
              type="submit"
              disabled={isSubmitting}
              className="px-8 bg-blue-600 hover:bg-blue-700"
            >
              {isSubmitting ? 'Getting Your Offer...' : 'Get My Cash Offer'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
} 