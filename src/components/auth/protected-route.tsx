'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from './auth-context'

interface ProtectedRouteProps {
  children: React.ReactNode
  requireVerified?: boolean
}

export function ProtectedRoute({ children, requireVerified = true }: ProtectedRouteProps) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    console.log('🛡️ ProtectedRoute: Checking access...', {
      loading,
      hasUser: !!user,
      userEmail: user?.email,
      emailConfirmed: user?.email_confirmed_at,
      requireVerified
    })

    if (!loading) {
      if (!user) {
        console.log('🛡️ ProtectedRoute: No user found, redirecting to login')
        router.push('/auth/login?redirect=/get-quote')
      } else if (requireVerified && !user.email_confirmed_at) {
        console.log('🛡️ ProtectedRoute: User not verified, redirecting to verification')
        router.push('/auth/verify')
      } else {
        console.log('🛡️ ProtectedRoute: Access granted')
      }
    }
  }, [user, loading, router, requireVerified])

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Don't render children if user is not authenticated or not verified
  if (!user || (requireVerified && !user.email_confirmed_at)) {
    return null
  }

  return <>{children}</>
} 