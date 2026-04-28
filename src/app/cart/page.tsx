"use client"

import { useCart } from "@/context/CartContext"
import Link from "next/link"
import Image from "next/image"
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag, ShieldCheck, ChevronLeft } from "lucide-react"
import { formatPrice } from "@/lib/utils"

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, totalPrice } = useCart()

  if (cart.length === 0) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-6 bg-[#F9F9F9]">
        <div className="bg-white p-16 rounded-[4rem] mb-12 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-black blur-[80px] opacity-5" />
          <ShoppingBag className="h-24 w-24 text-black/10 group-hover:text-black transition-all duration-700 transform group-hover:scale-110" />
        </div>
        <h2 className="text-6xl font-black tracking-tighter uppercase mb-6 text-black">Empty Collection</h2>
        <p className="text-black/40 mb-12 max-w-sm font-bold uppercase text-[10px] tracking-[0.3em] leading-loose">
          Your personal gallery is waiting to be filled with our premium garments.
        </p>
        <Link 
          href="/products" 
          className="h-20 px-16 bg-black text-white rounded-full font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-[0_20px_50px_rgba(0,0,0,0.2)] flex items-center gap-4 group"
        >
          Explore Pieces <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform" />
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F9F9F9] py-24">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-end justify-between gap-12 mb-24 border-b-4 border-black/5 pb-16">
          <div className="space-y-6">
             <Link href="/products" className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-[#A88B4A] hover:text-black transition-colors">
                <ChevronLeft className="h-4 w-4" /> Back to Shop
             </Link>
             <h1 className="text-7xl md:text-9xl font-black tracking-tighter uppercase text-black leading-none">
                THE <br /> <span className="text-black/20">BAG</span>
             </h1>
          </div>
          <div className="text-right">
             <p className="text-xs font-black text-black/20 uppercase tracking-[0.4em] mb-2">Total Selection</p>
             <p className="text-4xl font-black text-black">{cart.length} PIECES</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-24 items-start">
          {/* 📦 Cart Items List */}
          <div className="lg:col-span-8 space-y-16">
            {cart.map((item) => (
              <div key={item.id} className="group relative flex flex-col sm:flex-row gap-12 pb-16 border-b-2 border-black/5 last:border-0">
                <div className="relative h-80 w-full sm:w-64 flex-shrink-0 bg-white rounded-[3rem] overflow-hidden shadow-2xl group-hover:shadow-[0_40px_80px_rgba(0,0,0,0.1)] transition-all duration-700">
                  <Image
                    src={item.image_url || "/placeholder-product.png"}
                    alt={item.name}
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                </div>
                
                <div className="flex flex-col justify-between flex-grow py-4">
                  <div className="space-y-8">
                    <div className="flex justify-between items-start">
                      <div className="space-y-4">
                        <h3 className="text-4xl font-black tracking-tighter uppercase text-black leading-tight max-w-sm">{item.name}</h3>
                        <div className="flex flex-wrap items-center gap-4">
                          <div className="bg-white px-6 py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest text-black/30 border border-black/5">
                            SIZE: <span className="text-black">{item.size}</span>
                          </div>
                          <div className="bg-white px-6 py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest text-black/30 border border-black/5">
                            COLOR: <span className="text-black">{item.color}</span>
                          </div>
                        </div>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="h-14 w-14 bg-white hover:bg-black hover:text-white rounded-3xl flex items-center justify-center text-black/20 border border-black/5 transition-all shadow-xl active:scale-90"
                      >
                        <Trash2 className="h-6 w-6" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center mt-12">
                    <div className="flex items-center gap-2 bg-white p-2 rounded-3xl border border-black/5 shadow-xl">
                      <button 
                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        className="h-12 w-12 flex items-center justify-center hover:bg-black/5 rounded-2xl transition-all"
                      >
                        <Minus className="h-5 w-5" />
                      </button>
                      <span className="w-16 text-center font-black text-2xl text-black">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="h-12 w-12 flex items-center justify-center hover:bg-black/5 rounded-2xl transition-all"
                      >
                        <Plus className="h-5 w-5" />
                      </button>
                    </div>
                    <div className="text-right">
                       <p className="text-[10px] font-black text-black/20 uppercase tracking-widest mb-1">Subtotal</p>
                       <p className="text-4xl font-black text-black tracking-tighter">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 🧾 Order Summary Panel */}
          <div className="lg:col-span-4 lg:sticky lg:top-32">
            <div className="bg-black rounded-[4rem] p-12 text-white space-y-12 shadow-[0_50px_100px_rgba(0,0,0,0.3)] relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37] blur-[120px] opacity-10" />
               
               <h2 className="text-3xl font-black tracking-tighter uppercase border-b border-white/10 pb-8 relative z-10">SUMMARY</h2>
               
               <div className="space-y-8 relative z-10">
                  <div className="flex justify-between text-[11px] font-black uppercase tracking-[0.2em] text-white/40">
                    <span>SELECTION TOTAL</span>
                    <span className="text-white">{formatPrice(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between text-[11px] font-black uppercase tracking-[0.2em] text-white/40">
                    <span>LOGISTICS FEE</span>
                    <span className="text-[#D4AF37]">COMPLIMENTARY</span>
                  </div>
                  
                  <div className="pt-12 border-t border-white/10 flex flex-col gap-4">
                    <span className="text-xs font-black uppercase tracking-[0.4em] text-white/30">FINAL BILL</span>
                    <span className="text-7xl font-black text-white tracking-tighter leading-none">{formatPrice(totalPrice)}</span>
                  </div>
               </div>

               <Link 
                 href="/checkout"
                 className="w-full bg-white text-black h-24 rounded-[2.5rem] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-4 hover:scale-[1.03] active:scale-[0.97] transition-all shadow-2xl text-xs relative z-10 group"
               >
                 SECURE CHECKOUT <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform" />
               </Link>
               
               <div className="flex items-center justify-center gap-4 pt-4 opacity-20 relative z-10">
                  <ShieldCheck className="h-6 w-6" />
                  <span className="text-[9px] font-black uppercase tracking-[0.3em]">ENCRYPTED TRANSACTION</span>
               </div>
            </div>

            {/* Back to Shop helper */}
            <Link href="/products" className="flex items-center justify-center gap-4 mt-12 text-[10px] font-black uppercase tracking-[0.4em] text-black/20 hover:text-black transition-colors">
               <ShoppingBag className="h-4 w-4" /> Continue Selecting Pieces
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
