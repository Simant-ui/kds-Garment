import { getProducts } from "@/lib/products"
import Image from "next/image"
import { Edit2, Trash2, Search, Filter, Download, Package, ShieldCheck, ArrowUpRight, Zap, AlertCircle, Layers } from "lucide-react"
import { formatPrice, cn } from "@/lib/utils"
import AddProductButton from "./AddProductButton"
import ExportButton from "@/components/admin/ExportButton"

export default async function AdminProductsPage() {
  const products = await getProducts()

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventory</h1>
          <p className="text-sm text-gray-700 mt-1">Manage and track your product catalog</p>
        </div>
        <div className="flex gap-4">
           <ExportButton 
             data={products || []} 
             filename={`kds-inventory-${new Date().toISOString().split('T')[0]}`} 
             label="Export CSV" 
           />
           <AddProductButton />
        </div>
      </div>

      {/* Stats Quick View */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Total Assets", value: products.length, icon: Package, color: "text-blue-600 bg-blue-50" },
          { label: "Critical Stock", value: products.filter(p => (p.stock_quantity || 0) < 10).length, icon: AlertCircle, color: "text-rose-600 bg-rose-50" },
          { label: "Categories", value: new Set(products.map(p => p.category)).size, icon: Layers, color: "text-emerald-600 bg-emerald-50" }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-6 group hover:shadow-md transition-all">
             <div className={cn("p-4 rounded-xl", stat.color)}>
                <stat.icon className="h-6 w-6" />
             </div>
             <div>
                <p className="text-xs font-bold text-gray-600 uppercase tracking-wider">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
             </div>
          </div>
        ))}
      </div>

      {/* Main Table Section */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-600" />
            <input
              type="text"
              placeholder="Search products..."
              className="w-full bg-gray-50 border-none rounded-xl pl-12 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-8 py-5 text-[11px] font-bold uppercase tracking-wider text-gray-600">Product</th>
                <th className="px-8 py-5 text-[11px] font-bold uppercase tracking-wider text-gray-600">Category</th>
                <th className="px-8 py-5 text-[11px] font-bold uppercase tracking-wider text-gray-600">Price</th>
                <th className="px-8 py-5 text-[11px] font-bold uppercase tracking-wider text-gray-600">Stock</th>
                <th className="px-8 py-5 text-[11px] font-bold uppercase tracking-wider text-gray-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center">
                    <p className="text-sm text-gray-600 italic">No products found in inventory</p>
                  </td>
                </tr>
              ) : products.map((product, index) => (
                <tr key={product.id || index} className="group hover:bg-gray-50 transition-colors">
                  <td className="px-8 py-4">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 bg-gray-100 rounded-xl overflow-hidden border border-gray-200 flex-shrink-0">
                        {product.image_url ? (
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-gray-300">
                            <Package className="h-5 w-5" />
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-sm text-gray-900">{product.name || 'Unnamed Product'}</span>
                        <span className="text-[10px] text-gray-600 font-medium truncate max-w-[150px]">ID: {product.id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-4">
                    <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                      {product.category || 'General'}
                    </span>
                  </td>
                  <td className="px-8 py-4 font-bold text-sm text-gray-900">
                    {formatPrice(product.price)}
                  </td>
                  <td className="px-8 py-4">
                    <div className="flex items-center gap-3">
                       <div className={cn(
                         "h-2 w-2 rounded-full",
                         (product.stock_quantity || 0) > 10 ? "bg-emerald-500" : "bg-rose-500"
                       )} />
                       <span className={cn(
                         "text-[11px] font-bold",
                         (product.stock_quantity || 0) > 10 ? "text-emerald-600" : "text-rose-600"
                       )}>
                         {(product.stock_quantity || 0)} Units
                       </span>
                    </div>
                  </td>
                  <td className="px-8 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex justify-between items-center">
           <p className="text-xs text-gray-700 font-medium">Showing {products.length} products</p>
           <div className="flex gap-2">
              <button className="h-8 w-8 flex items-center justify-center rounded-lg bg-white border border-gray-200 text-gray-600 hover:border-blue-500 hover:text-blue-500 transition-all text-xs font-bold">1</button>
              <button className="h-8 w-8 flex items-center justify-center rounded-lg bg-white border border-gray-200 text-gray-600 hover:border-blue-500 hover:text-blue-500 transition-all text-xs font-bold">2</button>
           </div>
        </div>
      </div>
    </div>
  )
}
