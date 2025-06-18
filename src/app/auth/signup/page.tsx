import { Suspense } from 'react'
import { SignupForm } from '@/components/auth/signup-form'

export const metadata = {
  title: 'Create Account | InstantHomeBuyer',
  description: 'Create your account to get your instant cash offer.',
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignupForm />
    </Suspense>
  )
} 