'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import Image from 'next/image'
import { Upload } from 'lucide-react'
import toast from 'react-hot-toast'

export default function SettingsForm({ settings }: { settings: any }) {
  const [threshold, setThreshold] = useState(settings?.low_stock_threshold?.toString() ?? '5')
  const [upiId, setUpiId] = useState(settings?.upi_id ?? '')
  const [qrPreview, setQrPreview] = useState(settings?.upi_qr_image_url ?? '')
  const [qrFile, setQrFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleSave = async () => {
    setLoading(true)
    const supabase = createClient()
    let qrUrl = settings?.upi_qr_image_url

    if (qrFile) {
      const ext = qrFile.name.split('.').pop()
      const { data, error } = await supabase.storage
        .from('site-assets')
        .upload(`upi-qr.${ext}`, qrFile, { upsert: true })
      if (!error) {
        const { data: { publicUrl } } = supabase.storage.from('site-assets').getPublicUrl(`upi-qr.${ext}`)
        qrUrl = publicUrl
      }
    }

    const { error } = await supabase.from('site_settings').upsert({
      id: settings?.id ?? 1,
      low_stock_threshold: parseInt(threshold) || 5,
      upi_id: upiId,
      upi_qr_image_url: qrUrl,
      updated_at: new Date().toISOString(),
    })

    if (error) toast.error('Failed to save settings')
    else toast.success('Settings saved!')
    setLoading(false)
  }

  return (
    <div className="max-w-xl space-y-6">
      <div className="bg-brand-card border border-brand-border rounded-2xl p-6 space-y-4">
        <h2 className="font-bold text-white">Inventory Settings</h2>
        <div>
          <label className="text-xs text-gray-400 mb-1.5 block">Low Stock Threshold</label>
          <input
            type="number"
            value={threshold}
            onChange={(e) => setThreshold(e.target.value)}
            min="1"
            className="w-full bg-brand-dark border border-brand-border focus:border-brand-purple text-white rounded-lg px-4 py-3 text-sm outline-none transition-colors"
          />
          <p className="text-xs text-gray-500 mt-1">Products with stock at or below this quantity show "Low Stock"</p>
        </div>
      </div>

      <div className="bg-brand-card border border-brand-border rounded-2xl p-6 space-y-4">
        <h2 className="font-bold text-white">UPI Payment Settings</h2>
        <div>
          <label className="text-xs text-gray-400 mb-1.5 block">UPI ID</label>
          <input
            type="text"
            value={upiId}
            onChange={(e) => setUpiId(e.target.value)}
            className="w-full bg-brand-dark border border-brand-border focus:border-brand-purple text-white rounded-lg px-4 py-3 text-sm outline-none transition-colors"
            placeholder="yourname@upi"
          />
        </div>

        <div>
          <label className="text-xs text-gray-400 mb-2 block">UPI QR Code</label>
          {qrPreview && (
            <Image
              src={qrPreview}
              alt="UPI QR"
              width={150}
              height={150}
              className="rounded-xl border border-brand-border mb-3 object-contain"
            />
          )}
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="flex items-center gap-2 btn-outline text-sm px-4 py-2.5"
          >
            <Upload size={14} />
            {qrPreview ? 'Replace QR Code' : 'Upload QR Code'}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (!file) return
              setQrFile(file)
              setQrPreview(URL.createObjectURL(file))
            }}
          />
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={loading}
        className="btn-primary px-8 py-3"
      >
        {loading ? 'Saving...' : 'Save Settings'}
      </button>
    </div>
  )
}
