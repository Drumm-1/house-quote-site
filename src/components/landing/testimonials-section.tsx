import { Card, CardContent } from '@/components/ui/card'
import { Star, User } from 'lucide-react'

const testimonials = [
  {
    name: 'Sarah Johnson',
    location: 'Austin, TX',
    rating: 5,
    review: 'I was skeptical at first, but InstantHomeBuyer delivered exactly what they promised. Got my cash offer in 10 minutes and closed in 6 days. No stress, no hassle.',
    savings: '$23,000',
    timeframe: '6 days'
  },
  {
    name: 'Michael Chen',
    location: 'Phoenix, AZ',
    rating: 5,
    review: 'After trying to sell traditionally for 6 months with no offers, I found InstantHomeBuyer. They bought my house as-is, saved me thousands in repairs.',
    savings: '$18,500',
    timeframe: '8 days'
  },
  {
    name: 'Jennifer Rodriguez',
    location: 'Tampa, FL',
    rating: 5,
    review: 'The process was incredibly smooth. They handled everything from paperwork to closing. I had cash in hand within a week. Highly recommend!',
    savings: '$31,200',
    timeframe: '7 days'
  },
  {
    name: 'Robert Williams',
    location: 'Denver, CO',
    rating: 5,
    review: 'I inherited a property that needed major repairs. InstantHomeBuyer took it off my hands quickly without any repairs needed. Fantastic service.',
    savings: '$25,800',
    timeframe: '5 days'
  },
  {
    name: 'Lisa Thompson',
    location: 'Atlanta, GA',
    rating: 5,
    review: 'Facing foreclosure, I needed to sell fast. InstantHomeBuyer came through with a great offer and closed before my deadline. They saved my credit.',
    savings: '$19,600',
    timeframe: '9 days'
  },
  {
    name: 'David Martinez',
    location: 'Portland, OR',
    rating: 5,
    review: 'As a real estate investor, I appreciate efficiency. InstantHomeBuyer provided the fastest, most transparent transaction I\'ve ever experienced.',
    savings: '$27,400',
    timeframe: '4 days'
  }
]

export function TestimonialsSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
            What Our Customers Say
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Don't just take our word for it. Here's what real homeowners have to say 
            about their experience with InstantHomeBuyer.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-6 space-y-4">
                {/* Rating Stars */}
                <div className="flex items-center space-x-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>

                {/* Review Text */}
                <p className="text-gray-600 leading-relaxed">
                  "{testimonial.review}"
                </p>

                {/* Customer Info */}
                <div className="flex items-center space-x-3 pt-4 border-t">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>
                  </div>
                  <div className="flex-grow">
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.location}</p>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div className="text-center">
                    <p className="text-sm text-gray-500">Saved</p>
                    <p className="font-bold text-green-600">{testimonial.savings}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-500">Closed in</p>
                    <p className="font-bold text-blue-600">{testimonial.timeframe}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
          <div className="space-y-2">
            <div className="text-3xl font-bold text-blue-600">500+</div>
            <div className="text-sm text-gray-600">Homes Purchased</div>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-blue-600">4.9/5</div>
            <div className="text-sm text-gray-600">Customer Rating</div>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-blue-600">7 Days</div>
            <div className="text-sm text-gray-600">Average Closing</div>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-blue-600">$0</div>
            <div className="text-sm text-gray-600">Fees or Commissions</div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="bg-blue-50 rounded-lg p-8 inline-block">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Ready to Join Our Happy Customers?
            </h3>
            <p className="text-gray-600 mb-4">
              Get your instant cash offer today and see why homeowners choose us.
            </p>
            <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
              <span>✓ No obligation</span>
              <span>✓ 2-minute form</span>
              <span>✓ Instant response</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 