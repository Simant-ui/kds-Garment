"use client"

import { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Loader2, Mail, Lock, ArrowRight, ChevronLeft, ShieldCheck } from "lucide-react"
import { loginAction } from "./actions"
import Link from "next/link"

function LoginContent() {
  const searchParams = useSearchParams()
  const message = searchParams.get("message")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const result = await loginAction(email, password)

    if (result.success) {
      router.push(result.redirectTo || "/dashboard")
      router.refresh()
    } else {
      setError(result.error || "Login failed. Please check your credentials.")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50/50 flex items-center justify-center px-6 py-20 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(0,33,105,0.03),transparent_70%)]" />
      
      <div className="max-w-xl w-full relative z-10">
        <div className="bg-white p-12 md:p-16 rounded-[3rem] shadow-[0_50px_100px_rgba(0,0,0,0.04)] border border-slate-100 space-y-10">
          <div className="text-center space-y-4">
            <Link href="/" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-[#002169] transition-colors">
               <ChevronLeft className="h-4 w-4" /> Back to Home
            </Link>
            <h1 className="text-4xl font-black tracking-tight text-slate-900 uppercase">SIGN <span className="text-blue-600">IN</span></h1>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Access your KDS Garment Account</p>
          </div>

          {message && (
            <div className="bg-emerald-50 text-emerald-600 text-xs p-4 rounded-xl font-bold border border-emerald-100 text-center animate-in fade-in duration-500">
              {message}
            </div>
          )}

          {error && (
            <div className="bg-rose-50 text-rose-600 text-xs p-4 rounded-xl font-bold border border-rose-100 text-center animate-in shake-in duration-500">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-8">
            <div className="space-y-3">
              <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 ml-4">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-[#002169] transition-colors" />
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="NAME@EXAMPLE.COM"
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 pl-16 font-bold text-xs outline-none focus:ring-4 focus:ring-blue-50 focus:border-[#002169] transition-all text-slate-900"
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center px-4">
                <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Password</label>
                <Link href="/forgot-password" title="Forgot Password" className="text-[10px] font-bold text-[#002169] hover:underline uppercase tracking-widest">Forgot?</Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-[#002169] transition-colors" />
                <input
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 pl-16 font-bold text-xs outline-none focus:ring-4 focus:ring-blue-50 focus:border-[#002169] transition-all text-slate-900"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#002169] text-white h-16 rounded-2xl font-bold uppercase tracking-widest flex items-center justify-center gap-4 transition-all shadow-xl shadow-blue-900/10 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 group"
            >
              {loading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <>Sign In Now <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform" /></>
              )}
            </button>
          </form>

          <div className="text-center pt-8 border-t border-slate-50 space-y-4">
            <p className="text-xs font-bold text-slate-400">
              Don't have an account?{" "}
              <Link href="/signup" className="text-[#002169] hover:underline">Create one here</Link>
            </p>
          </div>
          
          <div className="flex items-center justify-center gap-4 opacity-10">
             <ShieldCheck className="h-6 w-6" />
             <span className="text-[8px] font-black uppercase tracking-widest">Protected by Enterprise Encryption</span>
          </div>
        </div>
        
        {/* Footer Link */}
        <p className="text-center mt-12 text-[10px] font-black uppercase tracking-[0.4em] text-black/20">
          KDS GARMENT © 2026 • MASTER CONTROL
        </p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#F9F9F9]">
         <Loader2 className="h-10 w-10 animate-spin text-black/10" />
      </div>
    }>
      <LoginContent />
    </Suspense>
  )
}
