'use client'

import { useState } from 'react'
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle, Globe, PhoneCall, ChevronRight, ShieldCheck, Clock } from 'lucide-react'
import { submitInquiry } from '../contact/actions'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import Image from 'next/image'

export default function InquiryPage() {
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
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs font-bold text-gray-600 uppercase tracking-widest mb-8">
            <Link href="/" className="hover:text-[#002169] transition-colors">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-[#002169]">Inquiry Portal</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left Side: Info */}
            <div className="lg:col-span-5 space-y-12">
              <div className="space-y-6">
                <h1 className="text-4xl md:text-5xl font-bold text-[#002169] leading-tight uppercase">
                  GET A PROFESSIONAL <br /> <span className="text-[#FCB800]">QUOTATION</span>
                </h1>
                <p className="text-gray-700 text-sm leading-relaxed max-w-md">
                  Interested in bulk orders, corporate partnerships, or custom school uniforms? Fill out the form and our team will get back to you with a detailed proposal within 24 hours.
                </p>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 space-y-8">
                 {[
                   { icon: Mail, label: "EMAIL US", value: "kdsgroup98@gmail.com" },
                   { icon: PhoneCall, label: "CALL US", value: "+977-9855073550" },
                   { icon: MapPin, label: "VISIT US", value: "Lalgadh, Nepal" },
                   { icon: Clock, label: "WORKING HOURS", value: "Sun - Fri: 9 AM - 6 PM" }
                 ].map((item, i) => (
                   <div key={i} className="flex items-center gap-5">
                      <div className="h-12 w-12 bg-[#F4F4F4] rounded-lg flex items-center justify-center text-[#002169]">
                         <item.icon className="h-5 w-5" />
                      </div>
                      <div>
                         <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">{item.label}</span>
                         <p className="text-sm font-bold text-gray-800 uppercase">{item.value}</p>
                      </div>
                   </div>
                 ))}
              </div>

              <div className="relative h-48 w-full rounded-xl overflow-hidden shadow-sm border border-gray-200">
                 <Image 
                   src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=2066&auto=format&fit=crop" 
                   alt="Factory" fill className="object-cover" 
                 />
                 <div className="absolute inset-0 bg-[#002169]/40 flex items-center justify-center">
                    <div className="bg-white/95 px-6 py-2 rounded-full shadow-lg">
                       <span className="text-[10px] font-bold uppercase tracking-wider text-[#002169]">VIEW ON GOOGLE MAPS</span>
                    </div>
                 </div>
              </div>
            </div>

            {/* Right Side: Form */}
            <div className="lg:col-span-7">
               <div className="bg-white rounded-xl p-8 md:p-12 shadow-sm border border-gray-200">
                  <h2 className="text-2xl font-bold text-[#002169] mb-8 uppercase border-b pb-4">Inquiry Form</h2>
                  
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
                         <label className="text-[11px] font-bold uppercase tracking-wider text-gray-700">Full Name</label>
                         <input
                           required
                           name="full_name"
                           placeholder="John Doe"
                           className="w-full bg-[#F4F4F4] border border-transparent rounded h-12 px-4 text-sm font-bold focus:border-[#002169] focus:bg-white transition-all outline-none"
                         />
                       </div>
                       <div className="space-y-2">
                         <label className="text-[11px] font-bold uppercase tracking-wider text-gray-700">Email Address</label>
                         <input
                           required
                           type="email"
                           name="email"
                           placeholder="john@example.com"
                           className="w-full bg-[#F4F4F4] border border-transparent rounded h-12 px-4 text-sm font-bold focus:border-[#002169] focus:bg-white transition-all outline-none"
                         />
                       </div>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="space-y-2">
                         <label className="text-[11px] font-bold uppercase tracking-wider text-gray-700">Phone Number</label>
                         <input
                           name="phone"
                           placeholder="+977-XXXXXXXXXX"
                           className="w-full bg-[#F4F4F4] border border-transparent rounded h-12 px-4 text-sm font-bold focus:border-[#002169] focus:bg-white transition-all outline-none text-gray-900"
                         />
                       </div>
                       <div className="space-y-2">
                         <label className="text-[11px] font-bold uppercase tracking-wider text-gray-700">Inquiry Type</label>
                         <select 
                           name="subject"
                           className="w-full bg-[#F4F4F4] border border-transparent rounded h-12 px-4 text-sm font-bold focus:border-[#002169] focus:bg-white transition-all outline-none appearance-none text-gray-900"
                         >
                           <option>Bulk Order Inquiry</option>
                           <option>Corporate Partnership</option>
                           <option>School Uniforms</option>
                           <option>Custom Manufacturing</option>
                           <option>Other</option>
                         </select>
                       </div>
                     </div>

                     <div className="space-y-2">
                       <label className="text-[11px] font-bold uppercase tracking-wider text-gray-700">Detailed Message</label>
                       <textarea
                         required
                         name="message"
                         rows={6}
                         placeholder="Describe your requirements in detail..."
                         className="w-full bg-[#F4F4F4] border border-transparent rounded p-4 text-sm font-bold focus:border-[#002169] focus:bg-white transition-all outline-none resize-none text-gray-900"
                       />
                     </div>

                     <button
                       disabled={isSubmitting}
                       className="w-full h-14 bg-[#002169] text-white rounded font-bold uppercase tracking-widest text-sm shadow-md hover:bg-[#00184d] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                     >
                       {isSubmitting ? (
                         <div className="h-6 w-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                       ) : (
                         <>SEND INQUIRY <Send className="h-4 w-4" /></>
                       )}
                     </button>

                     <div className="flex items-center justify-center gap-2 pt-4">
                        <ShieldCheck className="h-4 w-4 text-[#FCB800]" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-600">Secure Submission Protected</span>
                     </div>
                  </form>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
