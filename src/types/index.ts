export type Role = 'super_admin' | 'admin'

export type OrderStatus =
  | 'pending_verification'
  | 'payment_verified'
  | 'packed'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded'

export type StockStatus = 'in_stock' | 'low_stock' | 'out_of_stock'

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  image_url?: string
  created_at: string
  updated_at: string
}

export interface ProductImage {
  id: string
  product_id: string
  url: string
  is_featured: boolean
  sort_order: number
  created_at: string
}

export interface Product {
  id: string
  name: string
  slug: string
  description: string
  category_id: string
  category?: Category
  price: number
  sale_price?: number
  stock_quantity: number
  sku: string
  is_featured: boolean
  is_trending: boolean
  is_new_arrival: boolean
  images?: ProductImage[]
  featured_image?: string
  stock_status: StockStatus
  created_at: string
  updated_at: string
  has_variants: boolean
variants: string[]
}

export interface CartItem {
  product_id: string
  product: Product
  quantity: number
}

export interface Cart {
  items: CartItem[]
  subtotal: number
  delivery_charge: number
  total: number
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  product?: Product
  product_name: string
  product_price: number
  quantity: number
  subtotal: number
}

export interface Order {
  id: string
  order_number: string
  customer_name: string
  customer_phone: string
  customer_email?: string
  address: string
  city: string
  state: string
  pincode: string
  subtotal: number
  delivery_charge: number
  total: number
  status: OrderStatus
  payment_screenshot_url?: string
  transaction_id?: string
  items?: OrderItem[]
  created_at: string
  updated_at: string
}

export interface AdminUser {
  id: string
  email: string
  name: string
  role: Role
  is_active: boolean
  created_at: string
  updated_at: string
  last_login?: string
}

export interface ActivityLog {
  id: string
  admin_id: string
  admin?: AdminUser
  action: string
  entity_type: string
  entity_id?: string
  details?: Record<string, unknown>
  created_at: string
}

export interface SiteSettings {
  id: string
  low_stock_threshold: number
  upi_qr_image_url?: string
  upi_id?: string
  updated_at: string
}
