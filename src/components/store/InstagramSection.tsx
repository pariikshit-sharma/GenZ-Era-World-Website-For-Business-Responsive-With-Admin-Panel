import Link from 'next/link'
import { Instagram, ExternalLink } from 'lucide-react'
import { getInstagramUrl } from '@/lib/utils'

export default function InstagramSection() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-brand-purple/20 via-brand-card to-brand-purple/20 rounded-3xl border border-brand-border overflow-hidden p-8 sm:p-12 text-center relative">
          <div className="absolute inset-0 grid-overlay opacity-30" />
          <div className="relative z-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-500 mb-6 shadow-purple-md">
              <Instagram size={28} className="text-white" />
            </div>
            <h2 className="font-display text-3xl sm:text-5xl text-white tracking-wider mb-4">
              FOLLOW
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-purple to-pink-400"> @GENZERAWORLD</span>
            </h2>
            <p className="text-gray-300 text-base max-w-lg mx-auto mb-8">
              Stay updated with the latest drops, behind-the-scenes content, and exclusive deals.
              Join the GenZ Era World community.
            </p>
            <Link
              href={getInstagramUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 text-white font-bold px-8 py-4 rounded-full hover:opacity-90 transition-opacity shadow-purple-md"
            >
              <Instagram size={18} />
              Follow on Instagram
              <ExternalLink size={14} />
            </Link>

            <div className="flex items-center justify-center gap-8 mt-10 pt-8 border-t border-brand-border/50">
              {[
                { label: 'DM for custom orders', icon: '✉️' },
                { label: 'Early drops first', icon: '⚡' },
                { label: 'Creator collabs', icon: '🎯' },
              ].map((item) => (
                <div key={item.label} className="text-center">
                  <div className="text-2xl mb-1">{item.icon}</div>
                  <p className="text-xs text-gray-400">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
