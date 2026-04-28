import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { 
  ShoppingBag, 
  User, 
  MapPin, 
  LogOut, 
  ChevronRight, 
  Clock, 
  CheckCircle2, 
  Package, 
  Home,
  Phone,
  Mail,
  Search,
  Truck,
  ArrowRight
} from "lucide-react"

export default async function CustomerDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Fetch recent orders for this customer
  const { data: orders } = await supabase
    .from('orders')
    .select('*')
    .eq('customer_email', user.email)
    .order('created_at', { ascending: false })

  const activeOrders = orders?.filter(o => o.status === 'pending' || o.status === 'processing') || []
  const completedOrders = orders?.filter(o => o.status === 'delivered') || []

  const stats = [
    { label: "Active Orders", value: activeOrders.length, icon: Clock, color: "bg-orange-50 text-orange-600", desc: "Currently being processed" },
    { label: "Completed", value: completedOrders.length, icon: CheckCircle2, color: "bg-emerald-50 text-emerald-600", desc: "Delivered successfully" },
    { label: "Total Spent", value: `Rs. ${orders?.reduce((acc, curr) => acc + (curr.total_amount || 0), 0).toLocaleString()}`, icon: ShoppingBag, color: "bg-blue-50 text-blue-600", desc: "Lifetime shopping value" },
  ]

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* 🚀 Top Navigation / Breadcrumb */}
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-xs font-bold uppercase tracking-widest text-slate-400">
           <div className="flex items-center gap-2">
              <Link href="/" className="hover:text-[#002169]">Home</Link>
              <ChevronRight className="h-3 w-3" />
              <span className="text-[#002169]">My Dashboard</span>
           </div>
           <div className="hidden md:block">
              Welcome, {user.user_metadata.full_name}
           </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* 👤 Sidebar (3 Columns) */}
          <div className="lg:col-span-3 space-y-8">
            {/* Profile Summary */}
            <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm text-center">
               <div className="h-24 w-24 bg-gradient-to-br from-[#002169] to-blue-900 rounded-full mx-auto flex items-center justify-center text-white text-3xl font-black mb-4 shadow-xl ring-8 ring-blue-50">
                  {user.user_metadata.full_name?.charAt(0) || 'U'}
               </div>
               <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">{user.user_metadata.full_name}</h2>
               <p className="text-xs font-bold text-slate-400 mt-1">{user.email}</p>
               
               <div className="mt-8 space-y-2">
                  <Link href="/products" className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-all group">
                     <span className="text-xs font-bold uppercase tracking-widest text-slate-600 group-hover:text-[#002169]">Shop Now</span>
                     <ShoppingBag className="h-4 w-4 text-slate-300 group-hover:text-[#002169]" />
                  </Link>
                  <Link href="/track-order" className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-all group">
                     <span className="text-xs font-bold uppercase tracking-widest text-slate-600 group-hover:text-[#002169]">Track Order</span>
                     <Truck className="h-4 w-4 text-slate-300 group-hover:text-[#002169]" />
                  </Link>
                  <Link href="/cart" className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-all group">
                     <span className="text-xs font-bold uppercase tracking-widest text-slate-600 group-hover:text-[#002169]">My Cart</span>
                     <Package className="h-4 w-4 text-slate-300 group-hover:text-[#002169]" />
                  </Link>
               </div>

               <hr className="my-8 border-slate-100" />
               <form action="/api/auth/signout" method="post">
                 <button type="submit" className="text-xs font-black text-rose-600 uppercase tracking-widest hover:text-rose-700 flex items-center justify-center gap-2 w-full">
                    <LogOut className="h-4 w-4" /> Sign Out
                 </button>
               </form>
            </div>

            {/* Quick Support */}
            <div className="bg-[#FCB800] p-8 rounded-[2rem] shadow-lg shadow-yellow-500/10">
               <h4 className="text-[#002169] font-black uppercase tracking-widest text-xs mb-2">Need Help?</h4>
               <p className="text-[#002169]/70 text-xs font-bold leading-relaxed mb-6">Contact our team for any issues with your order.</p>
               <div className="flex flex-col gap-3">
                  <a href="tel:+9779855073550" className="flex items-center gap-3 text-sm font-black text-[#002169]">
                     <div className="h-8 w-8 bg-[#002169] text-white rounded-lg flex items-center justify-center">
                        <Phone className="h-4 w-4" />
                     </div>
                     9855073550
                  </a>
               </div>
            </div>
          </div>

          {/* 📊 Main Content (9 Columns) */}
          <div className="lg:col-span-9 space-y-10">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               {stats.map((stat) => (
                 <div key={stat.label} className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm relative overflow-hidden group hover:border-[#002169] transition-all">
                    <div className={`p-4 rounded-2xl ${stat.color} w-fit mb-6 group-hover:scale-110 transition-transform`}>
                       <stat.icon className="h-6 w-6" />
                    </div>
                    <p className="text-2xl font-black text-slate-900 tracking-tight">{stat.value}</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">{stat.label}</p>
                    <p className="text-[10px] text-slate-300 font-medium mt-4">{stat.desc}</p>
                 </div>
               ))}
            </div>

            {/* Order History Table */}
            <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
               <div className="p-10 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Recent Orders</h3>
                    <p className="text-xs font-bold text-slate-400 mt-1 tracking-widest uppercase">Track and manage your shopping history</p>
                  </div>
                  <Link href="/products" className="bg-[#002169] text-white px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:scale-105 transition-all">
                     Order More
                  </Link>
               </div>

               {orders && orders.length > 0 ? (
                 <div className="overflow-x-auto">
                    <table className="w-full text-left">
                       <thead>
                          <tr className="bg-slate-50">
                             <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Order ID</th>
                             <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Date</th>
                             <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                             <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Total</th>
                             <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Action</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-100">
                          {orders.slice(0, 8).map((order) => (
                            <tr key={order.id} className="hover:bg-slate-50/50 transition-colors group">
                               <td className="px-10 py-8">
                                  <span className="text-sm font-black text-slate-900 uppercase tracking-tighter">#{order.order_id || order.id.slice(0, 8)}</span>
                               </td>
                               <td className="px-10 py-8">
                                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                                     {new Date(order.created_at).toLocaleDateString()}
                                  </span>
                               </td>
                               <td className="px-10 py-8">
                                  <span className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-[0.2em] ${
                                     order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                                     order.status === 'cancelled' ? 'bg-rose-100 text-rose-700' :
                                     'bg-orange-100 text-orange-700'
                                  }`}>
                                     {order.status || 'Pending'}
                                  </span>
                               </td>
                               <td className="px-10 py-8">
                                  <span className="text-sm font-black text-[#002169]">Rs. {order.total_amount?.toLocaleString()}</span>
                               </td>
                               <td className="px-10 py-8 text-right">
                                  <Link 
                                    href={`/track-order?id=${order.order_id || order.id}`}
                                    className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#002169] group-hover:underline"
                                  >
                                     Details <ArrowRight className="h-3 w-3" />
                                  </Link>
                               </td>
                            </tr>
                          ))}
                       </tbody>
                    </table>
                 </div>
               ) : (
                 <div className="p-20 text-center space-y-6">
                    <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
                       <ShoppingBag className="h-10 w-10 text-slate-200" />
                    </div>
                    <div>
                       <p className="text-lg font-bold text-slate-900 uppercase tracking-tight">Your order history is empty</p>
                       <p className="text-xs font-bold text-slate-400 mt-2 uppercase tracking-widest">Start exploring our premium collection now</p>
                    </div>
                    <Link href="/products" className="inline-block bg-[#002169] text-white px-10 py-4 rounded-xl text-xs font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-blue-900/10">
                       Go To Shop
                    </Link>
                 </div>
               )}
            </div>

            {/* Loyalty/Referral Promo */}
            <div className="bg-gradient-to-br from-slate-900 to-[#002169] p-12 rounded-[3rem] text-white relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                  <Package className="h-40 w-40" />
               </div>
               <div className="max-w-md space-y-6 relative z-10">
                  <h4 className="text-3xl font-black uppercase tracking-tighter leading-none">Your Trusted <br/> Garment Partner</h4>
                  <p className="text-blue-100/60 text-sm font-medium leading-relaxed">
                     KDS Garment ensures every order is crafted with precision and delivered with care. Check your order status any time from this dashboard.
                  </p>
                  <div className="flex gap-4 pt-4">
                     <Link href="/products" className="bg-[#FCB800] text-[#002169] px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-white transition-all">New Arrival</Link>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
