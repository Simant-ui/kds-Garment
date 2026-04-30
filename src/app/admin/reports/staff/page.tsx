"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { formatPrice, cn } from "@/lib/utils"
import { 
  Users, 
  TrendingUp, 
  ChevronRight, 
  ShoppingBag, 
  User, 
  ArrowLeft,
  Calendar,
  DollarSign,
  Package
} from "lucide-react"
import Link from "next/link"

export default function StaffReportPage() {
  const [staff, setStaff] = useState<any[]>([])
  const [orders, setOrders] = useState<any[]>([])
  const [selectedStaff, setSelectedStaff] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const supabase = createClient()

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      const { data: staffData } = await supabase.from('staff').select('*')
      const { data: orderData } = await supabase.from('orders').select('*, order_items(*, products(*))')
      
      setStaff(staffData || [])
      setOrders(orderData || [])
      setLoading(false)
    }
    fetchData()
  }, [])

  // Calculate sales per staff
  // Note: We use 'processed_by' if it exists, otherwise we look for matches in the orders data.
  // For now, we will group by 'processed_by' field in orders.
  const getStaffSales = (staffEmail: string, staffName: string) => {
    return orders.filter(order => 
      order.processed_by === staffName || 
      order.processed_by === staffEmail ||
      (order.processed_by === "Admin" && (staffName === "Admin" || staffEmail === "admin@kdsgarment.com"))
    )
  }

  const staffStats = staff.map(s => {
    const staffOrders = getStaffSales(s.email, s.full_name || `${s.first_name} ${s.last_name}`)
    const totalSales = staffOrders.reduce((acc, order) => acc + (order.total_price || 0), 0)
    return {
      ...s,
      orderCount: staffOrders.length,
      totalSales
    }
  })

  if (loading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
           <Link href="/admin/reports" className="h-10 w-10 bg-white rounded-xl flex items-center justify-center text-gray-400 hover:text-blue-600 shadow-sm border border-gray-100 transition-all">
              <ArrowLeft className="h-5 w-5" />
           </Link>
           <div>
              <h1 className="text-2xl font-bold text-gray-900 uppercase">Staff Performance Report</h1>
              <p className="text-sm text-gray-500 font-medium italic">Tracking sales and productivity across your team</p>
           </div>
        </div>
        <div className="bg-[#002169] px-6 py-3 rounded-2xl shadow-lg flex items-center gap-3 text-white">
           <Users className="h-5 w-5 text-[#FCB800]" />
           <span className="text-sm font-black uppercase tracking-widest">{staff.length} TOTAL STAFF</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Staff Selection List */}
        <div className="lg:col-span-4 space-y-4">
           <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-50 bg-gray-50/30">
                 <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Select Personnel</h3>
              </div>
              <div className="divide-y divide-gray-50 max-h-[600px] overflow-y-auto custom-scrollbar">
                 {staffStats.map((s) => (
                   <button 
                     key={s.id}
                     onClick={() => setSelectedStaff(s)}
                     className={cn(
                       "w-full p-6 text-left transition-all flex items-center justify-between group",
                       selectedStaff?.id === s.id ? "bg-blue-50" : "hover:bg-gray-50"
                     )}
                   >
                      <div className="flex items-center gap-4">
                         <div className={cn(
                           "h-12 w-12 rounded-xl flex items-center justify-center font-bold text-white shadow-lg",
                           selectedStaff?.id === s.id ? "bg-blue-600" : "bg-gray-200 group-hover:bg-blue-500 transition-colors"
                         )}>
                            {s.first_name?.[0] || s.full_name?.[0]}
                         </div>
                         <div>
                            <h4 className="text-sm font-bold text-gray-900">{s.first_name} {s.last_name}</h4>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{s.role}</p>
                         </div>
                      </div>
                      <ChevronRight className={cn(
                        "h-4 w-4 transition-all",
                        selectedStaff?.id === s.id ? "text-blue-600 translate-x-1" : "text-gray-300"
                      )} />
                   </button>
                 ))}
              </div>
           </div>
        </div>

        {/* Staff Sales Details */}
        <div className="lg:col-span-8">
           {selectedStaff ? (
             <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 space-y-2">
                      <div className="h-10 w-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                         <TrendingUp className="h-5 w-5" />
                      </div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Total Sales</p>
                      <p className="text-2xl font-black text-gray-900">{formatPrice(selectedStaff.totalSales)}</p>
                   </div>
                   <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 space-y-2">
                      <div className="h-10 w-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
                         <ShoppingBag className="h-5 w-5" />
                      </div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Orders Processed</p>
                      <p className="text-2xl font-black text-gray-900">{selectedStaff.orderCount}</p>
                   </div>
                   <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 space-y-2">
                      <div className="h-10 w-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                         <DollarSign className="h-5 w-5" />
                      </div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Avg. Order Value</p>
                      <p className="text-2xl font-black text-gray-900">
                        {formatPrice(selectedStaff.orderCount > 0 ? selectedStaff.totalSales / selectedStaff.orderCount : 0)}
                      </p>
                   </div>
                </div>

                {/* Sales Breakdown Table */}
                <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
                   <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
                      <h3 className="text-lg font-bold text-gray-900 uppercase tracking-tight">Recent Sales History</h3>
                      <button className="text-xs font-black text-blue-600 uppercase tracking-widest hover:underline">View All Activities</button>
                   </div>
                   <div className="overflow-x-auto">
                      <table className="w-full text-left">
                         <thead className="bg-gray-50/30">
                            <tr>
                               <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Order Info</th>
                               <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Customer</th>
                               <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Items</th>
                               <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Revenue</th>
                            </tr>
                         </thead>
                         <tbody className="divide-y divide-gray-50">
                            {getStaffSales(selectedStaff.email, selectedStaff.full_name || `${selectedStaff.first_name} ${selectedStaff.last_name}`).map((order) => (
                              <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                                 <td className="px-8 py-6">
                                    <span className="text-sm font-bold text-gray-900 block">#{order.tracking_id || order.id.slice(0, 8).toUpperCase()}</span>
                                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1 mt-1">
                                       <Calendar className="h-3 w-3" /> {new Date(order.created_at).toLocaleDateString()}
                                    </span>
                                 </td>
                                 <td className="px-8 py-6">
                                    <span className="text-sm font-bold text-gray-700">{order.full_name || 'Walk-in'}</span>
                                 </td>
                                 <td className="px-8 py-6">
                                    <div className="flex flex-wrap gap-2">
                                       {order.order_items?.slice(0, 2).map((item: any, i: number) => (
                                         <span key={i} className="text-[9px] font-black bg-gray-100 text-gray-600 px-2 py-1 rounded uppercase tracking-widest">
                                            {item.products?.name?.slice(0, 10)}... x{item.quantity}
                                         </span>
                                       ))}
                                       {order.order_items?.length > 2 && <span className="text-[9px] font-black text-gray-400">+{order.order_items.length - 2} more</span>}
                                    </div>
                                 </td>
                                 <td className="px-8 py-6 text-right">
                                    <span className="text-sm font-black text-gray-900">{formatPrice(order.total_price)}</span>
                                 </td>
                              </tr>
                            ))}
                            {getStaffSales(selectedStaff.email, selectedStaff.full_name || `${selectedStaff.first_name} ${selectedStaff.last_name}`).length === 0 && (
                              <tr>
                                 <td colSpan={4} className="px-8 py-20 text-center">
                                    <div className="h-16 w-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-gray-200">
                                       <Package className="h-8 w-8" />
                                    </div>
                                    <p className="text-sm font-bold text-gray-400 italic">No sales recorded for this staff member yet.</p>
                                 </td>
                              </tr>
                            )}
                         </tbody>
                      </table>
                   </div>
                </div>
             </div>
           ) : (
             <div className="h-full flex flex-col items-center justify-center p-20 text-center space-y-6 bg-white rounded-[3rem] border-2 border-dashed border-gray-100">
                <div className="h-24 w-24 bg-blue-50 text-blue-600 rounded-[2.5rem] flex items-center justify-center shadow-inner">
                   <User className="h-12 w-12" />
                </div>
                <div className="space-y-2">
                   <h3 className="text-xl font-bold text-gray-900 uppercase tracking-tight">No Personnel Selected</h3>
                   <p className="text-sm font-medium text-gray-400 max-w-xs mx-auto">Please select a staff member from the left panel to view their detailed performance analytics and sales history.</p>
                </div>
             </div>
           )}
        </div>
      </div>
    </div>
  )
}
