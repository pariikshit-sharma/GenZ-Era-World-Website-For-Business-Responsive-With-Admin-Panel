'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart, Zap } from 'lucide-react'
import { Product } from '@/types'
import { formatPrice } from '@/lib/utils'
import { useCartStore } from '@/hooks/useCart'
import toast from 'react-hot-toast'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCartStore()

  const price = product.sale_price ?? product.price
  const discount = product.sale_price
    ? Math.round(((product.price - product.sale_price) / product.price) * 100)
    : null

  const imageUrl = product.featured_image ||
    product.images?.[0]?.url || '/images/placeholder.jpg'

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    if (product.stock_status === 'out_of_stock') return
    addItem(product)
    toast.success(`${product.name} added to cart!`, {
      icon: '🛒',
    })
  }

  return (
    <Link href={`/product/${product.slug}`} className="group block product-card">
      <div className="bg-brand-card rounded-2xl overflow-hidden border border-brand-border hover:border-brand-purple/50 transition-all duration-300">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-brand-dark">
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1">
            {product.is_new_arrival && (
              <span className="bg-brand-purple text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-purple-sm">
                NEW
              </span>
            )}
            {product.is_trending && (
              <span className="bg-yellow-500/90 text-black text-xs font-bold px-2 py-0.5 rounded-full">
                TRENDING
              </span>
            )}
            {discount && (
              <span className="bg-red-500/90 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                -{discount}%
              </span>
            )}
          </div>

          {/* Stock badge */}
          <div className="absolute top-3 right-3">
            {product.stock_status === 'out_of_stock' && (
              <span className="badge-out-of-stock">Sold Out</span>
            )}
            {product.stock_status === 'low_stock' && (
              <span className="badge-low-stock">Low Stock</span>
            )}
          </div>

          {/* Quick Add button */}
          <div className="absolute bottom-3 left-0 right-0 flex justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
            <button
              onClick={handleAddToCart}
              disabled={product.stock_status === 'out_of_stock'}
              className="flex items-center gap-2 bg-brand-purple hover:bg-brand-purple-bright text-white text-sm font-bold px-4 py-2 rounded-full transition-all duration-200 shadow-purple-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingCart size={14} />
              {product.stock_status === 'out_of_stock' ? 'Sold Out' : 'Quick Add'}
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          <p className="text-xs text-brand-purple-light mb-1 tracking-wider uppercase">
            {product.category?.name}
          </p>
          <h3 className="text-white font-semibold text-sm line-clamp-2 group-hover:text-brand-purple-light transition-colors duration-200 leading-tight mb-2">
            {product.name}
          </h3>

          <div className="flex items-center justify-between mt-auto">
            <div className="flex items-center gap-2">
              <span className="text-white font-bold">{formatPrice(price)}</span>
              {product.sale_price && (
                <span className="text-gray-500 text-xs line-through">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>

            {product.stock_status !== 'out_of_stock' && (
              <button
                onClick={handleAddToCart}
                className="w-8 h-8 rounded-lg bg-brand-purple/20 border border-brand-purple/40 flex items-center justify-center hover:bg-brand-purple hover:border-brand-purple transition-all duration-200"
              >
                <Zap size={14} className="text-brand-purple-light" />
              </button>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
