"use client"

import { Download, FileText, Printer } from "lucide-react"
import { exportToCSV } from "@/lib/export-utils"
import { cn } from "@/lib/utils"

interface ExportButtonProps {
  data: any[]
  filename: string
  label?: string
  variant?: 'csv' | 'pdf'
  className?: string
}

export default function ExportButton({ data, filename, label = "Download", variant = 'csv', className }: ExportButtonProps) {
  const handleExport = () => {
    if (variant === 'csv') {
      // Clean data for CSV
      const cleanedData = data.map(item => {
        const { id, created_at, user_id, updated_at, ...rest } = item
        return {
          ...rest,
          date: new Date(created_at).toLocaleDateString(),
          time: new Date(created_at).toLocaleTimeString()
        }
      })
      exportToCSV(cleanedData, filename)
    } else {
      window.print()
    }
  }

  return (
    <button 
      onClick={handleExport}
      className={cn(
        "bg-white text-gray-700 px-6 py-3 rounded-2xl font-bold text-sm border border-gray-100 hover:bg-gray-50 transition-all flex items-center gap-2 shadow-sm active:scale-95",
        variant === 'pdf' && "bg-[#1E3A8A] text-white border-none hover:bg-blue-800 shadow-lg shadow-blue-500/20",
        className
      )}
    >
      {variant === 'csv' ? <Download className="h-4 w-4" /> : <Printer className="h-4 w-4" />}
      {variant === 'pdf' ? `${label} PDF` : `${label} CSV`}
    </button>
  )
}
