"use client"

import { useState, useEffect } from "react"
import { X, Printer, Eye, Loader2, Image as ImageIcon, CreditCard, RefreshCw } from "lucide-react"
import { formatPrice, cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export default function ViewOrderModal({ order: initialOrder }: { order: any }) {
  const [isOpen, setIsOpen] = useState(false)
  const [order, setOrder] = useState(initialOrder)
  const [items, setItems] = useState<any[]>(initialOrder?.order_items || [])
  const [isLoadingItems, setIsLoadingItems] = useState(false)
  
  const supabase = createClient()
  const router = useRouter()

  const fetchOrderItems = async () => {
    setIsLoadingItems(true)
    try {
      // Fetch fresh items with product enrichment
      const { data: rawItems, error: itemsError } = await supabase
        .from('order_items')
        .select(`
           *,
           products (
             name,
             image_url,
             price
           )
        `)
        .eq('order_id', order.id)
      
      if (itemsError) throw itemsError
      
      if (rawItems && rawItems.length > 0) {
        setItems(rawItems)
      } else {
        // Fallback for manual bills or older records
        const { data: fallbackItems } = await supabase
          .from('order_items')
          .select('*')
          .eq('order_id', order.id)
        
        if (fallbackItems) setItems(fallbackItems)
      }
    } catch (err: any) {
      console.error("Order Sync Error:", err)
    } finally {
      setIsLoadingItems(false)
    }
  }

  // Trigger fetch every time modal opens to ensure data is fresh
  useEffect(() => {
    if (isOpen) {
      fetchOrderItems()
    }
  }, [isOpen])

  const customerName = order.customer_name || order.full_name || "N/A"
  const customerPhone = order.customer_phone || order.phone || "N/A"
  const customerEmail = order.customer_email || order.email || "N/A"
  const shippingAddress = order.shipping_address || order.address || "N/A"
  const totalAmount = order.total_amount || order.total_price || 0
  
  const addressParts = shippingAddress.split(" | Note: ")
  const displayAddress = addressParts[0] || "N/A"

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="p-2.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
      >
        <Eye className="h-5 w-5" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 flex flex-col max-h-[95vh]">
            
            {/* Header Section */}
            <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-white">
              <div className="flex items-center gap-6">
                <div className="h-14 w-14 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                  <span className="text-2xl font-black">#</span>
                </div>
                <div>
                   <h2 className="text-2xl font-black text-gray-900 tracking-tight">Order {order.tracking_id || order.id.slice(0,8).toUpperCase()}</h2>
                   <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-0.5">Customer Manifest Record</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                 <button 
                   onClick={fetchOrderItems}
                   className="p-2.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                   title="Refresh Items"
                 >
                    <RefreshCw className={cn("h-5 w-5", isLoadingItems && "animate-spin")} />
                 </button>
                 <button 
                   onClick={() => window.print()}
                   className="flex items-center gap-2 px-6 py-2.5 border-2 border-gray-900 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-gray-900 hover:text-white transition-all"
                 >
                    <Printer className="h-4 w-4" /> Print Invoice
                 </button>
                 <button onClick={() => setIsOpen(false)} className="h-10 w-10 flex items-center justify-center hover:bg-gray-100 rounded-full transition-all">
                    <X className="h-6 w-6 text-gray-400" />
                 </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-10 lg:p-14 space-y-16">
               
               {/* Invoice Info Grid */}
               <div className="grid grid-cols-2 gap-10">
                  <div>
                     <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Invoice Number</p>
                     <h3 className="text-3xl font-black text-gray-900 tracking-tighter">{order.tracking_id || order.id.slice(0,8).toUpperCase()}</h3>
                  </div>
                  <div className="text-right">
                     <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Date & Time</p>
                     <p className="text-sm font-black text-gray-900 uppercase tracking-widest">{new Date(order.created_at).toLocaleString()}</p>
                  </div>
               </div>

               {/* Billing & Shipping Grid */}
               <div className="grid grid-cols-2 gap-10">
                  <div className="space-y-8">
                     <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] pb-2 border-b border-blue-50">Billing Information</p>
                     <div className="space-y-4">
                        <div>
                           <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Customer Name</p>
                           <p className="text-sm font-black text-gray-900 uppercase">{customerName}</p>
                        </div>
                        <div>
                           <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Contact Number</p>
                           <p className="text-sm font-black text-gray-900 uppercase">{customerPhone}</p>
                        </div>
                        <div>
                           <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Email Address</p>
                           <p className="text-sm font-black text-gray-900 uppercase">{customerEmail}</p>
                        </div>
                     </div>
                  </div>

                  <div className="space-y-8">
                     <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] pb-2 border-b border-blue-50">Shipping Details</p>
                     <div className="space-y-4">
                        <div>
                           <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Delivery Address</p>
                           <p className="text-sm font-black text-gray-900 uppercase">{displayAddress}</p>
                           {order.landmark && <p className="text-[10px] font-bold text-blue-500 italic mt-1">Near: {order.landmark}</p>}
                        </div>
                        <div>
                           <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Payment Method</p>
                           <p className="text-sm font-black text-gray-900 uppercase">{order.payment_method || 'COD'}</p>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Itemized List Table */}
               <div className="space-y-6">
                  <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] pb-2 border-b border-blue-50">Itemized List</p>
                  <table className="w-full text-left">
                     <thead>
                        <tr className="border-b border-gray-100">
                           <th className="py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Description (Stock Name)</th>
                           <th className="py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Size</th>
                           <th className="py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Qty</th>
                           <th className="py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Rate / Pcs</th>
                           <th className="py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Subtotal</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-gray-50">
                        {isLoadingItems ? (
                           <tr>
                              <td colSpan={5} className="py-20 text-center">
                                 <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto" />
                              </td>
                           </tr>
                        ) : items.length > 0 ? (
                           items.map((item, idx) => {
                              const stockName = item.products?.name || item.name || 'Stock Item';
                              const rate = item.price || item.products?.price || 0;
                              const qty = item.quantity || 0;
                              const subtotal = rate * qty;

                              return (
                                 <tr key={idx} className="group">
                                    <td className="py-8">
                                       <div className="flex items-center gap-4">
                                          <div className="h-12 w-12 bg-gray-50 rounded-lg overflow-hidden border border-gray-100 shrink-0">
                                             {item.products?.image_url ? (
                                                <img src={item.products.image_url} alt="p" className="h-full w-full object-cover" />
                                             ) : (
                                                <div className="h-full w-full flex items-center justify-center text-gray-200">
                                                   <ImageIcon className="h-5 w-5" />
                                                </div>
                                             )}
                                          </div>
                                          <div>
                                             <p className="text-sm font-black text-gray-900 uppercase leading-tight">{stockName}</p>
                                             <p className="text-[10px] font-bold text-emerald-600 uppercase mt-1">{item.color || 'Default'}</p>
                                          </div>
                                       </div>
                                    </td>
                                    <td className="py-8 text-center text-sm font-black text-gray-900 uppercase">{item.size || 'N/A'}</td>
                                    <td className="py-8 text-center text-sm font-black text-gray-900 uppercase">{qty}</td>
                                    <td className="py-8 text-center text-sm font-black text-gray-900 uppercase">{formatPrice(rate)}</td>
                                    <td className="py-8 text-right text-sm font-black text-gray-900 uppercase">{formatPrice(subtotal)}</td>
                                 </tr>
                              );
                           })
                        ) : (
                           <tr>
                              <td colSpan={5} className="py-20 text-center text-gray-400 font-bold uppercase text-[10px] tracking-widest">NO RECORDS FOUND.</td>
                           </tr>
                        )}
                     </tbody>
                  </table>
               </div>

               {/* Special Notes & Signatures Section */}
               <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end">
                  <div className="lg:col-span-8 space-y-12">
                     <div className="space-y-4">
                        <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em]">Special Notes</p>
                        <p className="text-xs font-bold text-gray-500 italic max-w-md leading-loose">
                           Thank you for shopping with KDS Garment. Goods once sold are not returnable under normal conditions.
                        </p>
                     </div>
                     <div className="grid grid-cols-2 gap-10 pt-10">
                        <div className="border-t border-gray-900 pt-4">
                           <p className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Authorized Signature</p>
                        </div>
                        <div className="border-t border-gray-900 pt-4">
                           <p className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Processed By: Admin</p>
                        </div>
                     </div>
                  </div>

                  <div className="lg:col-span-4">
                     <div className="bg-gray-50 rounded-3xl p-8 space-y-4 border border-gray-100">
                        <div className="flex justify-between items-center text-xs font-bold text-gray-400 uppercase tracking-widest">
                           <span>Subtotal</span>
                           <span className="text-gray-900 font-black">{formatPrice(totalAmount)}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs font-bold text-gray-400 uppercase tracking-widest">
                           <span>Tax (0%)</span>
                           <span className="text-gray-900 font-black">रू 0.00</span>
                        </div>
                        <div className="h-px bg-gray-200 my-4" />
                        <div className="flex justify-between items-center">
                           <span className="text-xs font-black text-gray-900 uppercase tracking-widest">Grand Total</span>
                           <span className="text-2xl font-black text-blue-600">{formatPrice(totalAmount)}</span>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            {/* Sticky Manifest Aggregate Footer */}
            <div className="p-10 border-t border-gray-100 bg-white flex justify-between items-center">
               <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-white rounded-xl border border-gray-200 flex items-center justify-center text-blue-600 shadow-sm">
                     <CreditCard className="h-6 w-6" />
                  </div>
                  <div>
                     <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Payment Status</p>
                     <p className="text-sm font-black text-gray-900 uppercase">{order.status === 'delivered' ? 'PAID' : 'ONLINE'}</p>
                  </div>
               </div>
               <div className="text-right">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Manifest Aggregate</p>
                  <p className="text-5xl font-black text-gray-900 tracking-tighter">{formatPrice(totalAmount)}</p>
               </div>
            </div>

          </div>
        </div>
      )}
    </>
  )
}
