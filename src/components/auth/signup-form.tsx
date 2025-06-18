'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useAuth } from './auth-context'
import { Mail, Lock, AlertCircle, Eye, EyeOff, CheckCircle } from 'lucide-react'

export function SignupForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  
  const { signUp } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirect') || '/get-quote'

  const validatePassword = (password: string) => {
    const minLength = password.length >= 8
    const hasUpper = /[A-Z]/.test(password)
    const hasLower = /[a-z]/.test(password)
    const hasNumber = /\d/.test(password)
    
    return {
      minLength,
      hasUpper,
      hasLower,
      hasNumber,
      isValid: minLength && hasUpper && hasLower && hasNumber
    }
  }

  const passwordValidation = validatePassword(password)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    // Validate password strength
    if (!passwordValidation.isValid) {
      setError('Password does not meet requirements')
      setLoading(false)
      return
    }

    const { error } = await signUp(email, password)
    
    if (error) {
      if (error.message.includes('already registered')) {
        setError('An account with this email already exists. Please sign in instead.')
      } else {
        setError(error.message)
      }
      setLoading(false)
    } else {
      setSuccess(true)
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <CheckCircle className="h-16 w-16 text-green-600 mx-auto" />
                <h2 className="text-2xl font-bold text-gray-900">
                  Check Your Email
                </h2>
                <p className="text-gray-600">
                  We've sent a verification link to <strong>{email}</strong>
                </p>
                <p className="text-sm text-gray-500">
                  Click the link in your email to verify your account and complete the signup process.
                </p>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                  <h4 className="font-medium text-blue-900 mb-2">What's next?</h4>
                  <div className="space-y-1 text-sm text-blue-700">
                    <p>1. Check your email inbox (and spam folder)</p>
                    <p>2. Click the verification link</p>
                    <p>3. Return here to sign in and get your quote</p>
                  </div>
                </div>

                <div className="pt-4">
                  <Link 
                    href={`/auth/login${redirectTo ? `?redirect=${encodeURIComponent(redirectTo)}` : ''}`}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Back to Sign In
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Create Account
          </h1>
          <p className="text-gray-600">
            Sign up to get your instant cash offer
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">Sign Up</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                    <span className="text-red-700 text-sm">{error}</span>
                  </div>
                </div>
              )}

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                    disabled={loading}
                  />
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a strong password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                    disabled={loading}
                  />
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    disabled={loading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>

                {/* Password Requirements */}
                {password && (
                  <div className="mt-2 space-y-1 text-xs">
                    <div className={`flex items-center space-x-2 ${passwordValidation.minLength ? 'text-green-600' : 'text-gray-500'}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${passwordValidation.minLength ? 'bg-green-600' : 'bg-gray-300'}`}></div>
                      <span>At least 8 characters</span>
                    </div>
                    <div className={`flex items-center space-x-2 ${passwordValidation.hasUpper ? 'text-green-600' : 'text-gray-500'}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${passwordValidation.hasUpper ? 'bg-green-600' : 'bg-gray-300'}`}></div>
                      <span>One uppercase letter</span>
                    </div>
                    <div className={`flex items-center space-x-2 ${passwordValidation.hasLower ? 'text-green-600' : 'text-gray-500'}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${passwordValidation.hasLower ? 'bg-green-600' : 'bg-gray-300'}`}></div>
                      <span>One lowercase letter</span>
                    </div>
                    <div className={`flex items-center space-x-2 ${passwordValidation.hasNumber ? 'text-green-600' : 'text-gray-500'}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${passwordValidation.hasNumber ? 'bg-green-600' : 'bg-gray-300'}`}></div>
                      <span>One number</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password Field */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                    disabled={loading}
                  />
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    disabled={loading}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {confirmPassword && password !== confirmPassword && (
                  <p className="text-red-600 text-xs mt-1">Passwords do not match</p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={loading || !passwordValidation.isValid || password !== confirmPassword}
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>

            {/* Sign In Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link 
                  href={`/auth/login${redirectTo ? `?redirect=${encodeURIComponent(redirectTo)}` : ''}`}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Privacy Notice */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3 text-center">
            Your Privacy is Protected
          </h3>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              <span>We never sell your information</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              <span>Secure data encryption</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              <span>Email verification required</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 