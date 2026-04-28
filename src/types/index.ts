export interface Product {
  id: string
  name: string
  description: string | null
  price: number
  category: string | null
  sizes: string[] | null
  stock_quantity: number // Matches database
  image_url: string | null
  created_at: string
}

export interface CartItem {
  id: string
  product_id: string
  name: string
  price: number
  image_url: string
  category: string
  quantity: number
  size: string
  color: string
}

export interface Order {
  id: string
  tracking_id: string | null
  user_id: string | null
  total_price: number
  status: 'pending' | 'confirmed' | 'processing' | 'delivered' | 'cancelled'
  full_name: string
  email: string
  phone: string
  address: string
  landmark: string | null
  payment_method: string
  created_at: string
  items?: OrderItem[]
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  quantity: number
  price: number
  size: string
  color: string
  product?: Product
}

export interface Inquiry {
  id: string
  full_name: string
  email: string
  phone: string
  subject: string
  message: string
  status: 'pending' | 'read' | 'replied'
  created_at: string
}
