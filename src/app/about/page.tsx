import Image from "next/image"
import Link from "next/link"
import { ChevronRight, Star, Quote, Award, Users, ShieldCheck, Factory, CheckCircle2, ArrowRight } from "lucide-react"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "About KDS Readymade Udhyog",
  description: "Learn about KDS Readymade Udhyog, Nepal's premier garment manufacturer. Discover our heritage, manufacturing process, and commitment to quality since 2018.",
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#F4F4F4] py-12">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto space-y-20">
          
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
            <Link href="/" className="hover:text-[#002169] transition-colors">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-[#002169]">About Us</span>
          </div>

          {/* Hero Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
             <div className="space-y-8">
                <h1 className="text-4xl md:text-6xl font-bold text-[#002169] leading-tight uppercase">
                  MANUFACTURING <br /> EXCELLENCE <span className="text-[#FCB800]">SINCE 2018 AD</span>
                </h1>
                <p className="text-gray-500 text-sm leading-relaxed max-w-lg">
                  KDS Garment is Nepal's premier manufacturing house for corporate wear, school uniforms, and custom apparel. With over 8 years of experience, we have defined the standard for quality and reliability in the garment industry.
                </p>
                <div className="flex items-center gap-6">
                   <div className="flex -space-x-3">
                      {[1,2,3,4].map((i) => (
                        <div key={i} className="h-12 w-12 rounded-full border-4 border-white bg-gray-200 overflow-hidden relative">
                           <Image src={`https://i.pravatar.cc/100?img=${i+10}`} alt="client" fill className="object-cover" />
                        </div>
                      ))}
                   </div>
                   <div className="text-xs font-bold uppercase tracking-widest text-[#002169]">
                      Trusted by 500+ Corporations
                   </div>
                </div>
             </div>
             <div className="relative aspect-video rounded-2xl overflow-hidden shadow-xl border-4 border-white">
                <Image 
                  src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=1974&auto=format&fit=crop" 
                  alt="Factory" fill className="object-cover" 
                />
                <div className="absolute inset-0 bg-[#002169]/20" />
             </div>
          </div>

          {/* Vision & Mission */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             {[
               { icon: Factory, title: "Our Facility", desc: "Equipped with state-of-the-art machinery and production lines to handle bulk manufacturing with precision." },
               { icon: ShieldCheck, title: "Quality Control", desc: "Every garment undergoes a multi-stage inspection process to ensure zero defects and perfect fit." },
               { icon: Users, title: "Our People", desc: "Our team of 200+ skilled artisans and tailors are the backbone of our manufacturing excellence." }
             ].map((item, i) => (
               <div key={i} className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 hover:border-[#FCB800] transition-colors group">
                  <item.icon className="h-10 w-10 text-[#FCB800] mb-6 group-hover:scale-110 transition-transform" />
                  <h3 className="text-lg font-bold text-[#002169] mb-4 uppercase">{item.title}</h3>
                  <p className="text-gray-500 text-xs leading-relaxed">{item.desc}</p>
               </div>
             ))}
          </div>

          {/* Detailed Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center py-10">
             <div className="relative aspect-square rounded-3xl overflow-hidden shadow-sm">
                <Image 
                  src="https://images.unsplash.com/photo-1524234107056-1c1f48f64ab8?q=80&w=2074&auto=format&fit=crop" 
                  alt="Crafting" fill className="object-cover" 
                />
                <div className="absolute bottom-8 left-8 bg-white/95 p-8 rounded-2xl shadow-2xl max-w-xs">
                   <Quote className="h-6 w-6 text-[#FCB800] mb-4" />
                   <p className="text-[11px] font-bold text-[#002169] leading-relaxed uppercase">
                     "Our goal is not just to sell clothes, but to represent the professionalism of your brand through our garments."
                   </p>
                </div>
             </div>
             
             <div className="space-y-10">
                <div className="space-y-6">
                   <h2 className="text-3xl font-bold text-[#002169] uppercase">The KDS Heritage & Manufacturing</h2>
                   <p className="text-gray-500 text-sm leading-loose">
                     Rooted in Lalgadh, Nepal, KDS Garment stands as a pillar of excellence in modern apparel manufacturing. What began as a dedicated vision to supply durable, premium uniforms for local schools and healthcare institutions has evolved into a full-scale industrial powerhouse. Today, we utilize state-of-the-art fabric sourcing, precision pattern-making, and advanced stitching technologies to produce everything from high-end corporate wear to heavy-duty industrial workwear. 
                   </p>
                   <p className="text-gray-500 text-sm leading-loose">
                     Our garment manufacturing process is defined by strict quality control at every phase—from raw material inspection and color-fastness testing to the final tailored finish. By blending traditional craftsmanship with automated production lines, we ensure that every single garment that leaves our facility offers unparalleled comfort, durability, and a flawless fit that proudly represents your brand.
                   </p>
                </div>

                <ul className="space-y-4">
                   {[
                     "ISO 9001:2015 Certified Manufacturing",
                     "Sustainable Material Sourcing",
                     "Advanced Digital Pattern Making",
                     "Real-time Production Tracking"
                   ].map((point) => (
                     <li key={point} className="flex items-center gap-3 text-sm font-bold text-gray-700">
                        <CheckCircle2 className="h-5 w-5 text-[#FCB800]" />
                        {point}
                     </li>
                   ))}
                </ul>

                <Link href="/contact" className="inline-flex h-14 px-10 bg-[#002169] text-white rounded font-bold uppercase tracking-widest text-xs items-center gap-4 hover:bg-[#00184d] transition-all shadow-lg">
                   Partner With Us <ArrowRight className="h-4 w-4" />
                </Link>
             </div>
          </div>

          {/* Stats Bar */}
          <div className="bg-[#002169] rounded-2xl p-12 md:p-20 text-white relative overflow-hidden shadow-xl">
             <div className="absolute top-0 right-0 w-96 h-96 bg-[#FCB800] blur-[150px] opacity-10" />
             <div className="grid grid-cols-1 md:grid-cols-3 gap-16 text-center relative z-10">
                <div className="space-y-4">
                   <span className="text-5xl md:text-6xl font-bold text-[#FCB800]">8+</span>
                   <p className="text-[10px] font-bold uppercase tracking-widest text-white/50">Years in Industry</p>
                </div>
                <div className="space-y-4">
                   <span className="text-5xl md:text-6xl font-bold text-[#FCB800]">1M+</span>
                   <p className="text-[10px] font-bold uppercase tracking-widest text-white/50">Garments Produced</p>
                </div>
                <div className="space-y-4">
                   <span className="text-5xl md:text-6xl font-bold text-[#FCB800]">100%</span>
                   <p className="text-[10px] font-bold uppercase tracking-widest text-white/50">Quality Satisfaction</p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  )
}
