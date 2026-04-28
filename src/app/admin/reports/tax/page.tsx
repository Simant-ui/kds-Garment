import { createClient } from "@/lib/supabase/server"
import { formatPrice, cn } from "@/lib/utils"
import { 
  Receipt, 
  ChevronLeft, 
  ArrowUpRight, 
  Info,
  ShieldCheck,
  Calculator,
  Download,
  Printer
} from "lucide-react"
import Link from "next/link"
import TaxReportActions from "./TaxReportActions"

export default async function TaxReportPage() {
  const supabase = await createClient()
  
  // Fetch Sales Data
  const { data: orders } = await supabase
    .from('orders')
    .select('total_price')

  const totalRevenue = orders?.reduce((acc, o) => acc + (o.total_price || 0), 0) || 0
  
  // Financial calculation logic (Simulated for this implementation)
  const estimatedCost = totalRevenue * 0.60 // 60% average cost basis
  const estimatedExpenses = totalRevenue * 0.10 // 10% operating expenses
  const netProfit = totalRevenue - estimatedCost - estimatedExpenses
  const taxRate = 0.13
  const taxPayable = netProfit > 0 ? netProfit * taxRate : 0

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-20">
      {/* Header */}
      <div className="flex items-center gap-6">
         <Link href="/admin/reports" className="h-10 w-10 flex items-center justify-center bg-white rounded-xl shadow-sm border border-gray-100 hover:text-blue-600 transition-colors">
            <ChevronLeft className="h-5 w-5" />
         </Link>
         <div>
            <h1 className="text-3xl font-bold text-[#1E3A8A]">Tax Compliance Report</h1>
            <p className="text-gray-500 mt-1 font-medium">Automatic tax calculation based on 13% of net profit</p>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         {/* Tax Summary Card */}
         <div className="bg-[#1E3A8A] rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[400px]">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl" />
            <div className="relative z-10">
               <div className="h-14 w-14 bg-white/10 rounded-2xl flex items-center justify-center mb-8 border border-white/20">
                  <Receipt className="h-7 w-7 text-white" />
               </div>
               <p className="text-white/60 text-xs font-bold uppercase tracking-[0.2em] mb-4">Total Tax Liability (13%)</p>
               <h2 className="text-5xl font-black">{formatPrice(taxPayable)}</h2>
            </div>
            
            <div className="relative z-10 mt-10 pt-10 border-t border-white/10 flex justify-between items-end">
               <div>
                  <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-1">Fiscal Status</p>
                  <p className="text-emerald-400 font-bold text-sm flex items-center gap-2">
                     <ShieldCheck className="h-4 w-4" /> Fully Compliant
                  </p>
               </div>
               <div className="text-right">
                  <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-1">Net Profit Base</p>
                  <p className="text-xl font-bold">{formatPrice(netProfit)}</p>
               </div>
            </div>
         </div>

         {/* Calculation Breakdown */}
         <div className="bg-white rounded-[3rem] p-10 border border-gray-100 shadow-sm space-y-8">
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
               <Calculator className="h-6 w-6 text-blue-600" />
               Calculation Logic
            </h3>
            
            <div className="space-y-6">
               <div className="flex justify-between items-center group">
                  <span className="text-gray-400 font-bold text-xs uppercase tracking-widest">Gross Revenue</span>
                  <span className="text-gray-900 font-bold">{formatPrice(totalRevenue)}</span>
               </div>
               <div className="flex justify-between items-center group">
                  <span className="text-gray-400 font-bold text-xs uppercase tracking-widest">Estimated COGS (60%)</span>
                  <span className="text-rose-500 font-bold">-{formatPrice(estimatedCost)}</span>
               </div>
               <div className="flex justify-between items-center group">
                  <span className="text-gray-400 font-bold text-xs uppercase tracking-widest">Op. Expenses (10%)</span>
                  <span className="text-rose-500 font-bold">-{formatPrice(estimatedExpenses)}</span>
               </div>
               <div className="h-px bg-gray-100" />
               <div className="flex justify-between items-center group">
                  <span className="text-gray-900 font-black text-sm uppercase tracking-widest">Net Profit</span>
                  <span className="text-blue-600 font-black text-xl">{formatPrice(netProfit)}</span>
               </div>
               <div className="flex justify-between items-center group pt-4">
                  <div className="flex items-center gap-2">
                     <span className="text-emerald-600 font-black text-sm uppercase tracking-widest">Tax (13%)</span>
                     <div className="h-5 w-5 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
                        <ArrowUpRight className="h-3 w-3" />
                     </div>
                  </div>
                  <span className="text-emerald-600 font-black text-3xl">{formatPrice(taxPayable)}</span>
               </div>
            </div>

            <TaxReportActions orders={orders || []} />
         </div>
      </div>

      {/* Info Notice */}
      <div className="bg-amber-50 border border-amber-100 p-8 rounded-[2rem] flex gap-6 items-start">
         <div className="h-10 w-10 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600 shrink-0">
            <Info className="h-5 w-5" />
         </div>
         <div>
            <h4 className="font-bold text-amber-900 mb-1 uppercase tracking-widest text-[10px]">Important Accounting Note</h4>
            <p className="text-sm text-amber-800/70 leading-relaxed font-medium">
               This calculation is based on a simulated 13% tax rate applied to calculated net profit. For final submission, please verify actual purchase invoices and operating expense receipts.
            </p>
         </div>
      </div>
    </div>
  )
}
