import Link from 'next/link'
import { Instagram, MessageCircle, MapPin, Zap } from 'lucide-react'
import { getInstagramUrl, getWhatsAppUrl } from '@/lib/utils'

export default function ContactSection() {
  return (
    <section className="py-20 px-4 bg-brand-darkest">
      <div className="max-w-3xl mx-auto text-center">
        <span className="text-brand-purple-light text-sm font-medium tracking-wider uppercase block mb-3">
          Get In Touch
        </span>
        <h2 className="font-display text-4xl sm:text-5xl text-white tracking-wider mb-4">
          CONTACT
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-purple to-brand-purple-light"> US</span>
        </h2>
        <p className="text-gray-400 mb-12 max-w-lg mx-auto">
          Questions? Custom orders? Collaborations? We&apos;re always a DM away.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
          <Link
            href={getInstagramUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 bg-brand-card border border-brand-border hover:border-brand-purple/50 rounded-2xl p-6 group transition-all duration-300 hover:shadow-card-hover"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center flex-shrink-0">
              <Instagram size={20} className="text-white" />
            </div>
            <div className="text-left">
              <p className="text-white font-semibold">Instagram</p>
              <p className="text-gray-400 text-sm">@genzeraworld</p>
              <p className="text-brand-purple-light text-xs mt-0.5">DM for orders & collabs</p>
            </div>
          </Link>

          <Link
            href={getWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 bg-brand-card border border-brand-border hover:border-green-500/50 rounded-2xl p-6 group transition-all duration-300 hover:shadow-card-hover"
          >
            <div className="w-12 h-12 rounded-xl bg-green-600 flex items-center justify-center flex-shrink-0">
              <MessageCircle size={20} className="text-white" />
            </div>
            <div className="text-left">
              <p className="text-white font-semibold">WhatsApp</p>
              <p className="text-gray-400 text-sm">+91 85699 50807</p>
              <p className="text-gray-500 text-xs mt-0.5">Chats only — no calls</p>
            </div>
          </Link>
        </div>

        <div className="flex items-center justify-center gap-2 text-gray-500 text-sm">
          <MapPin size={14} className="text-brand-purple" />
          <span>Pan India Delivery · Secure Packaging · Easy Returns</span>
        </div>
      </div>
    </section>
  )
}
