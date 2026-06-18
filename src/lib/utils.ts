import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { nanoid } from 'nanoid'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function generateOrderNumber(): string {
  const prefix = 'GEW'
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = nanoid(4).toUpperCase()
  return `${prefix}-${timestamp}-${random}`
}

export function generateSKU(categoryName: string): string {
  const prefix = categoryName.slice(0, 3).toUpperCase()
  const random = nanoid(6).toUpperCase()
  return `${prefix}-${random}`
}

export function calculateDelivery(subtotal: number): number {
  return subtotal >= 500 ? 0 : 80
}

export function getStockStatus(
  quantity: number,
  lowStockThreshold: number = 5
): 'in_stock' | 'low_stock' | 'out_of_stock' {
  if (quantity === 0) return 'out_of_stock'
  if (quantity <= lowStockThreshold) return 'low_stock'
  return 'in_stock'
}

export function getWhatsAppUrl(productName?: string): string {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '8569950807'
  const message = productName
    ? `Hi, I want to order ${productName} from GenZ Era World.`
    : 'Hi, I have a query about GenZ Era World.'
  return `https://wa.me/91${phone}?text=${encodeURIComponent(message)}`
}

export function getInstagramUrl(): string {
  return process.env.NEXT_PUBLIC_INSTAGRAM_URL || 'https://www.instagram.com/genzeraworld/'
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text
  return text.slice(0, length) + '...'
}
