"use client"

import { useState, useEffect, useMemo } from "react"
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

// Helper to convert number to words (Nepali numbering system)
function numberToWords(num: number): string {
  if (num === 0) return 'Zero';
  const a = ['','One ','Two ','Three ','Four ', 'Five ','Six ','Seven ','Eight ','Nine ','Ten ','Eleven ','Twelve ','Thirteen ','Fourteen ','Fifteen ','Sixteen ','Seventeen ','Eighteen ','Nineteen '];
  const b = ['', '', 'Twenty','Thirty','Forty','Fifty', 'Sixty','Seventy','Eighty','Ninety'];
  
  const inWords = (n: number) => {
    let strNum = Math.floor(n).toString();
    if (strNum.length > 9) return 'overflow';
    let nArray = ('000000000' + strNum).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!nArray) return '';
    let str = '';
    str += (nArray[1] != '00') ? (a[Number(nArray[1])] || b[nArray[1][0] as any] + ' ' + a[nArray[1][1] as any]) + 'Crore ' : '';
    str += (nArray[2] != '00') ? (a[Number(nArray[2])] || b[nArray[2][0] as any] + ' ' + a[nArray[2][1] as any]) + 'Lakh ' : '';
    str += (nArray[3] != '00') ? (a[Number(nArray[3])] || b[nArray[3][0] as any] + ' ' + a[nArray[3][1] as any]) + 'Thousand ' : '';
    str += (nArray[4] != '0') ? (a[Number(nArray[4])] || b[nArray[4][0] as any] + ' ' + a[nArray[4][1] as any]) + 'Hundred ' : '';
    str += (nArray[5] != '00') ? ((str != '') ? 'and ' : '') + (a[Number(nArray[5])] || b[nArray[5][0] as any] + ' ' + a[nArray[5][1] as any]) : '';
    return str.trim();
  }
  return inWords(num) + " Rupees Only";
}

export default function POSPage() {
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

    const match = document.cookie.match(/(^| )staff_name=([^;]+)/)
    if (match) {
      setStaffName(decodeURIComponent(match[2].replace(/\+/g, ' ')))
    }
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
          total_amount: total, // Fixed to total_amount
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
                <div className="overflow-x-auto w-full">
                  <table className="w-full text-left whitespace-nowrap">
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
                            <button onClick={() => removeFromCart(item.id)} className="p-2 text-rose-300 hover:text-rose-600 md:opacity-0 md:group-hover:opacity-100 transition-all">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
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
                    disabled
                    placeholder="Staff Name"
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl pl-12 pr-4 py-3 text-sm font-bold text-gray-500 focus:outline-none cursor-not-allowed"
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

            {/* The Actual Invoice Content (Receipt Format) */}
            <div className="flex-1 overflow-y-auto p-12 print:overflow-visible print-invoice bg-white text-black font-mono">
              <div className="relative text-center space-y-1 mb-6">
                <div className="absolute top-0 left-0">
                   <img src="/logo.png" alt="KDS Logo" className="h-16 w-16 object-contain filter grayscale" />
                </div>
                <h1 className="text-2xl font-black tracking-widest uppercase ml-16">KDS Garment</h1>
                <p className="text-sm ml-16">Lalgadh, Nepal</p>
                <p className="text-xs text-gray-500 mt-2">Copy: 1 | Printed: {new Date().toLocaleString()}</p>
              </div>

              <div className="border-t-2 border-black my-4" />

              <h2 className="text-center text-xl tracking-[0.2em] mb-6">ESTIMATED BILL</h2>

              <div className="bg-gray-100 p-4 flex justify-between text-sm mb-6">
                <div className="space-y-1">
                   <p><span className="font-bold">Bill To:</span> {customer.name || 'N/A'}</p>
                   <p><span className="font-bold">Phone:</span> {customer.phone || '-------'}</p>
                </div>
                <div className="text-right space-y-1">
                   <p><span className="font-bold">Bill #:</span> {invoiceNumber}</p>
                   <p><span className="font-bold">Date:</span> {new Date().toLocaleDateString('en-CA')}</p>
                </div>
              </div>

              <table className="w-full text-sm text-left mb-6 border-collapse">
                <thead className="bg-[#4a4a4a] text-white">
                  <tr>
                    <th className="py-2 px-3 font-bold">Description</th>
                    <th className="py-2 px-3 font-bold text-center">Qty</th>
                    <th className="py-2 px-3 font-bold text-right">Rate</th>
                    <th className="py-2 px-3 font-bold text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item, i) => (
                    <tr key={i} className="border-b border-gray-200">
                       <td className="py-3 px-3">{item.name}</td>
                       <td className="py-3 px-3 text-center">{item.quantity}</td>
                       <td className="py-3 px-3 text-right">Rs. {item.price.toFixed(2)}</td>
                       <td className="py-3 px-3 text-right">Rs. {item.subtotal.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="flex justify-end mb-6 text-sm">
                <div className="w-64 space-y-2">
                  <div className="flex justify-between">
                    <span className="font-bold">Subtotal:</span>
                    <span>Rs. {subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-300 pb-2">
                    <span className="font-bold">Discount:</span>
                    <span>Rs. 0.00</span>
                  </div>
                  <div className="flex justify-between font-black text-base pt-2 border-b-2 border-black pb-2">
                    <span>Total:</span>
                    <span>Rs. {total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between mt-2">
                    <span className="font-bold">Tendered:</span>
                    <span>Rs. {total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-bold">Change:</span>
                    <span>Rs. 0.00</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-100 p-4 text-sm mb-6">
                 <span className="font-bold">Amount in words:</span> {numberToWords(total)}
              </div>

              <div className="text-sm mb-10 space-y-1">
                 <p className="font-bold">Payment Method:</p>
                 <p>• {paymentMethod.toUpperCase()}: Rs. {total.toFixed(2)}</p>
              </div>

              <div className="flex justify-between text-sm border-t border-gray-300 pt-4 mb-8">
                 <p><span className="font-bold">Cashier:</span> {staffName}</p>
                 <p><span className="font-bold">Items:</span> {cart.length}</p>
              </div>

              <div className="text-center text-xs italic text-gray-500 space-y-1 pb-4">
                 <p>Thank you for visiting us!</p>
                 <p className="not-italic">KDS Garment • Lalgadh • Tel: +977 9855073550</p>
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
