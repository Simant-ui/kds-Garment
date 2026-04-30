"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Save, Globe, Search, Tag, Loader2, CheckCircle2 } from "lucide-react"

export default function SeoSettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [seo, setSeo] = useState({
    title: "",
    description: "",
    keywords: ""
  })

  const supabase = createClient()

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    const { data, error } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'seo')
      .single()

    if (data) {
      setSeo(data.value)
    }
    setLoading(false)
  }

  const handleSave = async () => {
    setSaving(true)
    setSuccess(false)
    
    const { error } = await supabase
      .from('site_settings')
      .upsert({ 
        key: 'seo', 
        value: seo,
        updated_at: new Date().toISOString() 
      }, { onConflict: 'key' })

    if (error) {
      alert("Error saving: " + error.message)
    } else {
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    }
    setSaving(false)
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
    </div>
  )

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-10">
      <div className="flex justify-between items-center">
        <div>
           <h1 className="text-3xl font-black text-gray-900 tracking-tight">SEO & RANKING</h1>
           <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mt-1">Manage your Google search visibility</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-xl font-black uppercase text-xs tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50"
        >
           {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
           Save Settings
        </button>
      </div>

      {success && (
        <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl flex items-center gap-3 text-emerald-700 animate-in fade-in slide-in-from-top-4">
           <CheckCircle2 className="h-5 w-5" />
           <p className="text-sm font-bold">SEO settings updated successfully! Google will crawl these changes soon.</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-8">
        
        {/* Meta Title */}
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
           <div className="flex items-center gap-3 text-blue-600">
              <Globe className="h-5 w-5" />
              <h3 className="text-sm font-black uppercase tracking-widest">Site Meta Title</h3>
           </div>
           <div className="space-y-2">
              <input 
                type="text" 
                value={seo.title}
                onChange={(e) => setSeo({...seo, title: e.target.value})}
                placeholder="e.g. Best Garment Company in Nepal | KDS Readymade Udhyog"
                className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Recommended: 50-60 characters</p>
           </div>
        </div>

        {/* Meta Description */}
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
           <div className="flex items-center gap-3 text-emerald-600">
              <Search className="h-5 w-5" />
              <h3 className="text-sm font-black uppercase tracking-widest">Meta Description</h3>
           </div>
           <div className="space-y-2">
              <textarea 
                rows={4}
                value={seo.description}
                onChange={(e) => setSeo({...seo, description: e.target.value})}
                placeholder="Write a catchy summary of your business for Google..."
                className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 text-sm font-bold focus:ring-2 focus:ring-emerald-500 outline-none transition-all resize-none"
              />
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Recommended: 150-160 characters</p>
           </div>
        </div>

        {/* Keywords */}
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
           <div className="flex items-center gap-3 text-amber-500">
              <Tag className="h-5 w-5" />
              <h3 className="text-sm font-black uppercase tracking-widest">Target Keywords</h3>
           </div>
           <div className="space-y-2">
              <textarea 
                rows={3}
                value={seo.keywords}
                onChange={(e) => setSeo({...seo, keywords: e.target.value})}
                placeholder="garment in nepal, best garment, mahottari clothing, terai uniforms..."
                className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 text-sm font-bold focus:ring-2 focus:ring-amber-500 outline-none transition-all resize-none"
              />
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Separate keywords with commas (,)</p>
           </div>
        </div>

        {/* SEO Preview */}
        <div className="bg-gray-900 rounded-3xl p-10 space-y-6">
           <h3 className="text-white text-xs font-black uppercase tracking-[0.2em] opacity-50">Google Preview</h3>
           <div className="space-y-2">
              <p className="text-blue-400 text-xl font-medium hover:underline cursor-pointer">{seo.title || "Your Site Title Goes Here"}</p>
              <p className="text-emerald-500 text-sm">https://kdsreadymadeudhyog.com.np › garment-nepal</p>
              <p className="text-gray-400 text-sm line-clamp-2">{seo.description || "Your site description will appear here on Google search results."}</p>
           </div>
        </div>

      </div>
    </div>
  )
}
