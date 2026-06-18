'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Search, Package, CheckCircle, Truck, Home } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

const STATUS_STEPS = [
  { key: 'pending_verification', label: 'Order Received', icon: Package },
  { key: 'payment_verified', label: 'Payment Verified', icon: CheckCircle },
  { key: 'packed', label: 'Packed', icon: Package },
  { key: 'shipped', label: 'Shipped', icon: Truck },
  { key: 'delivered', label: 'Delivered', icon: Home },
]

export default function TrackOrderPage() {
  const searchParams = useSearchParams()
  const [orderId, setOrderId] = useState(searchParams.get('id') || '')
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSearch = async (id?: string) => {
    const searchId = id || orderId
    if (!searchId.trim()) return
    setLoading(true)
    setError('')
    setOrder(null)

    const supabase = createClient()
    const { data, error: err } = await supabase
      .from('orders')
      .select('*, items:order_items(*)')
      .eq('order_number', searchId.trim().toUpperCase())
      .single()

    if (err || !data) {
      setError('Order not found. Please check your Order ID.')
    } else {
      setOrder(data)
    }
    setLoading(false)
  }

  useEffect(() => {
    const id = searchParams.get('id')
    if (id) {
      setOrderId(id)
      handleSearch(id)
    }
  }, [])

  const currentStepIndex = order
    ? STATUS_STEPS.findIndex((s) => s.key === order.status)
    : -1

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="font-display text-4xl sm:text-5xl text-white tracking-wider mb-2">
          TRACK ORDER
        </h1>
        <p className="text-gray-400 mb-10">Enter your Order ID to check the status</p>

        <div className="flex gap-3 mb-10">
          <input
            type="text"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="e.g. GEW-ABC123-XY"
            className="flex-1 bg-brand-card border border-brand-border focus:border-brand-purple text-white rounded-xl px-4 py-3.5 text-sm outline-none transition-colors"
          />
          <button
            onClick={() => handleSearch()}
            disabled={loading}
            className="btn-primary px-6 flex items-center gap-2"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Search size={16} />
            )}
            Track
          </button>
        </div>

        {error && (
          <div className="bg-red-900/30 border border-red-700/50 text-red-400 rounded-xl p-4 text-sm mb-6">
            {error}
          </div>
        )}

        {order && (
          <div className="space-y-6">
            {/* Status */}
            {order.status !== 'cancelled' && order.status !== 'refunded' && (
              <div className="bg-brand-card border border-brand-border rounded-2xl p-6">
                <h2 className="font-bold text-white mb-6">Order Status</h2>
                <div className="relative">
                  <div className="absolute left-4 top-5 bottom-5 w-0.5 bg-brand-border" />
                  <div
                    className="absolute left-4 top-5 w-0.5 bg-brand-purple transition-all duration-1000"
                    style={{
                      height: `${Math.max(0, (currentStepIndex / (STATUS_STEPS.length - 1)) * 100)}%`,
                    }}
                  />
                  <div className="space-y-6">
                    {STATUS_STEPS.map((step, idx) => {
                      const Icon = step.icon
                      const done = idx <= currentStepIndex
                      const active = idx === currentStepIndex
                      return (
                        <div key={step.key} className="flex items-center gap-4 relative">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center z-10 transition-all ${
                              active
                                ? 'bg-brand-purple shadow-purple-sm'
                                : done
                                ? 'bg-brand-purple/50'
                                : 'bg-brand-dark border border-brand-border'
                            }`}
                          >
                            <Icon size={14} className={done ? 'text-white' : 'text-gray-500'} />
                          </div>
                          <div>
                            <p className={`text-sm font-medium ${done ? 'text-white' : 'text-gray-500'}`}>
                              {step.label}
                            </p>
                            {active && (
                              <p className="text-xs text-brand-purple-light">Current Status</p>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}

            {(order.status === 'cancelled' || order.status === 'refunded') && (
              <div className="bg-red-900/20 border border-red-700/40 rounded-2xl p-6">
                <p className="text-red-400 font-bold text-lg capitalize">{order.status}</p>
              </div>
            )}

            {/* Order Details */}
            <div className="bg-brand-card border border-brand-border rounded-2xl p-6">
              <h2 className="font-bold text-white mb-4">Order Details</h2>
              <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                <div>
                  <p className="text-gray-500 text-xs">Order ID</p>
                  <p className="text-brand-purple-light font-mono font-medium">{order.order_number}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Total</p>
                  <p className="text-white font-bold">{formatPrice(order.total)}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Name</p>
                  <p className="text-white">{order.customer_name}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Phone</p>
                  <p className="text-white">{order.customer_phone}</p>
                </div>
              </div>
              <div>
                <p className="text-gray-500 text-xs mb-1">Delivery Address</p>
                <p className="text-white text-sm">{order.address}, {order.city}, {order.state} - {order.pincode}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
