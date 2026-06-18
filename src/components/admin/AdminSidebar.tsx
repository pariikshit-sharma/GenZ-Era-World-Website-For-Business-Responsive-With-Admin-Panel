'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard, Package, ShoppingBag, Tag, Users,
  Settings, LogOut, Activity, ChevronRight
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { AdminUser } from '@/types'

const NAV = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/categories', label: 'Categories', icon: Tag },
  { href: '/admin/admins', label: 'Admins', icon: Users, superOnly: true },
  { href: '/admin/activity', label: 'Activity Log', icon: Activity, superOnly: true },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
]

export default function AdminSidebar({ admin }: { admin: AdminUser }) {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  return (
    <aside className="w-60 bg-brand-black border-r border-brand-border flex flex-col flex-shrink-0">
      <div className="p-5 border-b border-brand-border">
        <span className="font-display text-xl text-white tracking-wider">GENZERA</span>
        <span className="font-display text-xs text-brand-purple-light tracking-[0.3em] block">ADMIN</span>
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {NAV.filter(item => !item.superOnly || admin.role === 'super_admin').map((item) => {
          const Icon = item.icon
          const active = item.exact ? pathname === item.href : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all group ${
                active
                  ? 'bg-brand-purple/20 text-brand-purple-light border border-brand-purple/30'
                  : 'text-gray-400 hover:text-white hover:bg-brand-dark'
              }`}
            >
              <Icon size={16} />
              {item.label}
              {active && <ChevronRight size={14} className="ml-auto" />}
            </Link>
          )
        })}
      </nav>

      <div className="p-3 border-t border-brand-border">
        <div className="px-3 py-2 mb-2">
          <p className="text-white text-sm font-medium truncate">{admin.name}</p>
          <p className="text-gray-500 text-xs capitalize">{admin.role.replace('_', ' ')}</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-2.5 text-sm text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all w-full"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </aside>
  )
}
