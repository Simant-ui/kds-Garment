import { createClient } from "@/lib/supabase/server"
import { 
  Search,
  MessageSquare,
  Bot,
  User,
  Clock,
  ChevronRight,
  ShieldCheck,
  Send,
  Phone,
  Mail
} from "lucide-react"
import SupportChatInterface from "./SupportChatInterface"

export default async function AdminSupportPage() {
  const supabase = await createClient()
  
  // Fetch all inquiries/messages
  const { data: messages, error } = await supabase
    .from('inquiries')
    .select('*')
    .or('subject.eq.Support Chat,subject.eq.Admin Reply,subject.eq.AI Reply')
    .order('created_at', { ascending: false })

  // Group messages by email/sender to create "Conversations"
  const conversations = messages?.reduce((acc: any, msg: any) => {
    const key = msg.email || 'guest@unknown.com'
    if (!acc[key]) {
      acc[key] = {
        id: key,
        sender: msg.full_name,
        email: msg.email,
        phone: msg.phone,
        lastMessage: msg.message,
        timestamp: msg.created_at,
        messages: [],
        status: msg.status
      }
    }
    acc[key].messages.push(msg)
    return acc
  }, {})

  const conversationList = Object.values(conversations || {})

  return (
    <div className="h-[calc(100vh-160px)] flex flex-col space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 shrink-0">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-black text-green-600 uppercase tracking-widest">Live Support Active</span>
          </div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight uppercase">Customer Support Portal</h1>
          <p className="text-sm text-gray-700 mt-1 font-bold">Monitor live chats and respond to customer queries in real-time</p>
        </div>
        <div className="bg-white px-8 py-4 rounded-[2rem] shadow-sm border border-gray-100 flex items-center gap-6">
          <div className="text-center">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Chats</p>
            <p className="text-xl font-black text-blue-600">{conversationList.length}</p>
          </div>
          <div className="h-10 w-px bg-gray-100" />
          <div className="text-center">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Wait Time</p>
            <p className="text-xl font-black text-gray-900">&lt; 1m</p>
          </div>
          <div className="h-10 w-px bg-gray-100" />
          <div className="flex flex-col items-center">
             <div className="flex items-center gap-1 text-[8px] font-black text-emerald-600 uppercase mb-1">
                <ShieldCheck className="h-2 w-2" /> Encrypted
             </div>
             <p className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Safe Storage</p>
          </div>
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="flex-1 bg-white rounded-[3rem] shadow-xl border border-gray-100 overflow-hidden flex divide-x divide-gray-100">
        {/* Sidebar: Chat List */}
        <div className="w-96 flex flex-col shrink-0">
           <div className="p-8 border-b border-gray-100">
              <div className="relative">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                 <input 
                   type="text" 
                   placeholder="Search conversations..." 
                   className="w-full bg-gray-50 border-none rounded-2xl pl-12 pr-4 py-4 text-sm font-bold text-gray-900 placeholder:text-gray-400 focus:ring-4 focus:ring-blue-100 transition-all"
                 />
              </div>
           </div>
           <div className="flex-1 overflow-y-auto">
              {conversationList.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center p-10 text-center opacity-40">
                  <MessageSquare className="h-12 w-12 mb-4" />
                  <p className="text-xs font-black uppercase tracking-widest">No active chats</p>
                </div>
              ) : conversationList.map((chat: any) => (
                <button 
                  key={chat.id}
                  className="w-full p-8 flex items-start gap-5 border-b border-gray-50 hover:bg-blue-50/50 transition-all text-left group relative overflow-hidden"
                >
                   <div className="h-14 w-14 bg-blue-100 rounded-[1.25rem] flex items-center justify-center text-blue-600 shrink-0 group-hover:scale-110 transition-transform">
                      <User className="h-7 w-7" />
                   </div>
                   <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                         <h4 className="font-black text-gray-900 text-sm truncate uppercase tracking-tight">
                            {chat.email?.startsWith('session_') ? 'Anonymous Guest' : (chat.sender || 'Unknown User')}
                         </h4>
                         <span className="text-[10px] font-bold text-gray-400">{new Date(chat.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <p className="text-xs text-gray-600 font-bold line-clamp-1 opacity-70 mb-2">{chat.lastMessage}</p>
                      <div className="flex items-center gap-2">
                        {chat.status === 'responded' ? (
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[9px] font-black rounded uppercase tracking-tighter">Replied</span>
                        ) : (
                          <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-[9px] font-black rounded uppercase tracking-tighter animate-pulse">Waiting</span>
                        )}
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{chat.email}</span>
                      </div>
                   </div>
                </button>
              ))}
           </div>
        </div>

        {/* Main Content: Active Conversation */}
        <SupportChatInterface initialConversations={conversationList} />
      </div>
    </div>
  )
}
