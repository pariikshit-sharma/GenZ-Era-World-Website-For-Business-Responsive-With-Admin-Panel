'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

const STATUSES = [
  'pending_verification',
  'payment_verified',
  'packed',
  'shipped',
  'delivered',
  'cancelled',
  'refunded',
]

export default function OrderStatusUpdater({
  orderId,
  currentStatus,
}: {
  orderId: string
  currentStatus: string
}) {
  const [status, setStatus] = useState(currentStatus)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleUpdate = async () => {
    if (status === currentStatus) return
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase
      .from('orders')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', orderId)

    if (error) {
      toast.error('Failed to update status')
    } else {
      toast.success('Order status updated')
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <div className="flex items-center gap-3">
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="bg-brand-dark border border-brand-border text-white rounded-lg px-3 py-2.5 text-sm outline-none focus:border-brand-purple transition-colors"
      >
        {STATUSES.map((s) => (
          <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
        ))}
      </select>
      <button
        onClick={handleUpdate}
        disabled={loading || status === currentStatus}
        className="btn-primary px-4 py-2.5 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Updating...' : 'Update'}
      </button>
    </div>
  )
}
