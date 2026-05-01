import { createClient } from "@/lib/supabase/server"
import { formatPrice } from "@/lib/utils"
import { UserCircle, ShoppingBag } from "lucide-react"

export default async function CustomerReportPage() {
  const supabase = await createClient()
  
  const { data: orders } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })

  // Aggregate customers
  const customerMap = new Map()
  orders?.forEach(o => {
    const name = o.customer_name || o.full_name || 'Walk-in Customer'
    const phone = o.phone || o.customer_phone || 'No Phone'
    const key = `${name}-${phone}`
    
    if (!customerMap.has(key)) {
      customerMap.set(key, { name, phone, ordersCount: 0, totalSpent: 0, lastOrder: o.created_at })
    }
    const c = customerMap.get(key)
    c.ordersCount += 1
    c.totalSpent += (o.total_price || o.total_amount || 0)
    customerMap.set(key, c)
  })

  const customers = Array.from(customerMap.values()).sort((a, b) => b.totalSpent - a.totalSpent)

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight uppercase">Customer Insights</h1>
          <p className="text-sm text-gray-500 mt-1 font-medium">Customer purchase history and loyalty ranking</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
             <thead>
                <tr className="bg-gray-50/50">
                   <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Customer</th>
                   <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Purchases</th>
                   <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Lifetime Value</th>
                   <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Last Active</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-gray-50">
                {!customers.length ? (
                  <tr>
                    <td colSpan={4} className="px-8 py-20 text-center text-gray-400 font-bold uppercase">No customers found.</td>
                  </tr>
                ) : customers.map((c, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition-all">
                     <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                           <div className="h-10 w-10 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center font-black">
                              {c.name[0]}
                           </div>
                           <div>
                              <p className="font-bold text-gray-900 text-sm">{c.name}</p>
                              <p className="text-[10px] text-gray-500 font-bold">{c.phone}</p>
                           </div>
                        </div>
                     </td>
                     <td className="px-8 py-5 text-center font-bold text-gray-600">
                        {c.ordersCount} Orders
                     </td>
                     <td className="px-8 py-5 text-right font-black text-[#1E3A8A]">
                        {formatPrice(c.totalSpent)}
                     </td>
                     <td className="px-8 py-5 text-right text-xs font-bold text-gray-500">
                        {new Date(c.lastOrder).toLocaleDateString()}
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
