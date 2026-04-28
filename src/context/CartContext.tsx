"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'

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

interface CartContextType {
  cart: CartItem[]
  addToCart: (item: any) => void
  removeFromCart: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  clearCart: () => void
  totalItems: number
  totalPrice: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])

  useEffect(() => {
    const savedCart = localStorage.getItem('kds-cart-v2')
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart))
      } catch (e) {
        console.error('Failed to parse cart', e)
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('kds-cart-v2', JSON.stringify(cart))
  }, [cart])

  const addToCart = (newItem: any) => {
    setCart((prev) => {
      // Check if item with same ID, SIZE and COLOR already exists
      const existing = prev.find((item) => 
        item.product_id === newItem.id && 
        item.size === newItem.size && 
        item.color === newItem.color
      )

      if (existing) {
        return prev.map((item) =>
          (item.product_id === newItem.id && item.size === newItem.size && item.color === newItem.color)
            ? { ...item, quantity: item.quantity + (newItem.quantity || 1) }
            : item
        )
      }

      return [
        ...prev,
        {
          id: Math.random().toString(36).substr(2, 9),
          product_id: newItem.id,
          name: newItem.name,
          price: newItem.price,
          image_url: newItem.image_url,
          category: newItem.category,
          quantity: newItem.quantity || 1,
          size: newItem.size || 'M',
          color: newItem.color || 'Black',
        },
      ]
    })
  }

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== itemId))
  }

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId)
      return
    }
    setCart((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, quantity } : item
      )
    )
  }

  const clearCart = () => setCart([])

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = cart.reduce(
    (sum, item) => sum + (item.price || 0) * item.quantity,
    0
  )

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
