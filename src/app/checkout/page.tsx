"use client"

import { useState } from "react"
import { useCart } from "@/context/CartContext"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Loader2, CheckCircle2, CreditCard, Truck, MapPin, ChevronRight, AlertCircle, Hash, Copy, Check, ShoppingBag, ShieldCheck, ArrowRight, MessageSquare } from "lucide-react"
import Link from "next/link"
import { formatPrice } from "@/lib/utils"

// Helper to generate unique tracking ID (10 chars alphanumeric)
const generateTrackingId = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ0123456789'
  let result = ''
  for (let i = 0; i < 10; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

export default function CheckoutPage() {
  const { cart, totalPrice, clearCart } = useCart()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [trackingId, setTrackingId] = useState("")
  const [copied, setCopied] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'online'>('cod')
  const [confirmed, setConfirmed] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    landmark: "",
    description: "",
  })
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  // Delivery Logic (Refined: 200g per piece)
  const SHIPPING_THRESHOLD = 15000
  const RATE_PER_KG = 200
  const WEIGHT_PER_ITEM = 0.2 // 200 grams
  const totalWeight = cart.reduce((sum, item) => sum + (item.quantity * WEIGHT_PER_ITEM), 0)
  const deliveryCharge = totalPrice >= SHIPPING_THRESHOLD ? 0 : totalWeight * RATE_PER_KG
  const grandTotal = totalPrice + deliveryCharge

  const copyToClipboard = () => {
    navigator.clipboard.writeText(trackingId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.firstName || !formData.lastName || !formData.phone || !formData.email || !formData.address || !formData.landmark || !formData.description) {
      setError("PLEASE FILL IN ALL COMPULSORY FIELDS.")
      return
    }

    if (!confirmed) {
      setError("PLEASE CONFIRM YOUR ORDER BY TICKING THE BOX.")
      return
    }

    setLoading(true)
    setError(null)

    const newTrackingId = generateTrackingId()

    // 1. Create the order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        total_amount: grandTotal, 
        status: 'pending',
        tracking_id: newTrackingId,
        shipping_address: formData.address + (formData.description ? ` | Note: ${formData.description}` : ""),
        landmark: formData.landmark,
        payment_method: paymentMethod,
        customer_phone: formData.phone,
        customer_name: `${formData.firstName} ${formData.lastName}`,
        customer_email: formData.email,
      })
      .select()
      .single()

    if (orderError) {
      setError(orderError.message.toUpperCase())
      setLoading(false)
      return
    }

    // 2. Create order items
    const orderItems = cart.map(item => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.price,
      size: item.size,
      color: item.color
    }))

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems)

    if (itemsError) {
      console.error("Error saving items:", itemsError)
      alert("CRITICAL ERROR: Failed to save order items! " + itemsError.message)
    }

    // 3. Log initial history
    await supabase.from('order_history').insert({
      order_id: order.id,
      status: 'pending',
      note: `Order placed. Subtotal: ${totalPrice}, Weight: ${totalWeight.toFixed(2)}kg, Delivery: ${deliveryCharge}`
    })

    setTrackingId(newTrackingId)
    setSuccess(true)
    setLoading(false)
    clearCart()
  }

  if (success) {
    return (
      <div className="min-h-[90vh] bg-[#F4F4F4] flex flex-col items-center justify-center text-center px-6 py-20">
        <div className="bg-white p-12 rounded-xl shadow-xl max-w-2xl w-full border border-gray-200">
          <div className="bg-emerald-50 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 className="h-10 w-10 text-emerald-500" />
          </div>

          <h2 className="text-4xl font-bold text-[#002169] mb-4 uppercase">Order Success!</h2>
          <p className="text-gray-500 max-w-md mx-auto mb-10 text-sm font-medium leading-relaxed">
            Thank you for shopping with us, please visit again. Our team will contact you soon!
          </p>

          <div className="bg-[#F9F9F9] p-8 rounded-lg border border-gray-200 mb-10">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">YOUR TRACKING ID</p>
            <div className="flex items-center justify-center gap-6">
              <span className="text-4xl font-bold text-[#002169]">{trackingId}</span>
              <button
                onClick={copyToClipboard}
                className="h-12 w-12 bg-white border border-gray-200 rounded flex items-center justify-center hover:bg-gray-50 transition-all shadow-sm"
              >
                {copied ? <Check className="h-5 w-5 text-emerald-500" /> : <Copy className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <button
            onClick={() => router.push("/")}
            className="w-full bg-[#FCB800] text-[#002169] h-14 rounded font-bold uppercase hover:bg-[#e6a700] transition-all shadow-md"
          >
            RETURN TO SHOPPING
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F4F4F4] py-12">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
          <h1 className="text-4xl font-bold text-[#002169] uppercase">Checkout</h1>
          <div className="flex items-center gap-2 text-xs text-gray-500 font-bold uppercase tracking-widest">
            <Link href="/cart" className="hover:text-[#002169]">Cart</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-[#002169]">Shipping & Payment</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center gap-4 mb-8 border-b pb-4">
                <Truck className="h-6 w-6 text-[#FCB800]" />
                <h2 className="text-xl font-bold text-[#002169] uppercase">Shipping Details</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-[#002169] uppercase tracking-widest">First Name *</label>
                  <input required name="firstName" value={formData.firstName} onChange={handleInputChange} placeholder="Simant" className="w-full border-2 border-gray-300 rounded p-4 focus:border-[#002169] outline-none transition-all text-base font-bold text-gray-900 placeholder-gray-400 bg-white" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-[#002169] uppercase tracking-widest">Last Name *</label>
                  <input required name="lastName" value={formData.lastName} onChange={handleInputChange} placeholder="Shrestha" className="w-full border-2 border-gray-300 rounded p-4 focus:border-[#002169] outline-none transition-all text-base font-bold text-gray-900 placeholder-gray-400 bg-white" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-[#002169] uppercase tracking-widest">Mobile Number *</label>
                  <input required name="phone" value={formData.phone} onChange={handleInputChange} placeholder="98XXXXXXXX" className="w-full border-2 border-gray-300 rounded p-4 focus:border-[#002169] outline-none transition-all text-base font-bold text-gray-900 placeholder-gray-400 bg-white" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-[#002169] uppercase tracking-widest">Email Address *</label>
                  <input required name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="example@gmail.com" className="w-full border-2 border-gray-300 rounded p-4 focus:border-[#002169] outline-none transition-all text-base font-bold text-gray-900 placeholder-gray-400 bg-white" />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-black text-[#002169] uppercase tracking-widest">Location / Delivery Address *</label>
                  <input required name="address" value={formData.address} onChange={handleInputChange} placeholder="Street, Ward No, City" className="w-full border-2 border-gray-300 rounded p-4 focus:border-[#002169] outline-none transition-all text-base font-bold text-gray-900 placeholder-gray-400 bg-white" />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-black text-[#002169] uppercase tracking-widest">Nearest Landmark *</label>
                  <input required name="landmark" value={formData.landmark} onChange={handleInputChange} placeholder="E.g. Near White House" className="w-full border-2 border-gray-300 rounded p-4 focus:border-[#002169] outline-none transition-all text-base font-bold text-gray-900 placeholder-gray-400 bg-white" />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-black text-[#002169] uppercase tracking-widest">Order Description / Special Instructions *</label>
                  <textarea required name="description" value={formData.description} onChange={handleInputChange} placeholder="Tell us more about your size requirements or delivery instructions..." className="w-full border-2 border-gray-300 rounded p-4 min-h-[120px] focus:border-[#002169] outline-none transition-all text-base font-bold text-gray-900 placeholder-gray-400 bg-white resize-none" />
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center gap-4 mb-8 border-b pb-4">
                <CreditCard className="h-6 w-6 text-[#FCB800]" />
                <h2 className="text-xl font-bold text-[#002169] uppercase">Payment</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <button type="button" onClick={() => setPaymentMethod('cod')} className={`p-6 rounded-lg border-2 transition-all flex items-center gap-4 ${paymentMethod === 'cod' ? 'border-[#002169] bg-[#002169]/5' : 'border-gray-100 hover:border-gray-200'}`}>
                  <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'cod' ? 'border-[#002169]' : 'border-gray-300'}`}>
                    {paymentMethod === 'cod' && <div className="h-3 w-3 bg-[#002169] rounded-full" />}
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-sm text-[#002169]">Cash on Delivery</p>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Pay at your door</p>
                  </div>
                </button>

                <button type="button" onClick={() => setPaymentMethod('online')} className={`p-6 rounded-lg border-2 transition-all flex items-center gap-4 ${paymentMethod === 'online' ? 'border-[#002169] bg-[#002169]/5' : 'border-gray-100 hover:border-gray-200'}`}>
                  <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'online' ? 'border-[#002169]' : 'border-gray-300'}`}>
                    {paymentMethod === 'online' && <div className="h-3 w-3 bg-[#002169] rounded-full" />}
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-sm text-[#002169]">Online Payment</p>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Bank Transfer / Wallet</p>
                  </div>
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 lg:sticky lg:top-32">
            <div className="bg-[#002169] p-8 rounded-xl shadow-lg text-white">
              <h2 className="text-xl font-bold mb-8 border-b border-white/10 pb-4 uppercase">Order Summary</h2>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-sm opacity-60 font-bold uppercase tracking-widest">
                  <span>Subtotal</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-sm opacity-60 font-bold uppercase tracking-widest">
                  <span>Shipping ({totalWeight.toFixed(2)}KG)</span>
                  {deliveryCharge > 0 ? (
                    <span>{formatPrice(deliveryCharge)}</span>
                  ) : (
                    <span className="text-[#FCB800]">FREE</span>
                  )}
                </div>
                <div className="pt-4 border-t border-white/10 flex justify-between items-end">
                  <span className="text-sm font-bold uppercase tracking-widest">TOTAL</span>
                  <span className="text-3xl font-bold text-[#FCB800]">{formatPrice(grandTotal)}</span>
                </div>
              </div>

              <div className="bg-white/5 p-6 rounded-lg mb-8 border border-white/10">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input type="checkbox" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} className="mt-1 h-5 w-5 rounded border-white/20 bg-transparent text-[#FCB800] focus:ring-[#FCB800]" />
                  <span className="text-[10px] font-bold text-white/60 group-hover:text-white transition-colors leading-relaxed uppercase tracking-wider">
                    I confirm that the provided information is correct and I agree to purchase.
                  </span>
                </label>
              </div>

              {error && (
                <div className="bg-rose-500/10 p-4 rounded-lg mb-6 flex items-center gap-3 text-[10px] font-bold text-rose-400 border border-rose-500/20">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {error}
                </div>
              )}

              <button type="submit" disabled={loading} className="w-full bg-[#FCB800] text-[#002169] h-14 rounded font-bold uppercase hover:bg-yellow-500 transition-all flex items-center justify-center gap-3 shadow-xl text-xs tracking-widest">
                {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : (
                  <>Complete Order <ArrowRight className="h-5 w-5" /></>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 mt-6 opacity-40">
                <ShieldCheck className="h-4 w-4" />
                <span className="text-[9px] font-bold uppercase tracking-widest">Verified Merchant</span>
              </div>
            </div>

            <Link href="/cart" className="flex items-center justify-center gap-2 mt-6 text-[10px] font-bold text-gray-400 hover:text-[#002169] transition-all uppercase tracking-widest">
              <ShoppingBag className="h-4 w-4" /> Back to Cart
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
