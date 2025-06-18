import { TrendingUp, Clock, DollarSign, Home, Users, Calendar } from 'lucide-react'

const stats = [
  {
    label: 'Homes Purchased',
    value: '500+',
    description: 'Houses bought across 12 states',
    icon: Home,
    color: 'text-blue-600'
  },
  {
    label: 'Average Closing Time',
    value: '7 Days',
    description: 'From offer to cash in hand',
    icon: Clock,
    color: 'text-green-600'
  },
  {
    label: 'Customer Savings',
    value: '$2.5M+',
    description: 'Total saved on fees and repairs',
    icon: DollarSign,
    color: 'text-purple-600'
  },
  {
    label: 'Customer Satisfaction',
    value: '99%',
    description: 'Would recommend to friends',
    icon: TrendingUp,
    color: 'text-orange-600'
  },
  {
    label: 'Happy Customers',
    value: '500+',
    description: 'Homeowners we\'ve served',
    icon: Users,
    color: 'text-indigo-600'
  },
  {
    label: 'Years in Business',
    value: '5+',
    description: 'Trusted local home buyer',
    icon: Calendar,
    color: 'text-red-600'
  }
]

export function StatsSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold">
            Our Track Record Speaks for Itself
          </h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            We've built our reputation on delivering results. Here are the numbers 
            that show why homeowners trust us with their biggest asset.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon
            return (
              <div 
                key={index} 
                className="bg-white/10 backdrop-blur-sm rounded-lg p-8 text-center hover:bg-white/20 transition-all duration-300 hover:scale-105"
              >
                {/* Icon */}
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6">
                  <IconComponent className="h-8 w-8 text-white" />
                </div>

                {/* Value */}
                <div className="text-4xl lg:text-5xl font-bold mb-2">
                  {stat.value}
                </div>

                {/* Label */}
                <h3 className="text-xl font-semibold mb-2">
                  {stat.label}
                </h3>

                {/* Description */}
                <p className="text-blue-100 text-sm">
                  {stat.description}
                </p>
              </div>
            )
          })}
        </div>

        {/* Additional Info */}
        <div className="mt-16 text-center">
          <div className="bg-white/10 rounded-lg p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">Why These Numbers Matter</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
              <div>
                <h4 className="font-semibold mb-2">Proven Experience</h4>
                <p className="text-blue-100 text-sm">
                  With over 500 successful transactions, we've refined our process to provide 
                  the smoothest, fastest home selling experience possible.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Financial Strength</h4>
                <p className="text-blue-100 text-sm">
                  Our track record demonstrates our ability to close deals quickly with cash, 
                  giving you confidence in our offers and timeline.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Customer Focus</h4>
                <p className="text-blue-100 text-sm">
                  Our 99% satisfaction rate shows we're committed to exceeding expectations 
                  and making the process as stress-free as possible.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Market Knowledge</h4>
                <p className="text-blue-100 text-sm">
                  Years of experience in local markets means we can provide accurate, 
                  competitive offers based on real market data.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-12 flex flex-wrap justify-center items-center gap-8">
          <div className="flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-lg">
            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            <span className="text-sm">BBB Accredited</span>
          </div>
          <div className="flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-lg">
            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            <span className="text-sm">Licensed & Insured</span>
          </div>
          <div className="flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-lg">
            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            <span className="text-sm">5-Star Reviews</span>
          </div>
          <div className="flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-lg">
            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            <span className="text-sm">Cash Ready</span>
          </div>
        </div>
      </div>
    </section>
  )
} 