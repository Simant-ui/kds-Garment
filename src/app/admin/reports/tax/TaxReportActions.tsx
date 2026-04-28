"use client"

import { Printer, Download } from "lucide-react"
import { exportToCSV } from "@/lib/export-utils"

export default function TaxReportActions({ orders }: { orders: any[] }) {
  return (
    <div className="pt-8 flex gap-4">
      <button 
        onClick={() => window.print()}
        className="flex-1 h-12 bg-[#1E3A8A] text-white rounded-xl font-bold text-xs hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
      >
        <Printer className="h-4 w-4" /> Generate PDF Report
      </button>
      <button 
        onClick={() => {
          const cleaned = orders.map(o => ({
            Revenue: o.total_price,
            Date: new Date(o.created_at).toLocaleDateString()
          }))
          exportToCSV(cleaned, 'tax-report')
        }}
        className="h-12 px-6 bg-gray-50 text-gray-700 rounded-xl flex items-center justify-center hover:bg-gray-100 transition-all border border-gray-100 font-bold text-xs flex items-center gap-2"
      >
        <Download className="h-4 w-4" /> CSV
      </button>
    </div>
  )
}
