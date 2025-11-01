import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, company, phone, services, message } = body

    // Validation
    if (!name || !email || !company || !services || services.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    // Store lead data (in a real app, you'd save to a database)
    const leadData = {
      name,
      email,
      company,
      phone: phone || 'Not provided',
      services,
      message: message || 'No message provided',
      timestamp: new Date().toISOString()
    }

    console.log('New Lead:', leadData)

    // Send email notification
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      })

      const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #6366f1; border-bottom: 2px solid #6366f1; padding-bottom: 10px;">
            New Lead from Alfox.ai
          </h2>

          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1f2937; margin-top: 0;">Contact Information</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            <p><strong>Company:</strong> ${company}</p>
            <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
          </div>

          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1f2937; margin-top: 0;">Services of Interest</h3>
            <ul style="list-style-type: none; padding-left: 0;">
              ${services.map((service: string) => `<li style="padding: 5px 0;">✓ ${service}</li>`).join('')}
            </ul>
          </div>

          ${message ? `
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1f2937; margin-top: 0;">Message</h3>
            <p style="white-space: pre-wrap;">${message}</p>
          </div>
          ` : ''}

          <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 12px;">
            <p>Lead generated at: ${new Date().toLocaleString()}</p>
          </div>
        </div>
      `

      const mailOptions = {
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: process.env.LEAD_EMAIL || process.env.SMTP_USER,
        subject: `New Lead: ${name} from ${company}`,
        html: htmlContent,
        replyTo: email,
      }

      if (process.env.SMTP_USER && process.env.SMTP_PASS) {
        await transporter.sendMail(mailOptions)
        console.log('Email sent successfully')
      } else {
        console.log('Email not configured. Lead data:', leadData)
        console.log('Would send email to:', process.env.LEAD_EMAIL || 'not configured')
      }
    } catch (emailError) {
      console.error('Email error:', emailError)
      // Don't fail the request if email fails
    }

    return NextResponse.json({
      success: true,
      message: 'Lead submitted successfully',
      leadId: Date.now().toString()
    })

  } catch (error) {
    console.error('Error processing lead:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
