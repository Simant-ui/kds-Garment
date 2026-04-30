'use client'

import { useState } from 'react'
import { 
  Mail, 
  MessageSquare, 
  User, 
  Trash2,
  CheckCircle2,
  Send,
  X,
  Loader2
} from "lucide-react"
import { cn, formatPrice } from "@/lib/utils"
import { replyToInquiryAction } from './actions'

export default function InquiriesList({ initialInquiries }: { initialInquiries: any[] }) {
  const [inquiries, setInquiries] = useState(initialInquiries)
  const [selectedInquiry, setSelectedInquiry] = useState<any>(null)
  const [replyMessage, setReplyMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleReply = async () => {
    if (!replyMessage.trim()) return
    setIsSubmitting(true)
    
    const result = await replyToInquiryAction(selectedInquiry.id, replyMessage)
    
    if (result.success) {
      setInquiries(inquiries.map(inv => 
        inv.id === selectedInquiry.id ? { ...inv, status: 'responded' } : inv
      ))
      
      alert(result.success)
      
      setSelectedInquiry(null)
      setReplyMessage('')
    } else if (result.error) {
      alert(result.error)
    }
    setIsSubmitting(false)
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50">
              <th className="px-8 py-5 text-[11px] font-black text-gray-900 uppercase tracking-widest">Sender Details</th>
              <th className="px-8 py-5 text-[11px] font-black text-gray-900 uppercase tracking-widest">Inquiry Type</th>
              <th className="px-8 py-5 text-[11px] font-black text-gray-900 uppercase tracking-widest">Message Preview</th>
              <th className="px-8 py-5 text-[11px] font-black text-gray-900 uppercase tracking-widest text-center">Status</th>
              <th className="px-8 py-5 text-[11px] font-black text-gray-900 uppercase tracking-widest text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {inquiries.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-8 py-32 text-center">
                  <div className="flex flex-col items-center gap-4 text-gray-400">
                    <MessageSquare className="h-16 w-16" />
                    <p className="text-sm font-black uppercase tracking-widest text-gray-900">No customer messages yet</p>
                  </div>
                </td>
              </tr>
            ) : inquiries.map((item) => (
              <tr key={item.id} className="group hover:bg-blue-50/30 transition-all">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "h-12 w-12 rounded-2xl flex items-center justify-center shrink-0",
                      item.subject === 'Support Chat' ? "bg-amber-50 text-amber-600" : "bg-blue-50 text-blue-600"
                    )}>
                      {item.subject === 'Support Chat' ? <MessageSquare className="h-6 w-6" /> : <User className="h-6 w-6" />}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-black text-gray-900 text-sm">{item.full_name}</span>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Mail className="h-3 w-3 text-gray-400" />
                        <span className="text-[10px] text-gray-600 font-bold">{item.email}</span>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className={cn(
                    "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border",
                    item.subject === 'Support Chat' 
                      ? "bg-amber-50 text-amber-600 border-amber-100" 
                      : "bg-blue-50 text-blue-600 border-blue-100"
                  )}>
                    {item.subject}
                  </span>
                </td>
                <td className="px-8 py-6">
                  <div className="max-w-md">
                    <p className="text-sm text-gray-800 font-bold line-clamp-2 leading-relaxed">
                      {item.message}
                    </p>
                  </div>
                </td>
                <td className="px-8 py-6 text-center">
                  <span className={cn(
                    "text-[10px] font-black uppercase tracking-widest",
                    item.status === 'responded' ? "text-emerald-600" : "text-amber-600"
                  )}>
                    {item.status || 'pending'}
                  </span>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center justify-end gap-3">
                     <button 
                        onClick={() => setSelectedInquiry(item)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-md shadow-blue-100"
                     >
                        <Send className="h-3 w-3" /> Reply
                     </button>
                     <button className="h-10 w-10 bg-white border border-gray-100 rounded-xl flex items-center justify-center text-rose-600 shadow-sm hover:bg-rose-50 opacity-0 group-hover:opacity-100 transition-all">
                        <Trash2 className="h-5 w-5" />
                     </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Reply Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
              <div className="bg-blue-600 p-8 text-white flex items-center justify-between">
                 <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-white/20 rounded-2xl flex items-center justify-center">
                       <MessageSquare className="h-6 w-6" />
                    </div>
                    <div>
                       <h3 className="font-black uppercase tracking-widest text-xs">Reply to Customer</h3>
                       <p className="text-[10px] font-bold text-white/60 uppercase mt-0.5">Direct Message Portal</p>
                    </div>
                 </div>
                 <button 
                    onClick={() => setSelectedInquiry(null)}
                    className="h-10 w-10 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center transition-colors"
                 >
                    <X className="h-5 w-5" />
                 </button>
              </div>

              <div className="p-10 space-y-8">
                 <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                    <div className="flex items-center gap-3 mb-3">
                       <User className="h-4 w-4 text-blue-600" />
                       <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Original Message from {selectedInquiry.full_name}</span>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed font-bold italic">
                       "{selectedInquiry.message}"
                    </p>
                 </div>

                 <div className="space-y-3">
                    <label className="text-[11px] font-black text-gray-900 uppercase tracking-widest">Your Professional Reply</label>
                    <textarea 
                       value={replyMessage}
                       onChange={(e) => setReplyMessage(e.target.value)}
                       placeholder="Type your response to the customer..."
                       rows={6}
                       className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-6 text-sm font-bold text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-blue-600 outline-none transition-all resize-none"
                    />
                 </div>

                 <div className="flex gap-4">
                    <button 
                       onClick={() => setSelectedInquiry(null)}
                       className="flex-1 px-8 py-4 bg-gray-100 text-gray-900 rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-gray-200 transition-all"
                    >
                       Cancel
                    </button>
                    <button 
                       disabled={isSubmitting || !replyMessage.trim()}
                       onClick={handleReply}
                       className="flex-[2] px-8 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                    >
                       {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                       Send Reply Now
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </>
  )
}
