import { createClient } from "@/lib/supabase/server"
import { formatPrice, cn } from "@/lib/utils"
import { 
  Users, 
  Mail, 
  Lock, 
  ShieldCheck, 
  Trash2, 
  UserPlus,
  ArrowRight
} from "lucide-react"
import { createStaffAction, deleteStaffAction } from "./actions"

export default async function AdminStaffPage() {
  const supabase = await createClient()
  const { data: staffMembers } = await supabase
    .from('staff')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Staff Management</h1>
        <p className="text-gray-500 mt-1 font-medium">Create and manage administrative access for your team.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Create Staff Form */}
        <div className="lg:col-span-1">
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 sticky top-10">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
               <UserPlus className="h-5 w-5 text-blue-600" /> Add New Staff
            </h3>
            <form action={async (formData) => {
  "use server"
  await createStaffAction(formData)
}} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Full Name</label>
                <div className="relative">
                  <Users className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
                  <input 
                    name="full_name"
                    type="text" 
                    placeholder="Enter full name"
                    required
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl pl-12 pr-4 py-3 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
                  <input 
                    name="email"
                    type="email" 
                    placeholder="staff@kdsgarment.com"
                    required
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl pl-12 pr-4 py-3 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Access Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
                  <input 
                    name="password"
                    type="password" 
                    placeholder="••••••••"
                    required
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl pl-12 pr-4 py-3 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                  />
                </div>
              </div>

              <button 
                type="submit"
                className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 active:scale-[0.98]"
              >
                Authorize Member <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Staff List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-8 border-b border-gray-50 bg-gray-50/30">
               <h3 className="text-lg font-bold text-gray-900 tracking-tight">Active Personnel</h3>
               <p className="text-xs text-gray-400 font-medium">Members with administrative privileges</p>
            </div>
            <div className="divide-y divide-gray-50">
              {!staffMembers?.length ? (
                <div className="p-20 text-center space-y-4">
                  <div className="h-16 w-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto">
                    <ShieldCheck className="h-8 w-8" />
                  </div>
                  <p className="text-sm font-medium text-gray-400">No additional staff members authorized yet.</p>
                </div>
              ) : staffMembers.map((staff) => (
                <div key={staff.id} className="p-6 flex items-center justify-between group hover:bg-gray-50/50 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center font-bold shadow-lg shadow-blue-500/20">
                      {staff.full_name[0]}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-900">{staff.full_name}</h4>
                      <p className="text-[11px] text-gray-400 font-medium">{staff.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right hidden sm:block">
                      <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-2 py-1 rounded-md">Staff Access</p>
                      <p className="text-[9px] text-gray-400 mt-1">Authorized on {new Date(staff.created_at).toLocaleDateString()}</p>
                    </div>
                    <form action={async () => {
                      "use server"
                      await deleteStaffAction(staff.id)
                    }}>
                      <button className="p-3 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Security Notice */}
      <div className="bg-amber-50 border border-amber-100 p-6 rounded-2xl flex gap-4">
         <div className="h-10 w-10 bg-amber-500 text-white rounded-xl flex items-center justify-center shrink-0">
            <ShieldCheck className="h-5 w-5" />
         </div>
         <div>
            <h4 className="text-sm font-bold text-amber-900">Security Best Practices</h4>
            <p className="text-xs text-amber-700 mt-1 leading-relaxed">Authorized staff members have full access to orders and inventory. Ensure they use strong passwords and deactivate accounts immediately if a team member leaves the company.</p>
         </div>
      </div>
    </div>
  )
}
