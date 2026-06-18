import Link from 'next/link'
import { Instagram, MessageCircle, Mail, MapPin, Zap } from 'lucide-react'
import { getInstagramUrl, getWhatsAppUrl } from '@/lib/utils'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-brand-darkest border-t border-brand-border mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="mb-4">
              <span className="font-display text-3xl text-white tracking-wider glow-text-sm">GENZERA</span>
              <span className="font-display text-sm text-brand-purple-light tracking-[0.4em] block">WORLD</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-4 max-w-sm">
              Not your average pop culture store. Premium action figures, sneakers, apparel & collectibles.
              By Kabir Luthra.
            </p>
            <p className="text-gray-500 text-xs">
              <Zap size={12} className="inline text-brand-purple mr-1" />
              Pan India Shipping · Premium Quality · Secure Packaging
            </p>
            <div className="flex items-center gap-3 mt-6">
              <Link
                href={getInstagramUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 rounded-lg bg-brand-dark neon-border hover:bg-brand-purple/20 transition-all duration-300 group"
              >
                <Instagram size={18} className="text-gray-400 group-hover:text-brand-purple-light transition-colors" />
              </Link>
              <Link
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 rounded-lg bg-brand-dark neon-border hover:bg-brand-purple/20 transition-all duration-300 group"
              >
                <MessageCircle size={18} className="text-gray-400 group-hover:text-green-400 transition-colors" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-white mb-4 text-sm tracking-wider uppercase">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { href: '/', label: 'Home' },
                { href: '/shop', label: 'Shop All' },
                { href: '/category/action-figures', label: 'Action Figures' },
                { href: '/category/t-shirts', label: 'T-Shirts' },
                { href: '/category/sneakers', label: 'Sneakers' },
                { href: '/track-order', label: 'Track Order' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-brand-purple-light transition-colors text-sm flex items-center gap-1 group"
                  >
                    <span className="w-0 group-hover:w-3 transition-all duration-200 overflow-hidden text-brand-purple">›</span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-white mb-4 text-sm tracking-wider uppercase">Contact</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href={getInstagramUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-400 hover:text-brand-purple-light transition-colors text-sm"
                >
                  <Instagram size={14} className="text-brand-purple flex-shrink-0" />
                  @genzeraworld
                </Link>
              </li>
              <li>
                <Link
                  href={getWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-400 hover:text-green-400 transition-colors text-sm"
                >
                  <MessageCircle size={14} className="text-green-500 flex-shrink-0" />
                  +91 85699 50807
                  <span className="text-xs text-gray-500">(chats only)</span>
                </Link>
              </li>
              <li className="flex items-start gap-2 text-gray-500 text-sm">
                <MapPin size={14} className="text-brand-purple flex-shrink-0 mt-0.5" />
                Pan India Delivery
              </li>
            </ul>

            <div className="mt-6 p-4 bg-brand-dark rounded-lg neon-border">
              <p className="text-xs text-gray-400 mb-2">DM on Instagram for:</p>
              <div className="flex flex-wrap gap-1">
                {['Bulk Orders', 'Custom Figures', 'Collabs'].map((tag) => (
                  <span
                    key={tag}
                    className="text-xs bg-brand-purple/20 text-brand-purple-light px-2 py-0.5 rounded-full border border-brand-purple/30"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-brand-border mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-xs">
            © {currentYear} GenZ Era World by Kabir Luthra. All rights reserved.
          </p>
          <p className="text-gray-600 text-xs">
            Not your average pop culture store.
          </p>
        </div>
      </div>
    </footer>
  )
}
