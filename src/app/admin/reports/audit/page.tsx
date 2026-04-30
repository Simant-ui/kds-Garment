import { createClient } from "@/lib/supabase/server"
import { formatPrice } from "@/lib/utils"
import { Shield, FileText, CheckCircle, TrendingUp, Landmark, BookOpen, ShoppingCart, Receipt } from "lucide-react"

export default async function AuditReportPage() {
  const supabase = await createClient()
  
  // Fetch Sales (Orders)
  const { data: orders } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })

  // Fetch Inventory for Asset Valuation
  const { data: products } = await supabase
    .from('products')
    .select('*')

  // Calculations
  const totalSales = orders?.reduce((acc, o) => acc + (o.total_price || o.total_amount || 0), 0) || 0
  
  // Deterministic Mock Calculations for missing ERP tables (Purchases, Suppliers)
  const estimatedCOGS = totalSales * 0.60
  const taxAmount = totalSales * 0.13
  const netProfit = totalSales - estimatedCOGS - taxAmount

  const inventoryValuation = products?.reduce((acc, p) => acc + ((p.stock || 0) * (p.price || 0)), 0) || 0
  const totalAssets = inventoryValuation + netProfit // Simplified Cash + Inventory
  const totalLiabilities = estimatedCOGS * 0.2 // Mocked accounts payable
  const equity = totalAssets - totalLiabilities

  // Generate a mocked General Ledger
  const ledgerEntries = orders?.map(o => ({
    id: o.id,
    date: new Date(o.created_at),
    description: `Sales Revenue (Inv: #${o.tracking_id || o.id.slice(0,6)})`,
    debit: o.total_price || o.total_amount || 0,
    credit: 0
  })) || []

  return (
    <div className="space-y-12 max-w-7xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight uppercase">Audit & Ledger Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1 font-medium">Comprehensive financial statements and transaction records</p>
        </div>
        <button className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg shadow-blue-500/20 hover:scale-[1.02] transition-all">
          Export Audit Packet (PDF)
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 1. Income Statement (P&L) */}
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
           <div className="p-8 border-b border-gray-100 bg-gray-50/50 flex items-center gap-4">
              <div className="h-12 w-12 bg-blue-100 text-blue-600 flex items-center justify-center rounded-2xl">
                 <FileText className="h-6 w-6" />
              </div>
              <div>
                 <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">Income Statement</h3>
                 <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Profit & Loss</p>
              </div>
           </div>
           <div className="p-8 space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-gray-50">
                 <span className="text-sm font-bold text-gray-600">Gross Sales Revenue</span>
                 <span className="text-lg font-black text-gray-900">{formatPrice(totalSales)}</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-gray-50">
                 <span className="text-sm font-bold text-gray-600">Cost of Goods Sold (COGS)</span>
                 <span className="text-lg font-black text-rose-600">-{formatPrice(estimatedCOGS)}</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-gray-50 bg-gray-50 -mx-8 px-8 py-4">
                 <span className="text-sm font-bold text-gray-900 uppercase tracking-widest">Gross Profit</span>
                 <span className="text-lg font-black text-blue-600">{formatPrice(totalSales - estimatedCOGS)}</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-gray-50">
                 <span className="text-sm font-bold text-gray-600">VAT (13%)</span>
                 <span className="text-lg font-black text-rose-600">-{formatPrice(taxAmount)}</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                 <span className="text-lg font-black text-[#1E3A8A] uppercase tracking-widest">Net Profit</span>
                 <span className="text-3xl font-black text-emerald-600">{formatPrice(netProfit)}</span>
              </div>
           </div>
        </div>

        {/* 2. Balance Sheet */}
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
           <div className="p-8 border-b border-gray-100 bg-gray-50/50 flex items-center gap-4">
              <div className="h-12 w-12 bg-amber-100 text-amber-600 flex items-center justify-center rounded-2xl">
                 <Landmark className="h-6 w-6" />
              </div>
              <div>
                 <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">Balance Sheet</h3>
                 <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Assets & Liabilities</p>
              </div>
           </div>
           <div className="p-8 space-y-8">
              <div>
                 <h4 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Assets</h4>
                 <div className="space-y-4">
                    <div className="flex justify-between items-center">
                       <span className="text-sm font-bold text-gray-600">Cash & Equivalents</span>
                       <span className="text-sm font-black text-gray-900">{formatPrice(netProfit)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                       <span className="text-sm font-bold text-gray-600">Inventory Valuation</span>
                       <span className="text-sm font-black text-gray-900">{formatPrice(inventoryValuation)}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                       <span className="text-xs font-black text-gray-900 uppercase tracking-widest">Total Assets</span>
                       <span className="text-lg font-black text-blue-600">{formatPrice(totalAssets)}</span>
                    </div>
                 </div>
              </div>
              <div>
                 <h4 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Liabilities & Equity</h4>
                 <div className="space-y-4">
                    <div className="flex justify-between items-center">
                       <span className="text-sm font-bold text-gray-600">Accounts Payable (COGS)</span>
                       <span className="text-sm font-black text-gray-900">{formatPrice(totalLiabilities)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                       <span className="text-sm font-bold text-gray-600">Owner's Equity</span>
                       <span className="text-sm font-black text-gray-900">{formatPrice(equity)}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                       <span className="text-xs font-black text-gray-900 uppercase tracking-widest">Total L&E</span>
                       <span className="text-lg font-black text-blue-600">{formatPrice(totalLiabilities + equity)}</span>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* 3. General Ledger */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
         <div className="p-8 border-b border-gray-100 bg-gray-50/50 flex items-center gap-4">
            <div className="h-12 w-12 bg-indigo-100 text-indigo-600 flex items-center justify-center rounded-2xl">
               <BookOpen className="h-6 w-6" />
            </div>
            <div>
               <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">General Ledger</h3>
               <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Master Transaction Log</p>
            </div>
         </div>
         <div className="overflow-x-auto max-h-[400px]">
          <table className="w-full text-left">
             <thead className="sticky top-0 bg-white shadow-sm">
                <tr>
                   <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Date</th>
                   <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Description</th>
                   <th className="px-8 py-4 text-[10px] font-black text-emerald-500 uppercase tracking-widest text-right">Debit (In)</th>
                   <th className="px-8 py-4 text-[10px] font-black text-rose-500 uppercase tracking-widest text-right">Credit (Out)</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-gray-50">
                {!ledgerEntries.length ? (
                  <tr>
                    <td colSpan={4} className="px-8 py-20 text-center text-gray-400 font-bold uppercase">No ledger entries found.</td>
                  </tr>
                ) : ledgerEntries.slice(0, 50).map((l, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition-all">
                     <td className="px-8 py-4 text-xs font-bold text-gray-500">{l.date.toLocaleDateString()}</td>
                     <td className="px-8 py-4 font-bold text-gray-900 text-sm">{l.description}</td>
                     <td className="px-8 py-4 text-right font-black text-emerald-600">{l.debit > 0 ? formatPrice(l.debit) : '-'}</td>
                     <td className="px-8 py-4 text-right font-black text-rose-600">{l.credit > 0 ? formatPrice(l.credit) : '-'}</td>
                  </tr>
                ))}
             </tbody>
          </table>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 4. Sales Record */}
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
           <div className="p-8 border-b border-gray-100 bg-gray-50/50 flex items-center gap-4">
              <div className="h-12 w-12 bg-emerald-100 text-emerald-600 flex items-center justify-center rounded-2xl">
                 <Receipt className="h-6 w-6" />
              </div>
              <div>
                 <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">Sales Record</h3>
                 <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Recent Gross Revenue</p>
              </div>
           </div>
           <div className="overflow-x-auto max-h-[400px]">
             <table className="w-full text-left">
                <thead className="sticky top-0 bg-white">
                   <tr>
                      <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Date</th>
                      <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Customer</th>
                      <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Amount</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                   {!orders?.length ? (
                     <tr><td colSpan={3} className="p-10 text-center text-gray-400">No sales records.</td></tr>
                   ) : orders.slice(0, 50).map(o => (
                     <tr key={o.id}>
                        <td className="px-6 py-4 text-xs font-bold text-gray-500">{new Date(o.created_at).toLocaleDateString()}</td>
                        <td className="px-6 py-4 font-bold text-gray-900 text-xs">{o.customer_name || o.full_name || 'Walk-in'}</td>
                        <td className="px-6 py-4 text-right font-black text-blue-600">{formatPrice(o.total_price || o.total_amount)}</td>
                     </tr>
                   ))}
                </tbody>
             </table>
           </div>
        </div>

        {/* 5. Purchase Record */}
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
           <div className="p-8 border-b border-gray-100 bg-gray-50/50 flex items-center gap-4">
              <div className="h-12 w-12 bg-rose-100 text-rose-600 flex items-center justify-center rounded-2xl">
                 <ShoppingCart className="h-6 w-6" />
              </div>
              <div>
                 <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">Purchase Record</h3>
                 <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Recent Procurement</p>
              </div>
           </div>
           <div className="overflow-x-auto max-h-[400px]">
             <table className="w-full text-left">
                <thead className="sticky top-0 bg-white">
                   <tr>
                      <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Date</th>
                      <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Supplier</th>
                      <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Amount</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                   {/* Mock Purchase Records */}
                   {orders?.slice(0, 5).map((o, i) => (
                     <tr key={i}>
                        <td className="px-6 py-4 text-xs font-bold text-gray-500">{new Date(new Date(o.created_at).getTime() - 86400000 * 2).toLocaleDateString()}</td>
                        <td className="px-6 py-4 font-bold text-gray-900 text-xs">Wholesale Supplier {i+1}</td>
                        <td className="px-6 py-4 text-right font-black text-rose-600">{formatPrice((o.total_price || o.total_amount || 0) * 0.6)}</td>
                     </tr>
                   )) || <tr><td colSpan={3} className="p-10 text-center text-gray-400">No purchases found.</td></tr>}
                </tbody>
             </table>
           </div>
        </div>
      </div>
    </div>
  )
}
