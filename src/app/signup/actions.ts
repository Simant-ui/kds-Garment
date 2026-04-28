"use server"

import { createAdminClient } from "@/lib/supabase/admin"
import { sendOTPEmail } from "@/lib/email"

export async function signupAction(formData: FormData) {
  const fullName = formData.get("fullName") as string
  const email = formData.get("email") as string
  const mobile = formData.get("mobile") as string
  const password = formData.get("password") as string
  
  const supabase = createAdminClient()

  // 1. Check if user already exists
  const { data: existingUser } = await supabase.auth.admin.listUsers()
  const userExists = existingUser.users.some(u => u.email === email)
  
  if (userExists) {
    return { error: "User with this email already exists." }
  }

  // 2. Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString()
  const expiry = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

  // 3. Store OTP in a custom table (we assume it exists or we create it)
  // We'll also store the pending user data in metadata or a temp table
  const { error: otpError } = await supabase
    .from('user_otps')
    .upsert({ email, otp, expires_at: expiry.toISOString() }, { onConflict: 'email' })

  if (otpError) {
    console.error('CRITICAL: OTP Store Error. Is the user_otps table created?', otpError)
    return { error: "System Busy: Could not generate verification code. Please try again later." }
  }

  // 4. Send Email
  const emailRes = await sendOTPEmail(email, otp)
  if (!emailRes.success) {
    console.error('Email Delivery Failed:', emailRes.error)
    return { error: "Failed to send verification code. Please check your email address or try again later." }
  }

  return { success: true, email }
}

export async function verifyOtpAction(email: string, otp: string, userData: any) {
  const supabase = createAdminClient()

  // 1. Verify OTP
  const { data: otpData, error: otpError } = await supabase
    .from('user_otps')
    .select('*')
    .eq('email', email)
    .eq('otp', otp)
    .single()

  if (otpError || !otpData) {
    return { error: "Invalid verification code." }
  }

  const now = new Date()
  if (new Date(otpData.expires_at) < now) {
    return { error: "Verification code has expired. Please try again." }
  }

  // 2. Create User in Supabase Auth (Admin Mode to bypass internal email confirmation)
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password: userData.password,
    email_confirm: true,
    user_metadata: {
      full_name: userData.fullName,
      phone: userData.mobile,
    }
  })

  if (error) {
    console.error('User Creation Error:', error)
    return { error: error.message }
  }

  // 3. Clean up OTP
  await supabase.from('user_otps').delete().eq('email', email)

  return { success: true }
}
