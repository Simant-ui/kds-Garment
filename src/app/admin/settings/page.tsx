"use client"

import { useState } from "react"
import { 
  Settings, 
  User, 
  Bell, 
  Shield, 
  CreditCard, 
  Globe, 
  Save, 
  Mail, 
  Phone, 
  MapPin,
  Clock,
  CheckCircle2
} from "lucide-react"
import { cn } from "@/lib/utils"

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState("general")
  const [isSaving, setIsSaving] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleSave = () => {
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    }, 1500)
  }

  const tabs = [
    { id: "general", name: "General Store", icon: Settings },
    { id: "profile", name: "Admin Profile", icon: User },
    { id: "notifications", name: "Notifications", icon: Bell },
    { id: "security", name: "Security", icon: Shield },
    { id: "payments", name: "Payments", icon: CreditCard },
  ]

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
          <p className="text-sm text-gray-500 mt-1">Configure your enterprise preferences and security</p>
        </div>
        <div className="flex gap-4">
           {showSuccess && (
             <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100 animate-in fade-in slide-in-from-right-4">
                <CheckCircle2 className="h-4 w-4" />
                <span className="text-xs font-bold uppercase tracking-widest">Changes Saved</span>
             </div>
           )}
           <button 
             onClick={handleSave}
             disabled={isSaving}
             className="bg-blue-600 text-white px-8 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 active:scale-95 disabled:opacity-50"
           >
              {isSaving ? "Saving..." : <><Save className="h-4 w-4" /> Save Preferences</>}
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 text-sm font-bold",
                activeTab === tab.id 
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" 
                  : "text-gray-400 hover:bg-white hover:text-gray-900"
              )}
            >
              <tab.icon className="h-5 w-5" />
              {tab.name}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3 bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
           {activeTab === "general" && (
             <div className="p-10 space-y-10 animate-in fade-in duration-500">
                {/* Store Identity */}
                <section className="space-y-6">
                   <div className="flex items-center gap-3 border-b border-gray-50 pb-4">
                      <Globe className="h-5 w-5 text-blue-600" />
                      <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em]">Store Identity</h3>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                         <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Business Name</label>
                         <input 
                           type="text" 
                           defaultValue="KDS Garment" 
                           className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                         />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Support Email</label>
                         <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
                            <input 
                              type="email" 
                              defaultValue="kdsgroup98@gmail.com" 
                              className="w-full bg-gray-50 border border-gray-100 rounded-xl pl-12 pr-4 py-3 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                            />
                         </div>
                      </div>
                   </div>
                </section>

                {/* Contact Information */}
                <section className="space-y-6">
                   <div className="flex items-center gap-3 border-b border-gray-50 pb-4">
                      <Phone className="h-5 w-5 text-blue-600" />
                      <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em]">Contact Channels</h3>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                         <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Primary Phone</label>
                         <input 
                           type="text" 
                           defaultValue="+977 9855073550" 
                           className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                         />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Physical Location</label>
                         <div className="relative">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
                            <input 
                              type="text" 
                              defaultValue="Lalgadh, Nepal" 
                              className="w-full bg-gray-50 border border-gray-100 rounded-xl pl-12 pr-4 py-3 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                            />
                         </div>
                      </div>
                   </div>
                </section>

                {/* Regional & Localization */}
                <section className="space-y-6">
                   <div className="flex items-center gap-3 border-b border-gray-50 pb-4">
                      <Clock className="h-5 w-5 text-blue-600" />
                      <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em]">Regional & Localization</h3>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                         <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Store Currency</label>
                         <select className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all appearance-none">
                            <option>NPR (Nepalese Rupee)</option>
                            <option>USD (United States Dollar)</option>
                            <option>INR (Indian Rupee)</option>
                         </select>
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Time Zone</label>
                         <select className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all appearance-none">
                            <option>(GMT+05:45) Kathmandu</option>
                            <option>(GMT+05:30) India</option>
                         </select>
                      </div>
                   </div>
                </section>
             </div>
           )}

           {activeTab !== "general" && (
             <div className="p-20 text-center space-y-4 animate-in fade-in duration-500">
                <div className="h-16 w-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto">
                   <Settings className="h-8 w-8" />
                </div>
                <div>
                   <h3 className="text-lg font-bold text-gray-900">{tabs.find(t => t.id === activeTab)?.name} Settings</h3>
                   <p className="text-xs text-gray-400 font-medium max-w-xs mx-auto mt-2">These configurations are currently being provisioned for your enterprise suite.</p>
                </div>
                <button className="text-blue-600 text-xs font-bold uppercase tracking-widest hover:underline">Request Priority Activation</button>
             </div>
           )}
        </div>
      </div>
    </div>
  )
}
