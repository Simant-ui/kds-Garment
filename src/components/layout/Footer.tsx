import Link from "next/link"
import Image from "next/image"
import { Mail, Phone, MapPin, Globe, Camera, MessageCircle, Send, ShieldCheck, ArrowRight, MessageSquare, Clock } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-[#002169] text-white pt-20 pb-10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 border-b border-white/10 pb-16">
          {/* Brand Identity */}
          <div className="space-y-8">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative h-12 w-12 bg-white rounded-full flex items-center justify-center shadow-lg overflow-hidden">
                 <Image 
                   src="/logo.png" 
                   alt="KDS Garment Logo" 
                   fill
                   className="object-cover"
                 />
              </div>
              <span className="text-3xl font-black tracking-tight uppercase">
                KDS <span className="text-[#FCB800]">READYMADE UDHYOG</span>
              </span>
            </Link>
            <p className="text-sm text-white/90 leading-relaxed max-w-xs">
              Nepal's leading garment manufacturer specializing in corporate wear, school uniforms, and high-quality custom apparel. Quality you can trust since 2018.
            </p>
            <div className="flex items-center gap-4">
              {[
                { icon: <MessageSquare className="h-5 w-5" />, href: "#" },
                { icon: <Camera className="h-5 w-5" />, href: "#" },
                { icon: <Send className="h-5 w-5" />, href: "#" },
                { icon: <Globe className="h-5 w-5" />, href: "#" }
              ].map((social, i) => (
                <Link key={i} href={social.href} className="h-10 w-10 rounded bg-white/10 flex items-center justify-center hover:bg-[#FCB800] hover:text-[#002169] transition-all">
                   {social.icon}
                </Link>
              ))}
            </div>
          </div>

          {/* Useful Links */}
          <div className="space-y-6">
             <h4 className="text-lg font-bold">Useful Links</h4>
             <ul className="space-y-3">
               {[
                 { name: "About Us", href: "/about" },
                 { name: "Our Services", href: "/services" },
                 { name: "Shop", href: "/products" },
                 { name: "Track Order", href: "/track-order" },
                 { name: "Contact Us", href: "/contact" }
               ].map((item) => (
                 <li key={item.name}>
                   <Link href={item.href} className="text-sm text-white/80 hover:text-[#FCB800] transition-colors flex items-center gap-2">
                     <ArrowRight className="h-3 w-3" />
                     {item.name}
                   </Link>
                 </li>
               ))}
             </ul>
          </div>

          {/* Categories */}
          <div className="space-y-6">
             <h4 className="text-lg font-bold">Categories</h4>
             <ul className="space-y-3">
               {[
                 "Corporate Wear",
                 "School Uniforms",
                 "Hospital Wear",
                 "Custom T-shirts",
                 "Jackets & Sweaters"
               ].map((item) => (
                 <li key={item}>
                   <Link href="/products" className="text-sm text-white/80 hover:text-[#FCB800] transition-colors flex items-center gap-2">
                     <ArrowRight className="h-3 w-3" />
                     {item}
                   </Link>
                 </li>
               ))}
             </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
             <h4 className="text-lg font-bold">Get In Touch</h4>
             <div className="space-y-4">
               <div className="flex items-start gap-4">
                 <MapPin className="h-6 w-6 text-[#FCB800] shrink-0" />
                 <p className="text-sm text-white/90 leading-relaxed">
                   Lalgadh, Nepal
                 </p>
               </div>
               <div className="flex items-center gap-4">
                 <Phone className="h-5 w-5 text-[#FCB800] shrink-0" />
                 <p className="text-sm text-white/70">+977-9855073550</p>
               </div>
               <div className="flex items-center gap-4">
                 <Mail className="h-5 w-5 text-[#FCB800] shrink-0" />
                 <p className="text-sm text-white/70">kdsgroup98@gmail.com</p>
               </div>
               <div className="flex items-center gap-4">
                 <Clock className="h-5 w-5 text-[#FCB800] shrink-0" />
                 <p className="text-sm text-white/70">Sun - Fri: 9:00 AM - 6:00 PM</p>
               </div>
             </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-sm text-white/60">
            &copy; {new Date().getFullYear()} KDS Readymade Udhyog. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
             <Link href="/privacy" className="text-xs text-white/60 hover:text-white transition-colors">Privacy Policy</Link>
             <Link href="/terms" className="text-xs text-white/60 hover:text-white transition-colors">Terms of Service</Link>
             <div className="flex items-center gap-2 ml-4">
                <ShieldCheck className="h-4 w-4 text-[#FCB800]" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-white/60">ISO 9001 Certified</span>
             </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
