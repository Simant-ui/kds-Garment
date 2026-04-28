"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function createStaffAction(formData: FormData) {
  const full_name = formData.get("full_name") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!full_name || !email || !password) {
    return { success: false, error: "All fields are required" }
  }

  const supabase = await createClient()

  // Note: In a production app, password should be hashed.
  // Using plain text for now as per simple setup, but highly recommended to hash.
  const { error } = await supabase
    .from('staff')
    .insert([{ 
      full_name, 
      email, 
      password,
      role: 'staff',
      created_at: new Date().toISOString()
    }])

  if (error) {
    console.error("Staff creation error:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/admin/staff")
  return { success: true }
}

export async function deleteStaffAction(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('staff').delete().eq('id', id)

  if (error) return { success: false, error: error.message }
  
  revalidatePath("/admin/staff")
  return { success: true }
}
