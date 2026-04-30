"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function createStaffAction(formData: FormData) {
  const first_name = formData.get("first_name") as string
  const last_name = formData.get("last_name") as string
  const phone = formData.get("phone") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const confirm_password = formData.get("confirm_password") as string

  if (!first_name || !last_name || !phone || !email || !password || !confirm_password) {
    return { error: "All fields are required" }
  }

  if (password !== confirm_password) {
    return { error: "Passwords do not match" }
  }

  const supabase = await createClient()

  // In this implementation, we store staff in a dedicated table for admin panel access.
  // Note: For real-world production, you should hash the password or use Supabase Auth.
  const { error } = await supabase
    .from('staff')
    .insert([{ 
      first_name,
      last_name,
      full_name: `${first_name} ${last_name}`,
      phone,
      email, 
      password,
      role: 'staff',
      created_at: new Date().toISOString()
    }])

  if (error) {
    console.error("Staff creation error:", error)
    return { error: error.message }
  }

  revalidatePath("/admin/staff")
  return { success: true }
}

export async function deleteStaffAction(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('staff').delete().eq('id', id)

  if (error) return { error: error.message }
  
  revalidatePath("/admin/staff")
  return { success: true }
}
