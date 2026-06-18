'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { CheckCircle, Package, MessageCircle, Instagram } from 'lucide-react'
import { getWhatsAppUrl, getInstagramUrl } from '@/lib/utils'
import { useSearchParams } from 'next/navigation'

export default function ThankYouPage() {
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
          Thank you for ordering from GenZ Era World. Your order has been received and is awaiting payment verification.
        </p>

        {orderNumber && (
          <div className="bg-brand-card border border-brand-border rounded-xl p-4 mb-8 inline-block">
            <p className="text-gray-400 text-xs mb-1">Your Order ID</p>
            <p className="text-brand-purple-light font-mono font-bold text-lg">{orderNumber}</p>
            <p className="text-gray-500 text-xs mt-1">Save this to track your order</p>
          </div>
        )}

        <div className="bg-brand-card border border-brand-border rounded-2xl p-6 mb-8 text-left">
          <h2 className="font-bold text-white mb-4 flex items-center gap-2">
            <Package size={18} className="text-brand-purple" />
            What happens next?
          </h2>
          <ol className="space-y-3">
            {[
              'We verify your payment (usually within a few hours)',
              'Once verified, we pack your order carefully',
              'Your order is shipped with tracking',
              'Delivered to your doorstep!',
            ].map((step, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                <span className="w-5 h-5 rounded-full bg-brand-purple/30 border border-brand-purple/50 flex items-center justify-center flex-shrink-0 text-xs text-brand-purple-light font-bold mt-0.5">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          {orderNumber && (
            <Link href={`/track-order?id=${orderNumber}`} className="flex-1 btn-outline py-3 text-sm">
              Track Order
            </Link>
          )}
          <Link href="/shop" className="flex-1 btn-primary py-3 text-sm">
            Continue Shopping
          </Link>
        </div>

        <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
          <Link
            href={getInstagramUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-brand-purple-light transition-colors"
          >
            <Instagram size={14} />
            DM on Instagram
          </Link>
          <span>·</span>
          <Link
            href={getWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-green-400 transition-colors"
          >
            <MessageCircle size={14} />
            WhatsApp
          </Link>
        </div>
      </div>
    </div>
  )
}
