import { Suspense } from 'react'
import { VerifyEmail } from '@/components/auth/verify-email'

export const metadata = {
  title: 'Verify Email | InstantHomeBuyer',
  description: 'Verify your email address to complete your account setup.',
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmail />
    </Suspense>
  )
} 