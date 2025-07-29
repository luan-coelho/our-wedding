'use client'

import { Button } from '@/components/ui/button'
import { Calendar, CheckCircle, Gift, Heart, MapPin, Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'

const navItems = [
  { id: 'hero', label: 'Início', icon: Heart },
  { id: 'countdown', label: 'Contagem', icon: Calendar },
  { id: 'ceremony', label: 'Cerimônia', icon: MapPin },
  { id: 'gifts', label: 'Presentes', icon: Gift },
  { id: 'confirmation', label: 'Confirmação', icon: CheckCircle },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      setScrolled(scrollPosition > 50)

      // Determine active section based on scroll position
      const sections = navItems.map(item => ({
        id: item.id,
        element: document.getElementById(item.id),
      }))

      const currentSection = sections.find(section => {
        if (!section.element) return false
        const rect = section.element.getBoundingClientRect()
        return rect.top <= 100 && rect.bottom >= 100
      })

      if (currentSection) {
        setActiveSection(currentSection.id)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

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
    setIsOpen(false)
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-md shadow-lg border-wedding-light/20' : 'bg-transparent'
      }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-16 sm:h-20">
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map(item => {
              const Icon = item.icon
              const isActive = activeSection === item.id

              return (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? 'bg-wedding-primary text-white shadow-md'
                      : scrolled
                        ? 'text-wedding-dark hover:text-wedding-primary hover:bg-wedding-primary/10'
                        : 'text-black hover:text-wedding-primary hover:bg-white/20'
                  }`}>
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </button>
              )
            })}
          </div>
          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 ${
                scrolled
                  ? 'text-wedding-dark hover:text-wedding-primary'
                  : 'text-white hover:text-wedding-primary hover:bg-white/20'
              }`}>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md border-b border-wedding-light/20">
          <div className="px-4 py-4 space-y-1">
            {navItems.map(item => {
              const Icon = item.icon
              const isActive = activeSection === item.id

              return (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-300 ${
                    isActive
                      ? 'bg-wedding-primary text-white shadow-md'
                      : 'text-wedding-dark hover:text-wedding-primary hover:bg-wedding-primary/10'
                  }`}>
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </nav>
  )
}
