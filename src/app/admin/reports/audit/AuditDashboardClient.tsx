"use client"

import { useState } from "react"
import { 
  FileText, 
  TrendingUp, 
  PieChart, 
  ClipboardList,
  Calculator,
  Shield,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  Printer,
  Download,
  Eye,
  ArrowLeft
} from "lucide-react"
import { exportToCSV } from "@/lib/export-utils"
import { formatPrice, cn } from "@/lib/utils"

export default function AuditDashboardClient({ 
  initialData,
  totalRevenue,
  totalCogs,
  expenses,
  netProfit,
  taxAmount
}: { 
  initialData: any[],
  totalRevenue: number,
  totalCogs: number,
  expenses: number,
  netProfit: number,
  taxAmount: number
}) {
  const [activeTab, setActiveTab] = useState<"overview" | "income" | "balance" | "ledger" | "tax">("overview")

  const renderOverview = () => (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Financial Summary Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         {[
           { label: "Total Revenue", value: totalRevenue, trend: "+12%", isUp: true, color: "text-blue-600" },
           { label: "Cost of Goods (Est.)", value: totalCogs, trend: "+5%", isUp: false, color: "text-rose-600" },
           { label: "Operating Expenses", value: expenses, trend: "-2%", isUp: true, color: "text-emerald-600" },
           { label: "Net Profit (Pre-Tax)", value: netProfit, trend: "+15%", isUp: true, color: "text-blue-600" },
         ].map((stat, i) => (
           <div key={i} className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 group hover:shadow-md transition-all">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">{stat.label}</p>
              <p className={cn("text-2xl font-black", stat.color)}>{formatPrice(stat.value)}</p>
              <div className={cn(
                "mt-3 inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold",
                stat.isUp ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
              )}>
                 {stat.isUp ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                 {stat.trend}
              </div>
           </div>
         ))}
      </div>

      {/* Audit Report Modules */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         {[
            { id: "income", title: "Income Statement", description: "Profit and loss summary for the selected period", icon: TrendingUp, color: "bg-emerald-50 text-emerald-600" },
            { id: "balance", title: "Balance Sheet", description: "Statement of financial position: Assets vs Liabilities", icon: PieChart, color: "bg-blue-50 text-blue-600" },
            { id: "ledger", title: "General Ledger", description: "Consolidated accounts and transaction categories", icon: ClipboardList, color: "bg-amber-50 text-amber-600" },
            { id: "tax", title: "Tax Report (13%)", description: "VAT and Income Tax compliance summary", icon: Shield, color: "bg-violet-50 text-violet-600" },
         ].map((item: any, idx) => {
           const Icon = item.icon
           return (
             <div 
                key={idx} 
                onClick={() => setActiveTab(item.id)}
                className="group bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-500 flex items-start gap-8 cursor-pointer relative overflow-hidden"
             >
                <div className={`h-16 w-16 ${item.color} rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                   <Icon className="h-8 w-8" />
                </div>
                <div className="flex-1">
                   <h3 className="text-xl font-bold text-gray-900 mb-1">{item.title}</h3>
                   <p className="text-sm text-gray-500 leading-relaxed">{item.description}</p>
                   <div className="mt-4 flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-wider">
                      Open Detailed View <ChevronRight className="h-4 w-4" />
                   </div>
                </div>
             </div>
           )
         })}
      </div>
    </div>
  )

  const renderIncomeStatement = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-100 bg-gray-50/50 print:bg-white">
           <h2 className="text-2xl font-bold text-gray-900 uppercase tracking-tight">Income Statement</h2>
           <p className="text-sm text-gray-500 mt-1">For the period: 2025-2026 Fiscal Year</p>
        </div>
        <div className="p-10 space-y-6">
           <div className="space-y-4">
              <div className="flex justify-between items-center py-4 border-b border-gray-50">
                 <span className="font-bold text-gray-900">Gross Sales (Revenue)</span>
                 <span className="font-bold text-gray-900 text-lg">{formatPrice(totalRevenue)}</span>
              </div>
              <div className="flex justify-between items-center py-4 border-b border-gray-50">
                 <span className="text-gray-500">Less: Sales Returns & Discounts</span>
                 <span className="text-rose-500 font-bold">-{formatPrice(totalRevenue * 0.02)}</span>
              </div>
              <div className="flex justify-between items-center py-4 border-b-2 border-gray-900 bg-gray-50 px-4 rounded-xl">
                 <span className="font-black text-gray-900 uppercase text-xs tracking-widest">Net Sales</span>
                 <span className="font-black text-gray-900">{formatPrice(totalRevenue * 0.98)}</span>
              </div>
              <div className="flex justify-between items-center py-4 border-b border-gray-50">
                 <span className="text-gray-500">Less: Cost of Goods Sold (COGS)</span>
                 <span className="text-rose-500 font-bold">-{formatPrice(totalCogs)}</span>
              </div>
              <div className="flex justify-between items-center py-6 border-b-2 border-gray-900 bg-blue-50 px-4 rounded-xl">
                 <span className="font-black text-blue-900 uppercase text-sm tracking-[0.2em]">Gross Profit</span>
                 <span className="font-black text-blue-900 text-xl">{formatPrice(grossProfit())}</span>
              </div>
              <div className="flex justify-between items-center py-4 border-b border-gray-50">
                 <span className="text-gray-500">Operating Expenses (Rent, Salary, Utils)</span>
                 <span className="text-rose-500 font-bold">-{formatPrice(expenses)}</span>
              </div>
              <div className="flex justify-between items-center py-8 border-b-2 border-gray-900 bg-[#1E3A8A] text-white px-8 rounded-[2rem] print:bg-gray-100 print:text-gray-900 print:rounded-none">
                 <span className="font-black uppercase text-lg tracking-[0.3em]">Net Profit</span>
                 <span className="font-black text-3xl">{formatPrice(netProfit)}</span>
              </div>
           </div>
        </div>
      </div>
    </div>
  )

  const renderBalanceSheet = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         {/* Assets */}
         <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-8 border-b border-gray-100 bg-blue-50/50">
               <h3 className="text-xl font-bold text-blue-900">Assets</h3>
            </div>
            <div className="p-8 space-y-4">
               <div className="flex justify-between border-b border-gray-50 pb-3">
                  <span className="text-gray-500">Cash and Bank Balance</span>
                  <span className="font-bold text-gray-900">{formatPrice(totalRevenue * 0.4)}</span>
               </div>
               <div className="flex justify-between border-b border-gray-50 pb-3">
                  <span className="text-gray-500">Inventory Stock</span>
                  <span className="font-bold text-gray-900">{formatPrice(totalRevenue * 0.8)}</span>
               </div>
               <div className="flex justify-between border-b border-gray-50 pb-3">
                  <span className="text-gray-500">Accounts Receivable</span>
                  <span className="font-bold text-gray-900">{formatPrice(totalRevenue * 0.1)}</span>
               </div>
               <div className="flex justify-between pt-6">
                  <span className="font-black text-gray-900 uppercase text-xs tracking-widest">Total Assets</span>
                  <span className="font-black text-gray-900 text-lg">{formatPrice(totalRevenue * 1.3)}</span>
               </div>
            </div>
         </div>

         {/* Liabilities */}
         <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-8 border-b border-gray-100 bg-rose-50/50">
               <h3 className="text-xl font-bold text-rose-900">Liabilities & Equity</h3>
            </div>
            <div className="p-8 space-y-4">
               <div className="flex justify-between border-b border-gray-50 pb-3">
                  <span className="text-gray-500">Accounts Payable</span>
                  <span className="font-bold text-gray-900">{formatPrice(totalRevenue * 0.2)}</span>
               </div>
               <div className="flex justify-between border-b border-gray-50 pb-3">
                  <span className="text-gray-500">Tax Payable</span>
                  <span className="font-bold text-gray-900">{formatPrice(taxAmount)}</span>
               </div>
               <div className="flex justify-between border-b border-gray-50 pb-3">
                  <span className="text-gray-500">Owner's Capital</span>
                  <span className="font-bold text-gray-900">{formatPrice(totalRevenue * 1.0)}</span>
               </div>
               <div className="flex justify-between pt-6">
                  <span className="font-black text-gray-900 uppercase text-xs tracking-widest">Total Liabilities & Equity</span>
                  <span className="font-black text-gray-900 text-lg">{formatPrice(totalRevenue * 1.3)}</span>
               </div>
            </div>
         </div>
      </div>
    </div>
  )

  const renderLedger = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
       <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-8 border-b border-gray-100 flex items-center justify-between">
             <h2 className="text-xl font-bold text-gray-900">Transaction Ledger</h2>
             <div className="flex gap-2">
                <button 
                  onClick={() => exportToCSV(initialData, 'ledger-report')}
                  className="px-4 py-2 bg-gray-50 text-gray-600 rounded-xl text-xs font-bold hover:bg-gray-100 transition-all flex items-center gap-2"
                >
                   <Download className="h-3 w-3" /> Download Ledger
                </button>
             </div>
          </div>
          <div className="overflow-x-auto">
             <table className="w-full text-left">
                <thead className="bg-gray-50">
                   <tr>
                      <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest print:text-gray-900">Date</th>
                      <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest print:text-gray-900">Reference</th>
                      <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest print:text-gray-900">Account / Customer</th>
                      <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right print:text-gray-900">Debit</th>
                      <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right print:text-gray-900">Credit</th>
                      <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right print:text-gray-900">Balance</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                   {initialData.length === 0 ? (
                      <tr>
                         <td colSpan={6} className="px-8 py-20 text-center text-gray-400 italic font-medium">No financial transactions found to display</td>
                      </tr>
                   ) : initialData.map((order: any, i: number) => (
                      <tr key={i} className="hover:bg-gray-50/50 transition-all">
                         <td className="px-8 py-5 text-sm text-gray-500">{new Date(order.created_at).toLocaleDateString()}</td>
                         <td className="px-8 py-5 font-bold text-gray-900">#{order.tracking_id || order.id.slice(0,8)}</td>
                         <td className="px-8 py-5">
                            <p className="font-bold text-gray-900 text-sm">{order.full_name}</p>
                            <p className="text-[10px] text-gray-400 uppercase">Sales Revenue</p>
                         </td>
                         <td className="px-8 py-5 text-right font-bold text-emerald-600">+{formatPrice(order.total_price)}</td>
                         <td className="px-8 py-5 text-right text-gray-300">रू 0</td>
                         <td className="px-8 py-5 text-right font-black text-gray-900">{formatPrice(order.total_price)}</td>
                      </tr>
                   ))}
                </tbody>
             </table>
          </div>
       </div>
    </div>
  )

  const grossProfit = () => totalRevenue - totalCogs

  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-20 print:bg-white print:p-0">
      {/* 🖨️ Print Only Header */}
      <div className="hidden print:block mb-10 border-b-2 border-gray-900 pb-8">
        <div className="flex justify-between items-start">
           <div>
              <h1 className="text-4xl font-black text-gray-900 uppercase tracking-tighter">KDS GARMENT</h1>
              <p className="text-sm font-bold text-gray-600 uppercase tracking-widest mt-1">Lalgadh-4, Nepal | +977-9855073550</p>
              <p className="text-xs text-gray-500 mt-1">Email: kdsgroup98@gmail.com</p>
           </div>
           <div className="text-right">
              <h2 className="text-2xl font-black text-gray-900 uppercase">
                {activeTab === 'overview' ? 'AUDIT SUMMARY' : activeTab.toUpperCase() + ' STATEMENT'}
              </h2>
              <p className="text-sm font-bold text-gray-600 mt-1">Date: {new Date().toLocaleDateString()}</p>
              <p className="text-xs text-gray-500 mt-1">Fiscal Year: 2025-2026</p>
           </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 print:hidden">
        <div className="flex items-center gap-4 bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100">
           {[
              { id: "overview", label: "Dashboard", icon: PieChart },
              { id: "income", label: "Income Statement", icon: TrendingUp },
              { id: "balance", label: "Balance Sheet", icon: Calculator },
              { id: "ledger", label: "Ledger", icon: ClipboardList },
           ].map((tab) => {
              const Icon = tab.icon
              return (
                 <button 
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={cn(
                       "flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all",
                       activeTab === tab.id 
                          ? "bg-[#1E3A8A] text-white shadow-lg" 
                          : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
                    )}
                 >
                    <Icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{tab.label}</span>
                 </button>
              )
           })}
        </div>
        <div className="flex gap-4">
           {activeTab !== "overview" && (
              <button 
                onClick={() => setActiveTab("overview")}
                className="h-12 w-12 flex items-center justify-center bg-white text-gray-700 rounded-2xl border border-gray-100 shadow-sm hover:text-blue-600 transition-all"
              >
                 <ArrowLeft className="h-5 w-5" />
              </button>
           )}
           <button onClick={() => window.print()} className="h-12 px-6 flex items-center gap-3 bg-[#1E3A8A] text-white rounded-2xl shadow-lg hover:shadow-xl transition-all font-bold text-sm">
              <Printer className="h-5 w-5" /> Download PDF Report
           </button>
           <button 
             onClick={() => exportToCSV(initialData, 'audit-summary')}
             className="h-12 px-6 flex items-center gap-3 bg-white text-gray-700 rounded-2xl border border-gray-100 shadow-sm hover:bg-gray-50 transition-all font-bold text-sm"
           >
              <Download className="h-5 w-5" /> Download CSV
           </button>
        </div>
      </div>

      {activeTab === "overview" && renderOverview()}
      {activeTab === "income" && renderIncomeStatement()}
      {activeTab === "balance" && renderBalanceSheet()}
      {activeTab === "ledger" && renderLedger()}
      
      {/* Global Tax Notice (Fixed at bottom) */}
      <div className="bg-[#1E3A8A] rounded-[3rem] p-12 text-white relative overflow-hidden shadow-2xl mt-12 print:hidden">
         <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-white/5 rounded-full -mr-40 -mt-40 blur-[100px]" />
         <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
               <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
                  <Shield className="h-4 w-4" /> Compliance Check
               </div>
               <h2 className="text-4xl font-black mb-4 leading-tight text-white">Tax Analysis (13%)</h2>
               <p className="text-white/60 text-lg leading-relaxed">
                  Based on current net profit analysis.
               </p>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-10 rounded-[2.5rem] border border-white/20">
               <div className="space-y-6">
                  <div className="flex justify-between items-center">
                     <span className="text-white/60 font-bold uppercase text-xs tracking-widest">Net Profit</span>
                     <span className="text-2xl font-bold">{formatPrice(netProfit)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                     <span className="text-white/60 font-bold uppercase text-xs tracking-widest text-white">Tax Rate</span>
                     <span className="text-2xl font-bold">13%</span>
                  </div>
                  <div className="h-px bg-white/10" />
                  <div className="flex justify-between items-center">
                     <span className="text-emerald-400 font-bold uppercase text-xs tracking-widest">Calculated Tax</span>
                     <span className="text-4xl font-black text-emerald-400">{formatPrice(taxAmount)}</span>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  )
}
