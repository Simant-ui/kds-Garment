import Link from "next/link"
import { ChevronLeft, Info } from "lucide-react"

export default function ReportPlaceholder({ title }: { title: string }) {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Link href="/admin/reports" className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#1E3A8A] transition-colors group">
        <ChevronLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
        Back to Reports
      </Link>
      
      <div className="bg-white p-12 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col items-center text-center">
        <div className="h-20 w-20 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mb-8">
          <Info className="h-10 w-10" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{title}</h1>
        <p className="text-gray-500 max-w-md mx-auto mb-10 leading-relaxed">
          The {title.toLowerCase()} module is currently being optimized for your business. Check back soon for detailed insights and data visualization.
        </p>
        
        <div className="flex gap-4">
           <div className="px-6 py-3 bg-gray-50 text-gray-400 font-bold rounded-xl text-sm cursor-not-allowed">
             Export Data
           </div>
           <div className="px-6 py-3 bg-gray-50 text-gray-400 font-bold rounded-xl text-sm cursor-not-allowed">
             Print Report
           </div>
        </div>
      </div>
    </div>
  )
}
