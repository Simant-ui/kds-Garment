import { createClient } from "@/lib/supabase/server"
import { formatPrice, cn } from "@/lib/utils"
import { 
  Users, 
  Mail, 
  Lock, 
  ShieldCheck, 
  Trash2, 
  UserPlus,
  ArrowRight,
  Phone,
  User
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight uppercase">Staff Management</h1>
          <p className="text-gray-500 mt-1 font-medium italic">"Empower your team with administrative access"</p>
        </div>
        <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3">
          <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse" />
          <span className="text-xs font-black text-blue-600 uppercase tracking-widest">{staffMembers?.length || 0} Active Staff</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Create Staff Form */}
        <div className="lg:col-span-4">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100 sticky top-10">
            <h3 className="text-xl font-bold text-gray-900 mb-8 flex items-center gap-3">
               <div className="h-10 w-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                  <UserPlus className="h-5 w-5" />
               </div>
               Add New Staff
            </h3>
            
            <form action={createStaffAction as unknown as (payload: FormData) => void} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">First Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
                    <input 
                      name="first_name"
                      type="text" 
                      placeholder="First"
                      required
                      className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl pl-12 pr-4 py-3 text-sm font-bold text-gray-700 focus:border-blue-600 focus:bg-white outline-none transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Last Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
                    <input 
                      name="last_name"
                      type="text" 
                      placeholder="Last"
                      required
                      className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl pl-12 pr-4 py-3 text-sm font-bold text-gray-700 focus:border-blue-600 focus:bg-white outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Contact Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
                  <input 
                    name="phone"
                    type="tel" 
                    placeholder="98XXXXXXXX"
                    required
                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl pl-12 pr-4 py-3 text-sm font-bold text-gray-700 focus:border-blue-600 focus:bg-white outline-none transition-all"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
                  <input 
                    name="email"
                    type="email" 
                    placeholder="staff@kdsgarment.com"
                    required
                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl pl-12 pr-4 py-3 text-sm font-bold text-gray-700 focus:border-blue-600 focus:bg-white outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
                  <input 
                    name="password"
                    type="password" 
                    placeholder="••••••••"
                    required
                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl pl-12 pr-4 py-3 text-sm font-bold text-gray-700 focus:border-blue-600 focus:bg-white outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
                  <input 
                    name="confirm_password"
                    type="password" 
                    placeholder="••••••••"
                    required
                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl pl-12 pr-4 py-3 text-sm font-bold text-gray-700 focus:border-blue-600 focus:bg-white outline-none transition-all"
                  />
                </div>
              </div>

              <button 
                type="submit"
                className="w-full bg-[#002169] text-white py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-[0.98] mt-4"
              >
                AUTHORIZE STAFF MEMBER <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Staff List */}
        <div className="lg:col-span-8">
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-8 border-b border-gray-50 bg-gray-50/30 flex justify-between items-center">
               <div>
                  <h3 className="text-lg font-bold text-gray-900 tracking-tight uppercase">Active Personnel</h3>
                  <p className="text-xs text-gray-400 font-medium italic">Members with administrative privileges</p>
               </div>
            </div>
            <div className="divide-y divide-gray-50">
              {!staffMembers?.length ? (
                <div className="p-24 text-center space-y-6">
                  <div className="h-20 w-20 bg-blue-50 text-blue-600 rounded-[2rem] flex items-center justify-center mx-auto shadow-inner">
                    <ShieldCheck className="h-10 w-10" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-lg font-bold text-gray-800">No staff members yet</p>
                    <p className="text-sm font-medium text-gray-400">Add your team members to manage the platform together.</p>
                  </div>
                </div>
              ) : (
                <div className="overflow-x-auto w-full">
                  <table className="w-full text-left border-collapse whitespace-nowrap">
                    <thead>
                      <tr className="bg-gray-50/50">
                        <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Name</th>
                        <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Contact</th>
                        <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Access Level</th>
                        <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {staffMembers.map((staff) => (
                        <tr key={staff.id} className="group hover:bg-gray-50/50 transition-all">
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-4">
                              <div className="h-10 w-10 bg-[#002169] text-white rounded-xl flex items-center justify-center font-bold shadow-lg shadow-blue-500/10">
                                {staff.first_name?.[0] || staff.full_name?.[0]}
                              </div>
                              <div>
                                <h4 className="text-sm font-bold text-gray-900">{staff.first_name} {staff.last_name}</h4>
                                <p className="text-[11px] text-gray-400 font-medium">{staff.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <span className="text-xs font-bold text-gray-700">{staff.phone || 'N/A'}</span>
                          </td>
                          <td className="px-8 py-6">
                             <span className="px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest bg-blue-50 text-blue-600 border border-blue-100">
                                {staff.role}
                             </span>
                          </td>
                          <td className="px-8 py-6 text-right">
                             <form action={deleteStaffAction.bind(null, staff.id) as unknown as (payload: FormData) => void}>
                               <button className="p-3 text-gray-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all">
                                 <Trash2 className="h-4 w-4" />
                               </button>
                             </form>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Security Notice */}
      <div className="bg-[#002169] p-8 rounded-3xl flex flex-col md:flex-row gap-8 items-center text-white relative overflow-hidden">
         <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl" />
         <div className="h-16 w-16 bg-white/10 rounded-2xl flex items-center justify-center shrink-0 border border-white/10">
            <ShieldCheck className="h-8 w-8 text-[#FCB800]" />
         </div>
         <div className="flex-1 space-y-2">
            <h4 className="text-lg font-bold">Security Best Practices</h4>
            <p className="text-sm text-white/70 leading-relaxed max-w-3xl">Authorized staff members have full access to orders and inventory. Ensure they use strong passwords and deactivate accounts immediately if a team member leaves the company.</p>
         </div>
      </div>
    </div>
  )
}
