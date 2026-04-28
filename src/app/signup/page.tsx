"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Loader2, Mail, Lock, User, Phone, ArrowRight, ShieldCheck, CheckCircle2, XCircle } from "lucide-react"

import { signupAction, verifyOtpAction } from "./actions"

export default function SignupPage() {
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [mobile, setMobile] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [step, setStep] = useState<'details' | 'verify'>('details')
  const router = useRouter()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError("Passwords do not match!")
      return
    }

    setLoading(true)

    const formData = new FormData()
    formData.append("fullName", fullName)
    formData.append("email", email)
    formData.append("mobile", mobile)
    formData.append("password", password)

    const result = await signupAction(formData)

    if (result.error) {
      setError(result.error)
      setLoading(false)
    } else {
      setStep('verify')
      setLoading(false)
    }
  }

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    const result = await verifyOtpAction(email, verificationCode, { 
      fullName, 
      mobile, 
      password 
    })

    if (result.error) {
      setError(result.error)
      setLoading(false)
    } else {
      setSuccess("Account successfully created and verified!")
      
      // Automatically log the user in
      const { createClient } = await import("@/lib/supabase/client")
      const supabase = createClient()
      await supabase.auth.signInWithPassword({
        email,
        password
      })

      setTimeout(() => {
        router.push("/products") // Redirect to shop/dashboard
        router.refresh()
      }, 1500)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-[2rem] border border-border shadow-sm">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold tracking-tight uppercase text-slate-900">
            {step === 'details' ? 'Create Account' : 'Verify Email'}
          </h1>
          <p className="mt-2 text-slate-500 font-medium">
            {step === 'details' 
              ? 'Join KDS Garment for a premium experience.' 
              : `We've sent a 6-digit code to ${email}`}
          </p>
        </div>

        {error && (
          <div className="bg-rose-50 text-rose-700 text-sm p-4 rounded-xl font-bold flex items-center gap-3 border border-rose-100 animate-in shake-in duration-300">
            <XCircle className="h-5 w-5 shrink-0" />
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 text-green-600 text-sm p-4 rounded-xl font-bold flex items-center gap-3 border border-green-200">
            <CheckCircle2 className="h-5 w-5 shrink-0" />
            {success}
          </div>
        )}

        {step === 'details' ? (
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  required
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 pl-12 focus:ring-2 focus:ring-[#002169] outline-none transition-all text-sm text-slate-900 placeholder:text-slate-400"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 pl-12 focus:ring-2 focus:ring-[#002169] outline-none transition-all text-sm text-slate-900 placeholder:text-slate-400"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Mobile Number</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  required
                  type="tel"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="98XXXXXXXX"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 pl-12 focus:ring-2 focus:ring-[#002169] outline-none transition-all text-sm text-slate-900 placeholder:text-slate-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    required
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 pl-12 focus:ring-2 focus:ring-[#002169] outline-none transition-all text-sm text-slate-900 placeholder:text-slate-400"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Confirm</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    required
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 pl-12 focus:ring-2 focus:ring-[#002169] outline-none transition-all text-sm text-slate-900 placeholder:text-slate-400"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#002169] hover:bg-[#002169]/90 text-white h-14 rounded-xl font-bold flex items-center justify-center gap-3 transition-all mt-6 shadow-lg shadow-blue-900/20"
            >
              {loading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <>Send Verification Code <ArrowRight className="h-5 w-5" /></>
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerify} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-extrabold uppercase tracking-widest text-slate-500">Enter 6-Digit Code</label>
              <div className="relative">
                <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  required
                  type="text"
                  maxLength={6}
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="123456"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 pl-12 focus:ring-2 focus:ring-[#002169] outline-none transition-all text-center text-2xl tracking-[1em] font-bold text-slate-900 placeholder:text-slate-200"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !!success}
              className="w-full bg-[#002169] hover:bg-[#002169]/90 text-white h-14 rounded-xl font-bold flex items-center justify-center gap-3 transition-all shadow-lg shadow-blue-900/20 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <>Verify Code <ArrowRight className="h-5 w-5" /></>
              )}
            </button>
            
            <button 
              type="button"
              onClick={() => setStep('details')}
              className="w-full text-xs font-bold text-slate-500 hover:text-[#002169] transition-colors"
            >
              Change Email / Back
            </button>
          </form>
        )}

        <div className="text-center pt-4">
          <p className="text-sm text-muted-foreground font-medium">
            Already have an account?{" "}
            <Link href="/login" className="text-primary font-extrabold hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
