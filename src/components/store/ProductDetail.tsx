'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart, Zap, Instagram, MessageCircle, Package, Shield, Truck } from 'lucide-react'
import { Product } from '@/types'
import { formatPrice, getWhatsAppUrl, getInstagramUrl } from '@/lib/utils'
import { useCartStore } from '@/hooks/useCart'
import toast from 'react-hot-toast'

interface ProductDetailProps {
  product: Product
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [selectedVariant, setSelectedVariant] = useState('')
  const { addItem, openCart } = useCartStore()

  const images = product.images?.length
    ? product.images.sort((a, b) => a.sort_order - b.sort_order)
    : []

  const displayImages =
    images.length > 0
      ? images.map((img) => img.url)
      : product.featured_image
      ? [product.featured_image]
      : ['/images/placeholder.jpg']

  const price = product.sale_price ?? product.price
  const discount = product.sale_price
    ? Math.round(((product.price - product.sale_price) / product.price) * 100)
    : null

 const handleAddToCart = () => {
  if (product.stock_status === 'out_of_stock') return

  if (product.has_variants && !selectedVariant) {
    toast.error('Please select an option')
    return
  }

  addItem(product, quantity, selectedVariant)

  toast.success(
    selectedVariant
      ? `${product.name} (${selectedVariant}) added to cart!`
      : `${product.name} added to cart!`
  )

  openCart()
}
 const handleBuyNow = () => {
  if (product.stock_status === 'out_of_stock') return

  if (product.has_variants && !selectedVariant) {
    toast.error('Please select an option')
    return
  }

  addItem(product, quantity, selectedVariant)

  window.location.href = '/checkout'
}
  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-white transition-colors">Shop</Link>
          {product.category && (
            <>
              <span>/</span>
              <Link href={`/category/${product.category.slug}`} className="hover:text-white transition-colors">
                {product.category.name}
              </Link>
            </>
          )}
          <span>/</span>
          <span className="text-gray-300 truncate max-w-[200px]">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images */}
          <div className="space-y-4">
            <div className="aspect-square rounded-2xl overflow-hidden bg-brand-dark border border-brand-border relative">
              <Image
                src={displayImages[selectedImage]}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
              {discount && (
                <div className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                  -{discount}%
                </div>
              )}
            </div>

            {displayImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {displayImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === idx
                        ? 'border-brand-purple shadow-purple-sm'
                        : 'border-brand-border hover:border-brand-purple/50'
                    }`}
                  >
                    <Image src={img} alt="" width={64} height={64} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            {product.category && (
              <Link
                href={`/category/${product.category.slug}`}
                className="text-brand-purple-light text-sm tracking-wider uppercase hover:text-white transition-colors"
              >
                {product.category.name}
              </Link>
            )}

            <h1 className="font-display text-3xl sm:text-4xl text-white tracking-wide mt-2 mb-4">
              {product.name}
            </h1>

            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl font-bold text-white">{formatPrice(price)}</span>
              {product.sale_price && (
                <span className="text-xl text-gray-500 line-through">{formatPrice(product.price)}</span>
              )}
              {discount && (
                <span className="bg-red-500/20 text-red-400 border border-red-500/30 text-sm px-2 py-0.5 rounded-full">
                  Save {discount}%
                </span>
              )}
            </div>

            {/* Stock */}
            <div className="mb-6">
              {product.stock_status === 'in_stock' && (
                <span className="badge-in-stock">✓ In Stock</span>
              )}
              {product.stock_status === 'low_stock' && (
                <span className="badge-low-stock">⚡ Low Stock — Order Soon</span>
              )}
              {product.stock_status === 'out_of_stock' && (
                <span className="badge-out-of-stock">✗ Out of Stock</span>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <p className="text-gray-300 text-sm leading-relaxed mb-6 border-t border-brand-border pt-6">
                {product.description}
              </p>
            )}

            {product.has_variants && product.variants?.length > 0 && (
  <div className="mb-6">
    <h3 className="text-sm text-gray-400 mb-3">
      Select Option
    </h3>

    <div className="flex flex-wrap gap-2">
      {product.variants.map((variant) => (
        <button
          key={variant}
          type="button"
          onClick={() => setSelectedVariant(variant)}
          className={`px-4 py-2 rounded-lg border transition-all ${
            selectedVariant === variant
              ? 'bg-brand-purple border-brand-purple text-white'
              : 'bg-brand-dark border-brand-border text-gray-300 hover:border-brand-purple'
          }`}
        >
          {variant}
        </button>
      ))}
    </div>
  </div>
)}

            {/* Quantity */}
            {product.stock_status !== 'out_of_stock' && (
              <div className="flex items-center gap-4 mb-6">
                <span className="text-gray-400 text-sm">Quantity:</span>
                <div className="flex items-center gap-2 bg-brand-dark border border-brand-border rounded-lg px-3 py-2">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="text-gray-400 hover:text-white transition-colors w-6 text-center"
                  >
                    −
                  </button>
                  <span className="text-white font-medium w-8 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                    className="text-gray-400 hover:text-white transition-colors w-6 text-center"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-3 mb-8">
              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock_status === 'out_of_stock'}
                  className="flex-1 flex items-center justify-center gap-2 btn-outline py-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShoppingCart size={18} />
                  Add to Cart
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={product.stock_status === 'out_of_stock'}
                  className="flex-1 flex items-center justify-center gap-2 btn-primary py-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Zap size={18} />
                  Buy Now
                </button>
              </div>

              <div className="flex gap-3">
                <Link
                  href={getWhatsAppUrl(product.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 bg-green-600/20 border border-green-600/40 hover:bg-green-600/30 text-green-400 hover:text-green-300 font-semibold py-3 px-4 rounded-lg transition-all text-sm"
                >
                  <MessageCircle size={16} />
                  Order on WhatsApp
                </Link>
                <Link
                  href={getInstagramUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 bg-pink-600/20 border border-pink-600/40 hover:bg-pink-600/30 text-pink-400 hover:text-pink-300 font-semibold py-3 px-4 rounded-lg transition-all text-sm"
                >
                  <Instagram size={16} />
                  Ask on Instagram
                </Link>
              </div>
            </div>

            {/* Delivery Info */}
            <div className="bg-brand-card rounded-xl border border-brand-border p-4 space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Truck size={16} className="text-brand-purple flex-shrink-0" />
                <span className="text-gray-300">Free delivery on orders above ₹500. ₹80 below that.</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Package size={16} className="text-brand-purple flex-shrink-0" />
                <span className="text-gray-300">Safely packed to prevent damage during transit.</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Shield size={16} className="text-brand-purple flex-shrink-0" />
                <span className="text-gray-300">Secure UPI payment with manual verification.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
