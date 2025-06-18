import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { CheckCircle, Star, Shield } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-blue-50 to-indigo-100 py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Get Cash for Your Home in{' '}
                <span className="text-blue-600">7 Days</span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Skip the hassle of traditional home selling. We buy houses as-is, 
                with no repairs needed, no agent fees, and a guaranteed closing.
              </p>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-sm font-medium text-gray-700">No Fees</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-sm font-medium text-gray-700">Fast Closing</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-sm font-medium text-gray-700">As-Is Purchase</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="text-lg px-8 py-4">
                <Link href="/get-quote">Get My Instant Quote</Link>
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-4">
                <Link href="#how-it-works">Learn How It Works</Link>
              </Button>
            </div>

            {/* Social Proof */}
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <div className="text-sm text-gray-600">
                <span className="font-semibold">4.9/5</span> rating from 500+ homeowners
              </div>
            </div>
          </div>

          {/* Right Column - Image/Visual */}
          <div className="relative">
            <div className="bg-white rounded-lg shadow-2xl p-8">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">Your Offer</span>
                  <Shield className="h-5 w-5 text-green-500" />
                </div>
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-gray-900">$247,500</div>
                  <div className="text-sm text-gray-500">Cash offer • No fees</div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Market Value</span>
                    <span className="font-medium">$275,000</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Closing Costs</span>
                    <span className="font-medium text-green-600">$0</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Agent Fees</span>
                    <span className="font-medium text-green-600">$0</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Repairs Needed</span>
                    <span className="font-medium text-green-600">$0</span>
                  </div>
                  <hr className="my-3" />
                  <div className="flex justify-between font-semibold">
                    <span>Your Net Proceeds</span>
                    <span className="text-blue-600">$247,500</span>
                  </div>
                </div>
                <Button className="w-full" size="lg">
                  Accept Offer
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 