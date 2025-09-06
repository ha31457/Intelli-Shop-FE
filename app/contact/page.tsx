"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

export default function ContactPage() {
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault()
  setLoading(true)

  const formData = new FormData(e.currentTarget)
  const data = {
    name: formData.get("name"),
    title: formData.get("title"),
    email: formData.get("email"),
    message: formData.get("message"),
  }

  try {
    const res = await fetch("/apife/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })

    if (res.ok) {
      toast.success("Message sent!", {
        description: "We’ll get back to you shortly.",
      })
      e.currentTarget.reset()
    } else {
      toast.error("Failed to send message.")
    }
  } catch {
    toast.error("Something went wrong.")
  } finally {
    setLoading(false)
  }
}


  return (
    <div className="bg-background text-foreground">
      <nav className="flex items-center justify-between px-6 py-4 shadow-sm bg-background sticky top-0 z-50">
        <Link href="/" className="text-2xl font-extrabold text-primary tracking-wide">
          IntelliShop
        </Link>
        <div className="space-x-4">
          <Link href="/" className="hover:text-primary">Home</Link>
          <Link href="/contact" className="hover:text-primary">Contact</Link>
        </div>
      </nav>
      {/* Hero Section */}
      <section className="relative py-28 bg-gradient-to-br from-primary/10 via-background to-accent/10 text-center">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl font-extrabold text-primary mb-4"
        >
          Contact Us
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-lg text-muted-foreground max-w-2xl mx-auto"
        >
          We’d love to hear from you. Reach out with your questions, feedback, or just to say hello!
        </motion.p>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Contact Details */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Card className="bg-gradient-to-br from-primary/10 to-accent/35 shadow-lg border-0 rounded-2xl">
              <CardContent className="p-8 space-y-4">
                <h3 className="text-2xl font-semibold text-primary">Our Office</h3>
                <p className="text-muted-foreground">📍 Vadodara, India</p>
                <p className="text-muted-foreground">📞 +91 83200 99811 </p>
                <p className="text-muted-foreground">✉️ support@intellishop.com</p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Card className="shadow-xl border-0 bg-gradient-to-br from-primary/10 to-accent/35 rounded-2xl">
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <Input name="title" placeholder="Subject / Title" required />
                  <Input name="name" placeholder="Your Name" required />
                  <Input name="email" type="email" placeholder="Your Email" required />
                  <Textarea name="message" placeholder="Your Message" rows={4} required />
                  <Button type="submit" className="w-full rounded-xl" disabled={loading}>
                    {loading ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
