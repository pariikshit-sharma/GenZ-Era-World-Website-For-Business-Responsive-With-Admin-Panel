'use client'

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { CartItem, Product } from '@/types'
import { calculateDelivery } from '@/lib/utils'

interface CartState {
  items: CartItem[]
  isOpen: boolean

  // Actions
  addItem: (product: Product, quantity?: number) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void

  // Computed
  getSubtotal: () => number
  getDeliveryCharge: () => number
  getTotal: () => number
  getItemCount: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (product, quantity = 1) => {
        set((state) => {
          const existing = state.items.find((i) => i.product_id === product.id)
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.product_id === product.id
                  ? { ...i, quantity: Math.min(i.quantity + quantity, product.stock_quantity) }
                  : i
              ),
            }
          }
          return {
            items: [
              ...state.items,
              {
                product_id: product.id,
                product,
                quantity: Math.min(quantity, product.stock_quantity),
              },
            ],
          }
        })
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((i) => i.product_id !== productId),
        }))
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId)
          return
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.product_id === productId ? { ...i, quantity } : i
          ),
        }))
      },

      clearCart: () => set({ items: [] }),

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      getSubtotal: () => {
        const { items } = get()
        return items.reduce((sum, item) => {
          const price = item.product.sale_price ?? item.product.price
          return sum + price * item.quantity
        }, 0)
      },

      getDeliveryCharge: () => {
        const subtotal = get().getSubtotal()
        return calculateDelivery(subtotal)
      },

      getTotal: () => {
        const { getSubtotal, getDeliveryCharge } = get()
        return getSubtotal() + getDeliveryCharge()
      },

      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0)
      },
    }),
    {
      name: 'genzera-cart',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
)
