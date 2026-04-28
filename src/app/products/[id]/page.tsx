import { getProduct } from "@/lib/products"
import { notFound } from "next/navigation"
import Image from "next/image"
import { Star, ShieldCheck, Truck, RotateCcw, ArrowLeft, Heart, Share2, Package, Globe, ChevronLeft, Shield } from "lucide-react"
import { formatPrice, cn } from "@/lib/utils"
import ProductActions from "./AddToCartButton"
import Link from "next/link"

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const product = await getProduct(id)

  if (!product) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-[#F4F4F4] py-8">
      <div className="container mx-auto px-6">
        {/* 🧭 Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest mb-10">
          <Link href="/" className="hover:text-[#002169] transition-colors">Home</Link>
          <ChevronLeft className="h-3 w-3" />
          <Link href="/products" className="hover:text-[#002169] transition-colors">Products</Link>
          <ChevronLeft className="h-3 w-3" />
          <span className="text-[#002169]">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* 📸 Left: Product Image */}
          <div className="lg:col-span-6 space-y-6">
            <div className="relative aspect-square overflow-hidden rounded-xl bg-white shadow-sm border border-gray-200">
              <Image
                src={product.image_url || "/placeholder-product.jpg"}
                alt={product.name}
                fill
                className="object-contain p-8"
                priority
              />
              
              <div className="absolute top-6 left-6 flex flex-col gap-3">
                 <div className="bg-[#002169] text-white px-4 py-1.5 rounded text-[10px] font-bold uppercase tracking-widest shadow-lg">
                    Premium Quality
                 </div>
              </div>
            </div>
            
            {/* Thumbnail Gallery */}
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-square relative rounded-lg overflow-hidden bg-white border border-gray-200 cursor-pointer hover:border-[#002169] transition-all group">
                  <Image
                    src={product.image_url || "/placeholder-product.jpg"}
                    alt={`${product.name} thumbnail ${i}`}
                    fill
                    className="object-contain p-2 opacity-60 group-hover:opacity-100 transition-all"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* 📝 Right: Details Panel */}
          <div className="lg:col-span-6 space-y-8 bg-white p-8 md:p-12 rounded-xl border border-gray-200 shadow-sm">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                 <div className="flex gap-0.5">
                   {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-[#FCB800] text-[#FCB800]" />)}
                 </div>
                 <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Top Rated Garment</span>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold text-[#002169] uppercase leading-tight">
                {product.name}
              </h1>
              
              <div className="flex items-center gap-6">
                <p className="text-4xl font-bold text-[#002169]">{formatPrice(product.price)}</p>
                <div className="bg-gray-100 px-4 py-1 rounded text-xs font-bold text-gray-400 uppercase tracking-widest line-through">
                  Rs. {(product.price * 1.1).toLocaleString()}
                </div>
              </div>
            </div>

            <div className="border-t border-b border-gray-100 py-8">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Product Description</h3>
              <p className="text-gray-600 text-sm leading-loose">
                {product.description || "High-quality professional garment manufactured with precision at KDS Garment. Designed for durability and comfort using premium fabrics sourced locally."}
              </p>
            </div>

            {/* Selection Engine */}
            <ProductActions product={product} />

            {/* Trust Matrix */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-100">
              {[
                { icon: Truck, label: "Fast Delivery", color: "text-[#002169]" },
                { icon: Shield, label: "Quality Check", color: "text-[#002169]" },
                { icon: RotateCcw, label: "7 Day Return", color: "text-[#002169]" }
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center text-center gap-3">
                  <div className="h-12 w-12 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-100">
                    <item.icon className={cn("h-5 w-5", item.color)} />
                  </div>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-gray-500">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
