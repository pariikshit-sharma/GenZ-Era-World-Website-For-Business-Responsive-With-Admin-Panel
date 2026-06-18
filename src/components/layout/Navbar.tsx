'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, ShoppingCart, Search, Instagram } from 'lucide-react'
import { useCartStore } from '@/hooks/useCart'
import { getInstagramUrl } from '@/lib/utils'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/shop', label: 'Shop' },
  { href: '/category/action-figures', label: 'Action Figures' },
  { href: '/category/t-shirts', label: 'T-Shirts' },
  { href: '/category/sneakers', label: 'Sneakers' },
  { href: '/track-order', label: 'Track Order' },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { getItemCount, toggleCart } = useCartStore()
  const itemCount = getItemCount()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-brand-darkest/95 backdrop-blur-md border-b border-brand-border shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative">
              <span className="font-display text-2xl text-white tracking-wider group-hover:text-brand-purple-light transition-colors duration-300 glitch-hover">
                GENZERA
              </span>
              <span className="font-display text-xs text-brand-purple-light tracking-[0.3em] block -mt-1">
                WORLD
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-gray-300 hover:text-brand-purple-light transition-colors duration-200 relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-purple group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <Link
              href={getInstagramUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex text-gray-400 hover:text-brand-purple-light transition-colors p-2"
            >
              <Instagram size={18} />
            </Link>

            <Link
              href="/shop"
              className="hidden sm:flex text-gray-400 hover:text-brand-purple-light transition-colors p-2"
            >
              <Search size={18} />
            </Link>

            <button
              onClick={toggleCart}
              className="relative flex items-center gap-1 text-gray-300 hover:text-white transition-colors p-2"
            >
              <ShoppingCart size={20} />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-purple text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden text-gray-300 hover:text-white transition-colors p-2"
            >
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-brand-darkest/98 backdrop-blur-md border-b border-brand-border">
          <div className="px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block py-3 px-4 text-gray-300 hover:text-white hover:bg-brand-dark rounded-lg transition-all duration-200"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href={getInstagramUrl()}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 py-3 px-4 text-brand-purple-light hover:text-white rounded-lg transition-all duration-200"
            >
              <Instagram size={16} />
              <span>Follow on Instagram</span>
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
