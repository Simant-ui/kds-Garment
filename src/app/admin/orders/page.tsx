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
          <h1 className="text-2xl font-bold text-gray-900 uppercase tracking-tight">Enterprise Orders</h1>
          <p className="text-sm text-gray-500 mt-1">Monitor and fulfill global customer requests</p>
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
        <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4 bg-gray-50/30">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="SEARCH BY TRACKING ID OR NAME..."
              className="w-full bg-white border border-gray-200 rounded-xl pl-12 pr-4 py-2.5 text-xs font-bold focus:ring-2 focus:ring-[#002169] transition-all uppercase"
            />
          </div>
          <div className="flex gap-2">
             <button className="px-5 py-2 text-[10px] font-black text-white bg-[#002169] rounded-xl uppercase tracking-widest">Active Manifest</button>
             <button className="px-5 py-2 text-[10px] font-black text-gray-400 hover:text-[#002169] transition-all uppercase tracking-widest">Pending</button>
             <button className="px-5 py-2 text-[10px] font-black text-gray-400 hover:text-[#002169] transition-all uppercase tracking-widest">Processing</button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Order Manifest</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Customer Identity</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Current Status</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Financial Aggregate</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-gray-50">
              {!orders?.length ? (
                <tr>
                  <td colSpan={5} className="px-8 py-32 text-center">
                    <div className="flex flex-col items-center gap-4 opacity-20">
                       <ShoppingBag className="h-16 w-16" />
                       <p className="text-sm font-black uppercase tracking-[0.3em]">No Manifests Logged</p>
                    </div>
                  </td>
                </tr>
              ) : orders.map((order) => (
                <tr key={order.id} className="group hover:bg-blue-50/30 transition-all duration-500">
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                       <span className="font-black text-[#002169] text-sm uppercase tracking-tighter">#{order.tracking_id || order.id.slice(0, 8).toUpperCase()}</span>
                       <span className="text-[10px] text-gray-400 font-bold mt-1 uppercase tracking-widest">{new Date(order.created_at).toLocaleDateString()}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="h-11 w-11 bg-[#002169] text-[#FCB800] rounded-2xl border-2 border-white flex items-center justify-center font-black text-xs uppercase shadow-lg shadow-blue-900/10">
                        {(order.customer_name || order.full_name)?.[0] || 'U'}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-black text-sm text-gray-900 uppercase tracking-tight">{order.customer_name || order.full_name || 'Anonymous User'}</span>
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{order.customer_phone || order.phone || 'No Contact'}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <OrderStatusSwitcher orderId={order.id} currentStatus={order.status} />
                  </td>
                  <td className="px-8 py-6">
                    <span className="font-black text-sm text-gray-900">{formatPrice(order.total_amount || order.total_price)}</span>
                    <p className="text-[9px] font-black text-emerald-600 uppercase mt-0.5 tracking-widest">{order.payment_method === 'online' ? 'PAID ONLINE' : 'COD PENDING'}</p>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center justify-end gap-3">
                       <ViewOrderModal order={order} />
                       <button className="p-2.5 text-gray-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all border-2 border-transparent hover:border-rose-100">
                         <Trash2 className="h-5 w-5" />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-8 border-t-2 border-gray-50 bg-gray-50/30 flex justify-between items-center">
           <div className="space-y-1">
              <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]">Aggregate Fulfillment Value</p>
              <p className="text-xl font-black text-[#002169]">{formatPrice(orders?.reduce((acc, o) => acc + (o.total_amount || o.total_price || 0), 0) || 0)}</p>
           </div>
           <div className="flex gap-2">
              <button className="h-10 w-10 flex items-center justify-center rounded-xl bg-white border-2 border-gray-200 text-[#002169] hover:border-[#FCB800] hover:text-[#002169] transition-all text-xs font-black shadow-sm">1</button>
           </div>
        </div>
      </div>
    </div>
  )
}
