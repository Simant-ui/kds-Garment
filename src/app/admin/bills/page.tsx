"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { formatPrice, cn } from "@/lib/utils"
import { 
  Receipt, 
  Search, 
  Eye, 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  Package, 
  Filter, 
  Printer,
  ChevronRight,
  ArrowRight
} from "lucide-react"
import Link from "next/link"

export default function BillsHistoryPage() {
  const [bills, setBills] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedBill, setSelectedBill] = useState<any | null>(null)
  const [showModal, setShowModal] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    const fetchBills = async () => {
      // Fetching orders that have tracking_id starting with INV or no address (POS sales)
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            products (*)
          )
        `)
        .order('created_at', { ascending: false })

      if (data) setBills(data)
      setLoading(false)
    }
    fetchBills()
  }, [])

  const filteredBills = bills.filter(bill => 
    (bill.tracking_id?.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (bill.full_name?.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (bill.phone?.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight uppercase">BILLS <span className="text-blue-600">HISTORY</span></h1>
          <p className="text-sm text-gray-500 mt-1 font-medium">Record of all generated invoices and POS transactions</p>
        </div>
        <div className="flex gap-3">
           <Link href="/admin/billing" className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 shadow-lg shadow-blue-500/20 hover:scale-[1.02] transition-all">
              <Receipt className="h-4 w-4" /> NEW BILL
           </Link>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center">
         <div className="relative flex-1 w-full">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by Invoice ID, Customer Name, or Phone..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-50 border-none rounded-2xl pl-16 pr-6 py-4 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-blue-500 transition-all"
            />
         </div>
         <div className="flex gap-2">
            <button className="h-12 px-6 flex items-center gap-2 bg-gray-50 text-gray-500 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-gray-100 transition-all border border-gray-100">
               <Filter className="h-4 w-4" /> Filter
            </button>
            <button className="h-12 w-12 flex items-center justify-center bg-gray-50 text-gray-500 rounded-2xl hover:bg-gray-100 transition-all border border-gray-100">
               <Printer className="h-5 w-5" />
            </button>
         </div>
      </div>

      {/* Bills Table */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead>
                  <tr className="bg-gray-50/50">
                     <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Bill Info</th>
                     <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Customer</th>
                     <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Items</th>
                     <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">Amount</th>
                     <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">Action</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-gray-50">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="px-8 py-20 text-center">
                        <div className="flex flex-col items-center gap-4">
                           <div className="h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                           <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Fetching Bill Records...</p>
                        </div>
                      </td>
                    </tr>
                  ) : filteredBills.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-8 py-32 text-center">
                         <div className="flex flex-col items-center gap-4 opacity-20">
                            <Receipt className="h-16 w-16" />
                            <p className="text-sm font-bold uppercase tracking-widest text-gray-500">No bills found in history</p>
                         </div>
                      </td>
                    </tr>
                  ) : filteredBills.map((bill) => (
                    <tr key={bill.id} className="group hover:bg-gray-50 transition-all">
                       <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                             <div className="h-12 w-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-black text-xs">
                                #{bill.tracking_id?.slice(-4) || bill.id.slice(0,4)}
                             </div>
                             <div>
                                <p className="font-black text-gray-900 text-sm uppercase tracking-tight">{bill.tracking_id || 'POS-SALE'}</p>
                                <div className="flex items-center gap-3 mt-1 text-[10px] font-bold text-gray-400">
                                   <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {new Date(bill.created_at).toLocaleDateString()}</span>
                                   <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {new Date(bill.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                             </div>
                          </div>
                       </td>
                       <td className="px-8 py-6">
                          <div className="flex items-center gap-3">
                             <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center border border-gray-200">
                                <User className="h-4 w-4 text-gray-400" />
                             </div>
                             <div>
                                <p className="font-bold text-gray-900 text-sm">{bill.full_name || 'Walk-in Customer'}</p>
                                <p className="text-[10px] font-medium text-gray-400">{bill.phone || 'No Mobile'}</p>
                             </div>
                          </div>
                       </td>
                       <td className="px-8 py-6">
                          <div className="space-y-1">
                             {bill.order_items?.slice(0, 2).map((item: any, idx: number) => (
                               <div key={idx} className="flex items-center gap-2 text-xs">
                                  <span className="font-black text-blue-600">{item.quantity}x</span>
                                  <span className="text-gray-600 font-medium truncate max-w-[150px]">{item.products?.name}</span>
                               </div>
                             ))}
                             {bill.order_items?.length > 2 && (
                               <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">+{bill.order_items.length - 2} more items</p>
                             )}
                          </div>
                       </td>
                       <td className="px-8 py-6 text-right">
                          <p className="font-black text-gray-900 text-lg">{formatPrice(bill.total_price)}</p>
                          <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full uppercase">Paid</span>
                       </td>
                       <td className="px-8 py-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                             <button 
                               onClick={() => { setSelectedBill(bill); setShowModal(true); }}
                               className="h-10 w-10 flex items-center justify-center bg-gray-50 text-gray-400 rounded-xl hover:bg-blue-600 hover:text-white transition-all group-hover:shadow-lg"
                             >
                                <Eye className="h-5 w-5" />
                             </button>
                             <button 
                               onClick={() => { setSelectedBill(bill); setShowModal(true); setTimeout(() => window.print(), 500); }}
                               className="h-10 px-4 flex items-center gap-2 bg-gray-900 text-white rounded-xl text-xs font-bold hover:bg-[#1E3A8A] transition-all"
                             >
                                <Printer className="h-4 w-4" /> Print
                             </button>
                          </div>
                       </td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>

         {/* Pagination / Footer */}
         <div className="p-8 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Showing {filteredBills.length} Bill Records</p>
            <div className="flex gap-2">
               <button className="h-10 w-10 flex items-center justify-center bg-white border border-gray-200 rounded-xl text-xs font-bold text-blue-600 shadow-sm">1</button>
            </div>
         </div>
      </div>

      {/* Invoice Modal */}
      {(showModal && selectedBill) && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-gray-900/80 backdrop-blur-md p-4 print:p-0 print:static print:bg-white">
           <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[95vh] print:max-h-none print:shadow-none print:rounded-none">
              <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 print:hidden">
                 <h2 className="text-xl font-bold text-gray-900">Bill Details</h2>
                 <div className="flex gap-4">
                    <button onClick={() => window.print()} className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg shadow-blue-500/20">
                       <Printer className="h-4 w-4" /> Print PDF
                    </button>
                    <button onClick={() => setShowModal(false)} className="p-2.5 text-gray-400 hover:text-gray-900 hover:bg-white rounded-xl transition-all">
                       <span className="text-xl font-bold">×</span>
                    </button>
                 </div>
              </div>

              <div className="flex-1 overflow-y-auto p-12 space-y-12 print:overflow-visible">
                 <div className="flex justify-between items-start">
                    <div>
                       <div className="flex items-center gap-3 mb-4">
                          <img src="/logo.png" alt="Logo" className="h-12 w-12 object-contain" />
                          <h1 className="text-2xl font-black text-[#1E3A8A] uppercase tracking-tighter">KDS Garment</h1>
                       </div>
                       <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Lalgadh, Nepal</p>
                    </div>
                    <div className="text-right">
                       <h2 className="text-4xl font-black text-gray-200 uppercase tracking-tighter mb-4">Invoice</h2>
                       <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Bill ID</p>
                       <p className="text-sm font-black text-gray-900">{selectedBill.tracking_id || selectedBill.id.slice(0,10)}</p>
                       <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-4">Date</p>
                       <p className="text-sm font-bold text-gray-900">{new Date(selectedBill.created_at).toLocaleString()}</p>
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-10 py-10 border-y border-gray-100">
                    <div>
                       <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-4">Customer Details</p>
                       <h4 className="text-lg font-bold text-gray-900">{selectedBill.full_name || 'Walk-in Customer'}</h4>
                       <p className="text-sm text-gray-500 font-medium mt-1">{selectedBill.phone || 'No Mobile'}</p>
                    </div>
                    <div className="text-right">
                       <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-4">Payment Info</p>
                       <p className="text-sm font-bold text-gray-900">Method: <span className="text-blue-600">{selectedBill.payment_method || 'Cash'}</span></p>
                    </div>
                 </div>

                 <table className="w-full text-left">
                    <thead>
                       <tr className="border-b-2 border-gray-900/5">
                          <th className="py-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Description</th>
                          <th className="py-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Price</th>
                          <th className="py-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Qty</th>
                          <th className="py-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Total</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                       {selectedBill.order_items?.map((item: any, i: number) => (
                         <tr key={i}>
                            <td className="py-6 font-bold text-gray-900 text-sm">{item.products?.name || 'Garment Item'}</td>
                            <td className="py-6 text-center font-medium text-gray-500 text-sm">{formatPrice(item.price)}</td>
                            <td className="py-6 text-center font-black text-gray-900 text-sm">{item.quantity}</td>
                            <td className="py-6 text-right font-black text-gray-900 text-sm">{formatPrice(item.price * item.quantity)}</td>
                         </tr>
                       ))}
                    </tbody>
                 </table>

                 <div className="flex justify-end pt-10">
                    <div className="w-72 space-y-4">
                       <div className="flex justify-between items-center">
                          <span className="font-black text-[#1E3A8A] uppercase tracking-widest text-xs">Grand Total</span>
                          <span className="text-3xl font-black text-gray-900">{formatPrice(selectedBill.total_price)}</span>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}
      <style jsx global>{`
        @media print {
          body * {
             visibility: hidden;
          }
          .print-invoice, .print-invoice * {
             visibility: visible !important;
          }
          #billing-root, #billing-root * {
             display: none !important;
          }
          .fixed {
             position: absolute !important;
             left: 0 !important;
             top: 0 !important;
             background: white !important;
             padding: 0 !important;
             margin: 0 !important;
          }
          .max-w-2xl {
             max-width: 100% !important;
          }
        }
      `}</style>
    </div>
  )
}
