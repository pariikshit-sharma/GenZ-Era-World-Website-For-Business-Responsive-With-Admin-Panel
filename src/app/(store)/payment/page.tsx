'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/hooks/useCart'
import { formatPrice, generateOrderNumber } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { Upload, CheckCircle, AlertCircle } from 'lucide-react'
import Image from 'next/image'
import toast from 'react-hot-toast'

export default function PaymentPage() {
  const router = useRouter()
  const { clearCart } = useCartStore()
  const [checkoutData, setCheckoutData] = useState<any>(null)
  const [screenshot, setScreenshot] = useState<File | null>(null)
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null)
  const [transactionId, setTransactionId] = useState('')
  const [loading, setLoading] = useState(false)
  const [upiQrUrl, setUpiQrUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const data = sessionStorage.getItem('checkoutData')
    if (!data) {
      router.push('/checkout')
      return
    }
    setCheckoutData(JSON.parse(data))

    // Load UPI QR from settings
    const loadQr = async () => {
      const supabase = createClient()
      const { data: settings } = await supabase
        .from('site_settings')
        .select('upi_qr_image_url')
        .single()
      if (settings?.upi_qr_image_url) setUpiQrUrl(settings.upi_qr_image_url)
      else setUpiQrUrl('/images/upi-qr.png')
    }
    loadQr()
  }, [router])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setScreenshot(file)
    const reader = new FileReader()
    reader.onload = () => setScreenshotPreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!screenshot) {
      toast.error('Please upload your payment screenshot')
      return
    }
    if (!transactionId.trim()) {
      toast.error('Please enter your transaction ID')
      return
    }
    if (!checkoutData) return

    setLoading(true)
    try {
      const supabase = createClient()
      const orderNumber = generateOrderNumber()

      // Upload screenshot
      const fileExt = screenshot.name.split('.').pop()
      const fileName = `${orderNumber}-screenshot.${fileExt}`
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('payment-proofs')
        .upload(fileName, screenshot)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('payment-proofs')
        .getPublicUrl(fileName)

      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          order_number: orderNumber,
          customer_name: checkoutData.customer.fullName,
          customer_phone: checkoutData.customer.phone,
          customer_email: checkoutData.customer.email || null,
          address: checkoutData.customer.address,
          city: checkoutData.customer.city,
          state: checkoutData.customer.state,
          pincode: checkoutData.customer.pincode,
          subtotal: checkoutData.subtotal,
          delivery_charge: checkoutData.delivery_charge,
          total: checkoutData.total,
          status: 'pending_verification',
          payment_screenshot_url: publicUrl,
          transaction_id: transactionId,
        })
        .select()
        .single()

      if (orderError) throw orderError

      // Create order items
      const orderItems = checkoutData.items.map((item: any) => ({
        order_id: order.id,
        product_id: item.product_id,
        product_name: item.product_name,
        product_price: item.product_price,
        quantity: item.quantity,
        subtotal: item.subtotal,
      }))

      await supabase.from('order_items').insert(orderItems)

      // Update inventory
      for (const item of checkoutData.items) {
        await supabase.rpc('decrement_stock', {
          p_product_id: item.product_id,
          p_quantity: item.quantity,
        })
      }

      clearCart()
      sessionStorage.removeItem('checkoutData')
      sessionStorage.setItem('lastOrderNumber', orderNumber)
      router.push(`/thank-you?order=${orderNumber}`)
    } catch (err) {
      console.error(err)
      toast.error('Something went wrong. Please try again or contact us.')
    } finally {
      setLoading(false)
    }
  }

  if (!checkoutData) return null

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-display text-4xl text-white tracking-wider mb-2">PAYMENT</h1>
        <p className="text-gray-400 mb-10">Complete your payment to confirm the order</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* QR Code */}
          <div>
            <div className="bg-brand-card border border-brand-border rounded-2xl p-6 text-center mb-6">
              <h2 className="font-bold text-white mb-4">Scan & Pay via UPI</h2>
              {upiQrUrl && (
                <div className="flex justify-center mb-4">
                  <Image
                    src={upiQrUrl}
                    alt="UPI QR Code"
                    width={200}
                    height={200}
                    className="rounded-xl"
                  />
                </div>
              )}
              <p className="text-gray-400 text-sm mb-2">Scan using any UPI app</p>
              <p className="text-brand-purple-light text-sm font-medium">
                GooglePay · PhonePe · Paytm · BHIM
              </p>
            </div>

            {/* Order Summary */}
            <div className="bg-brand-card border border-brand-border rounded-2xl p-6">
              <h2 className="font-bold text-white mb-4">Order Summary</h2>
              <div className="space-y-2 text-sm">
                {checkoutData.items.map((item: any) => (
                  <div key={item.product_id} className="flex justify-between text-gray-300">
                    <span>{item.product_name} × {item.quantity}</span>
                    <span>{formatPrice(item.subtotal)}</span>
                  </div>
                ))}
                <div className="border-t border-brand-border pt-2 mt-2 space-y-1">
                  <div className="flex justify-between text-gray-400">
                    <span>Subtotal</span>
                    <span>{formatPrice(checkoutData.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Delivery</span>
                    <span className={checkoutData.delivery_charge === 0 ? 'text-green-400' : ''}>
                      {checkoutData.delivery_charge === 0 ? 'FREE' : formatPrice(checkoutData.delivery_charge)}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold text-base text-white border-t border-brand-border pt-2">
                    <span>Pay Exactly</span>
                    <span className="text-brand-purple-light text-lg">{formatPrice(checkoutData.total)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Upload */}
          <div>
            <form onSubmit={handleSubmit}>
              <div className="bg-brand-card border border-brand-border rounded-2xl p-6 space-y-5">
                <h2 className="font-bold text-white">Confirm Your Payment</h2>

                <div>
                  <label className="text-xs text-gray-400 mb-2 block">Payment Screenshot *</label>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                      screenshotPreview
                        ? 'border-brand-purple bg-brand-purple/10'
                        : 'border-brand-border hover:border-brand-purple/50'
                    }`}
                  >
                    {screenshotPreview ? (
                      <div>
                        <Image
                          src={screenshotPreview}
                          alt="Screenshot preview"
                          width={200}
                          height={150}
                          className="mx-auto rounded-lg object-contain max-h-40"
                        />
                        <p className="text-green-400 text-xs mt-2 flex items-center justify-center gap-1">
                          <CheckCircle size={12} /> Screenshot uploaded
                        </p>
                      </div>
                    ) : (
                      <div>
                        <Upload size={32} className="text-brand-purple/50 mx-auto mb-2" />
                        <p className="text-gray-400 text-sm">Click to upload payment screenshot</p>
                        <p className="text-gray-600 text-xs mt-1">JPG, PNG or WEBP</p>
                      </div>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-400 mb-1.5 block">Transaction ID / UTR Number *</label>
                  <input
                    type="text"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    className="w-full bg-brand-dark border border-brand-border focus:border-brand-purple text-white rounded-lg px-4 py-3 text-sm outline-none transition-colors"
                    placeholder="e.g. UTR123456789012"
                  />
                </div>

                <div className="bg-brand-dark border border-yellow-700/30 rounded-xl p-4">
                  <div className="flex gap-2">
                    <AlertCircle size={16} className="text-yellow-400 flex-shrink-0 mt-0.5" />
                    <div className="text-xs text-gray-300">
                      <p className="font-medium text-yellow-400 mb-1">Important:</p>
                      <p>Pay exactly {formatPrice(checkoutData.total)} to avoid delays. Your order will be confirmed after manual payment verification.</p>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || !screenshot || !transactionId.trim()}
                  className="w-full btn-primary py-4 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Submitting Order...
                    </span>
                  ) : (
                    'Submit Order'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
