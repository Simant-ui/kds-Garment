import { createClient } from "@/lib/supabase/server"
import { formatPrice } from "@/lib/utils"
import { CreditCard, AlertCircle } from "lucide-react"

export default async function CreditReportPage() {
  const supabase = await createClient()
  
  const { data: orders } = await supabase
    .from('orders')
    .select('*')
    .eq('payment_method', 'credit')
    .order('created_at', { ascending: false })

  const totalCredit = orders?.reduce((acc, o) => acc + (o.total_price || o.total_amount || 0), 0) || 0

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight uppercase">Credit Log</h1>
          <p className="text-sm text-gray-500 mt-1 font-medium">Track customer credit sales and outstanding balances</p>
        </div>
      </div>

      <div className="bg-rose-50 border border-rose-100 p-6 rounded-3xl flex items-center gap-6">
         <div className="h-16 w-16 bg-white text-rose-600 rounded-2xl flex items-center justify-center shadow-sm">
            <AlertCircle className="h-8 w-8" />
         </div>
         <div>
            <p className="text-xs font-black text-rose-400 uppercase tracking-widest">Total Outstanding Credit</p>
            <p className="text-3xl font-bold text-rose-600 mt-1">{formatPrice(totalCredit)}</p>
         </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
             <thead>
                <tr className="bg-gray-50/50">
                   <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Date</th>
                   <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Invoice</th>
                   <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Customer</th>
                   <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Owed Amount</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-gray-50">
                {!orders?.length ? (
                  <tr>
                    <td colSpan={4} className="px-8 py-20 text-center text-gray-400 font-bold uppercase">No credit sales logged.</td>
                  </tr>
                ) : orders.map((o) => (
                  <tr key={o.id} className="hover:bg-gray-50 transition-all">
                     <td className="px-8 py-5 text-sm font-bold text-gray-500">{new Date(o.created_at).toLocaleDateString()}</td>
                     <td className="px-8 py-5 text-sm font-black text-gray-900">#{o.tracking_id || o.id.slice(0,8)}</td>
                     <td className="px-8 py-5">
                        <p className="font-bold text-gray-900 text-sm">{o.customer_name || o.full_name || 'Walk-in'}</p>
                        <p className="text-[10px] text-gray-500 font-bold">{o.phone}</p>
                     </td>
                     <td className="px-8 py-5 text-right font-black text-rose-600">
                        {formatPrice(o.total_price || o.total_amount)}
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
