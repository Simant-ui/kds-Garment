"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Loader2, ShieldAlert, Lock, ArrowRight, User } from "lucide-react"

export default function AdminLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Permanent Admin Credentials Check
    const ADMIN_EMAIL = "admin@kdsgarment.com"
    const ADMIN_PASS = "KDSAdmin@2082"

    if (email === ADMIN_EMAIL && password === ADMIN_PASS) {
      // For demo/setup purposes, we allow direct access
      // In production, you would also sign in via Supabase for security
      router.push("/admin")
      router.refresh()
    } else {
      // Regular Supabase Login for other admin users
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setError("Invalid Admin Credentials.")
        setLoading(false)
      } else {
        router.push("/admin")
        router.refresh()
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary/30 px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-12 rounded-[3rem] shadow-2xl border border-border">
        <div className="text-center">
          <div className="bg-primary text-white p-4 rounded-2xl inline-block mb-6">
            <ShieldAlert className="h-10 w-10" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tighter uppercase">Admin Portal</h1>
          <p className="mt-2 text-muted-foreground font-medium">Authorized access only.</p>
        </div>

        {error && (
          <div className="bg-destructive/10 text-destructive text-xs p-4 rounded-xl font-bold border border-destructive/20">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-extrabold uppercase tracking-widest text-muted">Admin ID / Email</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted" />
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@kdsgarment.com"
                className="w-full bg-secondary/50 border-none rounded-xl p-4 pl-12 focus:ring-2 focus:ring-primary outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-extrabold uppercase tracking-widest text-muted">Secure Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted" />
              <input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-secondary/50 border-none rounded-xl p-4 pl-12 focus:ring-2 focus:ring-primary outline-none transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/90 text-white h-16 rounded-xl font-bold flex items-center justify-center gap-3 transition-all shadow-xl shadow-primary/20"
          >
            {loading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <>Access Dashboard <ArrowRight className="h-5 w-5" /></>
            )}
          </button>
        </form>

        <div className="text-center pt-8 border-t border-border">
          <Link href="/" className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors">
            ← Return to Storefront
          </Link>
        </div>
      </div>
    </div>
  )
}
