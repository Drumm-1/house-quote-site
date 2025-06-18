import { PropertyForm } from '@/components/property-form/property-form'
import { ProtectedRoute } from '@/components/auth/protected-route'

export const metadata = {
  title: 'Get Your Cash Offer | InstantHomeBuyer',
  description: 'Get an instant cash offer for your house. No fees, no commissions, close in as little as 7 days.',
}

export default function GetQuotePage() {
  return (
    <ProtectedRoute requireVerified={true}>
      <PropertyForm />
    </ProtectedRoute>
  )
} 