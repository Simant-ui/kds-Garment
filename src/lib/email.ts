import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export async function sendOTPEmail(email: string, otp: string) {
  const mailOptions = {
    from: `"KDS Garment Support" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Verification Code for KDS Garment',
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; background-color: #f9f9f9; border-radius: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #1e3a8a; margin: 0; font-size: 28px; letter-spacing: -0.02em;">KDS GARMENT</h1>
          <p style="color: #64748b; font-size: 14px; margin-top: 5px;">Premium Apparel Industry</p>
        </div>
        <div style="background-color: #ffffff; padding: 40px; border-radius: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
          <h2 style="color: #0f172a; margin-top: 0; font-size: 20px;">Verify Your Email</h2>
          <p style="color: #475569; line-height: 1.6; font-size: 16px;">
            Thank you for choosing KDS Garment. Use the 6-digit verification code below to complete your registration. This code is valid for <strong>10 minutes</strong>.
          </p>
          <div style="background-color: #f1f5f9; padding: 30px; border-radius: 12px; text-align: center; margin: 30px 0;">
            <span style="font-size: 42px; font-weight: 800; color: #1e3a8a; letter-spacing: 0.3em;">${otp}</span>
          </div>
          <p style="color: #64748b; font-size: 14px; margin-bottom: 0;">
            If you did not request this code, please ignore this email or contact support if you have concerns.
          </p>
        </div>
        <div style="text-align: center; margin-top: 30px;">
          <p style="color: #94a3b8; font-size: 12px;">
            &copy; 2026 KDS Garment Industry. Lalgadh, Nepal.
          </p>
        </div>
      </div>
    `,
  }

  try {
    const info = await transporter.sendMail(mailOptions)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('Nodemailer Error:', error)
    return { success: false, error }
  }
}
