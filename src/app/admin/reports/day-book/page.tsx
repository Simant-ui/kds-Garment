import { createClient } from "@/lib/supabase/server"
import { formatPrice, cn } from "@/lib/utils"
import { 
  Calendar as CalendarIcon, 
  Search, 
  User, 
  ArrowRight,
  TrendingUp,
  ShoppingBag,
  Clock,
  ChevronLeft,
  ChevronRight,
  Printer,
  Download
} from "lucide-react"
import Link from "next/link"
import { PrintButton, DateSelector } from "@/components/admin/ReportActions"

export default async function DayBookPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>
}) {
  const params = await searchParams
  const selectedDate = params.date ? new Date(params.date) : new Date()
  const dateString = selectedDate.toISOString().split('T')[0]

  const supabase = await createClient()
  
  // Fetch orders for the specific date
  const { data: orders } = await supabase
    .from('orders')
    .select('*, order_items(*, products(*))')
    .gte('created_at', `${dateString}T00:00:00Z`)
    .lte('created_at', `${dateString}T23:59:59Z`)
    .order('created_at', { ascending: true })

  const dayTotal = orders?.reduce((acc, o) => acc + (o.total_price || 0), 0) || 0
  const orderCount = orders?.length || 0

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Navigation & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 print:hidden">
        <div className="flex items-center gap-6">
           <Link href="/admin/reports" className="h-10 w-10 flex items-center justify-center bg-white rounded-xl shadow-sm border border-gray-100 hover:text-blue-600 transition-colors">
              <ChevronLeft className="h-5 w-5" />
           </Link>
           <div>
              <h1 className="text-3xl font-bold text-[#1E3A8A]">Day Book</h1>
              <p className="text-gray-500 mt-1 font-medium">Daily transaction journal for {selectedDate.toLocaleDateString('en-US', { dateStyle: 'full' })}</p>
           </div>
        </div>
        <div className="flex items-center gap-3">
           <button className="h-11 px-4 flex items-center gap-2 bg-white text-gray-700 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all font-bold text-xs">
              <Download className="h-4 w-4" /> CSV
           </button>
           <PrintButton 
             label="Print Journal" 
             className="h-11 px-4 flex items-center gap-2 bg-[#1E3A8A] text-white rounded-xl shadow-lg hover:shadow-xl transition-all font-bold text-xs" 
           />
        </div>
      </div>

      {/* Date Selector Bar */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6 print:hidden">
         <div className="flex items-center gap-4">
            <div className="flex flex-col gap-1.5">
               <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">View Records For</label>
               <DateSelector dateString={dateString} baseUrl="/admin/reports/day-book" />
            </div>
         </div>
         
         <div className="flex gap-10">
            <div className="text-right">
               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Daily Summary</p>
               <p className="text-xl font-black text-gray-900">{formatPrice(dayTotal)}</p>
            </div>
            <div className="text-right">
               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Order Count</p>
               <p className="text-xl font-black text-gray-900">{orderCount} Bills</p>
            </div>
         </div>
      </div>

      {/* Journal Entry Table */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-100 flex items-center justify-between print:hidden">
           <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3">
              <ShoppingBag className="h-6 w-6 text-blue-600" />
              Transaction Log
           </h2>
           <div className="relative w-72">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search customers..." 
                className="w-full bg-gray-50 border-none rounded-xl pl-12 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 transition-all"
              />
           </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-10 py-5 text-[10px] font-bold uppercase tracking-wider text-gray-400">Time</th>
                <th className="px-10 py-5 text-[10px] font-bold uppercase tracking-wider text-gray-400">Ref ID</th>
                <th className="px-10 py-5 text-[10px] font-bold uppercase tracking-wider text-gray-400">Customer Details</th>
                <th className="px-10 py-5 text-[10px] font-bold uppercase tracking-wider text-gray-400">Items</th>
                <th className="px-10 py-5 text-[10px] font-bold uppercase tracking-wider text-gray-400 text-right">Total Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {!orders?.length ? (
                <tr>
                   <td colSpan={5} className="px-10 py-32 text-center">
                      <div className="flex flex-col items-center gap-4">
                         <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300">
                            <Clock className="h-8 w-8" />
                         </div>
                         <p className="text-gray-400 font-medium italic">No transactions recorded for this date</p>
                      </div>
                   </td>
                </tr>
              ) : orders.map((order, i) => (
                <tr key={i} className="group hover:bg-gray-50 transition-colors">
                  <td className="px-10 py-6">
                    <span className="font-bold text-gray-500 text-xs">
                      {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </td>
                  <td className="px-10 py-6">
                    <span className="font-black text-gray-900 text-sm">#{order.tracking_id || order.id.slice(0,8).toUpperCase()}</span>
                  </td>
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-3">
                       <div className="h-9 w-9 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 font-bold text-[10px]">
                          {order.full_name?.[0] || 'C'}
                       </div>
                       <div>
                          <p className="font-bold text-sm text-gray-900">{order.full_name}</p>
                          <p className="text-[10px] text-gray-400 font-medium">{order.phone}</p>
                       </div>
                    </div>
                  </td>
                  <td className="px-10 py-6">
                     <div className="flex -space-x-3">
                        {order.order_items?.slice(0, 3).map((item: any, idx: number) => (
                           <div key={idx} className="h-10 w-10 rounded-full border-2 border-white overflow-hidden bg-gray-100 shadow-sm relative group/img">
                              <img src={item.products?.image_url || '/placeholder.jpg'} className="h-full w-full object-cover" />
                           </div>
                        ))}
                        {order.order_items?.length > 3 && (
                           <div className="h-10 w-10 rounded-full border-2 border-white bg-gray-900 text-white flex items-center justify-center text-[10px] font-bold shadow-sm">
                              +{order.order_items.length - 3}
                           </div>
                        )}
                     </div>
                  </td>
                  <td className="px-10 py-6 text-right">
                    <span className="font-black text-lg text-gray-900">{formatPrice(order.total_price)}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Print Summary (Visible on print) */}
        <div className="hidden print:block p-10 border-t-2 border-gray-900 mt-10">
           <div className="flex justify-between items-end">
              <div>
                 <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Processed By</p>
                 <div className="h-px w-48 bg-gray-900 mb-2" />
                 <p className="text-sm font-bold text-gray-900 uppercase tracking-widest">Administrator</p>
              </div>
              <div className="text-right space-y-2">
                 <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Total Daily Revenue</p>
                 <p className="text-3xl font-black text-gray-900">{formatPrice(dayTotal)}</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  )
}
