import { getProducts, getCategories } from "@/lib/products"
import ProductCard from "@/components/ui/ProductCard"
import { Search, Filter, SlidersHorizontal, ChevronRight, LayoutGrid, List } from "lucide-react"
import Link from "next/link"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Shop All Products",
  description: "Browse our collection of corporate wear, school uniforms, and custom garments. High-quality manufacturing at competitive prices in Nepal.",
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>
}) {
  const { q, category } = await searchParams
  const products = await getProducts()
  const categories = await getCategories()

  const filteredProducts = products.filter((p) => {
    const matchesSearch = q ? p.name.toLowerCase().includes(q.toLowerCase()) : true
    const matchesCategory = category ? p.category === category : true
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-[#F4F4F4]">
      {/* 🧭 Breadcrumbs */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-600 uppercase tracking-widest">
            <Link href="/" className="hover:text-[#002169] transition-colors">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-[#002169]">Products</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* 🏷️ Sidebar: Product Categories */}
          <aside className="lg:col-span-3 space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-[#002169] text-white px-6 py-4">
                <h3 className="text-sm font-bold uppercase tracking-wider">Product Categories</h3>
              </div>
              <div className="p-2">
                <Link 
                  href="/products" 
                  className={`flex items-center justify-between px-4 py-3 text-sm font-bold rounded transition-all ${!category ? 'bg-[#FCB800] text-[#002169]' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  ALL PRODUCTS
                  <ChevronRight className="h-4 w-4" />
                </Link>
                {categories.map((cat) => (
                  <Link 
                    key={cat}
                    href={`/products?category=${cat}`} 
                    className={`flex items-center justify-between px-4 py-3 text-sm font-bold rounded transition-all border-t border-gray-50 ${category === cat ? 'bg-[#FCB800] text-[#002169]' : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    {cat.toUpperCase()}
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Support Box */}
            <div className="bg-[#002169] rounded-lg p-8 text-white space-y-4">
               <h4 className="text-lg font-bold">Custom Orders</h4>
               <p className="text-xs text-white/90 leading-relaxed">
                 Need a custom design for your school or office? We provide high-quality manufacturing services.
               </p>
               <Link href="/inquiry" className="inline-flex items-center gap-2 text-sm font-bold text-[#FCB800] hover:underline">
                 GET A QUOTE <ChevronRight className="h-4 w-4" />
               </Link>
            </div>
          </aside>

          {/* 🛒 Main: Product Grid */}
          <main className="lg:col-span-9 space-y-6">
            {/* Toolbar */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-4">
                <p className="text-sm font-bold text-gray-700">
                  <span className="text-[#002169]">{filteredProducts.length}</span> Products Found
                </p>
              </div>
              
              <div className="flex items-center gap-4 w-full md:w-auto">
                <form action="/products" className="relative flex-1">
                   <input 
                     name="q"
                     defaultValue={q}
                     placeholder="Search..."
                     className="w-full md:w-64 bg-gray-50 border border-gray-200 rounded h-10 px-4 text-sm font-bold focus:border-[#002169] outline-none"
                   />
                   <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600">
                     <Search className="h-4 w-4" />
                   </button>
                </form>
                <div className="h-10 border-l border-gray-200 hidden md:block" />
                <select className="bg-gray-50 border border-gray-200 rounded h-10 px-4 text-xs font-bold outline-none">
                  <option>Sort by: Default</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Newest First</option>
                </select>
              </div>
            </div>

            {/* Grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-32 bg-white rounded-lg border-2 border-dashed border-gray-200 text-center">
                <Search className="h-16 w-16 text-gray-300 mb-6" />
                <h3 className="text-xl font-bold text-gray-800 mb-2 uppercase">No Products Found</h3>
                <p className="text-sm text-gray-600">Try adjusting your filters or search query.</p>
                <Link href="/products" className="mt-6 text-[#002169] font-bold text-sm underline">Clear all filters</Link>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
