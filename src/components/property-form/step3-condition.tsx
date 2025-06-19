'use client'

import { useState, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Settings, AlertCircle, CheckCircle, Home, Wrench, Upload, X, Image, FileText } from 'lucide-react'

interface Step3ConditionProps {
  onNext: (data: ConditionData) => void
  onBack: () => void
  initialData?: ConditionData
}

export interface ConditionData {
  condition: string
  additionalNotes: string
  photos: File[]
  floorPlan: File | null
}

const conditionOptions = [
  {
    value: 'excellent',
    title: 'Excellent',
    description: 'Move-in ready with recent updates',
    details: 'Recently renovated or well-maintained. No major repairs needed.',
    icon: CheckCircle,
    color: 'border-green-200 bg-green-50',
    selectedColor: 'border-green-500 bg-green-100',
    iconColor: 'text-green-600'
  },
  {
    value: 'good',
    title: 'Good',
    description: 'Minor updates needed',
    details: 'Generally well-maintained but may need some cosmetic improvements.',
    icon: Home,
    color: 'border-blue-200 bg-blue-50',
    selectedColor: 'border-blue-500 bg-blue-100',
    iconColor: 'text-blue-600'
  },
  {
    value: 'fair',
    title: 'Fair',
    description: 'Some repairs needed',
    details: 'Needs moderate repairs or updates to major systems or features.',
    icon: Settings,
    color: 'border-yellow-200 bg-yellow-50',
    selectedColor: 'border-yellow-500 bg-yellow-100',
    iconColor: 'text-yellow-600'
  },
  {
    value: 'needs_work',
    title: 'Needs Work',
    description: 'Major repairs required',
    details: 'Significant repairs needed to structural, electrical, plumbing, or HVAC systems.',
    icon: Wrench,
    color: 'border-orange-200 bg-orange-50',
    selectedColor: 'border-orange-500 bg-orange-100',
    iconColor: 'text-orange-600'
  }
]

