'use server'

import { createClient } from '@/lib/supabase/server'

export async function saveChatMessageAction(
  content: string, 
  email: string = 'chat@support.system',
  subject: string = 'Support Chat',
  fullName: string | null = null
) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('inquiries')
    .insert([
      {
        full_name: fullName || (email.split('@')[0] || 'Guest'),
        email: email,
        phone: 'N/A',
        subject: subject,
        message: content,
        status: 'pending',
      },
    ])

  if (error) {
    console.error('Error saving chat message:', error)
  }
}
