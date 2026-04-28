import { createClient } from "@/lib/supabase/server"
import { formatPrice, cn } from "@/lib/utils"
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  ArrowUpRight, 
  ArrowDownRight,
  MousePointer2,
  Eye,
  Percent
} from "lucide-react"

export default async function AdminAnalyticsPage() {
  const supabase = await createClient()
  const { data: orders } = await supabase.from('orders').select('*')
  
  const totalRevenue = orders?.reduce((acc, o) => acc + (o.total_price || 0), 0) || 0
  const totalOrders = orders?.length || 0

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Performance Analytics</h1>
        <p className="text-sm text-gray-500 mt-1">Real-time data visualization and market insights</p>
      </div>

      {/* Primary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Total Visits", value: "42.8k", trend: "+14.2%", isUp: true, icon: Eye, color: "bg-blue-600" },
          { label: "Conversion Rate", value: "3.24%", trend: "+1.2%", isUp: true, icon: Percent, color: "bg-emerald-600" },
          { label: "Active Users", value: "1.2k", trend: "-2.4%", isUp: false, icon: Users, color: "bg-indigo-600" },
          { label: "Avg. Session", value: "4m 32s", trend: "+0.5%", isUp: true, icon: MousePointer2, color: "bg-amber-600" }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-4">
             <div className="flex justify-between items-center">
                <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center text-white shadow-lg", stat.color)}>
                   <stat.icon className="h-5 w-5" />
                </div>
                <div className={cn(
                  "flex items-center gap-1 text-[10px] font-bold",
                  stat.isUp ? "text-emerald-600" : "text-rose-600"
                )}>
                  {stat.isUp ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                  {stat.trend}
                </div>
             </div>
             <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
             </div>
          </div>
        ))}
      </div>

      {/* Main Graphs Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         {/* User Acquisition Graph */}
         <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-8">
               <div>
                  <h3 className="text-lg font-bold text-gray-900">User Acquisition</h3>
                  <p className="text-xs text-gray-400 font-medium">Monthly new registration trends</p>
               </div>
               <select className="bg-gray-50 border-none rounded-lg text-xs font-bold px-3 py-2 text-gray-500">
                  <option>Last 6 Months</option>
                  <option>Last Year</option>
               </select>
            </div>
            
            <div className="h-64 w-full relative pt-10">
               {/* Grid Lines */}
               <div className="absolute inset-0 flex flex-col justify-between opacity-5">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-full h-px bg-gray-900" />
                  ))}
               </div>
               
               {/* SVG Area Chart */}
               <svg className="w-full h-full" viewBox="0 0 1000 300" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="userGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path 
                    d="M0,250 Q100,200 200,220 T400,100 T600,150 T800,50 T1000,80 L1000,300 L0,300 Z" 
                    fill="url(#userGradient)"
                  />
                  <path 
                    d="M0,250 Q100,200 200,220 T400,100 T600,150 T800,50 T1000,80" 
                    fill="none" 
                    stroke="#3B82F6" 
                    strokeWidth="4" 
                    strokeLinecap="round"
                    className="drop-shadow-lg"
                  />
               </svg>
            </div>
            
            <div className="flex justify-between mt-6 px-2">
               {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map(m => (
                 <span key={m} className="text-[10px] font-bold text-gray-400 uppercase">{m}</span>
               ))}
            </div>
         </div>

         {/* Sales by Category (Bar Chart) */}
         <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-8">
               <div>
                  <h3 className="text-lg font-bold text-gray-900">Category Distribution</h3>
                  <p className="text-xs text-gray-400 font-medium">Sales split by collection type</p>
               </div>
               <div className="flex gap-2">
                  <div className="flex items-center gap-2">
                     <div className="h-2 w-2 rounded-full bg-blue-500" />
                     <span className="text-[10px] font-bold text-gray-400 uppercase">Sales</span>
                  </div>
               </div>
            </div>
            
            <div className="h-64 flex items-end justify-between gap-4 px-4">
               {[
                 { label: "Men", value: 85, color: "bg-blue-500" },
                 { label: "Women", value: 65, color: "bg-indigo-500" },
                 { label: "Kids", value: 45, color: "bg-emerald-500" },
                 { label: "Accs", value: 30, color: "bg-amber-500" },
                 { label: "New", value: 55, color: "bg-rose-500" }
               ].map((bar, i) => (
                 <div key={i} className="flex-1 flex flex-col items-center gap-4 group">
                    <div className="relative w-full">
                       <div 
                         className={cn("w-full rounded-t-xl transition-all duration-700 group-hover:opacity-80", bar.color)} 
                         style={{ height: `${bar.value * 2}px` }} 
                       />
                       <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                          {bar.value}%
                       </div>
                    </div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{bar.label}</span>
                 </div>
               ))}
            </div>
         </div>
      </div>

      {/* Market Penetration Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 col-span-2">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Geographic Reach</h3>
            <div className="space-y-6">
               {[
                 { region: "Kathmandu Valley", percentage: 65, sales: "Rs. 420k" },
                 { region: "Pokhara / West", percentage: 22, sales: "Rs. 140k" },
                 { region: "Biratnagar / East", percentage: 13, sales: "Rs. 85k" }
               ].map((region, i) => (
                 <div key={i} className="space-y-2">
                    <div className="flex justify-between items-center">
                       <span className="text-sm font-bold text-gray-700">{region.region}</span>
                       <span className="text-xs font-bold text-blue-600">{region.sales}</span>
                    </div>
                    <div className="h-2 w-full bg-gray-50 rounded-full overflow-hidden">
                       <div className="h-full bg-blue-600 rounded-full" style={{ width: `${region.percentage}%` }} />
                    </div>
                 </div>
               ))}
            </div>
         </div>
         <div className="bg-blue-600 p-8 rounded-3xl shadow-xl shadow-blue-500/20 text-white flex flex-col justify-between">
            <div>
               <h3 className="text-lg font-bold">Growth Insight</h3>
               <p className="text-xs text-blue-100 mt-2 leading-relaxed font-medium">Your store conversion rate has increased by 15% in the last 7 days. We recommend increasing stock for the "Men" collection based on high view frequency.</p>
            </div>
            <button className="mt-8 bg-white text-blue-600 py-3 rounded-xl font-bold text-sm hover:bg-blue-50 transition-all">
               View Full Report
            </button>
         </div>
      </div>
    </div>
  )
}