export function Step3Condition({ onNext, onBack, initialData }: Step3ConditionProps) {
  const [formData, setFormData] = useState<ConditionData>({
    condition: initialData?.condition || '',
    additionalNotes: initialData?.additionalNotes || '',
    photos: initialData?.photos || [],
    floorPlan: initialData?.floorPlan || null
  })
  
  const [errors, setErrors] = useState<Partial<ConditionData>>({})
  const photoInputRef = useRef<HTMLInputElement>(null)
  const floorPlanInputRef = useRef<HTMLInputElement>(null)

  const validateForm = () => {
    const newErrors: Partial<ConditionData> = {}
    
    if (!formData.condition) {
      newErrors.condition = 'Please select your property condition'
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

  const handleConditionChange = (condition: string) => {
    setFormData(prev => ({ ...prev, condition }))
    // Clear error when user makes selection
    if (errors.condition) {
      setErrors(prev => ({ ...prev, condition: undefined }))
    }
  }

  const handleNotesChange = (additionalNotes: string) => {
    setFormData(prev => ({ ...prev, additionalNotes }))
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const validFiles = files.filter(file => {
      const isValidType = file.type.startsWith('image/')
      const isValidSize = file.size <= 10 * 1024 * 1024 // 10MB
      return isValidType && isValidSize
    })

    setFormData(prev => ({
      ...prev,
      photos: [...prev.photos, ...validFiles].slice(0, 10) // Max 10 photos
    }))
  }

  const handleFloorPlanUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const isValidType = file.type.startsWith('image/') || file.type === 'application/pdf'
      const isValidSize = file.size <= 10 * 1024 * 1024 // 10MB
      
      if (isValidType && isValidSize) {
        setFormData(prev => ({ ...prev, floorPlan: file }))
      }
    }
  }

  const removePhoto = (index: number) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }))
  }

  const removeFloorPlan = () => {
    setFormData(prev => ({ ...prev, floorPlan: null }))
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center space-x-2 mb-2">
          <Settings className="h-6 w-6 text-blue-600" />
          <CardTitle className="text-2xl">Property Condition & Photos</CardTitle>
        </div>
        <p className="text-gray-600">
          Help us understand your property's current condition and share some photos. 
          This affects our offer calculation, but remember - we buy houses as-is!
        </p>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Condition Selection */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              What best describes your property's condition? *
            </label>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {conditionOptions.map((option) => {
                const IconComponent = option.icon
                const isSelected = formData.condition === option.value
                
                return (
                  <div
                    key={option.value}
                    className={`
                      relative border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-md
                      ${isSelected ? option.selectedColor : option.color}
                    `}
                    onClick={() => handleConditionChange(option.value)}
                  >
                    {/* Radio Button */}
                    <input
                      type="radio"
                      name="condition"
                      value={option.value}
                      checked={isSelected}
                      onChange={() => handleConditionChange(option.value)}
                      className="absolute top-4 right-4 h-4 w-4 text-blue-600"
                    />
                    
                    {/* Content */}
                    <div className="space-y-3">
                      {/* Icon and Title */}
                      <div className="flex items-center space-x-3">
                        <IconComponent className={`h-6 w-6 ${option.iconColor}`} />
                        <h3 className="font-semibold text-gray-900">{option.title}</h3>
                      </div>
                      
                      {/* Description */}
                      <p className="text-sm font-medium text-gray-700">
                        {option.description}
                      </p>
                      
                      {/* Details */}
                      <p className="text-xs text-gray-600 leading-relaxed">
                        {option.details}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
            
            {errors.condition && (
              <div className="flex items-center text-red-600 text-sm">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.condition}
              </div>
            )}
          </div>

          {/* Photo Upload Section */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Property Photos <span className="text-gray-400">(Optional)</span>
              </label>
              <p className="text-sm text-gray-500 mb-4">
                Upload photos of your property to help us provide a more accurate offer. 
                Include exterior, interior, and any areas that need attention.
              </p>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                <input
                  ref={photoInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-2">
                  Click to upload photos or drag and drop
                </p>
                <p className="text-xs text-gray-500 mb-4">
                  PNG, JPG, GIF up to 10MB each (max 10 photos)
                </p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => photoInputRef.current?.click()}
                >
                  <Image className="h-4 w-4 mr-2" />
                  Choose Photos
                </Button>
              </div>

              {/* Photo Preview */}
              {formData.photos.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                  {formData.photos.map((photo, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(photo)}
                        alt={`Property photo ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border"
                      />
                      <button
                        type="button"
                        onClick={() => removePhoto(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                      <p className="text-xs text-gray-500 mt-1 truncate">
                        {photo.name}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Floor Plan Upload Section */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Floor Plan <span className="text-gray-400">(Optional)</span>
              </label>
              <p className="text-sm text-gray-500 mb-4">
                Upload a floor plan if you have one. This helps us better understand your property layout.
              </p>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                <input
                  ref={floorPlanInputRef}
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFloorPlanUpload}
                  className="hidden"
                />
                <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-2">
                  Click to upload floor plan
                </p>
                <p className="text-xs text-gray-500 mb-4">
                  PNG, JPG, PDF up to 10MB
                </p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => floorPlanInputRef.current?.click()}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Choose Floor Plan
                </Button>
              </div>

              {/* Floor Plan Preview */}
              {formData.floorPlan && (
                <div className="mt-4">
                  <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3 border">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-6 w-6 text-blue-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {formData.floorPlan.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {(formData.floorPlan.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={removeFloorPlan}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Additional Notes */}
          <div>
            <label htmlFor="additionalNotes" className="block text-sm font-medium text-gray-700 mb-2">
              Additional Notes <span className="text-gray-400">(Optional)</span>
            </label>
            <Textarea
              id="additionalNotes"
              placeholder="Tell us about any specific issues, recent repairs, or unique features..."
              value={formData.additionalNotes}
              onChange={(e) => handleNotesChange(e.target.value)}
              className="min-h-[100px]"
            />
            <p className="text-sm text-gray-500 mt-1">
              Help us understand any specific details about your property's condition, 
              recent repairs, or unique circumstances.
            </p>
          </div>

          {/* Info Boxes based on selection */}
          {formData.condition === 'excellent' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-medium text-green-900 mb-2">Excellent Condition</h4>
              <p className="text-sm text-green-700">
                Great! Properties in excellent condition typically receive our highest offers. 
                Your property sounds move-in ready with minimal work needed.
              </p>
            </div>
          )}

          {formData.condition === 'good' && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Good Condition</h4>
              <p className="text-sm text-blue-700">
                Properties in good condition are very attractive to us. Minor cosmetic updates 
                won't significantly impact our offer - we handle those details.
              </p>
            </div>
          )}

          {formData.condition === 'fair' && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-medium text-yellow-900 mb-2">Fair Condition</h4>
              <p className="text-sm text-yellow-700">
                No problem! We specialize in properties that need some work. Our offer will 
                account for necessary repairs while still providing you with a fair cash price.
              </p>
            </div>
          )}

          {formData.condition === 'needs_work' && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <h4 className="font-medium text-orange-900 mb-2">Needs Work</h4>
              <p className="text-sm text-orange-700">
                Perfect! This is exactly what we do best. We buy properties that need major 
                work and handle all repairs ourselves. You can sell as-is with no hassle.
              </p>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onBack}
              className="px-8"
            >
              Back
            </Button>
            <Button 
              type="submit"
              className="px-8"
            >
              Continue to Contact Info
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
} 