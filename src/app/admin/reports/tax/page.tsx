import { createClient } from "@/lib/supabase/server"
import { formatPrice } from "@/lib/utils"
import { Receipt, Percent, Landmark } from "lucide-react"

export default async function TaxReportPage() {
  const supabase = await createClient()
  
  const { data: orders } = await supabase.from('orders').select('*')

  const totalSales = orders?.reduce((acc, o) => acc + (o.total_price || o.total_amount || 0), 0) || 0
  
  // Tax calculation (13% VAT)
  const taxAmount = totalSales * 0.13
  
  // Estimated Cost of Goods Sold (Mocked to 60% of sales for demonstration until Purchase module is built)
  const estimatedCOGS = totalSales * 0.60
  
  // Net Profit = Total Sales - COGS - Tax
  const netProfit = totalSales - estimatedCOGS - taxAmount

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight uppercase">Tax & Net Profit Analysis</h1>
          <p className="text-sm text-gray-500 mt-1 font-medium">VAT calculation and estimated net profitability</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Gross Sales</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">{formatPrice(totalSales)}</p>
         </div>
         <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Est. Cost (COGS)</p>
            <p className="text-2xl font-bold text-orange-600 mt-2">-{formatPrice(estimatedCOGS)}</p>
         </div>
         <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-2">
               <Percent className="h-4 w-4 text-blue-500" />
               <p className="text-xs font-black text-blue-500 uppercase tracking-widest">Tax (13% VAT)</p>
            </div>
            <p className="text-2xl font-bold text-rose-600">-{formatPrice(taxAmount)}</p>
         </div>
         <div className="bg-[#1E3A8A] text-white p-6 rounded-3xl shadow-sm border border-blue-900">
            <p className="text-xs font-black text-white/60 uppercase tracking-widest">Net Profit</p>
            <p className="text-2xl font-bold mt-2 text-emerald-400">{formatPrice(netProfit)}</p>
         </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-10 text-center">
         <Landmark className="h-16 w-16 text-gray-200 mx-auto mb-4" />
         <h3 className="text-lg font-bold text-gray-900">Tax Compliance Mode</h3>
         <p className="text-sm text-gray-500 max-w-md mx-auto mt-2">
           The current tax is automatically calculated as 13% of all gross sales recorded in the POS system. 
           Net profit estimates will become more accurate once the Purchase and Supplier tracking modules are fully populated with exact costs.
         </p>
      </div>
    </div>
  )
}
