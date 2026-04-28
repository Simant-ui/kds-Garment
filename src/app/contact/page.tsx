'use client'

import { useState } from 'react'
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle, Globe, PhoneCall, ChevronRight, Clock } from 'lucide-react'
import { submitInquiry } from './actions'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)
    setMessage(null)

    const formData = new FormData(event.currentTarget)
    const result = await submitInquiry(formData)

    setIsSubmitting(false)
    if (result.error) {
      setMessage({ type: 'error', text: result.error })
    } else if (result.success) {
      setMessage({ type: 'success', text: result.success })
      ;(event.target as HTMLFormElement).reset()
    }
  }

  return (
    <div className="min-h-screen bg-[#F4F4F4] py-12">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto space-y-12">
          
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
            <Link href="/" className="hover:text-[#002169] transition-colors">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-[#002169]">Contact Us</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Left: Contact Info */}
            <div className="lg:col-span-5 space-y-8">
              <div className="space-y-4">
                 <h1 className="text-4xl md:text-5xl font-bold text-[#002169] uppercase">Connect <br /> With <span className="text-[#FCB800]">KDS</span></h1>
                 <p className="text-gray-500 text-sm leading-relaxed max-w-sm">
                   Have a specific requirement or want to visit our manufacturing plant? Reach out to us through any of the channels below.
                 </p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                 {[
                   { icon: Mail, label: "EMAIL US", value: "kdsgroup98@gmail.com" },
                   { icon: PhoneCall, label: "CALL US", value: "+977-9855073550" },
                   { icon: MapPin, label: "VISIT US", value: "Lalgadh, Nepal" },
                   { icon: Clock, label: "WORK HOURS", value: "Sun - Fri: 9:00 - 18:00" }
                 ].map((item, i) => (
                   <div key={i} className="bg-white p-6 rounded-xl border border-gray-200 flex items-center gap-6 shadow-sm">
                      <div className="h-12 w-12 bg-[#F4F4F4] rounded-lg flex items-center justify-center text-[#002169]">
                         <item.icon className="h-5 w-5" />
                      </div>
                      <div>
                         <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{item.label}</h4>
                         <p className="text-sm font-bold text-[#002169]">{item.value}</p>
                      </div>
                   </div>
                 ))}
              </div>

              {/* Mini Map Visual */}
              <div className="relative h-64 rounded-2xl overflow-hidden border-4 border-white shadow-xl">
                 <Image 
                   src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=2066&auto=format&fit=crop" 
                   alt="map" fill className="object-cover" 
                 />
                 <div className="absolute inset-0 bg-[#002169]/30 flex items-center justify-center">
                    <button className="bg-white px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest text-[#002169] shadow-2xl hover:scale-105 transition-all">
                       View Map
                    </button>
                 </div>
              </div>
            </div>

            {/* Right: Message Form */}
            <div className="lg:col-span-7">
               <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-gray-200">
                  <h3 className="text-2xl font-bold text-[#002169] mb-8 uppercase border-b pb-4">Send a Message</h3>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {message && (
                      <div className={cn(
                        "p-5 rounded-lg flex items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-500 text-sm font-bold",
                        message.type === 'success' ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-rose-50 text-rose-700 border border-rose-100"
                      )}>
                        {message.type === 'success' ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
                        {message.text}
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Full Name</label>
                        <input
                          required
                          name="full_name"
                          placeholder="Your Name"
                          className="w-full bg-gray-50 border border-gray-200 rounded h-12 px-4 text-sm font-bold focus:border-[#002169] outline-none transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Email Address</label>
                        <input
                          required
                          type="email"
                          name="email"
                          placeholder="email@example.com"
                          className="w-full bg-gray-50 border border-gray-200 rounded h-12 px-4 text-sm font-bold focus:border-[#002169] outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Phone</label>
                        <input
                          name="phone"
                          placeholder="+977-..."
                          className="w-full bg-gray-50 border border-gray-200 rounded h-12 px-4 text-sm font-bold focus:border-[#002169] outline-none transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Subject</label>
                        <input
                          name="subject"
                          placeholder="Inquiry Subject"
                          className="w-full bg-gray-50 border border-gray-200 rounded h-12 px-4 text-sm font-bold focus:border-[#002169] outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Message</label>
                      <textarea
                        required
                        name="message"
                        rows={6}
                        placeholder="How can we help you?"
                        className="w-full bg-gray-50 border border-gray-200 rounded p-4 text-sm font-bold focus:border-[#002169] outline-none transition-all resize-none"
                      />
                    </div>

                    <button
                      disabled={isSubmitting}
                      className="w-full h-14 bg-[#002169] text-white rounded font-bold uppercase tracking-widest text-sm shadow-md hover:bg-[#00184d] transition-all flex items-center justify-center gap-3"
                    >
                      {isSubmitting ? (
                        <div className="h-6 w-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>SEND MESSAGE <Send className="h-4 w-4" /></>
                      )}
                    </button>
                  </form>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
