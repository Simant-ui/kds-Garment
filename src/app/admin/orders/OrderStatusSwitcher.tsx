"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"
import { Loader2, ChevronDown } from "lucide-react"

const statuses = [
  { id: 'pending', label: 'PENDING', color: 'bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/20' },
  { id: 'processing', label: 'PROCESSING', color: 'bg-black text-white border-black' },
  { id: 'dispatched', label: 'DISPATCHED', color: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20' },
  { id: 'arrived', label: 'ARRIVED', color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' },
  { id: 'delivered', label: 'DELIVERED', color: 'bg-emerald-500 text-white border-emerald-500' },
  { id: 'cancelled', label: 'CANCELLED', color: 'bg-rose-500/10 text-rose-500 border-rose-500/20' },
]

export default function OrderStatusSwitcher({ orderId, currentStatus }: { orderId: string, currentStatus: string }) {
  const [status, setStatus] = useState(currentStatus)
  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  
  const supabase = createClient()

  const handleStatusChange = async (newStatus: string) => {
    setLoading(true)
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId)

    if (!error) {
      // Log history for tracking
      await supabase.from('order_history').insert({
        order_id: orderId,
        status: newStatus,
        note: `Status updated to ${newStatus}`
      })
      
      setStatus(newStatus)
      setIsOpen(false)
    }
    setLoading(false)
  }

  const current = statuses.find(s => s.id === status) || statuses[0]

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        disabled={loading}
        className={cn(
          "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 flex items-center gap-2 transition-all active:scale-95",
          current.color,
          isOpen && "ring-4 ring-slate-100"
        )}
      >
        {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : current.label}
        <ChevronDown className={cn("h-3 w-3 transition-transform", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 z-50 animate-in fade-in slide-in-from-top-2">
          {statuses.map((s) => (
            <button
              key={s.id}
              onClick={() => handleStatusChange(s.id)}
              className={cn(
                "w-full text-left px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors flex items-center justify-between group",
                status === s.id ? "bg-slate-50 text-primary" : "text-slate-400 hover:bg-slate-50 hover:text-primary"
              )}
            >
              {s.label}
              {status === s.id && <div className="h-1.5 w-1.5 rounded-full bg-primary" />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
