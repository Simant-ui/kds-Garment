"use client"

import { Printer, TrendingUp } from "lucide-react"
import { useRouter } from "next/navigation"

export function PrintButton({ label, className }: { label: string, className?: string }) {
  return (
    <button 
      onClick={() => window.print()} 
      className={className}
    >
      <Printer className="h-4 w-4" /> {label}
    </button>
  )
}

import { exportToCSV } from "@/lib/export-utils"
import { Download } from "lucide-react"

export function DownloadButton({ data, filename, label, className }: { data: any[], filename: string, label: string, className?: string }) {
  return (
    <button 
      onClick={() => exportToCSV(data, filename)} 
      className={className}
    >
      <Download className="h-4 w-4" /> {label}
    </button>
  )
}

export function DateSelector({ dateString, baseUrl }: { dateString: string, baseUrl: string }) {
  const router = useRouter()
  
  return (
    <div className="flex items-center gap-2">
      <input 
        type="date" 
        defaultValue={dateString} 
        className="bg-gray-50 border-none rounded-xl px-4 py-2.5 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
        onChange={(e) => {
          router.push(`${baseUrl}?date=${e.target.value}`)
        }}
      />
      <div className="h-10 w-px bg-gray-100 mx-2" />
      <button 
        onClick={() => router.push(baseUrl)}
        className="h-10 px-4 flex items-center gap-2 bg-blue-50 text-blue-600 rounded-xl font-bold text-xs hover:bg-blue-100 transition-colors"
      >
        <TrendingUp className="h-4 w-4" /> Today
      </button>
    </div>
  )
}

export function SalesFilter({ start, end, baseUrl }: { start: string, end: string, baseUrl: string }) {
    const router = useRouter()
    
    const handleApply = (e: any) => {
        e.preventDefault()
        const formData = new FormData(e.target)
        const s = formData.get('start')
        const en = formData.get('end')
        const c = formData.get('customer')
        router.push(`${baseUrl}?start=${s}&end=${en}&customer=${c || ''}`)
    }

    return (
        <form onSubmit={handleApply} className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
            <div className="space-y-2">
               <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Start Date</label>
               <input 
                 name="start"
                 type="date" 
                 defaultValue={start} 
                 className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-blue-500 transition-all"
               />
            </div>
            <div className="space-y-2">
               <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">End Date</label>
               <input 
                 name="end"
                 type="date" 
                 defaultValue={end} 
                 className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-blue-500 transition-all"
               />
            </div>
            <div className="space-y-2 flex items-end gap-2">
               <div className="flex-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Customer</label>
                <input 
                    name="customer"
                    type="text" 
                    placeholder="Search..." 
                    className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-blue-500 transition-all"
                />
               </div>
               <button type="submit" className="h-12 px-6 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all">
                    Apply
               </button>
            </div>
        </form>
    )
}
