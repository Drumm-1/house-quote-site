'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { Home, AlertCircle } from 'lucide-react'

interface Step2DetailsProps {
  onNext: (data: PropertyDetailsData) => void
  onBack: () => void
  initialData?: PropertyDetailsData
}

export interface PropertyDetailsData {
  bedrooms: string
  bathrooms: string
  squareFeet: string
  yearBuilt: string
  propertyType: string
  lotSize: string
}

const propertyTypes = [
  { value: 'single_family', label: 'Single Family Home' },
  { value: 'condo', label: 'Condominium' },
  { value: 'townhouse', label: 'Townhouse' },
  { value: 'duplex', label: 'Duplex' },
  { value: 'mobile_home', label: 'Mobile Home' },
  { value: 'other', label: 'Other' }
]

export function Step2Details({ onNext, onBack, initialData }: Step2DetailsProps) {
  const [formData, setFormData] = useState<PropertyDetailsData>({
    bedrooms: initialData?.bedrooms || '',
    bathrooms: initialData?.bathrooms || '',
    squareFeet: initialData?.squareFeet || '',
    yearBuilt: initialData?.yearBuilt || '',
    propertyType: initialData?.propertyType || '',
    lotSize: initialData?.lotSize || ''
  })
  
  const [errors, setErrors] = useState<Partial<PropertyDetailsData>>({})

  const validateForm = () => {
    const newErrors: Partial<PropertyDetailsData> = {}
    
    if (!formData.bedrooms) {
      newErrors.bedrooms = 'Number of bedrooms is required'
    }
    if (!formData.bathrooms) {
      newErrors.bathrooms = 'Number of bathrooms is required'
    }
    if (!formData.squareFeet) {
      newErrors.squareFeet = 'Square footage is required'
    } else if (isNaN(Number(formData.squareFeet)) || Number(formData.squareFeet) <= 0) {
      newErrors.squareFeet = 'Please enter a valid square footage'
    }
    if (!formData.yearBuilt) {
      newErrors.yearBuilt = 'Year built is required'
    } else {
      const year = Number(formData.yearBuilt)
      const currentYear = new Date().getFullYear()
      if (isNaN(year) || year < 1800 || year > currentYear) {
        newErrors.yearBuilt = `Please enter a year between 1800 and ${currentYear}`
      }
    }
    if (!formData.propertyType) {
      newErrors.propertyType = 'Property type is required'
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

  const handleInputChange = (field: keyof PropertyDetailsData, value: string) => {
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
          <Home className="h-6 w-6 text-blue-600" />
          <CardTitle className="text-2xl">Property Details</CardTitle>
        </div>
        <p className="text-gray-600">
          Tell us more about your property. This helps us provide the most accurate 
          cash offer possible.
        </p>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Bedrooms and Bathrooms Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Bedrooms */}
            <div>
              <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700 mb-2">
                Bedrooms *
              </label>
              <Select
                id="bedrooms"
                value={formData.bedrooms}
                onChange={(e) => handleInputChange('bedrooms', e.target.value)}
                className={errors.bedrooms ? 'border-red-500' : ''}
              >
                <option value="">Select bedrooms</option>
                <option value="1">1 Bedroom</option>
                <option value="2">2 Bedrooms</option>
                <option value="3">3 Bedrooms</option>
                <option value="4">4 Bedrooms</option>
                <option value="5">5 Bedrooms</option>
                <option value="6+">6+ Bedrooms</option>
              </Select>
              {errors.bedrooms && (
                <div className="flex items-center mt-1 text-red-600 text-sm">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.bedrooms}
                </div>
              )}
            </div>

            {/* Bathrooms */}
            <div>
              <label htmlFor="bathrooms" className="block text-sm font-medium text-gray-700 mb-2">
                Bathrooms *
              </label>
              <Select
                id="bathrooms"
                value={formData.bathrooms}
                onChange={(e) => handleInputChange('bathrooms', e.target.value)}
                className={errors.bathrooms ? 'border-red-500' : ''}
              >
                <option value="">Select bathrooms</option>
                <option value="1">1 Bathroom</option>
                <option value="1.5">1.5 Bathrooms</option>
                <option value="2">2 Bathrooms</option>
                <option value="2.5">2.5 Bathrooms</option>
                <option value="3">3 Bathrooms</option>
                <option value="3.5">3.5 Bathrooms</option>
                <option value="4+">4+ Bathrooms</option>
              </Select>
              {errors.bathrooms && (
                <div className="flex items-center mt-1 text-red-600 text-sm">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.bathrooms}
                </div>
              )}
            </div>
          </div>

          {/* Square Feet and Year Built Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Square Feet */}
            <div>
              <label htmlFor="squareFeet" className="block text-sm font-medium text-gray-700 mb-2">
                Square Footage *
              </label>
              <Input
                id="squareFeet"
                type="number"
                placeholder="1,500"
                value={formData.squareFeet}
                onChange={(e) => handleInputChange('squareFeet', e.target.value)}
                className={errors.squareFeet ? 'border-red-500' : ''}
              />
              {errors.squareFeet && (
                <div className="flex items-center mt-1 text-red-600 text-sm">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.squareFeet}
                </div>
              )}
            </div>

            {/* Year Built */}
            <div>
              <label htmlFor="yearBuilt" className="block text-sm font-medium text-gray-700 mb-2">
                Year Built *
              </label>
              <Input
                id="yearBuilt"
                type="number"
                placeholder="1995"
                value={formData.yearBuilt}
                onChange={(e) => handleInputChange('yearBuilt', e.target.value)}
                className={errors.yearBuilt ? 'border-red-500' : ''}
              />
              {errors.yearBuilt && (
                <div className="flex items-center mt-1 text-red-600 text-sm">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.yearBuilt}
                </div>
              )}
            </div>
          </div>

          {/* Property Type */}
          <div>
            <label htmlFor="propertyType" className="block text-sm font-medium text-gray-700 mb-2">
              Property Type *
            </label>
            <Select
              id="propertyType"
              value={formData.propertyType}
              onChange={(e) => handleInputChange('propertyType', e.target.value)}
              className={errors.propertyType ? 'border-red-500' : ''}
            >
              <option value="">Select property type</option>
              {propertyTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </Select>
            {errors.propertyType && (
              <div className="flex items-center mt-1 text-red-600 text-sm">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.propertyType}
              </div>
            )}
          </div>

          {/* Lot Size (Optional) */}
          <div>
            <label htmlFor="lotSize" className="block text-sm font-medium text-gray-700 mb-2">
              Lot Size <span className="text-gray-400">(Optional)</span>
            </label>
            <Input
              id="lotSize"
              type="text"
              placeholder="0.25 acres or 7,500 sq ft"
              value={formData.lotSize}
              onChange={(e) => handleInputChange('lotSize', e.target.value)}
            />
            <p className="text-sm text-gray-500 mt-1">
              Enter lot size in acres or square feet (e.g., "0.25 acres" or "7,500 sq ft")
            </p>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <Home className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900 mb-1">Accurate Information</h4>
                <p className="text-sm text-blue-700">
                  Providing accurate property details helps us give you the best possible 
                  cash offer. Don't worry if you're not sure about exact measurements - 
                  we'll verify during the inspection process.
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-4">
            <Button 
              type="button"
              variant="outline"
              size="lg"
              onClick={onBack}
              className="px-8"
            >
              Back to Address
            </Button>
            <Button 
              type="submit" 
              size="lg" 
              className="px-8"
            >
              Continue to Condition
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
} 