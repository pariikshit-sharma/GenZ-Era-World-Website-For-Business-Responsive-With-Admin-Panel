import { createClient } from '@/lib/supabase/server'
import { Package, ShoppingBag, AlertTriangle, TrendingUp } from 'lucide-react'
import Link from 'next/link'

export default async function AdminDashboard() {
  const supabase = await createClient()

  const [
    { count: totalOrders },
    { count: pendingOrders },
    { count: totalProducts },
    { count: lowStockProducts },
  ] = await Promise.all([
    supabase.from('orders').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'pending_verification'),
    supabase.from('products').select('*', { count: 'exact', head: true }),
    supabase.from('products').select('*', { count: 'exact', head: true }).eq('stock_status', 'low_stock'),
  ])

  const { data: recentOrders } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5)

  const stats = [
    { label: 'Total Orders', value: totalOrders ?? 0, icon: ShoppingBag, color: 'text-brand-purple-light', bg: 'bg-brand-purple/20', href: '/admin/orders' },
    { label: 'Pending Verification', value: pendingOrders ?? 0, icon: AlertTriangle, color: 'text-yellow-400', bg: 'bg-yellow-500/20', href: '/admin/orders?status=pending_verification' },
    { label: 'Total Products', value: totalProducts ?? 0, icon: Package, color: 'text-blue-400', bg: 'bg-blue-500/20', href: '/admin/products' },
    { label: 'Low Stock', value: lowStockProducts ?? 0, icon: TrendingUp, color: 'text-red-400', bg: 'bg-red-500/20', href: '/admin/products?filter=low_stock' },
  ]

  return (
    <div className="p-6 lg:p-8">
      <h1 className="font-display text-3xl text-white tracking-wider mb-8">DASHBOARD</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Link
              key={stat.label}
              href={stat.href}
              className="bg-brand-card border border-brand-border rounded-2xl p-5 hover:border-brand-purple/40 transition-all group"
            >
              <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}>
                <Icon size={18} className={stat.color} />
              </div>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-gray-400 text-sm mt-1">{stat.label}</p>
            </Link>
          )
        })}
      </div>

      <div className="bg-brand-card border border-brand-border rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-white">Recent Orders</h2>
          <Link href="/admin/orders" className="text-brand-purple-light text-sm hover:text-white transition-colors">
            View All →
          </Link>
        </div>

        {recentOrders && recentOrders.length > 0 ? (
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <Link
                key={order.id}
                href={`/admin/orders/${order.id}`}
                className="flex items-center justify-between p-4 bg-brand-dark rounded-xl hover:bg-brand-border/50 transition-colors"
              >
                <div>
                  <p className="text-white text-sm font-medium font-mono">{order.order_number}</p>
                  <p className="text-gray-400 text-xs">{order.customer_name} · {order.customer_phone}</p>
                </div>
                <div className="text-right">
                  <p className="text-brand-purple-light font-bold text-sm">₹{order.total}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    order.status === 'pending_verification' ? 'bg-yellow-500/20 text-yellow-400' :
                    order.status === 'delivered' ? 'bg-green-500/20 text-green-400' :
                    order.status === 'cancelled' ? 'bg-red-500/20 text-red-400' :
                    'bg-brand-purple/20 text-brand-purple-light'
                  }`}>
                    {order.status.replace(/_/g, ' ')}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm text-center py-8">No orders yet</p>
        )}
      </div>
    </div>
  )
}
