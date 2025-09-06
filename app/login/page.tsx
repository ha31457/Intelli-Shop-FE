"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    try {
      console.log("Attempting to log in ")
      const res = await fetch("http://localhost:8080/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const { success, message, data } = await res.json();
      console.log(data)
      if (!res.ok) throw new Error("Signup failed");
      if(success){
        console.log("Login successful, token stored:", data);
        sessionStorage.setItem("token", data.token);
        sessionStorage.setItem("role", data.role);
        toast.success(message);
        //TODO: setup some logic to redirect owners to owner-dashboard and users to dashboard
        if(data.role === "OWNER"){
          setTimeout(() => router.push("/owner/dashboard"), 500);
        }else if(data.role === "CUSTOMER"){
          setTimeout(() => router.push("/customer/dashboard"), 300);
        }
      }else{
        toast.error(message);
        setTimeout(() => router.push("/login"), 600);
      }
      
    } catch (err) {
      toast.error("Something went wrong. Try again!");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-background text-foreground min-h-screen flex flex-col">
      {/* Navbar */}
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
      <section className="relative py-16 bg-gradient-to-br from-primary/10 via-background to-accent/10 text-center">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-extrabold text-primary mb-4"
        >
          Welcome Back
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-lg text-muted-foreground max-w-xl mx-auto"
        >
          Log in to continue exploring AI-powered shopping with IntelliShop.
        </motion.p>
      </section>

      {/* Login Section */}
      <section className="flex-grow flex items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md"
        >
          <Card className="shadow-xl border-0 bg-gradient-to-br from-primary/10 to-accent/35 rounded-2xl">
            <CardContent className="p-8">
              <form onSubmit={handleLogin} className="space-y-6">
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Button type="submit" className="w-full rounded-xl" disabled={loading}>
                  {loading ? "Logging in..." : "Login"}
                </Button>
              </form>
              <p className="text-sm text-center text-muted-foreground mt-6">
                Don’t have an account?{" "}
                <Link href="/signup" className="text-primary hover:underline">
                  Sign up
                </Link>
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </section>
    </div>
  )
}
