import { createClient } from '@/lib/supabase/server'
import AdminManager from '@/components/admin/AdminManager'
import { redirect } from 'next/navigation'

export default async function AdminUsersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  const { data: currentAdmin } = await supabase
    .from('admin_users').select('role').eq('id', user.id).single()

  if (currentAdmin?.role !== 'super_admin') redirect('/admin')

  const { data: admins } = await supabase
    .from('admin_users').select('*').order('created_at', { ascending: false })

  return (
    <div className="p-6 lg:p-8">
      <h1 className="font-display text-3xl text-white tracking-wider mb-8">ADMINS</h1>
      <AdminManager admins={admins ?? []} currentUserId={user.id} />
    </div>
  )
}
