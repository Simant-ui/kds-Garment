import { createClient } from "@/lib/supabase/server"
import { formatPrice, cn } from "@/lib/utils"
import { ShoppingBag, Search, Eye, Clock, Truck, CheckCircle, Package, ArrowRight, ShieldCheck, Download, Filter, Trash2 } from "lucide-react"
import OrderStatusSwitcher from "./OrderStatusSwitcher"
import ViewOrderModal from "./ViewOrderModal"
import ExportButton from "@/components/admin/ExportButton"

export default async function AdminOrdersPage() {
  const supabase = await createClient()
  
  const { data: orders, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (
        *,
        products (*)
      )
    `)
    .order('created_at', { ascending: false })

  if (error) {
    return <div className="p-20 text-rose-500 font-bold uppercase tracking-widest bg-rose-50 rounded-2xl border border-rose-100">Failed to load orders: {error.message}</div>
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="text-sm text-gray-500 mt-1">Monitor and fulfill customer requests</p>
        </div>
        <div className="flex gap-4">
           <ExportButton 
             data={orders || []} 
             filename={`kds-orders-${new Date().toISOString().split('T')[0]}`} 
             label="Download" 
             variant="pdf"
           />
           <ExportButton 
             data={orders || []} 
             filename={`kds-orders-${new Date().toISOString().split('T')[0]}`} 
             label="Download" 
             variant="csv"
           />
        </div>
      </div>

      {/* Main Table Section */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by ID or customer..."
              className="w-full bg-gray-50 border-none rounded-xl pl-12 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
          <div className="flex gap-2">
             <button className="px-4 py-2 text-xs font-bold text-blue-600 bg-blue-50 rounded-lg">All Orders</button>
             <button className="px-4 py-2 text-xs font-bold text-gray-400 hover:text-gray-600 transition-all">Pending</button>
             <button className="px-4 py-2 text-xs font-bold text-gray-400 hover:text-gray-600 transition-all">Delivered</button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-8 py-5 text-[11px] font-bold uppercase tracking-wider text-gray-400">Order ID</th>
                <th className="px-8 py-5 text-[11px] font-bold uppercase tracking-wider text-gray-400">Customer</th>
                <th className="px-8 py-5 text-[11px] font-bold uppercase tracking-wider text-gray-400">Status</th>
                <th className="px-8 py-5 text-[11px] font-bold uppercase tracking-wider text-gray-400">Total</th>
                <th className="px-8 py-5 text-[11px] font-bold uppercase tracking-wider text-gray-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {!orders?.length ? (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center text-gray-400 italic">No orders found</td>
                </tr>
              ) : orders.map((order) => (
                <tr key={order.id} className="group hover:bg-gray-50 transition-colors">
                  <td className="px-8 py-5">
                    <span className="font-bold text-gray-900 text-sm">#{order.tracking_id || order.id.slice(0, 8).toUpperCase()}</span>
                    <p className="text-[10px] text-gray-400 font-medium mt-1 uppercase">{new Date(order.created_at).toLocaleDateString()}</p>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-gray-100 rounded-full overflow-hidden border border-gray-200 flex items-center justify-center text-gray-400 font-bold text-xs uppercase">
                        {order.full_name?.[0] || 'U'}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-sm text-gray-900">{order.full_name}</span>
                        <span className="text-[10px] text-gray-400 font-medium">{order.phone}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <OrderStatusSwitcher orderId={order.id} currentStatus={order.status} />
                  </td>
                  <td className="px-8 py-5 font-bold text-sm text-gray-900">
                    {formatPrice(order.total_price)}
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center justify-end gap-3">
                       <ViewOrderModal order={order} />
                       <button className="p-2.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all">
                         <Trash2 className="h-5 w-5" />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex justify-between items-center">
           <p className="text-xs text-gray-400 font-medium tracking-wide">TOTAL REVENUE: <span className="text-gray-900 font-bold">{formatPrice(orders?.reduce((acc, o) => acc + (o.total_price || 0), 0) || 0)}</span></p>
           <div className="flex gap-2">
              <button className="h-8 w-8 flex items-center justify-center rounded-lg bg-white border border-gray-200 text-gray-400 hover:border-blue-500 hover:text-blue-500 transition-all text-xs font-bold shadow-sm">1</button>
           </div>
        </div>
      </div>
    </div>
  )
}
