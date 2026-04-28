"use client"

import { useState, useRef } from "react"
import { Plus, X, Upload, Loader2, Check } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export default function AddProductButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    category: "Men",
    price: "",
    stock: "",
    image_url: "",
    description: ""
  })
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random()}.${fileExt}`
    const filePath = `${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(filePath, file)

    if (uploadError) {
      alert("Error uploading image: " + uploadError.message)
      setUploading(false)
      return
    }

    const { data: { publicUrl } } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath)

    setFormData({ ...formData, image_url: publicUrl })
    setUploading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase
      .from('products')
      .insert({
        name: formData.name,
        category: formData.category,
        price: parseFloat(formData.price),
        stock_quantity: parseInt(formData.stock),
        image_url: formData.image_url,
        description: formData.description
      })

    if (error) {
      alert(error.message)
      setLoading(false)
    } else {
      setIsOpen(false)
      setFormData({ name: "", category: "Men", price: "", stock: "", image_url: "", description: "" })
      setLoading(false)
      router.refresh()
    }
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-blue-700 transition-all shadow-md shadow-blue-500/20 active:scale-95"
      >
        <Plus className="h-4 w-4" /> Add Product
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 flex flex-col max-h-[95vh]">
            <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                   <Plus className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Add New Product</h2>
                  <p className="text-xs text-gray-400 font-medium">Create a new item in your inventory</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="h-10 w-10 flex items-center justify-center hover:bg-white rounded-lg transition-all border border-transparent hover:border-gray-200">
                <X className="h-5 w-5 text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-10 space-y-8">
              {/* Image Upload Section */}
              <div className="space-y-3">
                <label className="text-[11px] font-black text-gray-900 uppercase tracking-widest">Product Display Asset</label>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="relative h-48 w-full rounded-2xl border-2 border-dashed border-gray-200 hover:border-blue-500 hover:bg-blue-50/50 transition-all cursor-pointer overflow-hidden flex flex-col items-center justify-center bg-gray-50 group"
                >
                  {formData.image_url ? (
                    <>
                      <img src={formData.image_url} alt="Preview" className="h-full w-full object-cover" />
                      <div className="absolute inset-0 bg-blue-600/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all backdrop-blur-sm">
                        <div className="bg-white p-3 rounded-full shadow-lg">
                          <Upload className="h-5 w-5 text-blue-600" />
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center gap-3">
                      <div className="h-14 w-14 rounded-xl bg-white shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform border border-gray-100">
                        {uploading ? <Loader2 className="h-6 w-6 animate-spin text-blue-600" /> : <Upload className="h-6 w-6 text-blue-600" />}
                      </div>
                      <p className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Upload High-Res Asset</p>
                    </div>
                  )}
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileUpload} 
                    className="hidden" 
                    accept="image/*"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-gray-900 uppercase tracking-widest">Product Title</label>
                  <input
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="ENTER PRODUCT NAME..."
                    className="w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-4 focus:ring-blue-100 focus:border-blue-600 outline-none transition-all text-sm font-bold text-gray-900 placeholder:text-gray-400"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-gray-900 uppercase tracking-widest">Collection</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-4 focus:ring-blue-100 focus:border-blue-600 outline-none transition-all appearance-none text-sm font-bold text-gray-900"
                  >
                    <option>Men</option>
                    <option>Women</option>
                    <option>Kids</option>
                    <option>Accessories</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-gray-900 uppercase tracking-widest">Unit Price (NPR)</label>
                  <input
                    required
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    placeholder="0.00"
                    className="w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-4 focus:ring-blue-100 focus:border-blue-600 outline-none transition-all text-sm font-bold text-gray-900 placeholder:text-gray-400"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-gray-900 uppercase tracking-widest">Initial Inventory</label>
                  <input
                    required
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({...formData, stock: e.target.value})}
                    placeholder="0"
                    className="w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-4 focus:ring-blue-100 focus:border-blue-600 outline-none transition-all text-sm font-bold text-gray-900 placeholder:text-gray-400"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || uploading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all shadow-lg shadow-blue-500/20 active:scale-[0.98] disabled:opacity-50"
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
                  <>
                    <Check className="h-5 w-5" />
                    Finalize Entry
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
