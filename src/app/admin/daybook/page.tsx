import { createClient } from "@/lib/supabase/server"
import { formatPrice, cn } from "@/lib/utils"
import { Calendar, ShoppingBag, Receipt, Search, Eye } from "lucide-react"
import Link from "next/link"

export default async function DayBookPage({ searchParams }: { searchParams: { date?: string } }) {
  const selectedDate = searchParams.date || new Date().toISOString().split('T')[0];
  
  const supabase = await createClient()
  
  // Fetch orders
  const { data: orders, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })

  // Filter orders by the selected date in the local timezone
  const dailyOrders = orders?.filter(o => {
    // Convert UTC created_at to YYYY-MM-DD in local time
    const localDate = new Date(o.created_at).toLocaleDateString('en-CA') // YYYY-MM-DD
    return localDate === selectedDate || o.created_at.startsWith(selectedDate)
  }) || []

  const totalSales = dailyOrders.reduce((acc, o) => acc + (o.total_amount || o.total_price || 0), 0)
  const totalOrders = dailyOrders.length

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 uppercase tracking-tight">Day Book Summary</h1>
          <p className="text-sm text-gray-500 mt-1">View real-time daily sales and order records</p>
        </div>
        
        <form className="flex items-center gap-3 bg-white p-2 rounded-xl shadow-sm border border-gray-100">
           <Calendar className="h-5 w-5 text-gray-400 ml-2" />
           <input 
             type="date" 
             name="date"
             defaultValue={selectedDate}
             className="bg-transparent border-none focus:ring-0 text-sm font-bold text-gray-700 outline-none cursor-pointer"
           />
           <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-blue-700 transition-all">
             Filter
           </button>
        </form>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-6">
            <div className="h-16 w-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
               <Receipt className="h-8 w-8" />
            </div>
            <div>
               <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Total Daily Sales</p>
               <p className="text-3xl font-bold text-gray-900 mt-1">{formatPrice(totalSales)}</p>
            </div>
         </div>
         <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-6">
            <div className="h-16 w-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
               <ShoppingBag className="h-8 w-8" />
            </div>
            <div>
               <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Total Daily Orders</p>
               <p className="text-3xl font-bold text-gray-900 mt-1">{totalOrders} Orders</p>
            </div>
         </div>
      </div>

      {/* Daily Orders Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50/30">
           <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Sales Log: {selectedDate}</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Time</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Order ID</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Customer</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Payment</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-gray-50">
              {!dailyOrders.length ? (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-3 opacity-30">
                       <ShoppingBag className="h-12 w-12" />
                       <p className="text-sm font-black uppercase tracking-[0.2em]">No Sales on this Date</p>
                    </div>
                  </td>
                </tr>
              ) : dailyOrders.map((order) => (
                <tr key={order.id} className="group hover:bg-blue-50/30 transition-all duration-300">
                  <td className="px-8 py-5">
                    <span className="text-xs font-bold text-gray-500">{new Date(order.created_at).toLocaleTimeString()}</span>
                  </td>
                  <td className="px-8 py-5">
                    <span className="font-black text-[#002169] text-sm tracking-tighter">#{order.tracking_id || order.id.slice(0, 8).toUpperCase()}</span>
                  </td>
                  <td className="px-8 py-5">
                    <span className="font-bold text-sm text-gray-900 uppercase">{order.customer_name || order.full_name || 'Anonymous User'}</span>
                  </td>
                  <td className="px-8 py-5">
                    <span className={cn(
                      "px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest",
                      order.payment_method === 'online' ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                    )}>
                      {order.payment_method || 'CASH'}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <span className="font-black text-sm text-gray-900">{formatPrice(order.total_amount || order.total_price)}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
