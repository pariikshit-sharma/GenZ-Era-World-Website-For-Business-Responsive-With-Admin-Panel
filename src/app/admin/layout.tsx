import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AdminSidebar from '@/components/admin/AdminSidebar'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Allow login page to render without forcing auth
  if (!user) {
    return <>{children}</>
  }

  const { data: admin } = await supabase
    .from('admin_users')
    .select('*')
    .eq('id', user.id)
    .eq('is_active', true)
    .single()

  if (!admin) {
    return <>{children}</>
  }

  return (
    <div className="flex h-screen bg-brand-black overflow-hidden">
      <AdminSidebar admin={admin} />
      <main className="flex-1 overflow-y-auto bg-brand-darkest">
        {children}
      </main>
    </div>
  )
}