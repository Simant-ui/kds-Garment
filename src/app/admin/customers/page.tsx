import { createClient } from "@/lib/supabase/server"
import { formatPrice, cn } from "@/lib/utils"
import { 
  Users, 
  Mail, 
  Phone, 
  MapPin, 
  Search, 
  MoreVertical,
  UserPlus,
  Download
} from "lucide-react"
import ExportButton from "@/components/admin/ExportButton"

export default async function AdminCustomersPage() {
  const supabase = await createClient()
  
  // Fetch unique customers from orders table (since there's no dedicated customers table in the schema)
  // We'll group by email/phone
  const { data: orders } = await supabase
    .from('orders')
    .select('full_name, email, phone, address, created_at, total_price')
    .order('created_at', { ascending: false })

  const uniqueCustomers: Record<string, any> = {}
  orders?.forEach(order => {
    const key = order.email || order.phone
    if (!uniqueCustomers[key]) {
      uniqueCustomers[key] = {
        name: order.full_name,
        email: order.email,
        phone: order.phone,
        address: order.address,
        totalSpent: 0,
        orderCount: 0,
        lastOrder: order.created_at
      }
    }
    uniqueCustomers[key].totalSpent += (order.total_price || 0)
    uniqueCustomers[key].orderCount += 1
  })

  const customers = Object.values(uniqueCustomers)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customer Base</h1>
          <p className="text-sm text-gray-700 mt-1">Manage and communicate with your clientele</p>
        </div>
        <div className="flex gap-4">
           <ExportButton 
             data={customers || []} 
             filename={`kds-customers-${new Date().toISOString().split('T')[0]}`} 
             label="Export Contacts" 
           />
           <button className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20">
              <UserPlus className="h-4 w-4" /> Add Lead
           </button>
        </div>
      </div>

      {/* Main Table Section */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-600" />
            <input
              type="text"
              placeholder="Search by name, email or phone..."
              className="w-full bg-gray-50 border-none rounded-xl pl-12 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-8 py-5 text-[11px] font-bold uppercase tracking-wider text-gray-600">Customer</th>
                <th className="px-8 py-5 text-[11px] font-bold uppercase tracking-wider text-gray-600">Contact</th>
                <th className="px-8 py-5 text-[11px] font-bold uppercase tracking-wider text-gray-600">Orders</th>
                <th className="px-8 py-5 text-[11px] font-bold uppercase tracking-wider text-gray-600">Total Spent</th>
                <th className="px-8 py-5 text-[11px] font-bold uppercase tracking-wider text-gray-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {customers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center text-gray-600 italic">No customers found in records</td>
                </tr>
              ) : customers.map((customer, i) => (
                <tr key={i} className="group hover:bg-gray-50 transition-colors">
                  <td className="px-8 py-4">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 font-bold text-xs">
                        {customer.name?.[0] || 'U'}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-sm text-gray-900">{customer.name || 'Anonymous'}</span>
                        <span className="text-[10px] text-gray-600 font-medium truncate max-w-[150px]">Last active: {new Date(customer.lastOrder).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-4 space-y-1">
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                       <Mail className="h-3 w-3 text-gray-500" /> {customer.email || 'No Email'}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                       <Phone className="h-3 w-3 text-gray-500" /> {customer.phone || 'No Phone'}
                    </div>
                  </td>
                  <td className="px-8 py-4 font-bold text-sm text-gray-700">
                    {customer.orderCount} Orders
                  </td>
                  <td className="px-8 py-4 font-bold text-sm text-gray-900">
                    {formatPrice(customer.totalSpent)}
                  </td>
                  <td className="px-8 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex justify-between items-center">
           <p className="text-xs text-gray-600 font-medium">Unique Customer Identifiers: {customers.length}</p>
           <div className="flex gap-2">
              <button className="h-8 w-8 flex items-center justify-center rounded-lg bg-white border border-gray-200 text-gray-600 hover:border-blue-500 hover:text-blue-500 transition-all text-xs font-bold">1</button>
           </div>
        </div>
      </div>
    </div>
  )
}
