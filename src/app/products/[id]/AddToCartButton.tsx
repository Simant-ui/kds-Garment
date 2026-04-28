"use client"

import { useCart } from "@/context/CartContext"
import { Product } from "@/types"
import { ShoppingBag, Minus, Plus, Check, Ruler, Zap, CreditCard } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"

const SIZES = ["S", "M", "L", "XL", "XXL"]
const COLORS = [
  { name: "Navy Blue", class: "bg-[#002169]" },
  { name: "Black", class: "bg-black" },
  { name: "White", class: "bg-white border-gray-200" },
  { name: "Gray", class: "bg-gray-500" },
]

export default function ProductActions({ product }: { product: Product }) {
  const { addToCart } = useCart()
  const router = useRouter()
  const [selectedSize, setSelectedSize] = useState("M")
  const [selectedColor, setSelectedColor] = useState("Navy Blue")
  const [quantity, setQuantity] = useState(1)

  const handleAddToCart = () => {
    const cartItem = {
      ...product,
      size: selectedSize,
      color: selectedColor,
      quantity: quantity
    }
    addToCart(cartItem)
  }

  const handleBuyNow = () => {
    const cartItem = {
      ...product,
      size: selectedSize,
      color: selectedColor,
      quantity: quantity
    }
    addToCart(cartItem)
    router.push('/checkout')
  }

  return (
    <div className="space-y-8">
      {/* Size Selection */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Select Size</h3>
          <button className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#002169] hover:underline">
             <Ruler className="h-3 w-3" /> Size Guide
          </button>
        </div>
        <div className="flex flex-wrap gap-3">
          {SIZES.map((size) => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={cn(
                "h-12 w-12 rounded border-2 font-bold transition-all flex items-center justify-center text-xs",
                selectedSize === size 
                  ? "border-[#002169] bg-[#002169] text-white shadow-md" 
                  : "border-gray-100 hover:border-gray-300 text-gray-500"
              )}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Color Selection */}
      <div className="space-y-4">
        <h3 className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Choose Color</h3>
        <div className="flex flex-wrap gap-4">
          {COLORS.map((color) => (
            <button
              key={color.name}
              onClick={() => setSelectedColor(color.name)}
              className={cn(
                "group flex flex-col items-center gap-2 transition-all",
                selectedColor === color.name ? "opacity-100" : "opacity-60"
              )}
            >
              <div className={cn(
                "h-10 w-10 rounded-full border-2 transition-all flex items-center justify-center relative shadow-sm",
                selectedColor === color.name ? "border-[#002169] scale-110" : "border-transparent"
              )}>
                <div className={cn("h-7 w-7 rounded-full border border-gray-100", color.class)} />
                {selectedColor === color.name && (
                   <div className="absolute -top-1 -right-1 h-4 w-4 bg-[#002169] rounded-full flex items-center justify-center border-2 border-white">
                      <Check className="h-2 w-2 text-white stroke-[4px]" />
                   </div>
                )}
              </div>
              <span className="text-[8px] font-bold uppercase tracking-widest text-gray-400">{color.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Quantity & Actions */}
      <div className="space-y-6 pt-4">
        <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border border-gray-100">
           <div className="space-y-1">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Quantity</h3>
              <div className="flex items-center bg-white rounded border border-gray-200">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="h-8 w-8 flex items-center justify-center hover:bg-gray-100 transition-all text-[#002169]"
                >
                  <Minus className="h-3 w-3" />
                </button>
                <span className="w-10 text-center font-bold text-sm">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="h-8 w-8 flex items-center justify-center hover:bg-gray-100 transition-all text-[#002169]"
                >
                  <Plus className="h-3 w-3" />
                </button>
              </div>
           </div>
           
           <div className="text-right">
             <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Total</p>
             <p className="text-2xl font-bold text-[#002169]">Rs. {(product.price * quantity).toLocaleString()}</p>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={handleAddToCart}
            className="h-14 bg-white border-2 border-[#002169] text-[#002169] rounded font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-all hover:bg-gray-50"
          >
            <ShoppingBag className="h-4 w-4" />
            Add to Cart
          </button>
          
          <button
            onClick={handleBuyNow}
            className="h-14 bg-[#FCB800] text-[#002169] rounded font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-all hover:bg-[#eab000] shadow-lg shadow-yellow-400/20"
          >
            <CreditCard className="h-4 w-4" />
            Buy Now
          </button>
        </div>
      </div>
    </div>
  )
}
