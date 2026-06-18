'use client'

import { Suspense } from 'react'
import Link from 'next/link'
import { CheckCircle, Package, MessageCircle, Instagram } from 'lucide-react'
import { getWhatsAppUrl, getInstagramUrl } from '@/lib/utils'
import { useSearchParams } from 'next/navigation'

function ThankYouContent() {
  const searchParams = useSearchParams()
  const orderNumber = searchParams.get('order')

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 flex items-center justify-center">
      <div className="max-w-lg mx-auto text-center">
        <div className="w-24 h-24 rounded-full bg-brand-purple/20 border-2 border-brand-purple flex items-center justify-center mx-auto mb-8 animate-glow-pulse">
          <CheckCircle size={48} className="text-brand-purple-light" />
        </div>

        <h1 className="font-display text-4xl sm:text-5xl text-white tracking-wider mb-4">
          ORDER PLACED!
        </h1>

        <p className="text-gray-300 text-base mb-4 leading-relaxed">
          Thank you for ordering from GenZ Era World.
        </p>

        {orderNumber && (
          <div className="bg-brand-card border border-brand-border rounded-xl p-4 mb-8 inline-block">
            <p className="text-brand-purple-light font-mono font-bold text-lg">
              {orderNumber}
            </p>
          </div>
        )}

        <Link href="/shop" className="btn-primary py-3 px-6">
          Continue Shopping
        </Link>
      </div>
    </div>
  )
}

export default function ThankYouPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ThankYouContent />
    </Suspense>
  )
}