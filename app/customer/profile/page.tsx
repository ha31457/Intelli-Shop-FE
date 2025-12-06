"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"


export default function ProfilePage() {
  const [name, setName] = useState("Your name")
  const [email, setEmail] = useState("Your email") // fixed, not editable
  const [phone, setPhone] = useState("Your phone number")
  const [address, setAddress] = useState("New Delhi, India")
  const router = useRouter()

  const handleSave = () => {
    const payload = {
      name,
      phone,
      address,
      role: "CUSTOMER",      
      shopId: null,
    }
    const id = localStorage.getItem("id")

    const resp = fetch(`http://localhost:8080/user/update/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((response) => {
        if (response.success) {
          toast.success("Profile updated successfully")
          console.log(response.data)
        } else {
          toast.error("Failed to update profile: " + response.message)
        }
      })
      .catch(() => {
        toast.error("Failed to update profile. Please try again.")
      })
  }

  const handleLogout = async () =>{
    localStorage.removeItem("token")
    localStorage.removeItem("_rle")
    toast.success("Logged out successfully")
    setTimeout((): void => {
      localStorage.removeItem("id")
      router.push("/login")
    }, 500)
  }

  useEffect(() => {
    // Fetch user profile from backend API and set state
    const fetchProfile = async () => {
      let user = null
      try {
        const res = await fetch("http://localhost:8080/getUser", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        const data = await res.json()
        user = data.data
        if (user) {
          localStorage.setItem("id", user.id)
          setName(user.name || "")
          setEmail(user.email || "")
          setPhone(user.phone || "")
          setAddress(user.address || "")
        } else {
          toast.error("Failed to load user profile.")
          setTimeout(() => {localStorage.removeItem("id"), router.push("/login"), 600});
        }
      } catch {
        toast.error("Failed to load user profile.")
        setTimeout(() => {localStorage.removeItem("id"), router.push("/login"), 600});
      }
    }
    fetchProfile()
  }, [])



  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="flex justify-between items-center px-8 py-4 border-b border-gray-800">
            <h1
            className="text-2xl font-extrabold text-yellow-500 cursor-pointer"
            onClick={function () {
                return router.push("/customer/dashboard")
            }}
            >
            IntelliShop
            </h1>
            <nav>
            <ul className="flex gap-6 text-gray-300">
                <li
                className="hover:text-yellow-500 cursor-pointer"
                onClick={() => router.push("/customer/browse-shop")}
                >
                Browse Shops
                </li>
                <li
                className="hover:text-yellow-500 cursor-pointer"
                onClick={() => router.push("/customer/orders")}
                >
                My Orders
                </li>
                <li
                className="hover:text-yellow-500 cursor-pointer"
                onClick={() => router.push("/customer/cart")}
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

            <Button onClick={handleSave} className="w-full">
              Save Changes
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
