import { getCategories } from "@/lib/products"
import Image from "next/image"
import Link from "next/link"
import { ChevronRight, ArrowRight, Layers } from "lucide-react"

export default async function CategoriesPage() {
  const categories = await getCategories()

  // Sample images for categories if not provided in data
  const categoryImages: Record<string, string> = {
    "Suits": "https://images.unsplash.com/photo-1594932224030-940955d21aa3?q=80&w=2000&auto=format&fit=crop",
    "Shirts": "https://images.unsplash.com/photo-1621335829175-95f437384d7c?q=80&w=1974&auto=format&fit=crop",
    "Pants": "https://images.unsplash.com/photo-1593032465175-481ac7f401a0?q=80&w=1935&auto=format&fit=crop",
    "Dresses": "https://images.unsplash.com/photo-1539008835279-434674508233?q=80&w=1974&auto=format&fit=crop",
    "Outerwear": "https://images.unsplash.com/photo-1544022613-e87ca75a784a?q=80&w=1974&auto=format&fit=crop",
  }

  return (
    <div className="min-h-screen bg-[#F9F9F9] py-24 relative overflow-hidden">
      {/* Side Watermark */}
      <div className="fixed left-4 top-1/2 -translate-y-1/2 -rotate-90 origin-left hidden xl:block pointer-events-none z-0">
        <span className="text-[12px] font-black uppercase tracking-[0.6em] text-black/10">KDS Garment • Archive</span>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-6xl mx-auto space-y-24">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row items-end justify-between gap-12 border-b-4 border-black/5 pb-20">
            <div className="space-y-8">
               <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-[#A88B4A]">
                  <Link href="/" className="hover:text-black transition-colors">Home</Link>
                  <ChevronRight className="h-3 w-3" />
                  <span>Archive</span>
               </div>
               <h1 className="text-3xl sm:text-5xl md:text-7xl lg:text-9xl font-black tracking-tighter uppercase text-black leading-[0.85]">
                  THE <br /> <span className="text-black/20">ARCHIVE</span>
               </h1>
            </div>
            <p className="text-sm font-bold text-black/40 uppercase tracking-[0.3em] max-w-sm text-right leading-loose">
              Explore our curated classifications of premium garments and bespoke creations.
            </p>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {categories.map((cat, idx) => (
              <Link 
                key={cat} 
                href={`/products?category=${cat}`}
                className={cn(
                  "group relative overflow-hidden rounded-[4rem] bg-white shadow-2xl transition-all duration-1000 hover:-translate-y-4",
                  idx % 3 === 0 ? "md:col-span-2 h-[600px]" : "h-[700px]"
                )}
              >
                <Image 
                  src={categoryImages[cat] || "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=1974&auto=format&fit=crop"} 
                  alt={cat} fill className="object-cover transition-transform duration-1000 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                <div className="absolute inset-0 flex flex-col justify-end p-16 space-y-6">
                   <div className="flex items-center gap-6">
                      <div className="h-1 bg-[#D4AF37] w-12" />
                      <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#D4AF37]">Explore Collection</span>
                   </div>
                   <h3 className="text-3xl sm:text-5xl md:text-6xl lg:text-8xl font-black tracking-tighter uppercase text-white leading-none">
                      {cat}
                   </h3>
                   <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                      <span className="text-xs font-black uppercase tracking-[0.4em] text-white/60">View all pieces</span>
                      <ArrowRight className="h-6 w-6 text-white" />
                   </div>
                </div>

                {/* Counter */}
                <div className="absolute top-12 right-12 h-16 w-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center">
                   <span className="text-xl font-black text-white">{String(idx + 1).padStart(2, '0')}</span>
                </div>
              </Link>
            ))}
          </div>

          {/* Custom Section Link */}
          <div className="bg-black rounded-[4rem] p-20 flex flex-col items-center text-center space-y-10 relative overflow-hidden shadow-2xl">
             <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(212,175,55,0.05),transparent_70%)]" />
             <Layers className="h-16 w-16 text-[#D4AF37] relative z-10" />
             <h2 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tighter uppercase text-white relative z-10">Bespoke <br /> Customizations</h2>
             <p className="text-xs font-bold text-white/40 uppercase tracking-[0.4em] max-w-lg relative z-10 leading-loose">
               Looking for something unique? Our master tailors can create any category of garment specifically for your requirements.
             </p>
             <Link href="/inquiry" className="h-20 px-16 bg-white text-black rounded-full font-black uppercase tracking-widest text-[10px] hover:scale-105 active:scale-95 transition-all shadow-2xl relative z-10 flex items-center gap-4">
                REQUEST CUSTOM PIECE <ArrowRight className="h-4 w-4" />
             </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ")
}
