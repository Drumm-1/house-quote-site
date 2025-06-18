'use client'

import { Progress } from '@/components/ui/progress'
import { CheckCircle } from 'lucide-react'

interface ProgressBarProps {
  currentStep: number
  totalSteps: number
  stepLabels: string[]
}

export function ProgressBar({ currentStep, totalSteps, stepLabels }: ProgressBarProps) {
  const progress = (currentStep / totalSteps) * 100

  return (
    <div className="w-full mb-8">
      {/* Progress Bar */}
      <div className="mb-6">
        <Progress value={progress} className="h-2" />
        <div className="flex justify-between items-center mt-2">
          <span className="text-sm text-gray-500">
            Step {currentStep} of {totalSteps}
          </span>
          <span className="text-sm font-medium text-blue-600">
            {Math.round(progress)}% Complete
          </span>
        </div>
      </div>

      {/* Step Indicators */}
      <div className="flex justify-between">
        {stepLabels.map((label, index) => {
          const stepNumber = index + 1
          const isCompleted = stepNumber < currentStep
          const isCurrent = stepNumber === currentStep
          const isUpcoming = stepNumber > currentStep

          return (
            <div key={index} className="flex flex-col items-center flex-1">
              {/* Step Circle */}
              <div className={`
                relative w-8 h-8 rounded-full flex items-center justify-center mb-2
                ${isCompleted ? 'bg-green-500 text-white' : ''}
                ${isCurrent ? 'bg-blue-600 text-white' : ''}
                ${isUpcoming ? 'bg-gray-200 text-gray-500' : ''}
              `}>
                {isCompleted ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  <span className="text-sm font-medium">{stepNumber}</span>
                )}
              </div>

              {/* Step Label */}
              <span className={`
                text-xs text-center leading-tight max-w-20
                ${isCompleted ? 'text-green-600' : ''}
                ${isCurrent ? 'text-blue-600 font-medium' : ''}
                ${isUpcoming ? 'text-gray-400' : ''}
              `}>
                {label}
              </span>

              {/* Connector Line */}
              {index < stepLabels.length - 1 && (
                <div className={`
                  absolute top-4 left-1/2 w-full h-0.5 -z-10
                  ${isCompleted ? 'bg-green-500' : 'bg-gray-200'}
                `} style={{ transform: 'translateX(50%)' }} />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
} 