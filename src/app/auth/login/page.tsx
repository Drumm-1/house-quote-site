import { Suspense } from 'react'
import { LoginForm } from '@/components/auth/login-form'

export const metadata = {
  title: 'Sign In | InstantHomeBuyer',
  description: 'Sign in to your account to get your instant cash offer.',
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm />
    </Suspense>
  )
} 