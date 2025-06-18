'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Settings, AlertCircle, CheckCircle, Home, Wrench } from 'lucide-react'

interface Step3ConditionProps {
  onNext: (data: ConditionData) => void
  onBack: () => void
  initialData?: ConditionData
}

export interface ConditionData {
  condition: string
  additionalNotes: string
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
    additionalNotes: initialData?.additionalNotes || ''
  })
  
  const [errors, setErrors] = useState<Partial<ConditionData>>({})

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

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center space-x-2 mb-2">
          <Settings className="h-6 w-6 text-blue-600" />
          <CardTitle className="text-2xl">Property Condition</CardTitle>
        </div>
        <p className="text-gray-600">
          Help us understand your property's current condition. This affects our offer 
          calculation, but remember - we buy houses as-is!
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
              <div className="flex items-start space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-green-900 mb-1">Excellent Condition</h4>
                  <p className="text-sm text-green-700">
                    Properties in excellent condition typically receive our highest offers. 
                    We'll still verify the condition during our inspection.
                  </p>
                </div>
              </div>
            </div>
          )}

          {formData.condition === 'needs_work' && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <Wrench className="h-5 w-5 text-orange-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-orange-900 mb-1">We Buy As-Is</h4>
                  <p className="text-sm text-orange-700">
                    Don't worry about repairs! We buy houses in any condition and will 
                    factor repair costs into our fair cash offer.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* General Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <Settings className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900 mb-1">Honest Assessment</h4>
                <p className="text-sm text-blue-700">
                  Please be honest about your property's condition. This helps us provide 
                  the most accurate offer upfront and speeds up the process.
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
              Back to Details
            </Button>
            <Button 
              type="submit" 
              size="lg" 
              className="px-8"
            >
              Continue to Photos
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
} 