'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { AdminUser } from '@/types'
import { UserPlus, Shield, ShieldOff } from 'lucide-react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function AdminManager({ admins, currentUserId }: { admins: AdminUser[]; currentUserId: string }) {
  const [list, setList] = useState(admins)
  const [newEmail, setNewEmail] = useState('')
  const [newName, setNewName] = useState('')
  const [newPass, setNewPass] = useState('')
  const [newRole, setNewRole] = useState<'admin' | 'super_admin'>('admin')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleCreate = async () => {
    if (!newEmail || !newName || !newPass) { toast.error('Fill all fields'); return }
    setLoading(true)

    const res = await fetch('/api/admin/create-admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: newEmail, name: newName, password: newPass, role: newRole }),
    })
    const data = await res.json()
    if (!res.ok) { toast.error(data.error || 'Failed'); setLoading(false); return }

    toast.success('Admin created!')
    setNewEmail(''); setNewName(''); setNewPass('')
    router.refresh()
    setLoading(false)
  }

  const toggleActive = async (admin: AdminUser) => {
    if (admin.id === currentUserId) { toast.error("You can't disable yourself"); return }
    const supabase = createClient()
    await supabase.from('admin_users').update({ is_active: !admin.is_active }).eq('id', admin.id)
    setList((prev) => prev.map((a) => a.id === admin.id ? { ...a, is_active: !a.is_active } : a))
    toast.success(admin.is_active ? 'Admin disabled' : 'Admin enabled')
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="bg-brand-card border border-brand-border rounded-2xl p-6">
        <h2 className="font-bold text-white mb-4 flex items-center gap-2"><UserPlus size={18} /> Add Admin</h2>
        <div className="space-y-3">
          <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)}
            placeholder="Full name" className="w-full bg-brand-dark border border-brand-border focus:border-brand-purple text-white rounded-lg px-4 py-2.5 text-sm outline-none" />
          <input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)}
            placeholder="Email" className="w-full bg-brand-dark border border-brand-border focus:border-brand-purple text-white rounded-lg px-4 py-2.5 text-sm outline-none" />
          <input type="password" value={newPass} onChange={(e) => setNewPass(e.target.value)}
            placeholder="Temporary password" className="w-full bg-brand-dark border border-brand-border focus:border-brand-purple text-white rounded-lg px-4 py-2.5 text-sm outline-none" />
          <select value={newRole} onChange={(e) => setNewRole(e.target.value as any)}
            className="w-full bg-brand-dark border border-brand-border text-white rounded-lg px-4 py-2.5 text-sm outline-none">
            <option value="admin">Admin</option>
            <option value="super_admin">Super Admin</option>
          </select>
          <button onClick={handleCreate} disabled={loading} className="btn-primary px-6 py-2.5 text-sm">
            {loading ? 'Creating...' : 'Create Admin'}
          </button>
        </div>
      </div>

      <div className="bg-brand-card border border-brand-border rounded-2xl overflow-hidden">
        <div className="divide-y divide-brand-border">
          {list.map((admin) => (
            <div key={admin.id} className="px-6 py-4 flex items-center justify-between">
              <div>
                <p className="text-white font-medium">{admin.name}</p>
                <p className="text-gray-400 text-sm">{admin.email}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${
                    admin.role === 'super_admin' ? 'bg-brand-purple/20 text-brand-purple-light border-brand-purple/30' : 'bg-gray-700/40 text-gray-400 border-gray-600/30'
                  }`}>{admin.role.replace('_', ' ')}</span>
                  {!admin.is_active && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30">Disabled</span>
                  )}
                  {admin.id === currentUserId && (
                    <span className="text-xs text-brand-purple-light">(you)</span>
                  )}
                </div>
              </div>
              {admin.id !== currentUserId && (
                <button
                  onClick={() => toggleActive(admin)}
                  className={`p-2 rounded-lg transition-colors ${
                    admin.is_active ? 'text-gray-400 hover:text-red-400 hover:bg-red-500/10' : 'text-gray-400 hover:text-green-400 hover:bg-green-500/10'
                  }`}
                  title={admin.is_active ? 'Disable admin' : 'Enable admin'}
                >
                  {admin.is_active ? <ShieldOff size={16} /> : <Shield size={16} />}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
