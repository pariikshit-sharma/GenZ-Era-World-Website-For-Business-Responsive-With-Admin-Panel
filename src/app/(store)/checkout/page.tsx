'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/hooks/useCart'
import { formatPrice } from '@/lib/utils'
import { ArrowRight, ShoppingBag } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getSubtotal, getDeliveryCharge, getTotal } = useCartStore()
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const subtotal = getSubtotal()
  const deliveryCharge = getDeliveryCharge()
  const total = getTotal()

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-24 flex flex-col items-center justify-center px-4">
        <ShoppingBag size={64} className="text-brand-purple/30 mb-6" />
        <h1 className="font-display text-3xl text-white mb-2">Your cart is empty</h1>
        <p className="text-gray-400 mb-6">Add some items before checkout</p>
        <Link href="/shop" className="btn-primary px-8 py-3">Browse Shop</Link>
      </div>
    )
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!form.fullName.trim()) newErrors.fullName = 'Full name is required'
    if (!form.phone.trim() || !/^[6-9]\d{9}$/.test(form.phone))
      newErrors.phone = 'Valid 10-digit Indian mobile number required'
    if (!form.address.trim()) newErrors.address = 'Address is required'
    if (!form.city.trim()) newErrors.city = 'City is required'
    if (!form.state.trim()) newErrors.state = 'State is required'
    if (!form.pincode.trim() || !/^\d{6}$/.test(form.pincode))
      newErrors.pincode = 'Valid 6-digit pincode required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    // Save checkout info to session storage
    sessionStorage.setItem('checkoutData', JSON.stringify({
      customer: form,
      items: items.map((item) => ({
        product_id: item.product_id,
        product_name: item.product.name,
        product_price: item.product.sale_price ?? item.product.price,
        quantity: item.quantity,
        subtotal: (item.product.sale_price ?? item.product.price) * item.quantity,
      })),
      subtotal,
      delivery_charge: deliveryCharge,
      total,
    }))

    router.push('/payment')
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="font-display text-4xl text-white tracking-wider mb-10">CHECKOUT</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Form */}
            <div className="lg:col-span-3 space-y-5">
              <div className="bg-brand-card border border-brand-border rounded-2xl p-6">
                <h2 className="font-bold text-white mb-5">Shipping Details</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="text-xs text-gray-400 mb-1.5 block">Full Name *</label>
                    <input
                      type="text"
                      value={form.fullName}
                      onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                      className="w-full bg-brand-dark border border-brand-border focus:border-brand-purple text-white rounded-lg px-4 py-3 text-sm outline-none transition-colors"
                      placeholder="Your full name"
                    />
                    {errors.fullName && <p className="text-red-400 text-xs mt-1">{errors.fullName}</p>}
                  </div>

                  <div>
                    <label className="text-xs text-gray-400 mb-1.5 block">Mobile Number *</label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full bg-brand-dark border border-brand-border focus:border-brand-purple text-white rounded-lg px-4 py-3 text-sm outline-none transition-colors"
                      placeholder="10-digit mobile"
                    />
                    {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
                  </div>

                  <div>
                    <label className="text-xs text-gray-400 mb-1.5 block">Email (optional)</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full bg-brand-dark border border-brand-border focus:border-brand-purple text-white rounded-lg px-4 py-3 text-sm outline-none transition-colors"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-xs text-gray-400 mb-1.5 block">Full Address *</label>
                    <textarea
                      value={form.address}
                      onChange={(e) => setForm({ ...form, address: e.target.value })}
                      rows={3}
                      className="w-full bg-brand-dark border border-brand-border focus:border-brand-purple text-white rounded-lg px-4 py-3 text-sm outline-none transition-colors resize-none"
                      placeholder="House/Flat No., Street, Area, Landmark"
                    />
                    {errors.address && <p className="text-red-400 text-xs mt-1">{errors.address}</p>}
                  </div>

                  <div>
                    <label className="text-xs text-gray-400 mb-1.5 block">City *</label>
                    <input
                      type="text"
                      value={form.city}
                      onChange={(e) => setForm({ ...form, city: e.target.value })}
                      className="w-full bg-brand-dark border border-brand-border focus:border-brand-purple text-white rounded-lg px-4 py-3 text-sm outline-none transition-colors"
                      placeholder="City"
                    />
                    {errors.city && <p className="text-red-400 text-xs mt-1">{errors.city}</p>}
                  </div>

                  <div>
                    <label className="text-xs text-gray-400 mb-1.5 block">State *</label>
                    <input
                      type="text"
                      value={form.state}
                      onChange={(e) => setForm({ ...form, state: e.target.value })}
                      className="w-full bg-brand-dark border border-brand-border focus:border-brand-purple text-white rounded-lg px-4 py-3 text-sm outline-none transition-colors"
                      placeholder="State"
                    />
                    {errors.state && <p className="text-red-400 text-xs mt-1">{errors.state}</p>}
                  </div>

                  <div>
                    <label className="text-xs text-gray-400 mb-1.5 block">Pincode *</label>
                    <input
                      type="text"
                      value={form.pincode}
                      onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                      className="w-full bg-brand-dark border border-brand-border focus:border-brand-purple text-white rounded-lg px-4 py-3 text-sm outline-none transition-colors"
                      placeholder="6-digit pincode"
                    />
                    {errors.pincode && <p className="text-red-400 text-xs mt-1">{errors.pincode}</p>}
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-2">
              <div className="bg-brand-card border border-brand-border rounded-2xl p-6 sticky top-24">
                <h2 className="font-bold text-white mb-5">Order Summary</h2>

                <div className="space-y-3 mb-5">
                  {items.map((item) => {
                    const price = item.product.sale_price ?? item.product.price
                    return (
                      <div key={item.product_id} className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-brand-dark flex-shrink-0">
                          <Image
                            src={item.product.featured_image || item.product.images?.[0]?.url || '/images/placeholder.jpg'}
                            alt={item.product.name}
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white truncate">{item.product.name}</p>
                          <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                        </div>
                        <p className="text-sm font-medium text-white flex-shrink-0">
                          {formatPrice(price * item.quantity)}
                        </p>
                      </div>
                    )
                  })}
                </div>

                <div className="border-t border-brand-border pt-4 space-y-2 text-sm">
                  <div className="flex justify-between text-gray-400">
                    <span>Subtotal</span>
                    <span className="text-white">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Delivery</span>
                    <span className={deliveryCharge === 0 ? 'text-green-400' : 'text-white'}>
                      {deliveryCharge === 0 ? 'FREE' : formatPrice(deliveryCharge)}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold text-base border-t border-brand-border pt-2 mt-2">
                    <span className="text-white">Total</span>
                    <span className="text-brand-purple-light">{formatPrice(total)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full btn-primary mt-6 flex items-center justify-center gap-2"
                >
                  Proceed to Payment
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
