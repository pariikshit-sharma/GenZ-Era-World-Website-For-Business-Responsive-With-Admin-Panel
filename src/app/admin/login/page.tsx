'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Zap } from 'lucide-react'
import toast from 'react-hot-toast'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const supabase = createClient()

    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      toast.error('Invalid credentials')
      setLoading(false)
      return
    }

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { toast.error('Login failed'); setLoading(false); return }

    const { data: admin, error: adminError } = await supabase
  .from('admin_users')
  .select('*')
  .eq('id', user.id)
  .single()

console.log('ADMIN DATA:', admin)
console.log('ADMIN ERROR:', adminError)

   if (adminError || !admin?.is_active) {
      await supabase.auth.signOut()
      toast.error('Account disabled. Contact super admin.')
      setLoading(false)
      return
    }

    await supabase.from('admin_users').update({ last_login: new Date().toISOString() }).eq('id', user.id)
    router.push('/admin')
  }

  return (
    <div className="min-h-screen bg-brand-black flex items-center justify-center px-4 lightning-bg">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <span className="font-display text-4xl text-white tracking-wider glow-text-sm">GENZERA</span>
          <span className="font-display text-sm text-brand-purple-light tracking-[0.4em] block">ADMIN</span>
        </div>

        <div className="bg-brand-card border border-brand-border rounded-2xl p-8">
          <h1 className="text-xl font-bold text-white mb-6">Admin Login</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs text-gray-400 mb-1.5 block">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-brand-dark border border-brand-border focus:border-brand-purple text-white rounded-lg px-4 py-3 text-sm outline-none transition-colors"
                placeholder="admin@example.com"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1.5 block">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-brand-dark border border-brand-border focus:border-brand-purple text-white rounded-lg px-4 py-3 pr-10 text-sm outline-none transition-colors"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3.5 flex items-center justify-center gap-2 mt-6"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <><Zap size={16} /> Sign In</>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
