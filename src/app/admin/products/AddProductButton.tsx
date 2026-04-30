"use client"

import { useState, useRef } from "react"
import { Plus, X, Upload, Loader2, Check, Package, DollarSign, Layers, FileText, Images, Image as ImageIcon } from "lucide-react"
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
    description: "",
    gallery: [] as string[]
  })
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const galleryInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, isGallery = false) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    
    for (const file of Array.from(files)) {
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

      if (isGallery) {
        setFormData(prev => ({ ...prev, gallery: [...prev.gallery, publicUrl] }))
      } else {
        setFormData(prev => ({ ...prev, image_url: publicUrl }))
      }
    }
    
    setUploading(false)
  }

  const removeGalleryImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== index)
    }))
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
        description: formData.description,
        gallery: formData.gallery // We'll try to insert this. If column is missing, it might error.
      })

    if (error) {
      console.error("Insert Error:", error)
      // Fallback: If gallery column is missing, try without it
      if (error.message.includes('gallery')) {
        const { error: retryError } = await supabase
          .from('products')
          .insert({
            name: formData.name,
            category: formData.category,
            price: parseFloat(formData.price),
            stock_quantity: parseInt(formData.stock),
            image_url: formData.image_url,
            description: formData.description
          })
        if (retryError) alert(retryError.message)
        else success()
      } else {
        alert(error.message)
      }
      setLoading(false)
    } else {
      success()
    }
  }

  const success = () => {
    setIsOpen(false)
    setFormData({ name: "", category: "Men", price: "", stock: "", image_url: "", description: "", gallery: [] })
    setLoading(false)
    router.refresh()
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="bg-[#002169] text-white px-8 py-3.5 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center gap-3 hover:bg-[#FCB800] hover:text-[#002169] transition-all shadow-xl shadow-blue-900/20 active:scale-95 group"
      >
        <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform" /> Add New Asset
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#002169]/80 backdrop-blur-xl">
          <div className="bg-white w-full max-w-5xl rounded-[3.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden animate-in fade-in zoom-in duration-500 flex flex-col max-h-[95vh] border-4 border-white">
            
            {/* 🚀 Header */}
            <div className="p-6 md:p-10 border-b-4 border-gray-50 flex justify-between items-center bg-gray-50/50">
              <div className="flex items-center gap-4 md:gap-6">
                <div className="h-12 w-12 md:h-16 md:w-16 bg-[#002169] rounded-2xl md:rounded-3xl flex items-center justify-center text-[#FCB800] shadow-2xl shadow-blue-900/30 shrink-0">
                   <Package className="h-6 w-6 md:h-8 md:w-8" />
                </div>
                <div>
                  <h2 className="text-xl md:text-3xl font-black text-[#002169] uppercase tracking-tighter">Inventory <span className="text-[#FCB800]">Ingestion</span></h2>
                  <p className="text-[10px] md:text-xs text-gray-400 font-bold uppercase tracking-[0.2em] mt-1">Register new products and color variants</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="h-10 w-10 md:h-12 md:w-12 shrink-0 flex items-center justify-center bg-white hover:bg-rose-50 rounded-xl md:rounded-2xl transition-all border-2 border-gray-100 hover:border-rose-100 group">
                <X className="h-5 w-5 md:h-6 md:w-6 text-gray-400 group-hover:text-rose-600" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 md:p-12 space-y-8 md:space-y-12 custom-scrollbar bg-white">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16">
                
                {/* Left: Media & Gallery */}
                <div className="space-y-10">
                   {/* Main Image */}
                  <div className="space-y-4">
                    <label className="text-[11px] font-black text-[#002169] uppercase tracking-[0.3em] px-2 flex items-center gap-2">
                       <ImageIcon className="h-4 w-4" /> Feature Image
                    </label>
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="relative aspect-video w-full rounded-[2.5rem] border-4 border-dashed border-gray-200 hover:border-[#FCB800] hover:bg-amber-50/30 transition-all cursor-pointer overflow-hidden flex flex-col items-center justify-center bg-gray-50 group shadow-inner"
                    >
                      {formData.image_url ? (
                        <>
                          <img src={formData.image_url} alt="Preview" className="h-full w-full object-cover" />
                          <div className="absolute inset-0 bg-[#002169]/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all backdrop-blur-sm">
                            <div className="bg-white p-5 rounded-full shadow-2xl scale-75 group-hover:scale-100 transition-transform">
                              <Upload className="h-8 w-8 text-[#002169]" />
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col items-center gap-6">
                          <div className="h-20 w-20 rounded-[2rem] bg-white shadow-xl flex items-center justify-center group-hover:scale-110 transition-transform border-2 border-gray-50">
                            {uploading ? <Loader2 className="h-10 w-10 animate-spin text-[#002169]" /> : <Upload className="h-10 w-10 text-[#002169]" />}
                          </div>
                          <p className="text-[10px] font-black text-[#002169] uppercase tracking-[0.2em]">Upload Primary Asset</p>
                        </div>
                      )}
                      <input type="file" ref={fileInputRef} onChange={(e) => handleFileUpload(e)} className="hidden" accept="image/*" />
                    </div>
                  </div>

                  {/* Gallery / Color Variants */}
                  <div className="space-y-4">
                     <label className="text-[11px] font-black text-[#002169] uppercase tracking-[0.3em] px-2 flex items-center gap-2">
                        <Images className="h-4 w-4" /> Multi-Color / Gallery Assets
                     </label>
                     <div className="grid grid-cols-4 gap-4">
                        {formData.gallery.map((url, idx) => (
                           <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden border-2 border-gray-100 group">
                              <img src={url} alt="G" className="h-full w-full object-cover" />
                              <button 
                                type="button"
                                onClick={() => removeGalleryImage(idx)}
                                className="absolute top-1 right-1 h-6 w-6 bg-rose-600 text-white rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-lg"
                              >
                                 <X className="h-4 w-4" />
                              </button>
                           </div>
                        ))}
                        <button 
                           type="button"
                           onClick={() => galleryInputRef.current?.click()}
                           className="aspect-square rounded-2xl border-4 border-dashed border-gray-100 flex flex-col items-center justify-center text-gray-300 hover:text-[#FCB800] hover:border-[#FCB800] hover:bg-amber-50/20 transition-all"
                        >
                           <Plus className="h-6 w-6" />
                           <span className="text-[8px] font-black uppercase tracking-widest mt-2">Add Color</span>
                        </button>
                        <input type="file" ref={galleryInputRef} onChange={(e) => handleFileUpload(e, true)} className="hidden" accept="image/*" multiple />
                     </div>
                  </div>
                </div>

                {/* Right: Technical Metadata */}
                <div className="space-y-8">
                  <div className="space-y-4">
                    <label className="text-[11px] font-black text-[#002169] uppercase tracking-[0.3em] px-2 flex items-center gap-2">
                       <FileText className="h-4 w-4" /> Product Identity
                    </label>
                    <input
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="ENTER ASSET NAME..."
                      className="w-full bg-gray-50 border-4 border-gray-100 rounded-3xl px-8 py-6 focus:border-[#FCB800] focus:bg-white outline-none transition-all text-lg font-black text-gray-900 placeholder:text-gray-300 shadow-sm"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <label className="text-[11px] font-black text-[#002169] uppercase tracking-[0.3em] px-2 flex items-center gap-2">
                         <Layers className="h-4 w-4" /> Collection
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                        className="w-full bg-gray-50 border-4 border-gray-100 rounded-3xl px-8 py-6 focus:border-[#FCB800] focus:bg-white outline-none transition-all appearance-none text-base font-black text-gray-900 shadow-sm"
                      >
                        <option>Men</option>
                        <option>Women</option>
                        <option>Kids</option>
                        <option>Accessories</option>
                      </select>
                    </div>
                    <div className="space-y-4">
                      <label className="text-[11px] font-black text-[#002169] uppercase tracking-[0.3em] px-2 flex items-center gap-2">
                         <DollarSign className="h-4 w-4" /> MSRP (NPR)
                      </label>
                      <input
                        required
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData({...formData, price: e.target.value})}
                        placeholder="0.00"
                        className="w-full bg-gray-50 border-4 border-gray-100 rounded-3xl px-8 py-6 focus:border-[#FCB800] focus:bg-white outline-none transition-all text-lg font-black text-gray-900 placeholder:text-gray-300 shadow-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[11px] font-black text-[#002169] uppercase tracking-[0.3em] px-2 flex items-center gap-2">
                       <Package className="h-4 w-4" /> Stock
                    </label>
                    <input
                      required
                      type="number"
                      value={formData.stock}
                      onChange={(e) => setFormData({...formData, stock: e.target.value})}
                      placeholder="UNITS AVAILABLE"
                      className="w-full bg-gray-50 border-4 border-gray-100 rounded-3xl px-8 py-6 focus:border-[#FCB800] focus:bg-white outline-none transition-all text-lg font-black text-gray-900 placeholder:text-gray-300 shadow-sm"
                    />
                  </div>

                  <div className="pt-6">
                    <button
                      type="submit"
                      disabled={loading || uploading}
                      className="w-full bg-[#002169] hover:bg-[#FCB800] hover:text-[#002169] text-white py-8 rounded-[2.5rem] font-black text-sm uppercase tracking-[0.3em] flex items-center justify-center gap-4 transition-all shadow-[0_30px_60px_-10px_rgba(0,33,105,0.3)] active:scale-95 disabled:opacity-50 group"
                    >
                      {loading ? <Loader2 className="h-8 w-8 animate-spin" /> : (
                        <>
                          <Check className="h-8 w-8 group-hover:scale-125 transition-transform" />
                          Finalize Entry
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
