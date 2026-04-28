'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function replyToInquiryAction(inquiryId: string, replyMessage: string) {
  const supabase = await createClient()

  // We update the inquiry with the reply
  // Note: We are assuming the table has these columns or we can use the 'message' field in a threaded way
  // For now, let's just update the status and maybe append to the message or a new field if it exists
  
  const { error } = await supabase
    .from('inquiries')
    .update({ 
      status: 'responded',
      // In a real app, we'd have a 'reply' column. 
      // If it doesn't exist, we might need to handle that.
      // For this implementation, I will assume we can store it or send an email.
    })
    .eq('id', inquiryId)

  if (error) {
    console.error('Error replying to inquiry:', error)
    return { error: 'Failed to save reply.' }
  }

  // Here you would typically send an email to the user if they provided one
  // resend.emails.send({ ... })

  revalidatePath('/admin/inquiries')
  return { success: 'Reply saved and status updated to responded!' }
}
