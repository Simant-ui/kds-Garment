'use client'

import { useState, useRef, useEffect } from 'react'
import { 
  Send, 
  User, 
  Bot, 
  Phone, 
  Mail, 
  ShieldCheck,
  Clock,
  Loader2,
  Trash2,
  CheckCircle2,
  X
} from "lucide-react"
import { cn, formatPrice } from "@/lib/utils"
import { replyToInquiryAction } from '../inquiries/actions'

export default function SupportChatInterface({ initialConversations }: { initialConversations: any[] }) {
  const [activeChat, setActiveChat] = useState<any>(initialConversations[0] || null)
  const [replyMessage, setReplyMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [activeChat])

  const handleSendReply = async () => {
    if (!replyMessage.trim() || !activeChat) return
    setIsSubmitting(true)
    
    // Using the same action but we could optimize for threaded chat later
    const result = await replyToInquiryAction(activeChat.messages[0].id, replyMessage)
    
    if (result.success) {
      // For visual feedback in the UI without a full reload
      const newReply = {
        id: Date.now().toString(),
        full_name: 'Admin',
        message: replyMessage,
        created_at: new Date().toISOString(),
        subject: 'Admin Reply',
        status: 'responded'
      }
      
      setActiveChat({
        ...activeChat,
        status: 'responded',
        messages: [newReply, ...activeChat.messages]
      })
      setReplyMessage('')
    }
    setIsSubmitting(false)
  }

  if (!activeChat) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-20 text-center space-y-6 opacity-40">
         <div className="h-32 w-32 bg-gray-50 rounded-[3rem] flex items-center justify-center">
            <MessageSquare className="h-16 w-16 text-gray-300" />
         </div>
         <div className="space-y-2">
            <h3 className="text-xl font-black text-gray-900 uppercase tracking-widest">Select a Conversation</h3>
            <p className="text-sm font-bold text-gray-500 uppercase tracking-tighter">Click on a customer chat to start responding</p>
         </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col bg-slate-50/30">
       {/* Chat Header */}
       <div className="p-8 bg-white border-b border-gray-100 flex items-center justify-between shadow-sm relative z-10">
          <div className="flex items-center gap-6">
             <div className="h-16 w-16 bg-blue-600 rounded-[1.5rem] flex items-center justify-center text-white shadow-xl shadow-blue-200">
                <User className="h-8 w-8" />
             </div>
             <div>
                <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">
                   {activeChat.email?.startsWith('session_') ? 'Anonymous Guest' : (activeChat.sender || 'Anonymous User')}
                </h3>
                <div className="flex items-center gap-4 mt-1.5">
                   <div className="flex items-center gap-2">
                      <Mail className="h-3 w-3 text-blue-600" />
                      <span className="text-[10px] font-bold text-gray-500 uppercase">{activeChat.email}</span>
                   </div>
                   <div className="h-1 w-1 bg-gray-300 rounded-full" />
                   <div className="flex items-center gap-2">
                      <Phone className="h-3 w-3 text-blue-600" />
                      <span className="text-[10px] font-bold text-gray-500 uppercase">{activeChat.phone || 'No Phone'}</span>
                   </div>
                </div>
             </div>
          </div>
          <div className="flex items-center gap-3">
             <button className="h-12 px-6 bg-gray-50 border border-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-600 hover:bg-gray-100 transition-all flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" /> Resolve
             </button>
             <button className="h-12 w-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center hover:bg-rose-100 transition-all">
                <Trash2 className="h-5 w-5" />
             </button>
          </div>
       </div>

       {/* Chat Messages Area */}
       <div 
         ref={scrollRef}
         className="flex-1 overflow-y-auto p-10 space-y-8 scroll-smooth"
       >
          <div className="flex justify-center mb-8">
             <div className="bg-gray-100/50 backdrop-blur-sm px-6 py-2 rounded-full border border-gray-200 shadow-sm">
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                  <Clock className="h-3 w-3" /> Conversation Started: {new Date(activeChat.timestamp).toLocaleDateString()}
                </span>
             </div>
          </div>

          {[...activeChat.messages].reverse().map((m: any, i: number) => {
            const isAdmin = m.full_name === 'Admin' || m.subject === 'Admin Reply'
            const isAI = m.subject === 'AI Reply' || m.full_name === 'KDS Assistant'
            
            return (
              <div key={i} className={cn("flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500", (isAdmin || isAI) ? "items-end" : "items-start")}>
                 <div className={cn(
                   "max-w-[70%] p-6 rounded-[2rem] text-sm font-bold leading-relaxed shadow-lg",
                   isAdmin 
                    ? "bg-blue-600 text-white rounded-tr-none shadow-blue-100" 
                    : isAI
                    ? "bg-indigo-500 text-white rounded-tr-none shadow-indigo-100"
                    : "bg-white text-gray-900 rounded-tl-none border border-gray-100 shadow-gray-100"
                 )}>
                    {m.message}
                 </div>
                 <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-2 px-2">
                    {isAdmin ? 'KDS Support (You)' : isAI ? 'KDS Assistant (AI)' : activeChat.sender} • {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                 </span>
              </div>
            )
          })}
       </div>

       {/* Chat Input Area */}
       <div className="p-8 bg-white border-t border-gray-100 shadow-[0_-10px_40px_rgba(0,0,0,0.02)] relative z-10">
          <div className="relative flex items-center gap-4">
             <div className="flex-1 relative">
                <textarea 
                   value={replyMessage}
                   onChange={(e) => setReplyMessage(e.target.value)}
                   onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        handleSendReply()
                      }
                   }}
                   placeholder="Type your professional response here..."
                   className="w-full bg-gray-50 border-2 border-gray-100 rounded-[2rem] px-8 py-5 text-sm font-bold text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-blue-600 outline-none transition-all resize-none pr-16"
                   rows={1}
                />
                <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-3">
                   <div className="h-6 w-px bg-gray-200" />
                   <ShieldCheck className="h-5 w-5 text-emerald-500" />
                </div>
             </div>
             <button 
               disabled={isSubmitting || !replyMessage.trim()}
               onClick={handleSendReply}
               className="h-[60px] px-10 bg-blue-600 text-white rounded-[2rem] font-black uppercase tracking-widest text-[11px] shadow-2xl shadow-blue-200 hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 flex items-center gap-3 shrink-0"
             >
                {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                Send Response
             </button>
          </div>
          <div className="mt-4 flex items-center justify-center gap-6">
             <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Shift + Enter for new line</p>
             <div className="h-1 w-1 bg-gray-200 rounded-full" />
             <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <ShieldCheck className="h-3 w-3 text-emerald-500" /> Secure Data Protection Active
             </p>
          </div>
       </div>
    </div>
  )
}

function MessageSquare(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  )
}
