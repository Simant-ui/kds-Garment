import { createClient } from "@/lib/supabase/server"
import { formatPrice } from "@/lib/utils"
import { Users, TrendingUp, Medal, Calendar } from "lucide-react"

export default async function StaffReportPage() {
  const supabase = await createClient()
  
  const { data: staff } = await supabase.from('staff').select('*')
  const { data: orders } = await supabase.from('orders').select('*')

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1)

  const staffSales = staff?.map(s => {
    // We match by staff_id if it exists. If they don't have the column yet, this array will be empty for that staff.
    // If you haven't created the 'staff_id' column in 'orders', this will just return 0.
    const sOrders = orders?.filter(o => o.staff_id === s.id) || []
    
    let totalSales = 0
    let dailySales = 0
    let monthlySales = 0

    sOrders.forEach(o => {
      const amt = o.total_price || o.total_amount || 0
      totalSales += amt

      const orderDate = new Date(o.created_at)
      if (orderDate >= today) {
        dailySales += amt
      }
      if (orderDate >= thisMonth) {
        monthlySales += amt
      }
    })

    return { 
      ...s, 
      totalSales, 
      dailySales, 
      monthlySales, 
      ordersCount: sOrders.length 
    }
  }).sort((a, b) => b.totalSales - a.totalSales) || []

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight uppercase">Staff Performance</h1>
          <p className="text-sm text-gray-500 mt-1 font-medium">Daily and monthly sales tracking per employee</p>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-100 bg-gray-50/50 flex items-center gap-4">
           <div className="h-12 w-12 bg-blue-100 text-blue-600 flex items-center justify-center rounded-2xl">
              <TrendingUp className="h-6 w-6" />
           </div>
           <div>
              <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">Sales Leaderboard</h3>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Ranked by Total Revenue</p>
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
             <thead>
                <tr className="bg-gray-50/50">
                   <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Rank</th>
                   <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Staff Member</th>
                   <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Orders Handled</th>
                   <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right text-blue-600">Daily Sales</th>
                   <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right text-indigo-600">Monthly Sales</th>
                   <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right text-emerald-600">Lifetime Sales</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-gray-50">
                {!staffSales.length ? (
                  <tr>
                    <td colSpan={6} className="px-8 py-20 text-center text-gray-400">
                      <div className="flex flex-col items-center gap-4">
                        <Users className="h-10 w-10 opacity-20" />
                        <p className="font-bold">No staff records found.</p>
                      </div>
                    </td>
                  </tr>
                ) : staffSales.map((s, index) => (
                  <tr key={s.id} className="hover:bg-gray-50 transition-all group">
                     <td className="px-8 py-6">
                        {index === 0 ? (
                           <div className="h-10 w-10 bg-amber-100 text-amber-500 flex items-center justify-center rounded-2xl">
                              <Medal className="h-5 w-5" />
                           </div>
                        ) : (
                           <span className="font-black text-gray-400">#{index + 1}</span>
                        )}
                     </td>
                     <td className="px-8 py-6">
                        <p className="font-black text-gray-900 text-sm">{s.full_name}</p>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">{s.role}</p>
                     </td>
                     <td className="px-8 py-6 text-center font-bold text-gray-600">{s.ordersCount}</td>
                     <td className="px-8 py-6 text-right font-black text-blue-600">{formatPrice(s.dailySales)}</td>
                     <td className="px-8 py-6 text-right font-black text-indigo-600">{formatPrice(s.monthlySales)}</td>
                     <td className="px-8 py-6 text-right font-black text-emerald-600">{formatPrice(s.totalSales)}</td>
                  </tr>
                ))}
             </tbody>
          </table>
        </div>
      </div>
      
      <div className="bg-blue-50 text-blue-800 p-6 rounded-2xl text-sm font-bold border border-blue-100 flex items-center gap-4">
        <Users className="h-6 w-6 text-blue-600" />
        <p>
          Note: For sales to be accurately attributed to staff, ensure the <span className="bg-blue-100 px-2 py-0.5 rounded">staff_id</span> column exists in the <span className="bg-blue-100 px-2 py-0.5 rounded">orders</span> table and your POS is submitting it.
        </p>
      </div>
    </div>
  )
}
