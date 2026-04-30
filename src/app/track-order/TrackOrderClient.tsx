"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Search, Package, Truck, MapPin, CheckCircle2, Clock, Calendar, Hash, ArrowRight, Loader2, AlertCircle, ChevronLeft } from "lucide-react"
import { cn, formatPrice } from "@/lib/utils"
import Link from "next/link"

export default function TrackOrderPage() {
  const [trackingId, setTrackingId] = useState("")
  const [loading, setLoading] = useState(false)
  const [order, setOrder] = useState<any>(null)
  const [history, setHistory] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)
  
  const supabase = createClient()

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!trackingId) return

    setLoading(true)
    setError(null)
    setOrder(null)

    const { data: orders, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .ilike('tracking_id', trackingId.trim())
      .limit(1)

    if (orderError || !orders || orders.length === 0) {
      setError("Invalid Tracking ID. Please verify and try again.")
      setLoading(false)
      return
    }

    const orderData = orders[0]

    const { data: historyData } = await supabase
      .from('order_history')
      .select('*')
      .eq('order_id', orderData.id)
      .order('created_at', { ascending: false })

    setOrder(orderData)
    setHistory(historyData || [])
    setLoading(false)
  }

  const steps = [
    { id: 'pending', label: 'Order Placed', icon: Clock },
    { id: 'processing', label: 'Processing', icon: Package },
    { id: 'dispatched', label: 'Dispatched', icon: Truck },
    { id: 'arrived', label: 'Out for Delivery', icon: MapPin },
    { id: 'delivered', label: 'Delivered', icon: CheckCircle2 },
  ]

  const currentStepIndex = steps.findIndex(s => s.id === order?.status)

  return (
    <div className="min-h-screen bg-[#F4F4F4] py-12">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-[#002169] mb-4 uppercase">TRACK YOUR ORDER</h1>
            <p className="text-gray-700 max-w-lg mx-auto text-sm">
              Enter your tracking ID provided in your order confirmation email to see the real-time status of your parcel.
            </p>
          </div>

          {/* Search Box */}
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 mb-12">
            <form onSubmit={handleTrack} className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Hash className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-600" />
                <input
                  type="text"
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value)}
                  placeholder="Enter Tracking ID (e.g. ABC12345)"
                  className="w-full h-14 pl-12 pr-4 rounded border border-gray-200 focus:ring-2 focus:ring-[#002169]/10 focus:border-[#002169] outline-none transition-all font-bold uppercase text-sm text-gray-900"
                />
              </div>
              <button 
                disabled={loading}
                className="bg-[#002169] text-white px-10 h-14 rounded font-bold hover:bg-[#00184d] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
                  <>TRACK NOW <ArrowRight className="h-5 w-5" /></>
                )}
              </button>
            </form>

            {error && (
              <div className="mt-6 flex items-center gap-3 text-rose-600 text-xs font-bold bg-rose-50 p-4 rounded border border-rose-100">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}
          </div>

          {/* Tracking Result */}
          {order && (
            <div className="space-y-8 animate-in fade-in duration-700">
              {/* Status Banner */}
              <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">ORDER ID: {order.tracking_id}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-[#002169]">
                      STATUS: {order.status.toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="text-left md:text-right">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">TOTAL VALUE</p>
                  <p className="text-2xl font-bold text-[#002169]">{formatPrice(order.total_price)}</p>
                </div>
              </div>

              {/* Progress Steps */}
              <div className="bg-white p-8 md:p-12 rounded-xl shadow-sm border border-gray-200">
                <div className="relative flex flex-col md:flex-row justify-between items-center gap-8 md:gap-0">
                  {/* Progress Line (Mobile Vertical, Desktop Horizontal) */}
                  <div className="absolute top-10 left-1/2 md:left-0 md:top-1/2 w-1 md:w-full h-full md:h-1 bg-gray-100 -translate-x-1/2 md:-translate-y-1/2 z-0" />
                  <div 
                    className="absolute top-10 left-1/2 md:left-0 md:top-1/2 w-1 md:w-full h-full md:h-1 bg-[#002169] -translate-x-1/2 md:-translate-y-1/2 z-0 transition-all duration-1000 origin-top md:origin-left" 
                    style={{ 
                      height: currentStepIndex >= 0 ? `${(currentStepIndex / (steps.length - 1)) * 100}%` : '0%',
                      width: currentStepIndex >= 0 ? `${(currentStepIndex / (steps.length - 1)) * 100}%` : '0%'
                    }}
                  />

                  {steps.map((step, idx) => {
                    const Icon = step.icon
                    const isActive = idx <= currentStepIndex
                    return (
                      <div key={step.id} className="relative z-10 flex flex-col items-center">
                        <div className={cn(
                          "h-16 w-16 rounded-full flex items-center justify-center transition-all duration-500 border-4",
                          isActive 
                            ? "bg-[#002169] border-white text-white shadow-lg scale-110" 
                            : "bg-white border-gray-100 text-gray-400"
                        )}>
                          <Icon className="h-6 w-6" />
                        </div>
                        <span className={cn(
                          "mt-4 text-[11px] font-bold uppercase tracking-wider text-center",
                          isActive ? "text-[#002169]" : "text-gray-600"
                        )}>
                          {step.label}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* History & Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Consignee Info */}
                <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 space-y-6">
                  <h3 className="text-sm font-bold text-[#002169] border-b pb-3 uppercase tracking-widest">Customer Details</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <MapPin className="h-5 w-5 text-[#FCB800] shrink-0" />
                      <div>
                        <p className="text-[10px] font-bold text-gray-600 uppercase">Delivery Address</p>
                        <p className="text-sm font-bold text-gray-800 leading-snug">{order.address}</p>
                        <p className="text-[10px] font-medium text-gray-700 mt-1">Landmark: {order.landmark || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <Clock className="h-5 w-5 text-[#FCB800] shrink-0" />
                      <div>
                        <p className="text-[10px] font-bold text-gray-600 uppercase">Receiver Name</p>
                        <p className="text-sm font-bold text-gray-800">{order.customer_name}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Timeline */}
                <div className="bg-[#002169] p-8 rounded-xl shadow-lg space-y-6 text-white">
                  <h3 className="text-sm font-bold text-[#FCB800] border-b border-white/10 pb-3 uppercase tracking-widest">Journey History</h3>
                  <div className="space-y-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    {history.length > 0 ? history.map((log, idx) => (
                      <div key={log.id} className="relative flex gap-4">
                        {idx !== history.length - 1 && (
                          <div className="absolute top-10 left-[19px] w-[2px] h-8 bg-white/10" />
                        )}
                        <div className={cn(
                          "h-10 w-10 rounded-lg flex items-center justify-center shrink-0 border",
                          idx === 0 ? "bg-[#FCB800] border-[#FCB800] text-[#002169]" : "bg-transparent border-white/10 text-white/70"
                        )}>
                           <CheckCircle2 className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <span className="text-[10px] font-bold text-white/70">
                              {new Date(log.created_at).toLocaleDateString()}
                            </span>
                            <span className="text-[10px] font-bold text-white/70">
                              {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className={cn(
                            "text-sm font-bold uppercase tracking-tight",
                            idx === 0 ? "text-white" : "text-white/70"
                          )}>
                            {log.status}
                          </p>
                          {log.note && <p className="text-[10px] text-[#FCB800] mt-1 font-medium">{log.note}</p>}
                        </div>
                      </div>
                    )) : (
                      <div className="text-center py-10 text-white/20">
                        <Package className="h-10 w-10 mx-auto mb-2" />
                        <p className="text-[10px] font-bold uppercase tracking-widest">No logs yet</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
