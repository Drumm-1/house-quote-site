'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User, AuthError } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

interface AuthContextType {
  user: User | null
  loading: boolean
  signUp: (email: string, password: string, userData?: { firstName: string; lastName: string; phone?: string | null }) => Promise<{ error: AuthError | null }>
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>
  signOut: () => Promise<{ error: AuthError | null }>
  resendVerification: (email: string) => Promise<{ error: AuthError | null }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

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
          console.log('🔐 AuthProvider: User details:', {
            id: session?.user?.id,
            email: session?.user?.email,
            emailConfirmed: session?.user?.email_confirmed_at,
            role: session?.user?.role
          })
        }
        setUser(session?.user ?? null)
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

      // If userData is provided and user is created, create user profile
      if (userData && data.user) {
        console.log('🔐 AuthContext: Creating user profile')
        try {
          const { error: profileError } = await supabase
            .from('user_profiles')
            .insert({
              user_id: data.user.id,
              first_name: userData.firstName,
              last_name: userData.lastName,
              phone: userData.phone,
              user_type: 'seller'
            })

          if (profileError) {
            console.log('🔐 AuthContext: Profile creation error:', profileError)
            // Don't fail the signup if profile creation fails
          } else {
            console.log('🔐 AuthContext: User profile created successfully')
          }
        } catch (profileErr) {
          console.log('🔐 AuthContext: Profile creation exception:', profileErr)
        }
      }

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