"use client"

import { useState } from "react"
import { X, User, Phone, Mail, MapPin, Calendar, Hash, ShoppingBag, MessageSquare, Eye, Printer } from "lucide-react"
import { formatPrice } from "@/lib/utils"
import { printDocument } from "@/lib/export-utils"

export default function ViewOrderModal({ order }: { order: any }) {
  const [isOpen, setIsOpen] = useState(false)

  const handlePrint = () => {
    printDocument()
  }

  // Extract address and note if they were combined
  const rawAddress = order.address || ""
  const addressParts = rawAddress.split(" | Note: ")
  const displayAddress = addressParts[0] || "N/A"
  const displayNote = addressParts[1] || "No additional instructions provided."

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="p-2.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
      >
        <Eye className="h-5 w-5" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 print:hidden">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                   <Hash className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Order {order.tracking_id || `#${order.id.slice(0,8).toUpperCase()}`}
                  </h2>
                  <p className="text-xs text-gray-400 font-medium">Customer Manifest Record</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={handlePrint}
                  className="h-10 px-4 flex items-center gap-2 bg-white text-gray-700 rounded-lg transition-all border border-gray-200 hover:bg-gray-50 font-bold text-xs"
                >
                  <Printer className="h-4 w-4" /> Print Invoice
                </button>
                <button onClick={() => setIsOpen(false)} className="h-10 w-10 flex items-center justify-center hover:bg-white rounded-lg transition-all border border-transparent hover:border-gray-200">
                  <X className="h-5 w-5 text-gray-400" />
                </button>
              </div>
            </div>

            <style jsx global>{`
              @media print {
                body * {
                  visibility: hidden;
                }
                .print-content, .print-content * {
                  visibility: visible;
                }
                .print-content {
                  position: absolute;
                  left: 0;
                  top: 0;
                  width: 100%;
                }
                .print-hidden {
                  display: none !important;
                }
              }
            `}</style>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-10 space-y-10 print-content bg-white">
              {/* Print Header (Only visible on print) */}
              <div className="hidden print:flex flex-col items-center justify-center mb-10 border-b-2 border-gray-900 pb-8">
                 <div className="h-20 w-20 mb-4">
                    <img src="/logo.png" alt="KDS Logo" className="h-full w-full object-contain" />
                 </div>
                 <h1 className="text-3xl font-black tracking-tighter text-gray-900 uppercase">KDS Garment Industry</h1>
                 <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">Lalgadh, Nepal | Phone: 9855073550 | Email: kdsgroup98@gmail.com</p>
                 <div className="mt-6 px-8 py-2 bg-gray-900 text-white font-bold text-sm rounded-full uppercase tracking-[0.3em]">Official Invoice</div>
              </div>

              {/* Order Metadata */}
              <div className="grid grid-cols-2 gap-8 print:gap-12">
                 <div className="space-y-1">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Invoice Number</p>
                    <p className="text-lg font-black text-gray-900 uppercase">{order.tracking_id || `#${order.id.slice(0,8).toUpperCase()}`}</p>
                 </div>
                 <div className="text-right space-y-1">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Date & Time</p>
                    <p className="text-sm font-bold text-gray-900">{new Date(order.created_at).toLocaleString()}</p>
                 </div>
              </div>

              <div className="h-px bg-gray-100 print:bg-gray-300 w-full" />

              {/* Customer & Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 print:grid-cols-2">
                <div className="space-y-4">
                  <h3 className="text-[11px] font-bold text-blue-600 print:text-gray-900 uppercase tracking-widest border-b border-gray-100 print:border-gray-300 pb-2">Billing Information</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Customer Name</p>
                      <p className="text-sm font-bold text-gray-900">{order.full_name || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Contact Number</p>
                      <p className="text-sm font-bold text-gray-900">{order.phone || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Email Address</p>
                      <p className="text-sm font-bold text-gray-900">{order.email || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-[11px] font-bold text-blue-600 print:text-gray-900 uppercase tracking-widest border-b border-gray-100 print:border-gray-300 pb-2">Shipping Details</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Delivery Address</p>
                      <p className="text-sm font-bold text-gray-900 leading-relaxed">{displayAddress}</p>
                      {order.landmark && <p className="text-[10px] text-blue-600 print:text-gray-900 mt-1 font-bold italic">Near: {order.landmark}</p>}
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Payment Method</p>
                      <p className="text-sm font-bold text-gray-900 uppercase">{order.payment_method || 'Cash on Delivery'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Items Table */}
              <div className="space-y-4">
                <h3 className="text-[11px] font-bold text-blue-600 print:text-gray-900 uppercase tracking-widest border-b border-gray-100 print:border-gray-300 pb-2">Itemized List</h3>
                <div className="bg-white rounded-2xl border border-gray-100 print:border-gray-300 overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50 print:bg-gray-100 border-b border-gray-100 print:border-gray-300">
                      <tr>
                        <th className="px-6 py-4 text-[10px] font-bold text-gray-400 print:text-gray-900 uppercase tracking-wider">Description</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-gray-400 print:text-gray-900 uppercase tracking-wider text-center">Size</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-gray-400 print:text-gray-900 uppercase tracking-wider text-center">Qty</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-gray-400 print:text-gray-900 uppercase tracking-wider text-right">Unit Price</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-gray-400 print:text-gray-900 uppercase tracking-wider text-right">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 print:divide-gray-300">
                      {order.order_items?.map((item: any) => (
                        <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-4">
                            <span className="font-bold text-gray-900 text-xs">{item.products?.name}</span>
                            <p className="text-[9px] text-gray-400 font-medium uppercase mt-0.5">{item.color}</p>
                          </td>
                          <td className="px-6 py-4 text-center font-bold text-gray-900 text-xs">{item.size}</td>
                          <td className="px-6 py-4 text-center font-bold text-gray-900 text-xs">x{item.quantity}</td>
                          <td className="px-6 py-4 text-right font-bold text-gray-900 text-xs">{formatPrice(item.price)}</td>
                          <td className="px-6 py-4 text-right font-bold text-gray-900 text-xs">{formatPrice(item.price * item.quantity)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Calculations & Signatures */}
              <div className="flex justify-between items-end gap-20 pt-10">
                 <div className="flex-1 space-y-12">
                    <div className="space-y-4">
                       <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Special Notes</h4>
                       <p className="text-xs text-gray-500 italic max-w-sm border-l-2 border-gray-100 pl-4 py-1">
                          {displayNote === "No additional instructions provided." ? "Thank you for shopping with KDS Garment. Goods once sold are not returnable under normal conditions." : displayNote}
                       </p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-10">
                       <div className="border-t border-gray-900 pt-3 text-center">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-900">Authorized Signature</p>
                       </div>
                       <div className="border-t border-gray-900 pt-3 text-center">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-900">Processed By: Admin</p>
                       </div>
                    </div>
                 </div>

                 <div className="w-72 bg-gray-50 print:bg-white print:border print:border-gray-300 p-8 rounded-3xl space-y-4">
                    <div className="flex justify-between items-center text-xs">
                       <span className="text-gray-400 font-bold uppercase">Subtotal</span>
                       <span className="text-gray-900 font-bold">{formatPrice(order.total_price)}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                       <span className="text-gray-400 font-bold uppercase">Tax (0%)</span>
                       <span className="text-gray-900 font-bold">रू 0</span>
                    </div>
                    <div className="h-px bg-gray-200" />
                    <div className="flex justify-between items-center">
                       <span className="text-xs font-black text-gray-900 uppercase">Grand Total</span>
                       <span className="text-xl font-black text-blue-600 print:text-gray-900">{formatPrice(order.total_price)}</span>
                    </div>
                 </div>
              </div>

              {/* Print Footer */}
              <div className="hidden print:block text-center pt-20">
                 <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.5em]">--- End of Invoice ---</p>
                 <p className="text-[8px] text-gray-300 mt-4 italic font-medium">Generated automatically by KDS Garment ERP System on {new Date().toLocaleString()}</p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-8 border-t border-gray-100 bg-gray-50/50 flex justify-between items-center mt-auto print:hidden">
               <div className="flex items-center gap-4">
                 <div className="h-12 w-12 bg-white rounded-xl flex items-center justify-center text-blue-600 border border-gray-200 shadow-sm"><ShoppingBag className="h-6 w-6" /></div>
                 <div>
                   <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Payment Status</p>
                   <p className="text-sm font-bold text-gray-900 uppercase">{order.payment_method || 'COD'}</p>
                 </div>
               </div>
               <div className="text-right">
                 <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Manifest Aggregate</p>
                 <p className="text-3xl font-bold text-gray-900">{formatPrice(order.total_price)}</p>
               </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
