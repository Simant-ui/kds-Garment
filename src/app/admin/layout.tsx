"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard, 
  BarChart3, 
  Users, 
  Package, 
  ShoppingBag, 
  FileText, 
  Settings,
  LogOut,
  Search,
  Bell,
  MessageSquare,
  Filter,
  ChevronDown,
  Receipt,
  Shield,
  User
} from "lucide-react"
import { cn } from "@/lib/utils"
import { adminLogoutAction } from "@/app/login/actions"

const sidebarLinks = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Inventory", href: "/admin/products", icon: Package },
  { name: "POS Billing", href: "/admin/billing", icon: Receipt },
  { name: "Bills History", href: "/admin/bills", icon: FileText },
  { name: "Inquiries", href: "/admin/inquiries", icon: Users },
  { name: "Customer Support", href: "/admin/support", icon: MessageSquare, badge: "Live" },
  { name: "Orders", href: "/admin/orders", icon: ShoppingBag },
  { name: "Reports", href: "/admin/reports", icon: BarChart3 },
  { name: "Settings", href: "/admin/settings", icon: Settings },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-[#F0F2F5] flex font-sans selection:bg-blue-600 selection:text-white">
      {/* Sidebar */}
      <aside className="w-72 bg-[#1E3A8A] text-white flex flex-col sticky top-0 h-screen z-50 shadow-xl overflow-hidden">
        <div className="p-8">
          <Link href="/admin" className="flex items-center gap-3 group">
             <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center p-1 shadow-lg">
                <img src="/logo.png" alt="KDS Logo" className="h-full w-full object-contain" />
             </div>
             <span className="text-2xl font-bold tracking-tight text-white">KDS <span className="text-[#60A5FA]">Garment</span></span>
          </Link>
        </div>

        <nav className="flex-1 px-4 mt-4 space-y-1">
          {sidebarLinks.map((link) => {
            const Icon = link.icon
            const isActive = pathname === link.href
            return (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "flex items-center justify-between px-6 py-4 rounded-xl transition-all duration-300 group relative text-sm font-medium",
                  isActive 
                    ? "bg-[#3B82F6] text-white shadow-lg" 
                    : "text-white/60 hover:bg-white/5 hover:text-white"
                )}
              >
                <div className="flex items-center gap-4">
                  <Icon className={cn("h-5 w-5", isActive ? "text-white" : "text-white/40 group-hover:text-white")} />
                  <span>{link.name}</span>
                </div>
                {link.badge && (
                  <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-[10px] font-bold rounded-md">{link.badge}</span>
                )}
              </Link>
            )
          })}
        </nav>

        <div className="p-6 border-t border-white/10 space-y-6">
          <button 
            onClick={() => adminLogoutAction()}
            className="w-full flex items-center gap-4 px-6 py-3 rounded-xl text-white/60 hover:bg-white/5 hover:text-white transition-all text-sm font-medium"
          >
            <LogOut className="h-5 w-5" />
            Log Out
          </button>
          
          <div className="flex items-center gap-4 px-2">
             <div className="h-10 w-10 bg-[#3B82F6] rounded-full flex items-center justify-center border-2 border-white/20">
                <Shield className="h-5 w-5 text-white" />
             </div>
             <div className="flex-1 min-w-0">
                <p className="text-xs font-bold truncate text-white">System Admin</p>
                <p className="text-[10px] text-white/40 truncate uppercase tracking-widest">Administrator</p>
             </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-gray-200 px-10 flex items-center justify-between flex-shrink-0">
           <div className="relative w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
               <input 
                type="text" 
                placeholder="Search everything..." 
                className="w-full bg-gray-100 border-2 border-gray-200 rounded-xl pl-12 pr-4 py-2.5 text-sm font-bold text-gray-900 placeholder:text-gray-500 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all"
              />
           </div>
           
           <div className="flex items-center gap-6">
              <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg transition-all"><Filter className="h-5 w-5" /></button>
              <Link href="/admin/support" className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg transition-all relative">
                <MessageSquare className="h-5 w-5" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-blue-500 border-2 border-white rounded-full" />
              </Link>
              <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg transition-all relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1.5 right-1.5 h-3 w-3 bg-rose-500 border-2 border-white rounded-full flex items-center justify-center text-[8px] text-white font-bold">3</span>
              </button>
              <div className="h-8 w-px bg-gray-200" />
              <div className="flex items-center gap-3 cursor-pointer group">
                 <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center border border-gray-200">
                    <User className="h-5 w-5 text-gray-500" />
                 </div>
                 <span className="text-sm font-bold text-gray-700">Admin</span>
                 <ChevronDown className="h-4 w-4 text-gray-400 group-hover:translate-y-0.5 transition-transform" />
              </div>
           </div>
        </header>

        <div className="flex-1 overflow-y-auto p-10">
          {children}
        </div>
      </main>
    </div>
  )
}
