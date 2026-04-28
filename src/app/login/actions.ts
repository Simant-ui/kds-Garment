"use server"

import { cookies } from "next/headers"
import { createClient } from "@/lib/supabase/server"

export async function loginAction(email: string, pass: string) {
  const adminEmail = process.env.ADMIN_EMAIL
  const adminPass = process.env.ADMIN_PASSWORD

  // 1. Check super admin (env vars)
  if (email === adminEmail && pass === adminPass) {
    const cookieStore = await cookies()
    cookieStore.set("admin_session", "true", { httpOnly: true, secure: true })
    return { success: true, redirectTo: "/admin" }
  }

  const supabase = await createClient()

  // 2. Check staff table in database
  const { data: staff } = await supabase
    .from('staff')
    .select('*')
    .eq('email', email)
    .single()

  if (staff && staff.password === pass) {
    const cookieStore = await cookies()
    cookieStore.set("admin_session", "true", { httpOnly: true, secure: true })
    return { success: true, redirectTo: "/admin" }
  }

  // 3. Check standard customer (Supabase Auth)
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password: pass
  })

  if (!authError && authData.user) {
    return { success: true, redirectTo: "/dashboard" }
  }

  return { success: false, error: authError?.message || "Invalid credentials" }
}

export async function adminLogoutAction() {
  const cookieStore = await cookies()
  cookieStore.delete("admin_session")
  
  const supabase = await createClient()
  await supabase.auth.signOut()
}
