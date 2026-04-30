"use server"

import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"

export async function changePasswordAction(formData: FormData) {
  const currentPass = formData.get("current_password") as string
  const newPass = formData.get("new_password") as string
  const confirmPass = formData.get("confirm_password") as string

  if (newPass !== confirmPass) {
    return { error: "New passwords do not match." }
  }

  const cookieStore = await cookies()
  const staffId = cookieStore.get("staff_id")?.value

  if (!staffId) {
     return { error: "System Admin password cannot be changed from the dashboard." }
  }

  const supabase = await createClient()
  const { data: staff } = await supabase.from('staff').select('password').eq('id', staffId).single()
  
  if (staff?.password !== currentPass) {
    return { error: "Current password is incorrect." }
  }

  const { error } = await supabase.from('staff').update({ password: newPass }).eq('id', staffId)
  if (error) return { error: error.message }

  return { success: true }
}

export async function updateProfileAction(formData: FormData) {
  const firstName = formData.get("first_name") as string
  const lastName = formData.get("last_name") as string
  const phone = formData.get("phone") as string
  const email = formData.get("email") as string
  const profile_image = formData.get("profile_image") as string // base64

  const cookieStore = await cookies()
  const staffId = cookieStore.get("staff_id")?.value

  if (!staffId) {
    return { error: "System Admin profile is managed via system files." }
  }

  const supabase = await createClient()
  const updateData: any = { 
     first_name: firstName,
     last_name: lastName,
     full_name: `${firstName} ${lastName}`,
     phone,
     email
  }
  
  if (profile_image) {
    updateData.profile_image = profile_image
  }

  const { error } = await supabase.from('staff').update(updateData).eq('id', staffId)
  
  if (error) return { error: error.message }
  
  // Update cookie
  cookieStore.set("staff_name", `${firstName} ${lastName}`, { secure: true })

  return { success: true }
}
