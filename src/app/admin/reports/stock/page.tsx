import { createClient } from "@/lib/supabase/server"
import { formatPrice } from "@/lib/utils"
import { Package, Search, Tag, TrendingUp } from "lucide-react"

export default async function StockReportPage() {
  const supabase = await createClient()
  
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .order('name')

  const totalItems = products?.length || 0
  const totalStockQuantity = products?.reduce((acc, p) => acc + (p.stock || 0), 0) || 0
  const totalValuation = products?.reduce((acc, p) => acc + ((p.stock || 0) * (p.price || 0)), 0) || 0

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight uppercase">Stock Valuation Report</h1>
          <p className="text-sm text-gray-500 mt-1 font-medium">Real-time inventory levels and financial valuation</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Total Active SKUs</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{totalItems}</p>
         </div>
         <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Total Stock Quantity</p>
            <p className="text-3xl font-bold text-blue-600 mt-2">{totalStockQuantity} units</p>
         </div>
         <div className="bg-[#1E3A8A] text-white p-6 rounded-3xl shadow-sm border border-blue-900">
            <p className="text-xs font-black text-white/60 uppercase tracking-widest">Total Stock Valuation</p>
            <p className="text-3xl font-bold mt-2">{formatPrice(totalValuation)}</p>
         </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
             <thead>
                <tr className="bg-gray-50/50">
                   <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Product Name</th>
                   <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Category</th>
                   <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Unit Price</th>
                   <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Current Stock</th>
                   <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Total Value</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-gray-50">
                {products?.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 transition-all">
                     <td className="px-8 py-5">
                        <p className="font-bold text-gray-900 text-sm">{product.name}</p>
                     </td>
                     <td className="px-8 py-5">
                        <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-[10px] font-bold uppercase">{product.category}</span>
                     </td>
                     <td className="px-8 py-5 text-center font-bold text-gray-600">{formatPrice(product.price)}</td>
                     <td className="px-8 py-5 text-center">
                        <span className={`px-3 py-1 rounded-lg text-xs font-black ${product.stock && product.stock > 10 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                           {product.stock || 0}
                        </span>
                     </td>
                     <td className="px-8 py-5 text-right font-black text-[#1E3A8A]">
                        {formatPrice((product.stock || 0) * (product.price || 0))}
                     </td>
                  </tr>
                ))}
             </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
