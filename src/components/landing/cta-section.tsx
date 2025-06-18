import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Clock, Shield, DollarSign } from 'lucide-react'

export function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-700 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-8">
          {/* Main Headline */}
          <div className="space-y-4">
            <h2 className="text-4xl lg:text-5xl font-bold leading-tight">
              Ready to Get Your Cash Offer?
            </h2>
            <p className="text-xl lg:text-2xl text-blue-100 max-w-3xl mx-auto">
              Join hundreds of homeowners who've already received instant cash offers. 
              No obligations, no pressure – just a fast, fair offer.
            </p>
          </div>

          {/* Value Props */}
          <div className="flex flex-wrap justify-center items-center gap-8 mb-8">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-blue-200" />
              <span className="text-blue-100">Get offer in 2 minutes</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-blue-200" />
              <span className="text-blue-100">No obligation</span>
            </div>
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-blue-200" />
              <span className="text-blue-100">Cash in 7 days</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="space-y-4">
            <Button 
              asChild 
              size="lg" 
              className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-12 py-4 font-semibold"
            >
              <Link href="/get-quote" className="inline-flex items-center space-x-2">
                <span>Get My Instant Cash Offer</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            
            <div className="text-blue-100 text-sm">
              ✓ No fees ✓ No repairs ✓ No waiting ✓ Guaranteed closing
            </div>
          </div>

          {/* Social Proof */}
          <div className="pt-8 border-t border-blue-400/30">
            <p className="text-blue-200 mb-4">Trusted by homeowners nationwide</p>
            <div className="flex flex-wrap justify-center items-center gap-8">
              <div className="text-center">
                <div className="text-2xl font-bold">500+</div>
                <div className="text-sm text-blue-200">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">$50M+</div>
                <div className="text-sm text-blue-200">Paid to Homeowners</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">4.9★</div>
                <div className="text-sm text-blue-200">Average Rating</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">7</div>
                <div className="text-sm text-blue-200">Day Average Close</div>
              </div>
            </div>
          </div>

          {/* Urgency Element */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 max-w-2xl mx-auto">
            <div className="flex items-center justify-center space-x-2 mb-3">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="font-semibold">Limited Time Offer</span>
            </div>
            <p className="text-blue-100 text-sm">
              Market conditions are changing rapidly. Get your offer today to lock in 
              current pricing and avoid missing out on this opportunity.
            </p>
          </div>

          {/* Contact Info */}
          <div className="pt-8">
            <p className="text-blue-200 mb-2">
              Have questions? Call us directly:
            </p>
            <a 
              href="tel:+15551234567" 
              className="text-2xl font-bold hover:text-blue-200 transition-colors"
            >
              (555) 123-4567
            </a>
            <p className="text-blue-200 text-sm mt-2">
              Available 7 days a week, 8 AM - 8 PM
            </p>
          </div>
        </div>
      </div>
    </section>
  )
} 