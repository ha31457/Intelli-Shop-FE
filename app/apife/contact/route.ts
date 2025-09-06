// app/api/contact/route.ts
import { NextResponse } from "next/server"
import nodemailer from "nodemailer"

export async function POST(req: Request) {
  try {
    const { name, title, email, message } = await req.json()

    //TODO: create a .env.local file to save credentials
    //TODO: create an account to actually recieve emails..
    // configure transporter
    const transporter = nodemailer.createTransport({
      service: "gmail", // or your SMTP provider
      auth: {
        user: process.env.SMTP_USER, // your email
        pass: process.env.SMTP_PASS, // your app password
      },
    })

    // send mail
    await transporter.sendMail({
      from: `"${name}" <${email}>`,
      to: "dummyreceiver@example.com", // replace with your email
      subject: `${title} -from  ${name} `,
      text: message,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ success: false, error: "Failed to send email" }, { status: 500 })
  }
}
