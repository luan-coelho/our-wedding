'use client'

import Ceremony from '@/components/sections/ceremony'
import Confirmation from '@/components/sections/confirmation'
import Countdown from '@/components/sections/countdown'
import Footer from '@/components/sections/footer'
import Gifts from '@/components/sections/gifts'
import Hero from '@/components/sections/hero'
import Navbar from '@/components/sections/navbar'

export default function Home() {
  // Data do casamento (12 de setembro de 2025)
  const weddingDate = new Date('2025-09-12T10:00:00')

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      const navHeight = 80
      const elementPosition = element.getBoundingClientRect().top + window.scrollY
      const offsetPosition = elementPosition - navHeight

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      })
    }
  }

  const scrollToNextSection = () => {
    scrollToSection('countdown')
  }

  return (
    <div className="min-h-screen">
      {/* Navbar fixo */}
      <Navbar />

      {/* Hero Section */}
      <Hero onScrollToNextAction={scrollToNextSection} />

      {/* Countdown Section */}
      <Countdown weddingDate={weddingDate} />

      {/* Couple Section */}
      {/* <Couple /> */}

      {/* Ceremony Section */}
      <Ceremony />

      {/* Gifts Section */}
      <Gifts />

      {/* Confirmation Section */}
      <Confirmation />

      {/* Footer */}
      <Footer />
    </div>
  )
}
