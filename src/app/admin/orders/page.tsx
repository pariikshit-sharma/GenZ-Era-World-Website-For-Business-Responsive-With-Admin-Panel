import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils'

const STATUS_COLORS: Record<string, string> = {
  pending_verification: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  payment_verified: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  packed: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
  shipped: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  delivered: 'bg-green-500/20 text-green-400 border-green-500/30',
  cancelled: 'bg-red-500/20 text-red-400 border-red-500/30',
  refunded: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
}

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  const params = await searchParams
  const supabase = await createClient()

  let query = supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })

  if (params.status) query = query.eq('status', params.status)

  const { data: orders } = await query

  return (
    <div className="p-6 lg:p-8">
      <h1 className="font-display text-3xl text-white tracking-wider mb-6">ORDERS</h1>

      <div className="flex flex-wrap gap-2 mb-6">
        {['', 'pending_verification', 'payment_verified', 'packed', 'shipped', 'delivered', 'cancelled'].map((status) => (
          <Link
            key={status}
            href={status ? `/admin/orders?status=${status}` : '/admin/orders'}
            className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
              params.status === status || (!params.status && !status)
                ? 'bg-brand-purple border-brand-purple text-white'
                : 'border-brand-border text-gray-400 hover:border-brand-purple/50'
            }`}
          >
            {status ? status.replace(/_/g, ' ') : 'All'}
          </Link>
        ))}
      </div>

      <div className="bg-brand-card border border-brand-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-brand-border">
                <th className="text-left px-5 py-3.5 text-gray-400 font-medium">Order</th>
                <th className="text-left px-5 py-3.5 text-gray-400 font-medium">Customer</th>
                <th className="text-left px-5 py-3.5 text-gray-400 font-medium">Total</th>
                <th className="text-left px-5 py-3.5 text-gray-400 font-medium">Status</th>
                <th className="text-left px-5 py-3.5 text-gray-400 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders?.map((order) => (
                <tr key={order.id} className="border-b border-brand-border/50 hover:bg-brand-dark/50 transition-colors">
                  <td className="px-5 py-4">
                    <Link href={`/admin/orders/${order.id}`} className="text-brand-purple-light font-mono hover:text-white transition-colors">
                      {order.order_number}
                    </Link>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-white">{order.customer_name}</p>
                    <p className="text-gray-500 text-xs">{order.customer_phone}</p>
                  </td>
                  <td className="px-5 py-4 text-white font-medium">{formatPrice(order.total)}</td>
                  <td className="px-5 py-4">
                    <span className={`text-xs px-2.5 py-1 rounded-full border ${STATUS_COLORS[order.status] ?? 'bg-gray-500/20 text-gray-400 border-gray-500/30'}`}>
                      {order.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-gray-400">
                    {new Date(order.created_at).toLocaleDateString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {(!orders || orders.length === 0) && (
            <div className="text-center py-12 text-gray-500">No orders found</div>
          )}
        </div>
      </div>
    </div>
  )
}
