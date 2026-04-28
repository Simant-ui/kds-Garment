import { createClient } from "@/lib/supabase/server"
import AuditDashboardClient from "./AuditDashboardClient"

export default async function AuditReportsPage() {
  const supabase = await createClient()
  
  // Fetch Sales Data
  const { data: orders } = await supabase
    .from('orders')
    .select('*, order_items(*, products(*))')
    .order('created_at', { ascending: false })

  const data = orders || []
  const totalRevenue = data.reduce((acc, o) => acc + (o.total_price || 0), 0) || 0
  
  // Financial Logic (Calculated based on existing orders)
  // Simulated COGS (Cost of Goods Sold) as 65% of revenue if no specific cost data exists
  const totalCogs = totalRevenue * 0.65
  const grossProfit = totalRevenue - totalCogs
  const expenses = totalRevenue * 0.10 // Simulated 10% operating expenses
  const netProfit = grossProfit - expenses
  const taxAmount = netProfit > 0 ? netProfit * 0.13 : 0

  return (
    <div className="space-y-6">
      <div className="print:hidden">
        <h1 className="text-3xl font-bold text-[#1E3A8A]">Audit & Compliance</h1>
        <p className="text-gray-500 mt-2 font-medium">Automatic financial analysis for KDS Garment Industry</p>
      </div>

      <AuditDashboardClient 
        initialData={data}
        totalRevenue={totalRevenue}
        totalCogs={totalCogs}
        expenses={expenses}
        netProfit={netProfit}
        taxAmount={taxAmount}
      />
    </div>
  )
}
