import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { formatPrice, cn } from "@/lib/utils"
import { 
  TrendingUp, 
  ShoppingBag, 
  Package, 
  Users, 
  Plus,
  ArrowUp,
  ArrowDown,
  MoreVertical,
  Calendar,
  CheckCircle2,
  Clock,
  UserPlus,
  BarChart3
} from "lucide-react"
import Link from "next/link"
import ExportButton from "@/components/admin/ExportButton"

export default async function AdminDashboard() {
  const supabase = await createClient()
  
  // Fetch recent orders for stats and table
  const { data: orders } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })

  const tzOptions = { timeZone: 'Asia/Kathmandu' } as const;
  const formatDateStr = (d: Date) => new Intl.DateTimeFormat('en-CA', tzOptions).format(d)

  // Aggregate sales by day for the last 7 days
  const last7Days = [...Array(7)].map((_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    return formatDateStr(d)
  })

  const dailyRevenue = last7Days.map(date => {
    return orders?.filter(o => formatDateStr(new Date(o.created_at)) === date)
      .reduce((acc, o) => acc + (o.total_price || o.total_amount || 0), 0) || 0
  })

  const totalRevenue = orders?.reduce((acc, o) => acc + (o.total_price || o.total_amount || 0), 0) || 0
  const totalOrdersCount = orders?.length || 0
  
  const monthlyRevenue = orders?.filter(o => {
    const d = new Date(o.created_at)
    // Convert to Nepal time for accurate monthly filtering
    const month = parseInt(new Intl.DateTimeFormat('en-CA', { ...tzOptions, month: 'numeric' }).format(d))
    const year = parseInt(new Intl.DateTimeFormat('en-CA', { ...tzOptions, year: 'numeric' }).format(d))
    
    const currentMonth = parseInt(new Intl.DateTimeFormat('en-CA', { ...tzOptions, month: 'numeric' }).format(new Date()))
    const currentYear = parseInt(new Intl.DateTimeFormat('en-CA', { ...tzOptions, year: 'numeric' }).format(new Date()))

    return month === currentMonth && year === currentYear
  }).reduce((acc, o) => acc + (o.total_price || o.total_amount || 0), 0) || 0

  const pendingOrdersCount = orders?.filter(o => o.status === 'pending').length || 0

  // Calculate max revenue for graph scaling
  const maxRevenue = Math.max(...dailyRevenue, 10)
  const graphPoints = dailyRevenue.map((rev, i) => {
    const x = (i * (1000 / 6))
    const y = 300 - (rev / maxRevenue * 250) // Map to y-axis height
    return `${x},${y}`
  }).join(' ')

  const stats = [
    { label: "Total Revenue", value: formatPrice(totalRevenue), change: "+12.5%", isUp: true, icon: TrendingUp, color: "text-blue-600 bg-blue-50", sparkColor: "#3B82F6" },
    { label: "New Orders", value: totalOrdersCount, change: "+8.2%", isUp: true, icon: ShoppingBag, color: "text-emerald-600 bg-emerald-50", sparkColor: "#10B981" },
    { label: "Monthly Sales", value: formatPrice(monthlyRevenue), change: "+5.1%", isUp: true, icon: BarChart3, color: "text-amber-600 bg-amber-50", sparkColor: "#F59E0B" },
    { label: "Pending Orders", value: pendingOrdersCount.toString(), change: "-2.4%", isUp: false, icon: Clock, color: "text-rose-600 bg-rose-50", sparkColor: "#F43F5E" }
  ]

  const hour = new Date().getHours()
  let timeGreeting = "Good morning"
  if (hour >= 12 && hour < 17) timeGreeting = "Good afternoon"
  else if (hour >= 17 && hour < 21) timeGreeting = "Good evening"
  else if (hour >= 21 || hour < 5) timeGreeting = "Good night"

  const cookieStore = await cookies()
  let staffName = "Admin"
  const staffNameCookie = cookieStore.get('staff_name')
  if (staffNameCookie) {
    staffName = decodeURIComponent(staffNameCookie.value.replace(/\+/g, ' '))
  }

  return (
    <div className="space-y-10">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{timeGreeting}, {staffName}! 👋</h1>
          <p className="text-sm text-gray-500 mt-1 font-medium italic">"Every day is a new opportunity to grow KDS Garment"</p>
        </div>
        <div className="flex gap-4">
           <ExportButton 
             data={orders || []} 
             filename={`kds-summary-${new Date().toISOString().split('T')[0]}`} 
             label="Download Report" 
           />
           <Link href="/admin/products" className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-3 hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
              <Plus className="h-4 w-4" /> New inventory
           </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between h-48 relative overflow-hidden group hover:shadow-xl transition-all duration-300">
             <div className="flex justify-between items-start">
                <div>
                   <p className="text-xs font-black text-gray-900 uppercase tracking-wider">{stat.label}</p>
                   <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                </div>
                <div className={cn("p-3 rounded-2xl", stat.color)}>
                   <stat.icon className="h-5 w-5" />
                </div>
             </div>
             
             <div className="flex items-center gap-2 mt-4">
                <div className={cn("flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full", stat.isUp ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600")}>
                   {stat.isUp ? <ArrowUp className="h-2.5 w-2.5 mr-1" /> : <ArrowDown className="h-2.5 w-2.5 mr-1" />}
                   {stat.change}
                </div>
             </div>

             <div className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none opacity-40">
                <svg viewBox="0 0 100 40" className="h-full w-full preserve-3d">
                   <path 
                     d={stat.isUp ? "M0 35 Q 25 30, 50 20 T 100 5" : "M0 5 Q 25 10, 50 20 T 100 35"} 
                     fill="none" 
                     stroke={stat.sparkColor} 
                     strokeWidth="3" 
                     strokeLinecap="round" 
                   />
                </svg>
             </div>
          </div>
        ))}
      </div>

      {/* Main Insights Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Performance Chart */}
         <div className="lg:col-span-2 bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-10">
               <h3 className="text-lg font-bold text-gray-900">Sales Performance <span className="text-gray-400 font-medium">(Last 7 Days)</span></h3>
               <div className="flex items-center gap-3 bg-gray-50 p-1.5 rounded-lg border border-gray-100">
                  <button className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-gray-400">Transactions</button>
                  <button className="px-3 py-1.5 bg-white shadow-sm rounded-md text-[10px] font-bold uppercase tracking-widest text-gray-900 border border-gray-100">Revenue</button>
               </div>
            </div>

            <div className="h-80 w-full relative">
               <svg viewBox="0 0 1000 300" className="h-full w-full">
                  <defs>
                    <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  
                  {[0, 1, 2, 3].map(i => (
                    <line key={i} x1="0" y1={i * 100} x2="1000" y2={i * 100} stroke="#F3F4F6" strokeWidth="2" />
                  ))}

                  <path 
                    d={`M0,300 L${graphPoints} L1000,300 Z`} 
                    fill="url(#blueGrad)"
                  />
                  <path 
                    d={`M${graphPoints}`} 
                    fill="none" 
                    stroke="#3B82F6" 
                    strokeWidth="4" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    className="drop-shadow-lg"
                  />
               </svg>
               
               <div className="flex justify-between mt-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2">
                  {last7Days.map((day, i) => {
                    const parts = day.split('-') // YYYY-MM-DD
                    return <span key={i}>{parts[1]}/{parts[2]}</span>
                  })}
               </div>
            </div>
         </div>

         {/* Recent Activity */}
         <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 flex flex-col">
            <h3 className="text-lg font-bold text-gray-900 mb-8">Recent Activity</h3>
            <div className="flex-1 space-y-6">
               <div className="overflow-x-auto w-full">
                 <table className="w-full text-left border-collapse whitespace-nowrap">
                    <thead>
                      <tr className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                         <th className="pb-4">Event</th>
                         <th className="pb-4">User</th>
                         <th className="pb-4 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {orders?.slice(0, 5).map((order) => (
                        <tr key={order.id} className="group hover:bg-gray-50 transition-colors">
                          <td className="py-4 pr-4">
                             <div className="flex flex-col">
                                <span className="text-xs font-bold text-gray-900">Order Placed</span>
                                <span className="text-[9px] text-gray-400 mt-0.5">{new Date(order.created_at).toLocaleDateString()}</span>
                             </div>
                          </td>
                          <td className="py-4 pr-4">
                             <div className="flex items-center gap-3">
                                <div className="h-8 w-8 bg-gray-100 rounded-full overflow-hidden border border-gray-200 shrink-0">
                                   <img src={`https://i.pravatar.cc/100?u=${order.id}`} alt="u" className="h-full w-full object-cover" />
                                </div>
                                <span className="text-[11px] font-bold text-gray-700 truncate max-w-[120px]">{order.full_name || order.customer_name || 'Customer'}</span>
                             </div>
                          </td>
                          <td className="py-4 text-right">
                             <span className={cn(
                               "px-3 py-1 rounded-lg text-[9px] font-bold uppercase tracking-widest",
                               order.status === 'delivered' ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-blue-600"
                             )}>
                               {order.status || 'pending'}
                             </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                 </table>
               </div>
            </div>
            <Link href="/admin/orders" className="mt-8 text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center justify-center gap-2 group transition-all">
               View All Activity <Plus className="h-3 w-3 rotate-45 group-hover:translate-x-0.5 transition-transform" />
            </Link>
         </div>
      </div>
    </div>
  )
}
