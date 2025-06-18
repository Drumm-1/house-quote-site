import { Card, CardContent } from '@/components/ui/card'
import { Home, Calculator, CheckCircle } from 'lucide-react'

const steps = [
  {
    number: '01',
    title: 'Submit Property Details',
    description: 'Tell us about your property with our simple online form. Takes just 2 minutes to complete.',
    icon: Home,
    color: 'bg-blue-100 text-blue-600'
  },
  {
    number: '02',
    title: 'Get Instant Quote',
    description: 'Receive a competitive cash offer within minutes. No waiting around or haggling required.',
    icon: Calculator,
    color: 'bg-green-100 text-green-600'
  },
  {
    number: '03',
    title: 'Close in 7 Days',
    description: 'Accept our offer and close on your timeline. We handle all the paperwork and logistics.',
    icon: CheckCircle,
    color: 'bg-purple-100 text-purple-600'
  }
]

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our simple 3-step process makes selling your house fast and easy. 
            No stress, no surprises, just cash in your pocket.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => {
            const IconComponent = step.icon
            return (
              <div key={index} className="relative">
                <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardContent className="p-8 text-center space-y-6">
                    {/* Step Number */}
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 text-gray-400 font-bold text-lg">
                      {step.number}
                    </div>

                    {/* Icon */}
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${step.color}`}>
                      <IconComponent className="h-8 w-8" />
                    </div>

                    {/* Content */}
                    <div className="space-y-3">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {step.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Connector Arrow (hidden on mobile, visible on md+) */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <div className="w-8 h-0.5 bg-gray-300 relative">
                      <div className="absolute -right-1 -top-1 w-3 h-3 border-r-2 border-t-2 border-gray-300 transform rotate-45"></div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <p className="text-lg text-gray-600 mb-6">
            Ready to get started? It only takes 2 minutes.
          </p>
          <div className="inline-flex items-center space-x-2 bg-blue-50 px-6 py-3 rounded-lg">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-gray-700">
              Average response time: Less than 10 minutes
            </span>
          </div>
        </div>
      </div>
    </section>
  )
} 