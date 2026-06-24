'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { slugify, generateSKU, getStockStatus } from '@/lib/utils'
import { Upload, X, Image as ImageIcon, Plus } from 'lucide-react'
import Image from 'next/image'
import { useDropzone } from 'react-dropzone'
import toast from 'react-hot-toast'
import { Category, Product } from '@/types'

interface ProductFormProps {
  categories: Category[]
  product?: Product & { images?: any[] }
}

export default function ProductForm({ categories, product }: ProductFormProps) {
  const router = useRouter()
  const isEdit = !!product

  const [form, setForm] = useState({
    name: product?.name ?? '',
    description: product?.description ?? '',
    category_id: product?.category_id ?? '',
    price: product?.price?.toString() ?? '',
    sale_price: product?.sale_price?.toString() ?? '',
    stock_quantity: product?.stock_quantity?.toString() ?? '0',
    sku: product?.sku ?? '',
    is_featured: product?.is_featured ?? false,
    is_trending: product?.is_trending ?? false,
    is_new_arrival: product?.is_new_arrival ?? false,
    has_variants: product?.has_variants ?? false,
variants: product?.variants?.join(',') ?? '',
  })

  const [newImages, setNewImages] = useState<File[]>([])
  const [existingImages, setExistingImages] = useState<any[]>(product?.images ?? [])
  const [loading, setLoading] = useState(false)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setNewImages((prev) => [...prev, ...acceptedFiles].slice(0, 10))
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: true,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.price || !form.category_id) {
      toast.error('Please fill in all required fields')
      return
    }
    setLoading(true)

    try {
      const supabase = createClient()
      const slug = slugify(form.name)
      const stockQty = parseInt(form.stock_quantity) || 0
      const stockStatus = getStockStatus(stockQty)

      const productData = {
        name: form.name,
        slug,
        description: form.description,
        category_id: form.category_id,
        price: parseFloat(form.price),
        sale_price: form.sale_price ? parseFloat(form.sale_price) : null,
        stock_quantity: stockQty,
        stock_status: stockStatus,
        sku: form.sku || generateSKU(categories.find(c => c.id === form.category_id)?.name ?? 'GEN'),
        is_featured: form.is_featured,
        is_trending: form.is_trending,
        is_new_arrival: form.is_new_arrival,
        has_variants: form.has_variants,

variants: form.has_variants
  ? form.variants
      .split(',')
      .map(v => v.trim())
      .filter(Boolean)
  : [],
        updated_at: new Date().toISOString(),
      }

      let productId = product?.id

      if (isEdit) {
        const { error } = await supabase.from('products').update(productData).eq('id', product!.id)
        if (error) throw error
      } else {
        const { data, error } = await supabase.from('products').insert(productData).select().single()
        if (error) throw error
        productId = data.id
      }

      // Upload new images
      if (newImages.length > 0 && productId) {
        const sortStart = existingImages.length
        for (let i = 0; i < newImages.length; i++) {
          const file = newImages[i]
          const ext = file.name.split('.').pop()
          const fileName = `${productId}/${Date.now()}-${i}.${ext}`

          const { error: uploadError } = await supabase.storage
            .from('product-images')
            .upload(fileName, file, { upsert: true })

          if (uploadError) continue

          const { data: { publicUrl } } = supabase.storage
            .from('product-images')
            .getPublicUrl(fileName)

          const isFeatured = sortStart + i === 0 && existingImages.length === 0

          await supabase.from('product_images').insert({
            product_id: productId,
            url: publicUrl,
            is_featured: isFeatured,
            sort_order: sortStart + i,
          })

          if (isFeatured) {
            await supabase.from('products').update({ featured_image: publicUrl }).eq('id', productId)
          }
        }
      }

      toast.success(isEdit ? 'Product updated!' : 'Product created!')
      router.push('/admin/products')
    } catch (err: any) {
      toast.error(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const removeExistingImage = async (imageId: string) => {
    const supabase = createClient()
    await supabase.from('product_images').delete().eq('id', imageId)
    setExistingImages((prev) => prev.filter((img) => img.id !== imageId))
    toast.success('Image removed')
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
      {/* Basic Info */}
      <div className="bg-brand-card border border-brand-border rounded-2xl p-6 space-y-4">
        <h2 className="font-bold text-white mb-2">Basic Information</h2>

        <div>
          <label className="text-xs text-gray-400 mb-1.5 block">Product Name *</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            className="w-full bg-brand-dark border border-brand-border focus:border-brand-purple text-white rounded-lg px-4 py-3 text-sm outline-none transition-colors"
            placeholder="e.g. Tanjiro Kamado Action Figure"
          />
        </div>

        <div>
          <label className="text-xs text-gray-400 mb-1.5 block">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={4}
            className="w-full bg-brand-dark border border-brand-border focus:border-brand-purple text-white rounded-lg px-4 py-3 text-sm outline-none transition-colors resize-none"
            placeholder="Describe this product..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-gray-400 mb-1.5 block">Category *</label>
            <select
              value={form.category_id}
              onChange={(e) => setForm({ ...form, category_id: e.target.value })}
              required
              className="w-full bg-brand-dark border border-brand-border focus:border-brand-purple text-white rounded-lg px-4 py-3 text-sm outline-none transition-colors"
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-400 mb-1.5 block">SKU</label>
            <input
              type="text"
              value={form.sku}
              onChange={(e) => setForm({ ...form, sku: e.target.value })}
              className="w-full bg-brand-dark border border-brand-border focus:border-brand-purple text-white rounded-lg px-4 py-3 text-sm outline-none transition-colors font-mono"
              placeholder="Auto-generated if empty"
            />
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className="bg-brand-card border border-brand-border rounded-2xl p-6">
        <h2 className="font-bold text-white mb-4">Pricing & Inventory</h2>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="text-xs text-gray-400 mb-1.5 block">Price (₹) *</label>
            <input
              type="number"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              required
              min="0"
              step="0.01"
              className="w-full bg-brand-dark border border-brand-border focus:border-brand-purple text-white rounded-lg px-4 py-3 text-sm outline-none transition-colors"
              placeholder="999"
            />
          </div>
          <div>
            <label className="text-xs text-gray-400 mb-1.5 block">Sale Price (₹)</label>
            <input
              type="number"
              value={form.sale_price}
              onChange={(e) => setForm({ ...form, sale_price: e.target.value })}
              min="0"
              step="0.01"
              className="w-full bg-brand-dark border border-brand-border focus:border-brand-purple text-white rounded-lg px-4 py-3 text-sm outline-none transition-colors"
              placeholder="Optional"
            />
          </div>
          <div>
            <label className="text-xs text-gray-400 mb-1.5 block">Stock Qty *</label>
            <input
              type="number"
              value={form.stock_quantity}
              onChange={(e) => setForm({ ...form, stock_quantity: e.target.value })}
              min="0"
              required
              className="w-full bg-brand-dark border border-brand-border focus:border-brand-purple text-white rounded-lg px-4 py-3 text-sm outline-none transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Variants */}
<div className="bg-brand-card border border-brand-border rounded-2xl p-6">
  <h2 className="font-bold text-white mb-4">Variants</h2>

  <label className="flex items-center gap-3 cursor-pointer mb-4">
    <div
      onClick={() =>
        setForm({
          ...form,
          has_variants: !form.has_variants,
        })
      }
      className={`w-11 h-6 rounded-full transition-colors cursor-pointer relative ${
        form.has_variants
          ? 'bg-brand-purple'
          : 'bg-brand-dark border border-brand-border'
      }`}
    >
      <div
        className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
          form.has_variants ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </div>

    <span className="text-sm text-gray-300">
      Product Has Variants
    </span>
  </label>

  {form.has_variants && (
    <div>
      <label className="text-xs text-gray-400 mb-1.5 block">
        Variants
      </label>

      <input
        type="text"
        value={form.variants}
        onChange={(e) =>
          setForm({
            ...form,
            variants: e.target.value,
          })
        }
        className="w-full bg-brand-dark border border-brand-border focus:border-brand-purple text-white rounded-lg px-4 py-3 text-sm outline-none transition-colors"
        placeholder="S,M,L,XL or 7,8,9,10 or Standard,Deluxe"
      />

      <p className="text-xs text-gray-500 mt-2">
        Separate options with commas
      </p>

      <div className="flex flex-wrap gap-2 mt-3">
        {form.variants
          .split(',')
          .map(v => v.trim())
          .filter(Boolean)
          .map((variant, index) => (
            <span
              key={index}
              className="px-3 py-1 rounded-full bg-brand-purple/20 border border-brand-purple/40 text-brand-purple-light text-xs"
            >
              {variant}
            </span>
          ))}
      </div>
    </div>
  )}
</div>

      {/* Toggles */}
      <div className="bg-brand-card border border-brand-border rounded-2xl p-6">
        <h2 className="font-bold text-white mb-4">Product Labels</h2>
        <div className="flex flex-wrap gap-4">
          {[
            { key: 'is_featured', label: 'Featured' },
            { key: 'is_trending', label: 'Trending' },
            { key: 'is_new_arrival', label: 'New Arrival' },
          ].map(({ key, label }) => (
            <label key={key} className="flex items-center gap-3 cursor-pointer">
              <div
                onClick={() => setForm({ ...form, [key]: !form[key as keyof typeof form] })}
                className={`w-11 h-6 rounded-full transition-colors cursor-pointer relative ${
                  form[key as keyof typeof form] ? 'bg-brand-purple' : 'bg-brand-dark border border-brand-border'
                }`}
              >
                <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                  form[key as keyof typeof form] ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </div>
              <span className="text-sm text-gray-300">{label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Images */}
      <div className="bg-brand-card border border-brand-border rounded-2xl p-6">
        <h2 className="font-bold text-white mb-4">Product Images</h2>

        {existingImages.length > 0 && (
          <div className="flex flex-wrap gap-3 mb-4">
            {existingImages.map((img) => (
              <div key={img.id} className="relative">
                <Image
                  src={img.url}
                  alt=""
                  width={80}
                  height={80}
                  className="rounded-lg border border-brand-border object-cover w-20 h-20"
                />
                <button
                  type="button"
                  onClick={() => removeExistingImage(img.id)}
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 flex items-center justify-center hover:bg-red-600 transition-colors"
                >
                  <X size={10} className="text-white" />
                </button>
                {img.is_featured && (
                  <span className="absolute bottom-0 left-0 right-0 text-center text-xs bg-brand-purple/80 text-white rounded-b-lg">
                    Main
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
            isDragActive ? 'border-brand-purple bg-brand-purple/10' : 'border-brand-border hover:border-brand-purple/50'
          }`}
        >
          <input {...getInputProps()} />
          <Upload size={28} className="text-brand-purple/50 mx-auto mb-2" />
          <p className="text-gray-400 text-sm">Drag & drop images, or click to select</p>
          <p className="text-gray-600 text-xs mt-1">Up to 10 images · JPG, PNG, WEBP</p>
        </div>

        {newImages.length > 0 && (
          <div className="flex flex-wrap gap-3 mt-4">
            {newImages.map((file, i) => (
              <div key={i} className="relative">
                <Image
                  src={URL.createObjectURL(file)}
                  alt=""
                  width={80}
                  height={80}
                  className="rounded-lg border border-brand-purple/40 object-cover w-20 h-20"
                />
                <button
                  type="button"
                  onClick={() => setNewImages((prev) => prev.filter((_, j) => j !== i))}
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 flex items-center justify-center hover:bg-red-600 transition-colors"
                >
                  <X size={10} className="text-white" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="btn-outline px-6 py-3"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="btn-primary px-8 py-3 flex items-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Plus size={16} />
          )}
          {isEdit ? 'Save Changes' : 'Create Product'}
        </button>
      </div>
    </form>
  )
}
