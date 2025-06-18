import { Card, CardContent } from '@/components/ui/card'
import { 
  DollarSign, 
  Clock, 
  Home, 
  Shield, 
  FileText, 
  Zap 
} from 'lucide-react'

const benefits = [
  {
    title: 'No Fees or Commissions',
    description: 'Keep 100% of your offer amount. No hidden fees, no agent commissions, no closing costs.',
    icon: DollarSign,
    color: 'bg-green-100 text-green-600'
  },
  {
    title: 'Fast 7-Day Closing',
    description: 'Close on your timeline, as fast as 7 days. No waiting months for the right buyer.',
    icon: Clock,
    color: 'bg-blue-100 text-blue-600'
  },
  {
    title: 'Buy Houses As-Is',
    description: 'No repairs, cleaning, or staging required. We buy your house exactly as it stands.',
    icon: Home,
    color: 'bg-purple-100 text-purple-600'
  },
  {
    title: 'Guaranteed Closing',
    description: 'No financing contingencies or deal fall-throughs. Cash offers with guaranteed closing.',
    icon: Shield,
    color: 'bg-orange-100 text-orange-600'
  },
  {
    title: 'No Paperwork Hassle',
    description: 'We handle all the paperwork and logistics. Just show up to closing and get your check.',
    icon: FileText,
    color: 'bg-red-100 text-red-600'
  },
  {
    title: 'Instant Offers',
    description: 'Get your cash offer in minutes, not days. Our proprietary system provides instant valuations.',
    icon: Zap,
    color: 'bg-yellow-100 text-yellow-600'
  }
]

export function BenefitsSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
            Why Choose InstantHomeBuyer?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Skip the traditional home selling process and enjoy these exclusive benefits 
            when you sell to us.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => {
            const IconComponent = benefit.icon
            return (
              <Card 
                key={index} 
                className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <CardContent className="p-8 space-y-4">
                  {/* Icon */}
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${benefit.color}`}>
                    <IconComponent className="h-6 w-6" />
                  </div>

                  {/* Content */}
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Comparison Section */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Traditional Sale vs. InstantHomeBuyer
            </h3>
            <p className="text-gray-600">
              See how we compare to traditional home selling methods
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x">
              {/* Traditional Sale */}
              <div className="p-8 space-y-4">
                <h4 className="text-lg font-semibold text-gray-900">Traditional Sale</h4>
                <ul className="space-y-3">
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                    <span className="text-sm text-gray-600">3-6 months to sell</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                    <span className="text-sm text-gray-600">6% agent commissions</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                    <span className="text-sm text-gray-600">Repairs & staging costs</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                    <span className="text-sm text-gray-600">Financing contingencies</span>
                  </li>
                </ul>
              </div>

              {/* InstantHomeBuyer */}
              <div className="p-8 space-y-4 bg-blue-50">
                <h4 className="text-lg font-semibold text-blue-900">InstantHomeBuyer</h4>
                <ul className="space-y-3">
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">7 days to close</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">0% fees or commissions</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">No repairs needed</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">Guaranteed cash closing</span>
                  </li>
                </ul>
              </div>

              {/* Your Savings */}
              <div className="p-8 space-y-4">
                <h4 className="text-lg font-semibold text-gray-900">Your Savings</h4>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Agent Commissions</span>
                    <span className="font-semibold text-green-600">+$16,500</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Closing Costs</span>
                    <span className="font-semibold text-green-600">+$3,500</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Repairs & Staging</span>
                    <span className="font-semibold text-green-600">+$8,000</span>
                  </div>
                  <hr className="my-2" />
                  <div className="flex justify-between font-bold">
                    <span>Total Savings</span>
                    <span className="text-green-600">$28,000+</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 