"use client"

import { useState, useEffect, useMemo } from "react" // Trigger Build
import { createClient } from "@/lib/supabase/client"
import { formatPrice, cn } from "@/lib/utils"
import {
   Search,
   Plus,
   Trash2,
   User,
   Phone,
   CreditCard,
   Receipt,
   X,
   Printer,
   ChevronRight,
   Package,
   ShoppingCart,
   ArrowLeft,
   Loader2
} from "lucide-react"
import Link from "next/link"

interface BillItem {
   id: string
   name: string
   price: number
   quantity: number
   subtotal: number
}

export default function BillingPage() {
   const [products, setProducts] = useState<any[]>([])
   const [searchQuery, setSearchQuery] = useState("")
   const [cart, setCart] = useState<BillItem[]>([])
   const [customer, setCustomer] = useState({ name: "", phone: "" })
   const [paymentMethod, setPaymentMethod] = useState("Cash")
   const [showInvoice, setShowInvoice] = useState(false)
   const [invoiceNumber, setInvoiceNumber] = useState("")
   const [staffName, setStaffName] = useState("Admin") // Default for now
   const [loading, setLoading] = useState(false)

   const supabase = createClient()

   useEffect(() => {
      const fetchProducts = async () => {
         const { data } = await supabase.from('products').select('*')
         if (data) setProducts(data)
      }
      fetchProducts()
      setInvoiceNumber(`INV-${Math.floor(100000 + Math.random() * 900000)}`)
   }, [])

   const filteredProducts = useMemo(() => {
      if (!searchQuery) return []
      return products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
   }, [searchQuery, products])

   const addToCart = (product: any) => {
      const existing = cart.find(item => item.id === product.id)
      if (existing) {
         setCart(cart.map(item =>
            item.id === product.id ? { ...item, quantity: item.quantity + 1, subtotal: (item.quantity + 1) * item.price } : item
         ))
      } else {
         setCart([...cart, {
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
            subtotal: product.price
         }])
      }
      setSearchQuery("")
   }

   const updateQuantity = (id: string, delta: number) => {
      setCart(cart.map(item => {
         if (item.id === id) {
            const newQty = Math.max(1, item.quantity + delta)
            return { ...item, quantity: newQty, subtotal: newQty * item.price }
         }
         return item
      }))
   }

   const removeFromCart = (id: string) => {
      setCart(cart.filter(item => item.id !== id))
   }

   const subtotal = cart.reduce((acc, item) => acc + item.subtotal, 0)
   const vat = subtotal * 0.13
   const total = subtotal + vat

   const saveInvoice = async () => {
      if (cart.length === 0) return

      setLoading(true)
      try {
         // 1. Create the Order (The Bill)
         const { data: order, error: orderError } = await supabase
            .from('orders')
            .insert({
               tracking_id: invoiceNumber,
               customer_name: customer.name || 'Walk-in Customer',
               customer_phone: customer.phone || '',
               total_amount: total,
               status: 'delivered', // POS sales are immediate
               shipping_address: 'POS Counter Sale',
               payment_method: paymentMethod
            })
            .select()
            .single()

         if (orderError) throw orderError

         // 2. Create the Order Items
         const orderItems = cart.map(item => ({
            order_id: order.id,
            product_id: item.id,
            quantity: item.quantity,
            price: item.price
         }))

         const { error: itemsError } = await supabase
            .from('order_items')
            .insert(orderItems)

         if (itemsError) {
            alert("POS ERROR: Failed to save bill items! " + itemsError.message)
            throw itemsError
         }

         // 3. Update Inventory (Subtract stock)
         for (const item of cart) {
            const product = products.find(p => p.id === item.id)
            if (product) {
               await supabase
                  .from('products')
                  .update({ stock_quantity: product.stock_quantity - item.quantity })
                  .eq('id', item.id)
            }
         }

         setShowInvoice(true)
      } catch (err: any) {
         alert(`Failed to save invoice: ${err.message}`)
      } finally {
         setLoading(false)
      }
   }

   const handlePrint = () => {
      window.print()
   }

   return (
      <div className="space-y-8 max-w-7xl mx-auto print:p-0">
         <div className="flex items-center justify-between print:hidden">
            <div>
               <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Point of Sale</h1>
               <p className="text-sm text-gray-500 mt-1">Generate new bills and manage inventory sales</p>
            </div>
            <div className="flex gap-4">
               <Link href="/admin" className="flex items-center gap-2 text-gray-500 hover:text-gray-900 font-bold text-sm transition-all">
                  <ArrowLeft className="h-4 w-4" /> Back to Panel
               </Link>
            </div>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 print:block">
            {/* Left: Product Search & Cart */}
            <div className="lg:col-span-2 space-y-8 print:hidden">
               {/* Product Search */}
               <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
                  <div className="relative">
                     <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                     <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search products by name to add..."
                        className="w-full bg-gray-50 border-none rounded-2xl pl-16 pr-6 py-5 text-lg font-medium focus:ring-2 focus:ring-blue-500 transition-all shadow-inner"
                     />

                     {filteredProducts.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-4 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden max-h-96 overflow-y-auto animate-in fade-in slide-in-from-top-4">
                           {filteredProducts.map(p => (
                              <button
                                 key={p.id}
                                 onClick={() => addToCart(p)}
                                 className="w-full flex items-center justify-between p-6 hover:bg-blue-50 transition-all group border-b border-gray-50 last:border-none"
                              >
                                 <div className="flex items-center gap-4 text-left">
                                    <div className="h-12 w-12 bg-gray-100 rounded-xl overflow-hidden shrink-0">
                                       <img src={p.image_url || '/placeholder.jpg'} alt="p" className="h-full w-full object-cover" />
                                    </div>
                                    <div>
                                       <p className="font-bold text-gray-900">{p.name}</p>
                                       <p className="text-xs text-gray-600 font-bold">Stock: {p.stock_quantity} available</p>
                                    </div>
                                 </div>
                                 <div className="flex items-center gap-6">
                                    <span className="font-bold text-blue-600">{formatPrice(p.price)}</span>
                                    <div className="h-10 w-10 bg-blue-600 rounded-lg flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all">
                                       <Plus className="h-5 w-5" />
                                    </div>
                                 </div>
                              </button>
                           ))}
                        </div>
                     )}
                  </div>
               </div>

               {/* Cart Items */}
               <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        <ShoppingCart className="h-5 w-5 text-blue-600" />
                        <h3 className="text-lg font-bold text-gray-900">Current Basket</h3>
                     </div>
                     <span className="text-xs font-black text-gray-600 uppercase tracking-widest">{cart.length} Items Selected</span>
                  </div>
                  <div className="min-h-[400px]">
                     {!cart.length ? (
                        <div className="h-full flex flex-col items-center justify-center p-20 text-center space-y-4">
                           <div className="h-20 w-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-200">
                              <Package className="h-10 w-10" />
                           </div>
                           <p className="text-sm font-medium text-gray-400 max-w-[200px]">Your basket is empty. Search and add products above.</p>
                        </div>
                     ) : (
                        <table className="w-full text-left">
                           <thead className="bg-gray-50/50">
                              <tr>
                                 <th className="px-8 py-5 text-[10px] font-black text-gray-900 uppercase tracking-widest">Product Details</th>
                                 <th className="px-8 py-5 text-[10px] font-black text-gray-900 uppercase tracking-widest text-center">Price</th>
                                 <th className="px-8 py-5 text-[10px] font-black text-gray-900 uppercase tracking-widest text-center">Quantity</th>
                                 <th className="px-8 py-5 text-[10px] font-black text-gray-900 uppercase tracking-widest text-right">Subtotal</th>
                                 <th className="px-8 py-5"></th>
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-gray-50">
                              {cart.map(item => (
                                 <tr key={item.id} className="group">
                                    <td className="px-8 py-5">
                                       <span className="font-bold text-gray-900">{item.name}</span>
                                    </td>
                                    <td className="px-8 py-5 text-center font-medium text-gray-600">
                                       {formatPrice(item.price)}
                                    </td>
                                    <td className="px-8 py-5">
                                       <div className="flex items-center justify-center gap-4">
                                          <button onClick={() => updateQuantity(item.id, -1)} className="h-8 w-8 rounded-lg border border-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-50 active:scale-90">-</button>
                                          <span className="font-bold text-gray-900 w-8 text-center">{item.quantity}</span>
                                          <button onClick={() => updateQuantity(item.id, 1)} className="h-8 w-8 rounded-lg border border-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-50 active:scale-90">+</button>
                                       </div>
                                    </td>
                                    <td className="px-8 py-5 text-right font-bold text-gray-900">
                                       {formatPrice(item.subtotal)}
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                       <button onClick={() => removeFromCart(item.id)} className="p-2 text-rose-300 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-all">
                                          <Trash2 className="h-4 w-4" />
                                       </button>
                                    </td>
                                 </tr>
                              ))}
                           </tbody>
                        </table>
                     )}
                  </div>
               </div>
            </div>

            {/* Right: Customer & Summary */}
            <div className="space-y-8 print:hidden">
               {/* Customer Details */}
               <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 space-y-6">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                     <User className="h-5 w-5 text-blue-600" /> Customer Info
                  </h3>
                  <div className="space-y-4">
                     <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Customer Name</label>
                        <div className="relative">
                           <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
                           <input
                              type="text"
                              value={customer.name}
                              onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                              placeholder="Enter customer name"
                              className="w-full bg-gray-50 border border-gray-100 rounded-xl pl-12 pr-4 py-3 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                           />
                        </div>
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Mobile Number</label>
                        <div className="relative">
                           <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
                           <input
                              type="text"
                              value={customer.phone}
                              onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                              placeholder="+977 98XXXXXXXX"
                              className="w-full bg-gray-50 border border-gray-100 rounded-xl pl-12 pr-4 py-3 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                           />
                        </div>
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Processed By (Staff)</label>
                        <div className="relative">
                           <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
                           <input
                              type="text"
                              value={staffName}
                              onChange={(e) => setStaffName(e.target.value)}
                              placeholder="Staff Name"
                              className="w-full bg-gray-50 border border-gray-100 rounded-xl pl-12 pr-4 py-3 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                           />
                        </div>
                     </div>
                  </div>
               </div>

               {/* Payment Method */}
               <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 space-y-6">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                     <CreditCard className="h-5 w-5 text-blue-600" /> Payment Type
                  </h3>
                  <div className="grid grid-cols-3 gap-3">
                     {['Cash', 'QR', 'Credit'].map(method => (
                        <button
                           key={method}
                           onClick={() => setPaymentMethod(method)}
                           className={cn(
                              "py-3 rounded-xl text-xs font-bold transition-all border",
                              paymentMethod === method
                                 ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-500/20"
                                 : "bg-gray-50 text-gray-400 border-gray-100 hover:bg-white hover:text-gray-900"
                           )}
                        >
                           {method}
                        </button>
                     ))}
                  </div>
               </div>

               {/* Final Summary */}
               <div className="bg-[#1E3A8A] p-10 rounded-[2.5rem] shadow-2xl text-white space-y-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-10 opacity-10">
                     <Receipt className="h-32 w-32 rotate-12" />
                  </div>

                  <div className="space-y-4">
                     <div className="flex justify-between items-center text-blue-200">
                        <span className="text-sm font-medium">Subtotal</span>
                        <span className="font-bold">{formatPrice(subtotal)}</span>
                     </div>
                     <div className="flex justify-between items-center text-blue-200">
                        <span className="text-sm font-medium">VAT (13%)</span>
                        <span className="font-bold">{formatPrice(vat)}</span>
                     </div>
                     <div className="h-px bg-white/10 my-4" />
                     <div className="flex justify-between items-center">
                        <span className="text-lg font-bold">Total Payable</span>
                        <span className="text-3xl font-black">{formatPrice(total)}</span>
                     </div>
                  </div>

                  <button
                     onClick={saveInvoice}
                     disabled={cart.length === 0 || loading}
                     className="w-full bg-white text-[#1E3A8A] py-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2"
                  >
                     {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Generate Invoice"}
                  </button>
               </div>
            </div>
         </div>

         {/* Invoice Modal for Printing */}
         {showInvoice && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center bg-gray-900/80 backdrop-blur-md p-4 print:p-0 print:static print:bg-white">
               <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[95vh] print:max-h-none print:shadow-none print:rounded-none">
                  {/* Toolbar */}
                  <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 print:hidden">
                     <h2 className="text-xl font-bold text-gray-900">Preview Invoice</h2>
                     <div className="flex gap-4">
                        <button onClick={handlePrint} className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg shadow-blue-500/20">
                           <Printer className="h-4 w-4" /> Print PDF
                        </button>
                        <button onClick={() => setShowInvoice(false)} className="p-2.5 text-gray-400 hover:text-gray-900 hover:bg-white rounded-xl transition-all">
                           <X className="h-5 w-5" />
                        </button>
                     </div>
                  </div>

                  {/* The Actual Invoice Content */}
                  <div className="flex-1 overflow-y-auto p-12 space-y-12 print:overflow-visible">
                     {/* Branding & Info */}
                     <div className="flex justify-between items-start">
                        <div>
                           <div className="flex items-center gap-3 mb-4">
                              <img src="/logo.png" alt="Logo" className="h-12 w-12 object-contain" />
                              <h1 className="text-2xl font-black text-[#1E3A8A] uppercase tracking-tighter">KDS Garment</h1>
                           </div>
                           <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Lalgadh, Nepal</p>
                           <p className="text-xs text-gray-400 font-medium">+977 9855073550 | kdsgroup98@gmail.com</p>
                        </div>
                        <div className="text-right">
                           <h2 className="text-4xl font-black text-gray-200 uppercase tracking-tighter mb-4">Invoice</h2>
                           <div className="space-y-1">
                              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Invoice Number</p>
                              <p className="text-sm font-black text-gray-900">{invoiceNumber}</p>
                           </div>
                           <div className="mt-4 space-y-1">
                              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Date & Time</p>
                              <p className="text-sm font-bold text-gray-900">{new Date().toLocaleString()}</p>
                           </div>
                        </div>
                     </div>

                     {/* Customer & Staff Info */}
                     <div className="grid grid-cols-2 gap-10 py-10 border-y border-gray-100">
                        <div>
                           <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-4">Billed To</p>
                           <h4 className="text-lg font-bold text-gray-900">{customer.name || 'Walk-in Customer'}</h4>
                           <p className="text-sm text-gray-500 font-medium mt-1">{customer.phone || 'Contact not provided'}</p>
                        </div>
                        <div className="text-right">
                           <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-4">Payment & Staff</p>
                           <p className="text-sm font-bold text-gray-900">Payment: <span className="text-blue-600">{paymentMethod}</span></p>
                           <p className="text-sm font-bold text-gray-900 mt-1">Processed By: {staffName}</p>
                        </div>
                     </div>

                     {/* Itemized List */}
                     <table className="w-full text-left">
                        <thead>
                           <tr className="border-b-2 border-gray-900/5">
                              <th className="py-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Description</th>
                              <th className="py-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Price</th>
                              <th className="py-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Qty</th>
                              <th className="py-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Subtotal</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                           {cart.map((item, i) => (
                              <tr key={i}>
                                 <td className="py-6 font-bold text-gray-900 text-sm">{item.name}</td>
                                 <td className="py-6 text-center font-medium text-gray-500 text-sm">{formatPrice(item.price)}</td>
                                 <td className="py-6 text-center font-black text-gray-900 text-sm">{item.quantity}</td>
                                 <td className="py-6 text-right font-black text-gray-900 text-sm">{formatPrice(item.subtotal)}</td>
                              </tr>
                           ))}
                        </tbody>
                     </table>

                     {/* Calculations */}
                     <div className="flex justify-end pt-10">
                        <div className="w-72 space-y-4">
                           <div className="flex justify-between items-center text-sm">
                              <span className="font-bold text-gray-400 uppercase tracking-widest text-[10px]">Taxable Amount</span>
                              <span className="font-bold text-gray-900">{formatPrice(subtotal)}</span>
                           </div>
                           <div className="flex justify-between items-center text-sm">
                              <span className="font-bold text-gray-400 uppercase tracking-widest text-[10px]">VAT (13%)</span>
                              <span className="font-bold text-gray-900">{formatPrice(vat)}</span>
                           </div>
                           <div className="h-px bg-gray-100 my-4" />
                           <div className="flex justify-between items-center">
                              <span className="font-black text-[#1E3A8A] uppercase tracking-widest text-xs">Grand Total</span>
                              <span className="text-3xl font-black text-gray-900">{formatPrice(total)}</span>
                           </div>
                        </div>
                     </div>

                     {/* Footer */}
                     <div className="pt-20 text-center space-y-4">
                        <div className="inline-block p-4 bg-gray-50 rounded-2xl">
                           <p className="text-sm font-black text-gray-900 tracking-tight">Thank you for shopping with us! 👋</p>
                           <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Please visit again</p>
                        </div>
                        <p className="text-[10px] text-gray-300 font-medium uppercase tracking-[0.3em]">Computer Generated Invoice - No Signature Required</p>
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
