'use client'

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { CartItem, Product } from '@/types'
import { calculateDelivery } from '@/lib/utils'

interface CartState {
  items: CartItem[]
  isOpen: boolean

  // Actions
  addItem: (
  product: Product,
  quantity?: number,
  selectedVariant?: string
) => void
 removeItem: (cartKey: string) => void
updateQuantity: (cartKey: string, quantity: number) => void
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

     addItem: (product, quantity = 1, selectedVariant = '') => {
  set((state) => {
    const cartKey = `${product.id}-${selectedVariant}`

    const existing = state.items.find(
      (i) => i.cart_key === cartKey
    )

    if (existing) {
      return {
        items: state.items.map((i) =>
          i.cart_key === cartKey
            ? {
                ...i,
                quantity: Math.min(
                  i.quantity + quantity,
                  product.stock_quantity
                ),
              }
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

          selected_variant: selectedVariant,
          cart_key: cartKey,
        },
      ],
    }
  })
},

      removeItem: (cartKey) => {
  set((state) => ({
    items: state.items.filter(
      (i) => i.cart_key !== cartKey
    ),
  }))
},
      updateQuantity: (cartKey, quantity) => {
  if (quantity <= 0) {
    get().removeItem(cartKey)
    return
  }

  set((state) => ({
    items: state.items.map((i) =>
      i.cart_key === cartKey
        ? { ...i, quantity }
        : i
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
