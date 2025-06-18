'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { MapPin, AlertCircle } from 'lucide-react'

interface Step1AddressProps {
  onNext: (data: AddressData) => void
  initialData?: AddressData
}

export interface AddressData {
  address: string
  city: string
  state: string
  zipCode: string
}

export function Step1Address({ onNext, initialData }: Step1AddressProps) {
  const [formData, setFormData] = useState<AddressData>({
    address: initialData?.address || '',
    city: initialData?.city || '',
    state: initialData?.state || '',
    zipCode: initialData?.zipCode || ''
  })
  
  const [errors, setErrors] = useState<Partial<AddressData>>({})
  const [isValidating, setIsValidating] = useState(false)

  const validateForm = () => {
    const newErrors: Partial<AddressData> = {}
    
    if (!formData.address.trim()) {
      newErrors.address = 'Property address is required'
    }
    if (!formData.city.trim()) {
      newErrors.city = 'City is required'
    }
    if (!formData.state.trim()) {
      newErrors.state = 'State is required'
    }
    if (!formData.zipCode.trim()) {
      newErrors.zipCode = 'ZIP code is required'
    } else if (!/^\d{5}(-\d{4})?$/.test(formData.zipCode)) {
      newErrors.zipCode = 'Please enter a valid ZIP code'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsValidating(true)
    
    // Simulate address validation API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setIsValidating(false)
    onNext(formData)
  }

  const handleInputChange = (field: keyof AddressData, value: string) => {
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
          <MapPin className="h-6 w-6 text-blue-600" />
          <CardTitle className="text-2xl">Property Address</CardTitle>
        </div>
        <p className="text-gray-600">
          Enter your property's complete address. We'll use this to verify the location 
          and provide an accurate valuation.
        </p>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Street Address */}
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
              Street Address *
            </label>
            <Input
              id="address"
              type="text"
              placeholder="123 Main Street"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              className={errors.address ? 'border-red-500' : ''}
            />
            {errors.address && (
              <div className="flex items-center mt-1 text-red-600 text-sm">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.address}
              </div>
            )}
          </div>

          {/* City, State, ZIP Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* City */}
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                City *
              </label>
              <Input
                id="city"
                type="text"
                placeholder="City"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                className={errors.city ? 'border-red-500' : ''}
              />
              {errors.city && (
                <div className="flex items-center mt-1 text-red-600 text-sm">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.city}
                </div>
              )}
            </div>

            {/* State */}
            <div>
              <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
                State *
              </label>
              <Input
                id="state"
                type="text"
                placeholder="CA"
                maxLength={2}
                value={formData.state}
                onChange={(e) => handleInputChange('state', e.target.value.toUpperCase())}
                className={errors.state ? 'border-red-500' : ''}
              />
              {errors.state && (
                <div className="flex items-center mt-1 text-red-600 text-sm">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.state}
                </div>
              )}
            </div>

            {/* ZIP Code */}
            <div>
              <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-2">
                ZIP Code *
              </label>
              <Input
                id="zipCode"
                type="text"
                placeholder="12345"
                value={formData.zipCode}
                onChange={(e) => handleInputChange('zipCode', e.target.value)}
                className={errors.zipCode ? 'border-red-500' : ''}
              />
              {errors.zipCode && (
                <div className="flex items-center mt-1 text-red-600 text-sm">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.zipCode}
                </div>
              )}
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <MapPin className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900 mb-1">Address Verification</h4>
                <p className="text-sm text-blue-700">
                  We'll verify this address and may suggest corrections to ensure accurate 
                  property valuation. Your information is secure and confidential.
                </p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <Button 
              type="submit" 
              size="lg" 
              disabled={isValidating}
              className="px-8"
            >
              {isValidating ? 'Validating Address...' : 'Continue to Property Details'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
} 