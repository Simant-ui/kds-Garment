import { createClient } from "@/lib/supabase/server"
import { formatPrice, cn } from "@/lib/utils"
import { 
  FileText, 
  Calendar as CalendarIcon, 
  TrendingUp, 
  Search,
  Filter,
  Users,
  Download,
  Printer,
  ChevronLeft,
  ShoppingBag,
  ArrowRight
} from "lucide-react"
import Link from "next/link"
import { PrintButton, SalesFilter } from "@/components/admin/ReportActions"

export default async function SalesBookPage({
  searchParams,
}: {
  searchParams: Promise<{ start?: string; end?: string; customer?: string }>
}) {
  const params = await searchParams
  const startDate = params.start ? new Date(params.start) : new Date(new Date().setDate(new Date().getDate() - 30))
  const endDate = params.end ? new Date(params.end) : new Date()

  const supabase = await createClient()
  
  let query = supabase
    .from('orders')
    .select('*, order_items(*, products(*))')
    .gte('created_at', startDate.toISOString().split('T')[0] + 'T00:00:00Z')
    .lte('created_at', endDate.toISOString().split('T')[0] + 'T23:59:59Z')
    .order('created_at', { ascending: false })

  if (params.customer) {
    query = query.ilike('full_name', `%${params.customer}%`)
  }

  const { data: orders } = await query

  const totalRevenue = orders?.reduce((acc, o) => acc + (o.total_price || 0), 0) || 0
  const uniqueCustomers = new Set(orders?.map(o => o.phone)).size

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 print:hidden">
        <div className="flex items-center gap-6">
           <Link href="/admin/reports" className="h-10 w-10 flex items-center justify-center bg-white rounded-xl shadow-sm border border-gray-100 hover:text-blue-600 transition-colors">
              <ChevronLeft className="h-5 w-5" />
           </Link>
           <div>
              <h1 className="text-3xl font-bold text-[#1E3A8A]">Sales Book</h1>
              <p className="text-gray-500 mt-1 font-medium">Consolidated sales register and customer transaction history</p>
           </div>
        </div>
        <div className="flex items-center gap-3">
           <button className="h-11 px-4 flex items-center gap-2 bg-white text-gray-700 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all font-bold text-xs">
              <Download className="h-4 w-4" /> Export CSV
           </button>
           <PrintButton 
             label="Print Register" 
             className="h-11 px-4 flex items-center gap-2 bg-[#1E3A8A] text-white rounded-xl shadow-lg hover:shadow-xl transition-all font-bold text-xs" 
           />
        </div>
      </div>

      {/* Advanced Filter Bar */}
      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col lg:flex-row items-end gap-6 print:hidden">
         <SalesFilter 
            start={startDate.toISOString().split('T')[0]} 
            end={endDate.toISOString().split('T')[0]} 
            baseUrl="/admin/reports/sales" 
         />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex items-center gap-6">
            <div className="h-16 w-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
               <TrendingUp className="h-8 w-8" />
            </div>
            <div>
               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Sales</p>
               <p className="text-2xl font-black text-gray-900">{formatPrice(totalRevenue)}</p>
            </div>
         </div>
         <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex items-center gap-6">
            <div className="h-16 w-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
               <Users className="h-8 w-8" />
            </div>
            <div>
               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Unique Customers</p>
               <p className="text-2xl font-black text-gray-900">{uniqueCustomers} Pax</p>
            </div>
         </div>
         <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex items-center gap-6">
            <div className="h-16 w-16 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600">
               <ShoppingBag className="h-8 w-8" />
            </div>
            <div>
               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Orders Count</p>
               <p className="text-2xl font-black text-gray-900">{orders?.length || 0} Records</p>
            </div>
         </div>
      </div>

      {/* Sales Table */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-10 py-6 text-[10px] font-bold uppercase tracking-wider text-gray-400">Date</th>
                <th className="px-10 py-6 text-[10px] font-bold uppercase tracking-wider text-gray-400">Customer</th>
                <th className="px-10 py-6 text-[10px] font-bold uppercase tracking-wider text-gray-400">Invoice</th>
                <th className="px-10 py-6 text-[10px] font-bold uppercase tracking-wider text-gray-400">Items</th>
                <th className="px-10 py-6 text-[10px] font-bold uppercase tracking-wider text-gray-400 text-right">Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders?.map((order, i) => (
                <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-10 py-6">
                    <div className="flex flex-col">
                       <span className="font-bold text-gray-900 text-sm">{new Date(order.created_at).toLocaleDateString()}</span>
                       <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">{new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-4">
                       <div className="h-10 w-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 font-bold text-xs">
                          {order.full_name?.[0]}
                       </div>
                       <div>
                          <p className="font-bold text-sm text-gray-900">{order.full_name}</p>
                          <p className="text-[10px] text-gray-400 font-medium">{order.phone}</p>
                       </div>
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase tracking-widest">
                       #{order.tracking_id || order.id.slice(0,8).toUpperCase()}
                    </span>
                  </td>
                  <td className="px-10 py-6">
                    <span className="font-bold text-gray-600 text-xs">{order.order_items?.length} items</span>
                  </td>
                  <td className="px-10 py-6 text-right font-black text-gray-900 text-lg">
                    {formatPrice(order.total_price)}
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
