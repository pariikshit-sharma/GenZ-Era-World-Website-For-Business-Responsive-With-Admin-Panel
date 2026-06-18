'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { X, ShoppingCart, Plus, Minus, Trash2, ArrowRight } from 'lucide-react'
import { useCartStore } from '@/hooks/useCart'
import { formatPrice } from '@/lib/utils'

export default function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    getSubtotal,
    getDeliveryCharge,
    getTotal,
  } = useCartStore()

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  const subtotal = getSubtotal()
  const deliveryCharge = getDeliveryCharge()
  const total = getTotal()

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 transition-opacity"
          onClick={closeCart}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 h-full w-full sm:w-96 bg-brand-darkest border-l border-brand-border z-50 flex flex-col transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-brand-border">
          <div className="flex items-center gap-2">
            <ShoppingCart size={20} className="text-brand-purple" />
            <h2 className="font-bold text-white text-lg">Your Cart</h2>
            {items.length > 0 && (
              <span className="bg-brand-purple text-white text-xs px-2 py-0.5 rounded-full">
                {items.length}
              </span>
            )}
          </div>
          <button
            onClick={closeCart}
            className="text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-brand-dark"
          >
            <X size={20} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto py-4 px-4 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-4 py-16">
              <div className="w-20 h-20 rounded-full bg-brand-dark flex items-center justify-center neon-border">
                <ShoppingCart size={32} className="text-brand-purple-light" />
              </div>
              <p className="text-gray-400">Your cart is empty</p>
              <button
                onClick={closeCart}
                className="text-brand-purple-light text-sm hover:text-white transition-colors"
              >
                Continue Shopping →
              </button>
            </div>
          ) : (
            items.map((item) => {
              const price = item.product.sale_price ?? item.product.price
              const imageUrl = item.product.featured_image ||
                item.product.images?.[0]?.url || '/images/placeholder.jpg'

              return (
                <div
                  key={item.product_id}
                  className="flex gap-3 bg-brand-dark rounded-xl p-3 border border-brand-border"
                >
                  <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-brand-darkest">
                    <Image
                      src={imageUrl}
                      alt={item.product.name}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{item.product.name}</p>
                    <p className="text-brand-purple-light font-bold text-sm mt-0.5">
                      {formatPrice(price)}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                        className="w-6 h-6 rounded bg-brand-border flex items-center justify-center hover:bg-brand-purple/30 transition-colors"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                        disabled={item.quantity >= item.product.stock_quantity}
                        className="w-6 h-6 rounded bg-brand-border flex items-center justify-center hover:bg-brand-purple/30 transition-colors disabled:opacity-40"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <button
                      onClick={() => removeItem(item.product_id)}
                      className="text-gray-500 hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                    <p className="text-sm font-bold text-white">
                      {formatPrice(price * item.quantity)}
                    </p>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-brand-border p-4 space-y-3">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-400">
                <span>Subtotal</span>
                <span className="text-white">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Delivery</span>
                <span className={deliveryCharge === 0 ? 'text-green-400' : 'text-white'}>
                  {deliveryCharge === 0 ? 'FREE' : formatPrice(deliveryCharge)}
                </span>
              </div>
              {deliveryCharge > 0 && (
                <p className="text-xs text-gray-500">
                  Add {formatPrice(500 - subtotal)} more for free delivery
                </p>
              )}
              <div className="flex justify-between font-bold text-base border-t border-brand-border pt-2">
                <span className="text-white">Total</span>
                <span className="text-brand-purple-light">{formatPrice(total)}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              onClick={closeCart}
              className="flex items-center justify-center gap-2 w-full btn-primary text-center"
            >
              Proceed to Checkout
              <ArrowRight size={16} />
            </Link>
          </div>
        )}
      </div>
    </>
  )
}
