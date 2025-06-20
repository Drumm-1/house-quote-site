'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User, AuthError } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { UserProfile } from '@/types/database'

// Extended user info combining auth.identities and user_profiles
interface UserInfo {
  // From auth.identities (personal info)
  first_name?: string
  last_name?: string
  email?: string
  phone?: string
  // From user_profiles (business/profile data only)
  user_type?: string
  company_name?: string
  license_number?: string
  preferences?: any
  address?: string  // Business/mailing address
  city?: string
  state?: string
  zip_code?: string
}

interface AuthContextType {
  user: User | null
  userInfo: UserInfo | null
  loading: boolean
  signUp: (email: string, password: string, userData?: { firstName: string; lastName: string; phone?: string | null }) => Promise<{ error: AuthError | null }>
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>
  signOut: () => Promise<{ error: AuthError | null }>
  resendVerification: (email: string) => Promise<{ error: AuthError | null }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  const [loading, setLoading] = useState(true)

  // Function to fetch user info from the secure function
  const fetchUserInfo = async (userId: string) => {
    try {
      console.log('🔐 AuthProvider: Fetching user info for:', userId)
      
      // Get combined user info from the secure function
      const { data, error } = await supabase
        .rpc('get_current_user_info')

      if (error) {
        console.error('🔐 AuthProvider: Error fetching user info:', error)
        // If function doesn't exist or auth schema access is blocked, fallback to basic info
        console.log('🔐 AuthProvider: Falling back to basic user info from auth user')
        setUserInfo({
          first_name: user?.user_metadata?.first_name,
          last_name: user?.user_metadata?.last_name,
          email: user?.email,
          phone: user?.user_metadata?.phone
        })
        return
      }

      if (data && data.length > 0) {
        const userInfo = {
          first_name: data[0].first_name,
          last_name: data[0].last_name,
          email: data[0].email,
          phone: data[0].phone,
          user_type: data[0].user_type,
          company_name: data[0].company_name,
          license_number: data[0].license_number,
          preferences: data[0].preferences,
          address: data[0].address,
          city: data[0].city,
          state: data[0].state,
          zip_code: data[0].zip_code
        }
        console.log('🔐 AuthProvider: User info fetched:', userInfo)
        setUserInfo(userInfo)
      } else {
        console.log('🔐 AuthProvider: No user info found, using fallback')
        // Fallback to user metadata if no data from function
        setUserInfo({
          first_name: user?.user_metadata?.first_name,
          last_name: user?.user_metadata?.last_name,
          email: user?.email,
          phone: user?.user_metadata?.phone
        })
      }

    } catch (err) {
      console.error('🔐 AuthProvider: Exception fetching user info:', err)
      // Fallback to basic user metadata
      setUserInfo({
        first_name: user?.user_metadata?.first_name,
        last_name: user?.user_metadata?.last_name,
        email: user?.email,
        phone: user?.user_metadata?.phone
      })
    }
  }

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      console.log('🔐 AuthProvider: Getting initial session...')
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) {
          console.error('🔐 AuthProvider: Error getting session:', error)
        } else {
          console.log('🔐 AuthProvider: Initial session:', session?.user ? 'User found' : 'No user')
          if (session?.user) {
            console.log('🔐 AuthProvider: User details:', {
              id: session.user.id,
              email: session.user.email,
              emailConfirmed: session.user.email_confirmed_at,
              role: session.user.role
            })
          }
        }
        setUser(session?.user ?? null)
        
        // Fetch user info if user exists
        if (session?.user) {
          await fetchUserInfo(session.user.id)
        } else {
          setUserInfo(null)
        }
        
        setLoading(false)
      } catch (err) {
        console.error('🔐 AuthProvider: Exception getting session:', err)
        setLoading(false)
      }
    }

    getInitialSession()

    // Listen for auth changes
    console.log('🔐 AuthProvider: Setting up auth state listener...')
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔐 AuthProvider: Auth state changed:', event)
        console.log('🔐 AuthProvider: New session:', session?.user ? 'User found' : 'No user')
        if (session?.user) {
          console.log('🔐 AuthProvider: User details:', {
            id: session.user.id,
            email: session.user.email,
            emailConfirmed: session.user.email_confirmed_at,
            role: session.user.role
          })
        }
        setUser(session?.user ?? null)
        
        // Fetch user info if user exists, otherwise clear it
        if (session?.user) {
          await fetchUserInfo(session.user.id)
        } else {
          setUserInfo(null)
        }
        
        setLoading(false)
      }
    )

    return () => {
      console.log('🔐 AuthProvider: Cleaning up auth listener')
      subscription.unsubscribe()
    }
  }, [])

  const signUp = async (email: string, password: string, userData?: { firstName: string; lastName: string; phone?: string | null }) => {
    console.log('🔐 AuthContext: Starting sign up process', { email, hasUserData: !!userData })
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/verify`,
          data: userData ? {
            first_name: userData.firstName,
            last_name: userData.lastName,
            phone: userData.phone
          } : undefined
        }
      })

      if (error) {
        console.log('🔐 AuthContext: Sign up error:', error)
        return { error }
      }

      console.log('🔐 AuthContext: Sign up successful', data)
      // No need to create profile here - identity data is automatically stored by Supabase
      // Business profile can be created later when needed

      return { error: null }
    } catch (err) {
      console.log('🔐 AuthContext: Sign up exception:', err)
      return { error: err as AuthError }
    }
  }

  const signIn = async (email: string, password: string) => {
    console.log('🔐 AuthContext: Attempting sign in for:', email)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) {
        console.error('🔐 AuthContext: Sign in error:', error)
      } else {
        console.log('🔐 AuthContext: Sign in successful:', {
          userId: data.user?.id,
          email: data.user?.email,
          emailConfirmed: data.user?.email_confirmed_at
        })
      }
      
      return { error }
    } catch (err) {
      console.error('🔐 AuthContext: Sign in exception:', err)
      return { error: err as AuthError }
    }
  }

  const signOut = async () => {
    console.log('🔐 AuthContext: Attempting sign out')
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('🔐 AuthContext: Sign out error:', error)
      } else {
        console.log('🔐 AuthContext: Sign out successful')
      }
      return { error }
    } catch (err) {
      console.error('🔐 AuthContext: Sign out exception:', err)
      return { error: err as AuthError }
    }
  }

  const resendVerification = async (email: string) => {
    console.log('🔐 AuthContext: Resending verification for:', email)
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/verify`
        }
      })
      
      if (error) {
        console.error('🔐 AuthContext: Resend verification error:', error)
      } else {
        console.log('🔐 AuthContext: Verification email sent successfully')
      }
      
      return { error }
    } catch (err) {
      console.error('🔐 AuthContext: Resend verification exception:', err)
      return { error: err as AuthError }
    }
  }

  const value = {
    user,
    userInfo,
    loading,
    signUp,
    signIn,
    signOut,
    resendVerification
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 