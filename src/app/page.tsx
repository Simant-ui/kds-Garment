import Link from "next/link"
import Image from "next/image"
import { ArrowRight, ShoppingBag, Truck, ShieldCheck, Zap, Star, Phone, Globe, MessageSquare, Clock, CreditCard } from "lucide-react"
import { getProducts } from "@/lib/products"
import ProductCard from "@/components/ui/ProductCard"

export default async function Home() {
  const products = await getProducts()
  
  return (
    <div className="flex flex-col w-full bg-[#F4F4F4] min-h-screen">
      {/* 🚀 Section 1: Hero Banner */}
      <section className="relative min-h-[500px] md:min-h-[600px] py-20 w-full overflow-hidden flex items-center">
        <Image 
          src="https://images.unsplash.com/photo-1555529771-7888783a18d3?q=80&w=2070&auto=format&fit=crop" 
          alt="KDS Garment Factory" 
          fill 
          priority
          className="object-cover brightness-75"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#002169]/90 to-[#002169]/40 flex items-center">
          <div className="container mx-auto px-6 space-y-6">
            <div className="bg-[#FCB800] text-[#002169] px-4 py-1.5 inline-block rounded font-bold text-xs md:text-sm uppercase tracking-widest shadow-lg">
               Established in 2018 AD
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white max-w-3xl leading-tight drop-shadow-2xl">
              KDS READYMADE UDHYOG <br /> <span className="text-[#FCB800]">GARMENT MANUFACTURER</span>
            </h1>
            <p className="text-white/90 text-base md:text-lg max-w-xl font-medium drop-shadow-lg leading-relaxed">
              KDS Readymade Udhyog is Nepal's premier garment manufacturer providing high-quality corporate wear, school uniforms, and custom apparel delivered across Nepal.
            </p>
            <div className="flex gap-4 pt-6 flex-wrap">
              <Link href="/products" className="bg-[#FCB800] text-[#002169] px-6 py-3.5 md:px-8 md:py-4 rounded font-bold hover:bg-white transition-all flex items-center gap-2 shadow-xl hover:-translate-y-1">
                BROWSE COLLECTION <ArrowRight className="h-5 w-5" />
              </Link>
              <Link href="/about" className="bg-transparent border-2 border-white text-white px-6 py-3.5 md:px-8 md:py-4 rounded font-bold hover:bg-white hover:text-[#002169] transition-all shadow-xl hover:-translate-y-1">
                OUR STORY
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 📦 Section 2: Service Highlights */}
      <section className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-[#F4F4F4] rounded-full flex items-center justify-center text-[#002169]">
                <Truck className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-gray-800">FREE SHIPPING</h4>
                <p className="text-[11px] text-gray-500 uppercase tracking-tight">On orders over NPR 5,000</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-[#F4F4F4] rounded-full flex items-center justify-center text-[#002169]">
                <Clock className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-gray-800">FAST DELIVERY</h4>
                <p className="text-[11px] text-gray-500 uppercase tracking-tight">Delivery within 3-5 days</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-[#F4F4F4] rounded-full flex items-center justify-center text-[#002169]">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-gray-800">QUALITY ASSURED</h4>
                <p className="text-[11px] text-gray-500 uppercase tracking-tight">100% Genuine Fabric</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-[#F4F4F4] rounded-full flex items-center justify-center text-[#002169]">
                <CreditCard className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-gray-800">SECURE PAYMENT</h4>
                <p className="text-[11px] text-gray-500 uppercase tracking-tight">eSewa, Khalti, Cash</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 🏷️ Section 3: Categories Grid */}
      <section className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <p className="text-[#002169] font-bold text-xs uppercase tracking-[0.3em] mb-2">Our Specialization</p>
          <h2 className="text-4xl font-bold text-gray-900">TOP CATEGORIES</h2>
          <div className="h-1 bg-[#FCB800] w-20 mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: "CORPORATE WEAR", img: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=2070&auto=format&fit=crop", count: "120+ Items" },
            { title: "SCHOOL UNIFORMS", img: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=2022&auto=format&fit=crop", count: "80+ Items" },
            { title: "CUSTOM PRINTS", img: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1974&auto=format&fit=crop", count: "50+ Items" }
          ].map((cat, i) => (
            <Link href="/products" key={i} className="group relative h-[400px] overflow-hidden rounded-xl">
              <Image src={cat.img} alt={cat.title} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-[#002169]/60 transition-all duration-500" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                <h3 className="text-2xl font-bold tracking-wider">{cat.title}</h3>
                <p className="text-xs font-bold text-white mt-2">{cat.count}</p>
                <div className="mt-6 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                   <div className="px-6 py-2 border border-white rounded font-bold text-xs">SHOP NOW</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 🛒 Section 4: Featured Products */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-6">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-[#002169] font-bold text-xs uppercase tracking-[0.3em] mb-2">Editor's Choice</p>
              <h2 className="text-4xl font-bold text-gray-900">FEATURED PRODUCTS</h2>
            </div>
            <Link href="/products" className="text-[#002169] font-bold text-sm hover:text-[#FCB800] transition-colors flex items-center gap-2">
              VIEW ALL <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 🏭 Section 5: Why Choose Us */}
      <section className="container mx-auto px-6 py-24">
        <div className="bg-[#002169] rounded-2xl overflow-hidden flex flex-col lg:grid lg:grid-cols-2">
          <div className="relative h-[400px] lg:h-full min-h-[400px]">
            <Image 
              src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=1974&auto=format&fit=crop" 
              alt="Manufacturing" 
              fill 
              className="object-cover"
            />
          </div>
          <div className="p-12 md:p-20 flex flex-col justify-center space-y-8 text-white">
            <h2 className="text-4xl md:text-5xl font-bold leading-tight">THE LEADING <span className="text-[#FCB800]">CLOTHING FACTORY</span> IN BARDIBAS</h2>
            <p className="text-white leading-loose">
              Established in 2018, KDS Readymade Udhyog has become the best garment company in Nepal, specifically serving the Mahottari and Terai regions. We combine traditional craftsmanship with modern technology to deliver products that meet international standards.
            </p>
            <div className="grid grid-cols-2 gap-8 pt-4">
              <div className="space-y-2">
                <h4 className="text-3xl font-bold text-[#FCB800]">8+</h4>
                <p className="text-xs uppercase tracking-widest font-bold text-white/80">Years of Experience</p>
              </div>
              <div className="space-y-2">
                <h4 className="text-3xl font-bold text-[#FCB800]">1M+</h4>
                <p className="text-xs uppercase tracking-widest font-bold text-white/80">Garments Produced</p>
              </div>
            </div>
            <div className="pt-8">
              <Link href="/contact" className="bg-[#FCB800] text-[#002169] px-10 py-4 rounded font-bold hover:bg-white transition-all">
                GET A QUOTE
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 🏢 Section 6: Our Clients */}
      <section className="bg-white py-20 border-t border-gray-100">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h3 className="text-gray-600 font-bold text-xs uppercase tracking-[0.4em]">TRUSTED BY MAJOR BRANDS</h3>
          </div>
          <div className="flex flex-wrap justify-center gap-12 md:gap-24 opacity-60 hover:opacity-100 grayscale hover:grayscale-0 transition-all duration-500">
             <Globe className="h-12 w-12" />
             <ShieldCheck className="h-12 w-12" />
             <Zap className="h-12 w-12" />
             <Star className="h-12 w-12" />
             <Truck className="h-12 w-12" />
          </div>
        </div>
      </section>
    </div>
  )
}
