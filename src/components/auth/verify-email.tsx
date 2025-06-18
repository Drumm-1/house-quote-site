'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAuth } from './auth-context'
import { Mail, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react'

export function VerifyEmail() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [resendCooldown, setResendCooldown] = useState(0)
  
  const { user, resendVerification } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()

  // Handle email verification from URL params
  useEffect(() => {
    const handleVerification = async () => {
      const token = searchParams.get('token')
      const type = searchParams.get('type')
      
      if (token && type === 'signup') {
        // The verification will be handled automatically by Supabase
        // when the user clicks the link, so we just need to check if they're verified
        setTimeout(() => {
          if (user?.email_confirmed_at) {
            router.push('/get-quote')
          }
        }, 2000)
      }
    }

    handleVerification()
  }, [searchParams, user, router])

  // Cooldown timer for resend button
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [resendCooldown])

  const handleResendVerification = async () => {
    if (!user?.email) return
    
    setLoading(true)
    setError('')
    setSuccess('')

    const { error } = await resendVerification(user.email)
    
    if (error) {
      setError(error.message)
    } else {
      setSuccess('Verification email sent! Please check your inbox.')
      setResendCooldown(60) // 60 second cooldown
    }
    
    setLoading(false)
  }

  // If user is already verified, redirect them
  if (user?.email_confirmed_at) {
    router.push('/get-quote')
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <Mail className="h-16 w-16 text-blue-600 mx-auto" />
              <h2 className="text-2xl font-bold text-gray-900">
                Verify Your Email
              </h2>
              
              {user?.email && (
                <p className="text-gray-600">
                  We've sent a verification link to <strong>{user.email}</strong>
                </p>
              )}
              
              <p className="text-sm text-gray-500">
                Click the link in your email to verify your account and access the quote form.
              </p>

              {/* Success Message */}
              {success && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                    <span className="text-green-700 text-sm">{success}</span>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                    <span className="text-red-700 text-sm">{error}</span>
                  </div>
                </div>
              )}
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                <h4 className="font-medium text-blue-900 mb-2">What to do next:</h4>
                <div className="space-y-1 text-sm text-blue-700">
                  <p>1. Check your email inbox (and spam folder)</p>
                  <p>2. Click the "Verify Email" link</p>
                  <p>3. You'll be automatically redirected to continue</p>
                </div>
              </div>

              {/* Resend Button */}
              <div className="pt-4">
                <p className="text-sm text-gray-600 mb-3">
                  Didn't receive the email?
                </p>
                <Button
                  onClick={handleResendVerification}
                  disabled={loading || resendCooldown > 0 || !user?.email}
                  variant="outline"
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : resendCooldown > 0 ? (
                    `Resend in ${resendCooldown}s`
                  ) : (
                    <>
                      <Mail className="h-4 w-4 mr-2" />
                      Resend Verification Email
                    </>
                  )}
                </Button>
              </div>

              {/* Help Text */}
              <div className="pt-4 border-t border-gray-300">
                <p className="text-xs text-gray-500 mb-2">
                  Still having trouble? Contact our support team:
                </p>
                <a 
                  href="mailto:support@instanthomebuyer.com" 
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  support@instanthomebuyer.com
                </a>
              </div>

              {/* Back to Login */}
              <div className="pt-4">
                <Link 
                  href="/auth/login"
                  className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                >
                  ← Back to Sign In
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Notice */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3 text-center">
            Why We Verify Emails
          </h3>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              <span>Protect your account security</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              <span>Ensure we can reach you with offers</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              <span>Prevent spam and fake accounts</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 