'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function DeleteProductButton({ productId, productName }: { productId: string; productName: string }) {
  const [confirming, setConfirming] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    const supabase = createClient()
    const { error } = await supabase.from('products').delete().eq('id', productId)
    if (error) {
      toast.error('Failed to delete product')
    } else {
      toast.success(`${productName} deleted`)
      router.refresh()
    }
    setConfirming(false)
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-1">
        <button onClick={handleDelete} className="text-xs text-red-400 hover:text-red-300 px-2 py-1 rounded bg-red-500/20">
          Confirm
        </button>
        <button onClick={() => setConfirming(false)} className="text-xs text-gray-400 hover:text-white px-2 py-1">
          Cancel
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="text-gray-400 hover:text-red-400 transition-colors p-1.5 rounded-lg hover:bg-red-500/10"
    >
      <Trash2 size={15} />
    </button>
  )
}
