import { createClient } from '@/lib/supabase/server'
import { Product } from '@/types'

export async function getProducts() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching products:', error)
    return []
  }

  return data as Product[]
}

export async function getProduct(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching product:', error)
    return null
  }

  return data as Product
}

export async function getCategories() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('products')
    .select('category')
  
  if (error) {
    return ["Men", "Women", "Kids", "Accessories"]
  }
  
  const categories = Array.from(new Set(data.map(item => item.category).filter(Boolean)))
  return categories.length > 0 ? categories : ["Men", "Women", "Kids", "Accessories"]
}
