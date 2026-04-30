import { ShoppingCart, Plus } from "lucide-react"

export default function PurchaseReportPage() {
  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight uppercase">Purchase Analysis</h1>
          <p className="text-sm text-gray-500 mt-1 font-medium">Track your procurement, material costs, and inventory intake</p>
        </div>
        <button className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-blue-700 transition-all opacity-50 cursor-not-allowed">
           <Plus className="h-4 w-4" /> Add Purchase
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
             <thead>
                <tr className="bg-gray-50/50">
                   <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Date</th>
                   <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Purchase Order</th>
                   <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Supplier</th>
                   <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Total Amount</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-gray-50">
                <tr>
                  <td colSpan={4} className="px-8 py-32 text-center">
                     <div className="flex flex-col items-center gap-4 opacity-30">
                        <ShoppingCart className="h-16 w-16" />
                        <p className="text-sm font-bold uppercase tracking-[0.2em]">No Purchases Found</p>
                        <p className="text-xs text-gray-500 max-w-xs">The procurement tracking module requires initial data entry. Please add your first purchase order.</p>
                     </div>
                  </td>
                </tr>
             </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
