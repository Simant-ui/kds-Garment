'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function replyToInquiryAction(inquiryId: string, replyMessage: string) {
  const supabase = await createClient()

  // First fetch the inquiry to know its type
  const { data: inquiry, error: fetchErr } = await supabase
    .from('inquiries')
    .select('*')
    .eq('id', inquiryId)
    .single()

  if (fetchErr || !inquiry) {
    return { error: 'Inquiry not found.' }
  }

  // Update original status to responded
  const { error } = await supabase
    .from('inquiries')
    .update({ status: 'responded' })
    .eq('id', inquiryId)

  if (error) {
    console.error('Error replying to inquiry:', error)
    return { error: 'Failed to save reply status.' }
  }

  if (['Support Chat', 'Admin Reply', 'AI Reply'].includes(inquiry.subject)) {
    // Insert Admin Reply to AI Chat so it appears in the chat interface
    await supabase.from('inquiries').insert({
      full_name: 'Admin',
      email: inquiry.email,
      phone: inquiry.phone,
      subject: 'Admin Reply',
      message: replyMessage,
      status: 'responded'
    })
    revalidatePath('/admin/support')
    revalidatePath('/admin/inquiries')
    return { success: 'Reply sent to Support Chat!' }
  } else {
    // Normal email inquiry: send direct email
    try {
      // Lazy load nodemailer to avoid edge runtime issues if applicable, or just import it at top
      const nodemailer = (await import('nodemailer')).default

      let smtpUser = process.env.SMTP_USER
      let smtpPass = process.env.SMTP_PASS

      if (!smtpUser || !smtpPass) {
        try {
          const fs = await import('fs')
          const path = await import('path')
          const envFile = fs.readFileSync(path.join(process.cwd(), '.env.local'), 'utf8')
          const lines = envFile.split('\n')
          for (const line of lines) {
             if (line.startsWith('SMTP_USER=')) smtpUser = line.split('=')[1].trim()
             if (line.startsWith('SMTP_PASS=')) smtpPass = line.split('=')[1].trim()
          }
        } catch (err) {
          console.error("Failed to read .env.local manually", err)
        }
      }

      if (!smtpUser || !smtpPass) {
        return { error: 'Failed to find SMTP credentials. Please ensure they are set in .env.local' }
      }

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: smtpUser,
          pass: smtpPass.replace(/\s+/g, '')
        }
      });

      const mailOptions = {
        from: `KDS Garment <${smtpUser}>`,
        to: inquiry.email,
        subject: `Reply to your inquiry: ${inquiry.subject}`,
        text: `${replyMessage}\n\n---\nOriginal Message from ${inquiry.full_name}:\n${inquiry.message}`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eaeaea; border-radius: 10px;">
            <div style="text-align: center; margin-bottom: 20px;">
              <h2 style="color: #002169; margin: 0;">KDS Garment</h2>
            </div>
            <div style="font-size: 15px; line-height: 1.6; color: #333;">
              ${replyMessage.replace(/\n/g, '<br>')}
            </div>
            <hr style="border: none; border-top: 1px solid #eaeaea; margin: 30px 0;" />
            <div style="font-size: 12px; color: #666; background: #f9f9f9; padding: 15px; border-radius: 8px;">
              <strong style="color: #002169;">Original Message from ${inquiry.full_name}:</strong><br/><br/>
              ${inquiry.message.replace(/\n/g, '<br>')}
            </div>
            <div style="margin-top: 30px; text-align: center; font-size: 10px; color: #999; text-transform: uppercase; letter-spacing: 1px;">
              KDS Readymade Udhyog • Lalgadh, Nepal
            </div>
          </div>
        `
      };

      await transporter.sendMail(mailOptions);

      revalidatePath('/admin/inquiries')
      return { success: 'Email reply sent successfully!' }
    } catch (emailError: any) {
      console.error('Email send error:', emailError)
      return { error: 'Failed to send email. Ensure SMTP_USER and SMTP_PASS are set in .env.' }
    }
  }
}
