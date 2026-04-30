"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { ShoppingBag, Search, Menu, X, User, ArrowRight, Phone, Mail } from "lucide-react"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { useCart } from "@/context/CartContext"
import { createClient } from "@/lib/supabase/client"

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Shop", href: "/products" },
  { name: "Track Order", href: "/track-order" },
  { name: "Inquiry", href: "/inquiry" },
  { name: "About", href: "/about" },
]

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [user, setUser] = useState<any>(null)
  const { totalItems } = useCart()
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
    setIsMenuOpen(false)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/products?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery("")
      setIsMenuOpen(false)
    }
  }

  return (
    <>
      <header className="sticky top-0 z-50 w-full shadow-md">
        {/* 🔝 Top Utility Bar */}
        <div className="bg-[#00184d] text-white py-2 px-6 text-[11px] font-bold tracking-wider hidden md:block">
          <div className="container mx-auto flex justify-between items-center">
            <div className="flex gap-6">
              <div className="flex items-center gap-2">
                <Phone className="h-3 w-3 text-[#FCB800]" />
                <span>+977-9855073550</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-3 w-3 text-[#FCB800]" />
                <span>kdsgroup98@gmail.com</span>
              </div>
            </div>
            <div className="flex gap-6 uppercase">
              <Link href="/track-order" className="hover:text-[#FCB800] transition-colors">Track Your Order</Link>
              <Link href="/inquiry" className="hover:text-[#FCB800] transition-colors border-l border-white/20 pl-6">Business Inquiry</Link>
              <Link href="/login" className="hover:text-[#FCB800] transition-colors border-l border-white/20 pl-6">Client Login</Link>
            </div>
          </div>
        </div>

        {/* 🏢 Main Header */}
        <nav className="bg-[#002169] text-white">
          <div className="container mx-auto px-6 py-4 flex items-center justify-between gap-4 xl:gap-8">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 shrink-0">
              <div className="relative h-12 w-12 bg-white rounded-full flex items-center justify-center shadow-lg overflow-hidden">
                 <Image 
                   src="/logo.png" 
                   alt="KDS Garment Logo" 
                   fill
                   className="object-cover"
                 />
              </div>
              <span className="text-2xl font-black tracking-tight uppercase">
                KDS <span className="text-[#FCB800]">READYMADE UDHYOG</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "px-2 xl:px-4 py-2 text-xs font-bold uppercase tracking-widest transition-all rounded",
                    pathname === link.href 
                      ? "bg-white/10 text-[#FCB800]"
                      : "text-white hover:bg-white/5 hover:text-[#FCB800]"
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Desktop Search */}
            <form onSubmit={handleSearch} className="hidden lg:flex flex-1 min-w-[150px] max-w-sm relative">
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full bg-white/10 text-white py-2.5 px-4 rounded-l border border-white/20 outline-none text-sm placeholder:text-white/70 focus:bg-white focus:text-black transition-all"
              />
              <button type="submit" className="bg-[#FCB800] text-[#002169] px-5 rounded-r font-bold hover:bg-white transition-colors">
                <Search className="h-4 w-4" />
              </button>
            </form>

            {/* Action Icons */}
            <div className="flex items-center gap-2">
              <Link href="/cart" className="relative p-2.5 hover:bg-white/10 rounded-full transition-all group">
                <ShoppingBag className="h-6 w-6 group-hover:text-[#FCB800]" />
                {totalItems > 0 && (
                  <span className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#FCB800] text-[10px] font-bold text-[#002169] ring-2 ring-[#002169]">
                    {totalItems}
                  </span>
                )}
              </Link>
              
              <div className="hidden lg:flex items-center gap-4 border-l border-white/20 ml-4 pl-4">
                {user ? (
                  <>
                    <Link 
                      href="/dashboard" 
                      className="text-xs font-bold uppercase tracking-widest hover:text-[#FCB800] transition-colors flex items-center gap-2"
                    >
                      <User className="h-4 w-4" /> My Dashboard
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="bg-white/10 text-white px-6 py-2.5 rounded text-xs font-bold uppercase tracking-widest hover:bg-rose-600 transition-all ml-2"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link 
                      href="/login" 
                      className="text-xs font-bold uppercase tracking-widest hover:text-[#FCB800] transition-colors"
                    >
                      Sign In
                    </Link>
                    <Link 
                      href="/signup" 
                      className="bg-[#FCB800] text-[#002169] px-6 py-2.5 rounded text-xs font-bold uppercase tracking-widest hover:bg-white transition-all shadow-lg shadow-black/20"
                    >
                      Create Account
                    </Link>
                  </>
                )}
              </div>

              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2.5 hover:bg-white/10 rounded-full"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* 📱 Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[60] bg-[#002169] pt-24 px-6 lg:hidden animate-in slide-in-from-top duration-300">
           <div className="flex flex-col gap-4">
              <form onSubmit={handleSearch} className="relative mb-6">
                <input 
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="SEARCH PRODUCTS..."
                  className="w-full bg-white/10 text-white py-4 px-6 rounded border border-white/20 outline-none text-lg font-bold"
                />
                <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-[#FCB800]">
                  <Search className="h-6 w-6" />
                </button>
              </form>

              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={cn(
                    "text-3xl font-bold uppercase tracking-tight py-4 border-b border-white/10 flex items-center justify-between",
                    pathname === link.href ? "text-[#FCB800]" : "text-white"
                  )}
                >
                  {link.name}
                  <ArrowRight className="h-5 w-5 opacity-40" />
                </Link>
              ))}

              <div className="grid grid-cols-2 gap-4 mt-8">
                {user ? (
                  <>
                    <Link 
                      href="/dashboard" 
                      onClick={() => setIsMenuOpen(false)}
                      className="bg-[#FCB800] text-[#002169] py-4 rounded font-bold uppercase tracking-widest text-center text-sm col-span-2"
                    >
                      My Dashboard
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="bg-white/10 text-white py-4 rounded font-bold uppercase tracking-widest text-center text-sm col-span-2 border border-white/10"
                    >
                      Log Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link 
                      href="/login" 
                      onClick={() => setIsMenuOpen(false)}
                      className="bg-white/10 text-white py-4 rounded font-bold uppercase tracking-widest text-center text-sm border border-white/20"
                    >
                      Log In
                    </Link>
                    <Link 
                      href="/signup" 
                      onClick={() => setIsMenuOpen(false)}
                      className="bg-[#FCB800] text-[#002169] py-4 rounded font-bold uppercase tracking-widest text-center text-sm"
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
              
              <div className="mt-12 space-y-4">
                 <p className="text-[10px] font-bold text-white/70 uppercase tracking-widest">Support Center</p>
                 <div className="flex items-center gap-3 text-white">
                    <Phone className="h-5 w-5 text-[#FCB800]" />
                    <span className="font-bold">+977-9855073550</span>
                 </div>
                 <div className="flex items-center gap-3 text-white">
                    <Mail className="h-5 w-5 text-[#FCB800]" />
                    <span className="font-bold">kdsgroup98@gmail.com</span>
                 </div>
              </div>
           </div>
        </div>
      )}
    </>
  )
}
