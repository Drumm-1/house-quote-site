import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { HeroSection } from '@/components/landing/hero-section'
import { HowItWorksSection } from '@/components/landing/how-it-works-section'
import { BenefitsSection } from '@/components/landing/benefits-section'
import { TestimonialsSection } from '@/components/landing/testimonials-section'
import { StatsSection } from '@/components/landing/stats-section'
import { CTASection } from '@/components/landing/cta-section'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <HeroSection />
        <HowItWorksSection />
        <BenefitsSection />
        <TestimonialsSection />
        <StatsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
} 