"use server"

import { createAdminClient } from "@/lib/supabase/admin"
import { sendOTPEmail } from "@/lib/email"

export async function forgotPasswordAction(email: string) {
  const supabase = createAdminClient()

  // 1. Check if user exists
  const { data: users } = await supabase.auth.admin.listUsers()
  const user = users.users.find(u => u.email === email)

  if (!user) {
    // We shouldn't reveal if a user exists, but for this admin-focused request, we'll be helpful
    return { error: "No account found with this email address." }
  }

  // 2. Generate OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString()
  const expiry = new Date(Date.now() + 10 * 60 * 1000)

  // 3. Store OTP
  await supabase
    .from('user_otps')
    .upsert({ email, otp, expires_at: expiry.toISOString() }, { onConflict: 'email' })

  // 4. Send Email
  const emailRes = await sendOTPEmail(email, otp)
  if (!emailRes.success) {
    return { error: "Failed to send reset code." }
  }

  return { success: true }
}

export async function resetPasswordAction(email: string, otp: string, newPassword: any) {
  const supabase = createAdminClient()

  // 1. Verify OTP
  const { data: otpData, error: otpError } = await supabase
    .from('user_otps')
    .select('*')
    .eq('email', email)
    .eq('otp', otp)
    .single()

  if (otpError || !otpData) {
    return { error: "Invalid or expired reset code." }
  }

  // 2. Find user ID
  const { data: users } = await supabase.auth.admin.listUsers()
  const user = users.users.find(u => u.email === email)
  
  if (!user) return { error: "User not found." }

  // 3. Update Password
  const { error } = await supabase.auth.admin.updateUserById(user.id, {
    password: newPassword
  })

  if (error) return { error: error.message }

  // 4. Cleanup
  await supabase.from('user_otps').delete().eq('email', email)

  return { success: true }
}
