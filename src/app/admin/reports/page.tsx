import Link from "next/link"
import { 
  BookText, 
  TrendingUp, 
  Package, 
  Truck, 
  Users, 
  CreditCard, 
  UserCircle, 
  Receipt, 
  ShoppingCart, 
  ChevronRight,
  Shield
} from "lucide-react"

const reportModules = [
  { 
    name: "Day Book", 
    icon: BookText, 
    href: "/admin/daybook", 
    color: "bg-teal-50 text-teal-600",
    description: "Daily transaction journal and cash flow"
  },
  { 
    name: "Sales", 
    icon: TrendingUp, 
    href: "/admin/bills", 
    color: "bg-blue-50 text-blue-600",
    description: "Detailed sales analysis and revenue tracking"
  },
  { 
    name: "Stock", 
    icon: Package, 
    href: "/admin/reports/stock", 
    color: "bg-amber-50 text-amber-600",
    description: "Inventory levels, stock alerts and movements"
  },
  { 
    name: "Supplier", 
    icon: Truck, 
    href: "/admin/reports/supplier", 
    color: "bg-indigo-50 text-indigo-600",
    description: "Supplier performance and purchase history"
  },
  { 
    name: "Staff", 
    icon: Users, 
    href: "/admin/reports/staff", 
    color: "bg-rose-50 text-rose-600",
    description: "Employee performance and attendance reports"
  },
  { 
    name: "Credit", 
    icon: CreditCard, 
    href: "/admin/reports/credit", 
    color: "bg-cyan-50 text-cyan-600",
    description: "Credit sales and outstanding payments"
  },
  { 
    name: "Customer", 
    icon: UserCircle, 
    href: "/admin/reports/customer", 
    color: "bg-emerald-50 text-emerald-600",
    description: "Customer behavior and loyalty insights"
  },
  { 
    name: "Tax", 
    icon: Receipt, 
    href: "/admin/reports/tax", 
    color: "bg-slate-50 text-slate-600",
    description: "Calculated 13% tax on net profit and compliance"
  },
  { 
    name: "Purchase", 
    icon: ShoppingCart, 
    href: "/admin/reports/purchase", 
    color: "bg-orange-50 text-orange-600",
    description: "Procurement analysis and cost tracking"
  },
  { 
    name: "Audit Reports", 
    icon: Shield, 
    href: "/admin/reports/audit", 
    color: "bg-violet-50 text-violet-600",
    description: "Income Statement, Balance Sheet and Ledger audit packet"
  },
]

export default function AdminReportsPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#1E3A8A]">Reports Center</h1>
          <p className="text-gray-500 mt-2">Access comprehensive business intelligence and audit logs</p>
        </div>
        <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3">
          <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-sm font-bold text-gray-700 uppercase tracking-wider">Live System Sync</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {reportModules.map((item, idx) => {
          const Icon = item.icon
          return (
            <Link 
              key={idx} 
              href={item.href}
              className="group bg-white p-8 rounded-[2.5rem] shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-500 border border-gray-100 flex flex-col items-center text-center relative overflow-hidden"
            >
              {/* Subtle Background Pattern */}
              <div className={`absolute top-0 right-0 w-32 h-32 opacity-10 rounded-bl-full ${item.color.split(' ')[0]} -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-700`} />
              
              <div className={`h-20 w-20 ${item.color} rounded-3xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-500 group-hover:rotate-6`}>
                <Icon className="h-10 w-10" />
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-2">{item.name}</h3>
              <p className="text-xs text-gray-500 font-medium leading-relaxed px-2">
                {item.description}
              </p>
              
              <div className="mt-6 p-2 bg-gray-50 rounded-full group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                <ChevronRight className="h-4 w-4" />
              </div>
            </Link>
          )
        })}
      </div>

      {/* Quick Stats Section */}
      <div className="bg-[#1E3A8A] rounded-[3rem] p-12 text-white relative overflow-hidden shadow-2xl">
         <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl" />
         <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-12 divide-y md:divide-y-0 md:divide-x divide-white/10 text-center">
            <div>
               <p className="text-white/60 text-xs font-bold uppercase tracking-[0.2em] mb-3">Today's Revenue</p>
               <p className="text-4xl font-bold">रू 1,24,500</p>
            </div>
            <div>
               <p className="text-white/60 text-xs font-bold uppercase tracking-[0.2em] mb-3">Active Stock SKUs</p>
               <p className="text-4xl font-bold">1,452</p>
            </div>
            <div>
               <p className="text-white/60 text-xs font-bold uppercase tracking-[0.2em] mb-3">Monthly Growth</p>
               <p className="text-4xl font-bold text-green-400">+18.4%</p>
            </div>
         </div>
      </div>
    </div>
  )
}
