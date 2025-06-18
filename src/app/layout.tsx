import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/components/auth/auth-context'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'InstantHomeBuyer - Get Cash for Your Home in 7 Days',
  description: 'Sell your house fast with our instant cash offers. No fees, no repairs needed, close in 7 days.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
} 