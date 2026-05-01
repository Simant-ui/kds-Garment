'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { MessageSquare, X, Send, Bot, User, Minimize2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export default function ChatAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [sessionId, setSessionId] = useState('')
  const [hasSubmittedEmail, setHasSubmittedEmail] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Namaste! Welcome to KDS Garment Support. Please provide your valid Gmail/Email address to start chatting with our assistant and team.' }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Initialize Session
  useEffect(() => {
    let sId = typeof window !== 'undefined' ? localStorage.getItem('kds_chat_session') : null
    if (!sId) {
      sId = 'session_' + Math.random().toString(36).substr(2, 9)
      if (typeof window !== 'undefined') localStorage.setItem('kds_chat_session', sId)
    }
    setSessionId(sId)
    
    // Check for existing email
    const savedEmail = typeof window !== 'undefined' ? localStorage.getItem('kds_chat_email') : null
    if (savedEmail) {
      setEmail(savedEmail)
      setHasSubmittedEmail(true)
    }
  }, [])

  // Polling for admin replies & initial history load
  useEffect(() => {
    if (!sessionId && !email) return

    const fetchHistory = async () => {
      try {
        const identifier = email || sessionId
        const response = await fetch(`/api/support/messages?email=${encodeURIComponent(identifier)}`)
        const data = await response.json()
        if (data.messages && data.messages.length > 0) {
          // Sync messages with database
          const dbMessages = data.messages.map((m: any) => ({
            role: (m.full_name === 'Admin' || m.subject === 'Admin Reply' || m.subject === 'AI Reply') ? 'assistant' : 'user',
            content: m.message
          })).reverse()
          
          setMessages(dbMessages)
        }
      } catch (err) {
        console.error("Fetch history error:", err)
      }
    }

    // Load initial history
    fetchHistory()

    // Setup polling
    const interval = setInterval(fetchHistory, 5000)

    return () => clearInterval(interval)
  }, [email, sessionId])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    if (isOpen) {
      scrollToBottom()
    }
  }, [messages, isOpen])

  async function handleSend() {
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput('')

    // Check if the user is providing an email for the first time
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/
    const foundEmail = userMessage.match(emailRegex)?.[0]

    if (!hasSubmittedEmail && foundEmail) {
      const validatedEmail = foundEmail.toLowerCase()
      setEmail(validatedEmail)
      setHasSubmittedEmail(true)
      if (typeof window !== 'undefined') localStorage.setItem('kds_chat_email', validatedEmail)
      
      setMessages(prev => [...prev, 
        { role: 'user', content: userMessage }, 
        { role: 'assistant', content: `Thank you! I've registered your email (${validatedEmail}). How can I help you today?` }
      ])
      
      const { saveChatMessageAction } = await import('@/app/chat/actions')
      await saveChatMessageAction(`User provided email: ${validatedEmail}`, validatedEmail, 'Support Chat', 'Customer')
      return
    }

    // Always show user message locally
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setIsLoading(true)

    try {
      const { saveChatMessageAction } = await import('@/app/chat/actions')
      const identifier = email || sessionId
      
      // SAVE USER MESSAGE
      await saveChatMessageAction(userMessage, identifier, 'Support Chat', email ? null : 'Guest User')

      // Get AI Response
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage })
      })

      const data = await response.json()
      
      if (data.reply) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.reply }])
        // SAVE AI REPLY
        await saveChatMessageAction(data.reply, identifier, 'AI Reply', 'KDS Assistant')
      }

      // If user still hasn't provided email, remind them gently but keep the chat going
      if (!hasSubmittedEmail) {
        // We don't block anymore, but we can add a system note or just let the admin handle it
      }

    } catch (error) {
      console.error("Chat handleSend error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 z-[100] flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-6 w-[90vw] md:w-[400px] h-[500px] bg-white rounded-[32px] shadow-2xl border border-black/5 overflow-hidden flex flex-col animate-in slide-in-from-bottom-8 fade-in duration-500">
          {/* Header */}
          <div className="bg-primary p-6 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-white/20 rounded-2xl flex items-center justify-center">
                <Bot className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-black uppercase tracking-widest text-xs">KDS Assistant</h3>
                <div className="flex items-center gap-1.5">
                  <div className="h-1.5 w-1.5 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-[10px] font-bold text-white/60 uppercase">Online</span>
                </div>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="h-10 w-10 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
            {messages.map((m, i) => (
              <div key={i} className={cn("flex", m.role === 'user' ? "justify-end" : "justify-start")}>
                <div className={cn(
                  "max-w-[80%] p-4 rounded-2xl text-sm font-medium leading-relaxed",
                  m.role === 'user' 
                    ? "bg-primary text-white rounded-tr-none shadow-xl shadow-primary/20" 
                    : "bg-white text-black border border-black/5 rounded-tl-none shadow-sm"
                )}>
                  {m.content.split('\n').map((line, li) => (
                    <div key={li}>
                      {line.split(/(\[.*?\]\(.*?\))/g).map((part, pi) => {
                        const match = part.match(/\[(.*?)\]\((.*?)\)/)
                        if (match) {
                          return (
                            <Link 
                              key={pi} 
                              href={match[2]} 
                              className="text-white bg-white/20 hover:bg-white/30 px-3 py-1 rounded-lg font-bold underline transition-all inline-block my-1"
                              onClick={() => match[2].startsWith('http') ? null : setIsOpen(false)}
                            >
                              {match[1]}
                            </Link>
                          )
                        }
                        return part
                      })}
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-black/5 p-4 rounded-2xl rounded-tl-none flex gap-1">
                  <div className="h-1.5 w-1.5 bg-black/20 rounded-full animate-bounce" />
                  <div className="h-1.5 w-1.5 bg-black/20 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <div className="h-1.5 w-1.5 bg-black/20 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-6 bg-white border-t border-black/5">
            <div className="relative flex items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type your message..."
                className="w-full bg-slate-100 border-none rounded-2xl px-6 py-4 text-sm font-black text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-primary/10 transition-all pr-14"
              />
              <button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="absolute right-2 h-10 w-10 bg-primary text-white rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "h-14 w-14 sm:h-16 sm:w-16 bg-primary text-white rounded-[20px] sm:rounded-[24px] flex items-center justify-center shadow-2xl shadow-primary/40 hover:scale-110 active:scale-95 transition-all relative group",
          isOpen && "rotate-90"
        )}
      >
        {isOpen ? <X className="h-7 w-7" /> : <MessageSquare className="h-7 w-7" />}
        {!isOpen && (
          <span className="absolute right-full mr-4 bg-white text-primary px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl border border-black/5 opacity-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap">
            Chat with KDS
          </span>
        )}
      </button>
    </div>
  )
}
