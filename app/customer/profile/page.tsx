"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ProfilePage() {
  const [name, setName] = useState("John Doe")
  const [email] = useState("john@example.com") // fixed, not editable
  const [phone, setPhone] = useState("9876543210")
  const [address, setAddress] = useState("New Delhi, India")
  const [password, setPassword] = useState("")
  const router = useRouter()

  const handleSave = () => {
    toast.success("Profile updated successfully!")
  }

  const handleLogout = async () =>{
    sessionStorage.removeItem("token")
    sessionStorage.removeItem("role")
    toast.success("Logged out successfully")
    setTimeout((): void => {
      router.push("/login")
    }, 500)
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="flex justify-between items-center px-8 py-4 border-b border-gray-800">
            <h1
            className="text-2xl font-extrabold text-yellow-500 cursor-pointer"
            onClick={function () {
                return router.push("/")
            }}
            >
            IntelliShop
            </h1>
            <nav>
            <ul className="flex gap-6 text-gray-300">
                <li
                className="hover:text-yellow-500 cursor-pointer"
                onClick={() => router.push("/shops")}
                >
                Browse Shops
                </li>
                <li
                className="hover:text-yellow-500 cursor-pointer"
                onClick={() => router.push("/orders")}
                >
                My Orders
                </li>
                <li
                className="hover:text-yellow-500 cursor-pointer"
                onClick={() => router.push("/cart")}
                >
                Cart
                </li>
                <li
                className="hover:text-yellow-500 cursor-pointer"
                onClick={handleLogout}
                >
                Logout
                </li>
            </ul>
            </nav>
        </header>

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center py-16 bg-gradient-to-r from-background to-muted"
      >
        <h1 className="text-4xl font-bold text-primary">My Profile</h1>
        <p className="text-muted-foreground mt-2">Manage your account details</p>
      </motion.div>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="max-w-lg mx-auto p-6"
      >
        <Card className="shadow-lg border border-border">
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <Input value={email} disabled className="bg-muted cursor-not-allowed" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Address</label>
              <Input value={address} onChange={(e) => setAddress(e.target.value)} />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Change Password</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <Button onClick={handleSave} className="w-full">
              Save Changes
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
