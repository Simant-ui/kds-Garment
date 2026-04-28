import { createClient } from "@/lib/supabase/server"
import { 
  Search,
  MessageSquare,
} from "lucide-react"
import InquiriesList from "./InquiriesList"

export default async function AdminInquiriesPage() {
  const supabase = await createClient()
  
  const { data: inquiries, error } = await supabase
    .from('inquiries')
    .select('*')
    .neq('subject', 'Support Chat')
    .neq('subject', 'Admin Reply')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight uppercase">Customer Inquiries</h1>
          <p className="text-sm text-gray-700 mt-1 font-bold">Manage all messages from website forms and support chat</p>
        </div>
        <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3">
          <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse" />
          <span className="text-xs font-black text-blue-600 uppercase tracking-widest">{inquiries?.length || 0} Total Messages</span>
        </div>
      </div>

      {/* Main List */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
           <div className="relative max-w-md w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search everything..." 
                className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl pl-12 pr-4 py-3 text-sm font-bold text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-blue-600 outline-none transition-all"
              />
           </div>
        </div>

        <InquiriesList initialInquiries={inquiries || []} />
      </div>
    </div>
  )
}
