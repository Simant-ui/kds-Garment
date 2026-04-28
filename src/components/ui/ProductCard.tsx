"use client"

import Image from "next/image"
import Link from "next/link"
import { ShoppingBag, Star, Plus, ArrowRight } from "lucide-react"
import { Product } from "@/types"
import { useCart } from "@/context/CartContext"
import { formatPrice, cn } from "@/lib/utils"

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart()

  return (
    <div className="group bg-white border border-[#EBEBEB] rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full">
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-white border-b border-[#EBEBEB]">
        <Image
          src={product.image_url || "/placeholder-product.jpg"}
          alt={product.name}
          fill
          className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
           <div className="bg-[#00c1cf] text-white px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider shadow-sm">
              New
           </div>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4 flex flex-col flex-1 bg-[#F9F9F9]">
        <Link href={`/products/${product.id}`} className="hover:text-[#002169] transition-colors mb-2">
          <p className="text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-1">{product.category}</p>
          <h3 className="text-sm font-bold text-gray-800 line-clamp-2 min-h-[40px]">
            {product.name}
          </h3>
        </Link>
        
        <div className="mt-auto pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <span className="text-lg font-bold text-[#002169]">
              {formatPrice(product.price)}
            </span>
            <div className="flex items-center gap-1">
               <Star className="h-3 w-3 text-[#FCB800] fill-[#FCB800]" />
                <span className="text-xs font-bold text-gray-700">4.5</span>
            </div>
          </div>

          <Link 
            href={`/products/${product.id}`}
            className="w-full h-10 bg-[#002169] text-white rounded font-bold uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 hover:bg-[#FCB800] hover:text-[#002169] transition-all group/btn"
          >
            SHOP NOW <ArrowRight className="h-3 w-3 group-hover/btn:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  )
}
