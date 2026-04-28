'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function submitInquiry(formData: FormData) {
  const supabase = await createClient()

  const full_name = formData.get('full_name') as string
  const email = formData.get('email') as string
  const phone = formData.get('phone') as string
  const subject = formData.get('subject') as string
  const message = formData.get('message') as string

  if (!full_name || !email || !message) {
    return { error: 'Please fill in all required fields.' }
  }

  const { error } = await supabase
    .from('inquiries')
    .insert([
      {
        full_name,
        email,
        phone,
        subject,
        message,
        status: 'pending',
      },
    ])

  if (error) {
    console.error('Error submitting inquiry:', error)
    return { error: 'Failed to submit inquiry. Please try again later.' }
  }

  revalidatePath('/admin/inquiries')
  return { success: 'Your inquiry has been submitted successfully! We will get back to you soon.' }
}
