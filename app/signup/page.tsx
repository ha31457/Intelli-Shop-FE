"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export default function SignupPage() {
  const [role, setRole] = useState<"CUSTOMER" | "OWNER">("CUSTOMER")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    try{
      console.log(password)
      console.log(name)
      const datafe = { name, email, phone, address, password, role }
      const res = await fetch("http://localhost:8080/user/register", { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify( datafe ),
      })

      const { success, message, data } = await res.json();
      if (!res.ok) throw new Error("Signup failed");
      if(success){
        console.log("Signup successful")
        setLoading(false)
        toast.success(message)

        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
        
        if(role === "OWNER"){
          setTimeout(() => router.push("/owner/register-shop"), 400);
        }else if(role === "CUSTOMER"){
          setTimeout(() => router.push("/customer/dashboard"), 400);
        }
      }else{
        toast.error(message)
        setLoading(false)
        setTimeout(() => {
          router.push("/signup")
        }, 400)
      }
    } catch (error) {
      console.error("Error during signup:", error)
      toast.error("Something went wrong. Please try again.")
      setLoading(false)
      return
    }
    finally{
      setLoading(false)
    }
    if (role === "OWNER") {
      setTimeout(() => {
        router.push("/owner/register-shop")
    }, 500)
    } else {
      setTimeout(() => {
        router.push("/customer/dashboard")
    }, 500)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary/10 via-background to-accent/10 px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="w-full max-w-md"
      >
        <Card className="rounded-2xl shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-primary">Create an Account</CardTitle>
          </CardHeader>
          <CardContent>
            <form id="signupForm" onSubmit={handleSubmit} className="space-y-4">
              {/* Role Selection */}
              <div className="flex justify-center gap-4 mb-4">
                <Button
                  type="button"
                  variant={role === "CUSTOMER" ? "default" : "outline"}
                  onClick={() => setRole("CUSTOMER")}
                  className="w-1/2"
                >
                  Customer
                </Button>
                <Button
                  type="button"
                  variant={role === "OWNER" ? "default" : "outline"}
                  onClick={() => setRole("OWNER")}
                  className="w-1/2"
                >
                  Owner
                </Button>
              </div>

              {/* Name */}
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" type="text" required onChange={(e) => setName(e.target.value)}/>
              </div>

              {/* Email */}
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" required onChange={(e) => setEmail(e.target.value)}/>
              </div>

              {/* Phone */}
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" type="tel" required onChange={(e) => setPhone(e.target.value)}/>
              </div>

              {/* Address */}
              <div>
                <Label htmlFor="address">Address</Label>
                <Input id="address" type="text" required onChange={(e) => setAddress(e.target.value)}/>
              </div>

              {/* Password */}
              <div>
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" required onChange={(e) => setPassword(e.target.value)}/>
              </div>

              {/* Submit */}
              <Button type="submit" className="w-full rounded-xl" disabled={loading}>
                  {loading ? "Signing up..." : "Sign Up"}
                </Button>
            </form>

            {/* Redirect to login */}
            <p className="text-center text-sm text-muted-foreground mt-4">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline">Log in</Link>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
