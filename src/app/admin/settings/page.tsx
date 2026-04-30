"use client"

import { useState, useEffect } from "react"
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
  CheckCircle2,
  Users,
  UserPlus,
  Trash2,
  Lock,
  ArrowRight
} from "lucide-react"
import { cn } from "@/lib/utils"
import { createStaffAction, deleteStaffAction } from "../staff/actions"
import { createClient } from "@/lib/supabase/client"

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState("general")
  const [isSaving, setIsSaving] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [staffMembers, setStaffMembers] = useState<any[]>([])
  const [isLoadingStaff, setIsLoadingStaff] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    if (activeTab === "staff") {
      fetchStaff()
    }
  }, [activeTab])

  const fetchStaff = async () => {
    setIsLoadingStaff(true)
    const { data } = await supabase
      .from('staff')
      .select('*')
      .order('created_at', { ascending: false })
    setStaffMembers(data || [])
    setIsLoadingStaff(false)
  }

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
    { id: "staff", name: "Staff Management", icon: Users },
    { id: "profile", name: "Admin Profile", icon: User },
    { id: "notifications", name: "Notifications", icon: Bell },
    { id: "security", name: "Security", icon: Shield },
  ]

  const handleCreateStaff = async (formData: FormData) => {
    const res = await createStaffAction(formData)
    if (res.success) {
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
      fetchStaff()
    } else {
      alert(res.error || "Failed to create staff")
    }
  }

  const handleDeleteStaff = async (id: string) => {
    if (!confirm("Are you sure you want to remove this staff member?")) return
    const res = await deleteStaffAction(id)
    if (res.success) {
      fetchStaff()
    }
  }

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 uppercase">System Settings</h1>
          <p className="text-sm text-gray-500 mt-1">Configure your enterprise preferences and security</p>
        </div>
        <div className="flex gap-4">
           {showSuccess && (
             <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100 animate-in fade-in slide-in-from-right-4">
                <CheckCircle2 className="h-4 w-4" />
                <span className="text-xs font-bold uppercase tracking-widest text-[10px]">Changes Applied</span>
             </div>
           )}
           {activeTab === "general" && (
             <button 
               onClick={handleSave}
               disabled={isSaving}
               className="bg-[#002169] text-white px-8 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 active:scale-95 disabled:opacity-50"
             >
                {isSaving ? "Saving..." : <><Save className="h-4 w-4" /> Save Preferences</>}
             </button>
           )}
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
                  ? "bg-[#002169] text-white shadow-xl shadow-blue-500/10 scale-[1.02]" 
                  : "text-gray-400 hover:bg-white hover:text-gray-900"
              )}
            >
              <tab.icon className="h-5 w-5" />
              {tab.name}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3 bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden min-h-[600px]">
           {activeTab === "general" && (
             <div className="p-10 space-y-10 animate-in fade-in duration-500">
                {/* Store Identity */}
                <section className="space-y-6">
                   <div className="flex items-center gap-3 border-b border-gray-50 pb-4">
                      <Globe className="h-5 w-5 text-blue-600" />
                      <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Store Identity</h3>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Business Name</label>
                         <input 
                           type="text" 
                           defaultValue="KDS Readymade Udhyog" 
                           className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-4 py-3 text-sm font-bold text-gray-700 focus:border-blue-600 focus:bg-white outline-none transition-all"
                         />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Support Email</label>
                         <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
                            <input 
                              type="email" 
                              defaultValue="kdsgroup98@gmail.com" 
                              className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl pl-12 pr-4 py-3 text-sm font-bold text-gray-700 focus:border-blue-600 focus:bg-white outline-none transition-all"
                            />
                         </div>
                      </div>
                   </div>
                </section>

                {/* Contact Information */}
                <section className="space-y-6">
                   <div className="flex items-center gap-3 border-b border-gray-50 pb-4">
                      <Phone className="h-5 w-5 text-blue-600" />
                      <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Contact Channels</h3>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Primary Phone</label>
                         <input 
                           type="text" 
                           defaultValue="+977 9855073550" 
                           className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-4 py-3 text-sm font-bold text-gray-700 focus:border-blue-600 focus:bg-white outline-none transition-all"
                         />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Physical Location</label>
                         <div className="relative">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
                            <input 
                              type="text" 
                              defaultValue="Lalgadh, Nepal" 
                              className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl pl-12 pr-4 py-3 text-sm font-bold text-gray-700 focus:border-blue-600 focus:bg-white outline-none transition-all"
                            />
                         </div>
                      </div>
                   </div>
                </section>
             </div>
           )}

           {activeTab === "staff" && (
             <div className="p-10 space-y-10 animate-in fade-in duration-500">
                <section className="space-y-8">
                   <div className="flex items-center justify-between border-b border-gray-50 pb-4">
                      <div className="flex items-center gap-3">
                        <Users className="h-5 w-5 text-blue-600" />
                        <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Staff Access Control</h3>
                      </div>
                   </div>

                   {/* Add Staff Form */}
                   <div className="bg-gray-50/50 p-8 rounded-3xl border border-gray-100">
                      <h4 className="text-sm font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <UserPlus className="h-4 w-4 text-blue-600" /> Authorize New Member
                      </h4>
                      <form action={handleCreateStaff} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">First Name</label>
                          <input name="first_name" required className="w-full bg-white border-2 border-gray-100 rounded-xl px-4 py-2.5 text-sm font-bold" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Last Name</label>
                          <input name="last_name" required className="w-full bg-white border-2 border-gray-100 rounded-xl px-4 py-2.5 text-sm font-bold" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Contact Number</label>
                          <input name="phone" required className="w-full bg-white border-2 border-gray-100 rounded-xl px-4 py-2.5 text-sm font-bold" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Email Address</label>
                          <input name="email" type="email" required className="w-full bg-white border-2 border-gray-100 rounded-xl px-4 py-2.5 text-sm font-bold" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">New Password</label>
                          <input name="password" type="password" required className="w-full bg-white border-2 border-gray-100 rounded-xl px-4 py-2.5 text-sm font-bold" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Confirm Password</label>
                          <input name="confirm_password" type="password" required className="w-full bg-white border-2 border-gray-100 rounded-xl px-4 py-2.5 text-sm font-bold" />
                        </div>
                        <div className="md:col-span-2 pt-2">
                          <button type="submit" className="bg-[#002169] text-white px-8 py-3 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-blue-700 transition-all">
                            Create Staff Account <ArrowRight className="h-4 w-4" />
                          </button>
                        </div>
                      </form>
                   </div>

                   {/* Staff List */}
                   <div className="space-y-4">
                      <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Current Staff Members</h4>
                      <div className="border border-gray-100 rounded-3xl overflow-hidden">
                        <table className="w-full text-left">
                          <thead className="bg-gray-50/50">
                            <tr>
                              <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase">Name</th>
                              <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase">Email</th>
                              <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase text-right">Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-50">
                            {staffMembers.map((staff) => (
                              <tr key={staff.id} className="group hover:bg-gray-50/50 transition-all">
                                <td className="px-6 py-4 text-sm font-bold text-gray-700">{staff.first_name} {staff.last_name}</td>
                                <td className="px-6 py-4 text-xs font-medium text-gray-400">{staff.email}</td>
                                <td className="px-6 py-4 text-right">
                                  <button onClick={() => handleDeleteStaff(staff.id)} className="p-2 text-gray-300 hover:text-rose-600 transition-colors">
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                            {staffMembers.length === 0 && (
                              <tr>
                                <td colSpan={3} className="px-6 py-12 text-center text-sm font-medium text-gray-400">No staff members found.</td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                   </div>
                </section>
             </div>
           )}

           {activeTab !== "general" && activeTab !== "staff" && (
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
