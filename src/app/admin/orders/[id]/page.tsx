import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { formatPrice } from '@/lib/utils'
import OrderStatusUpdater from '@/components/admin/OrderStatusUpdater'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default async function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: order } = await supabase
    .from('orders')
    .select('*, items:order_items(*)')
    .eq('id', id)
    .single()

  if (!order) notFound()

  return (
    <div className="p-6 lg:p-8">
      <Link href="/admin/orders" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm mb-6">
        <ArrowLeft size={16} /> Back to Orders
      </Link>

      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl text-white tracking-wider">{order.order_number}</h1>
          <p className="text-gray-400 text-sm mt-1">{new Date(order.created_at).toLocaleString('en-IN')}</p>
        </div>
        <OrderStatusUpdater orderId={order.id} currentStatus={order.status} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Items */}
          <div className="bg-brand-card border border-brand-border rounded-2xl p-6">
            <h2 className="font-bold text-white mb-4">Order Items</h2>
           <div className="space-y-3">
  {order.items?.map((item: any) => (
    <div
      key={item.id}
      className="flex items-center justify-between p-3 bg-brand-dark rounded-xl"
    >
      <div>
        <p className="text-white text-sm font-medium">
          {item.product_name}
        </p>

        {item.selected_variant && (
          <p className="text-brand-purple-light text-xs">
            Size: {item.selected_variant}
          </p>
        )}

        <p className="text-gray-400 text-xs">
          Qty: {item.quantity} × {formatPrice(item.product_price)}
        </p>
      </div>

      <p className="text-white font-bold">
        {formatPrice(item.subtotal)}
      </p>
    </div>
  ))}
</div>
            <div className="border-t border-brand-border mt-4 pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-gray-400">
                <span>Subtotal</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>

              <div className="flex justify-between text-gray-400">
                <span>Delivery</span>
                <span>
                  {order.delivery_charge === 0
                    ? 'FREE'
                    : formatPrice(order.delivery_charge)}
                </span>
              </div>

              <div className="flex justify-between font-bold text-white">
                <span>Total</span>
                <span className="text-brand-purple-light">
                  {formatPrice(order.total)}
                </span>
              </div>
            </div>
          </div>
          {/* Payment Proof */}
          {order.payment_screenshot_url && (
            <div className="bg-brand-card border border-brand-border rounded-2xl p-6">
              <h2 className="font-bold text-white mb-4">Payment Proof</h2>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-gray-400 text-xs mb-1">Transaction ID</p>
                  <p className="text-white font-mono text-sm">{order.transaction_id || '—'}</p>
                </div>
              </div>
              <a href={order.payment_screenshot_url} target="_blank" rel="noopener noreferrer">
                <Image
                  src={order.payment_screenshot_url}
                  alt="Payment screenshot"
                  width={300}
                  height={200}
                  className="rounded-xl border border-brand-border object-contain max-h-60 hover:opacity-90 transition-opacity"
                />
              </a>
            </div>
          )}
        </div>

        {/* Customer Info */}
        <div className="space-y-4">
          <div className="bg-brand-card border border-brand-border rounded-2xl p-6">
            <h2 className="font-bold text-white mb-4">Customer Details</h2>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-gray-500 text-xs">Name</dt>
                <dd className="text-white">{order.customer_name}</dd>
              </div>
              <div>
                <dt className="text-gray-500 text-xs">Phone</dt>
                <dd className="text-white">{order.customer_phone}</dd>
              </div>
              {order.customer_email && (
                <div>
                  <dt className="text-gray-500 text-xs">Email</dt>
                  <dd className="text-white">{order.customer_email}</dd>
                </div>
              )}
              <div>
                <dt className="text-gray-500 text-xs">Address</dt>
                <dd className="text-white leading-relaxed">
                  {order.address}<br />
                  {order.city}, {order.state} - {order.pincode}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  )
}
