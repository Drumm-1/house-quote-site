import Link from 'next/link'
import { Home, Mail, Phone, MapPin } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Home className="h-8 w-8 text-blue-400" />
              <span className="text-xl font-bold">InstantHomeBuyer</span>
            </div>
            <p className="text-gray-300 text-sm">
              We buy houses fast for cash. No fees, no repairs needed, close in as little as 7 days.
            </p>
            <div className="flex space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <Phone className="h-4 w-4" />
                <span>(555) 123-4567</span>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-300">
              <Mail className="h-4 w-4" />
              <span>info@instanthomebuyer.com</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#how-it-works" className="text-gray-300 hover:text-white transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="#about" className="text-gray-300 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/get-quote" className="text-gray-300 hover:text-white transition-colors">
                  Get Quote
                </Link>
              </li>
              <li>
                <Link href="#contact" className="text-gray-300 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              <li className="text-gray-300 text-sm">Buy Houses As-Is</li>
              <li className="text-gray-300 text-sm">Fast Cash Offers</li>
              <li className="text-gray-300 text-sm">No Repairs Needed</li>
              <li className="text-gray-300 text-sm">Quick Closing</li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Disclaimer
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © 2024 InstantHomeBuyer. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
} 