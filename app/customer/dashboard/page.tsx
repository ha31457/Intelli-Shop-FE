// app/dashboard/page.tsx
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "sonner"
import ProtectedRoute from "@/components/ProtectedRoute"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"


export default function DashboardPage() {
  const [customerName, setCustomerName] = useState("Customer")
  const router = useRouter()

  // Simulate fetching customer name (replace with backend API)
  useEffect(() => {
    const response = fetch("http://localhost:8080/getUser", {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
    }).then(res => res.json())
    .then(response => {
        if(response.success){ 
            setCustomerName(response.data.name)
            // cookieStore.set("role", "CUSTOMER") this is how to set role in cookie 
            // cookieStore.get("role").then(res => console.log("role from cookie: ", res?.value)) this is how to get role from cookie
        }else{
            toast.error("Session expired. Please login again.") 
            setTimeout(() => router.push("/login"), 500)
        }
    })
  }, [])

  const handleLogout = async () =>{
    localStorage.removeItem("token")
    localStorage.removeItem("_rle")
    toast.success("Logged out successfully")
    setTimeout((): void => {
      router.push("/login")
    }, 500)
  }

  return (
    <ProtectedRoute allowedRoles={["CUSTOMER"]}>
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-black via-gray-900 to-black text-white">
        {/* Navbar */}
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
                <li>    
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Avatar className="cursor-pointer">
                            <AvatarImage src="/Profile.png" alt={customerName} />
                            <AvatarFallback>{customerName.charAt(0)}</AvatarFallback>
                            </Avatar>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent className="w-56 p-2">
                            <DropdownMenuLabel>
                            <div>
                                <p className="font-medium">{customerName}</p>
                                <p className="text-sm text-muted-foreground">{customerName}</p>
                            </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />

                            <DropdownMenuItem onClick={() => router.push("/customer/dashboard")}>
                            Dashboard
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => router.push("/customer/orders")}>
                            My Orders
                            </DropdownMenuItem>

                            <DropdownMenuItem onClick={() => router.push("/customer/profile")}>
                            Update Details
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleLogout} className="text-red-500">
                            Logout
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </li>
            </ul>
            </nav>
        </header>

        {/* Hero Section */}
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center text-center mt-16"
        >
            <h2 className="text-4xl font-bold text-yellow-500 mb-2">
            Welcome back, {customerName}!
            </h2>
            <p className="text-lg text-gray-400">
            Manage your shopping experience with ease 🚀
            </p>
        </motion.section>

        {/* Quick Actions */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 px-12 mt-16">
            {[
            { title: "Browse Shops", desc: "Explore nearby shops and products", path: "/customer/browse-shop" },
            { title: "My Orders", desc: "Track your past & current orders", path: "/customer/orders" },
            { title: "Cart", desc: "View and manage items in your cart", path: "/customer/cart" },
            ].map((item, index) => (
            <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
            >
                <Card
                className="bg-gray-900 border border-gray-800 shadow-lg hover:shadow-yellow-500/30 cursor-pointer transition"
                onClick={() => router.push(item.path)}
                >
                <CardContent className="p-6 text-center">
                    <h3 className="text-xl font-semibold text-yellow-500">{item.title}</h3>
                    <p className="text-gray-400 mt-2">{item.desc}</p>
                </CardContent>
                </Card>
            </motion.div>
            ))}
        </section>

        {/* Recommendations Section (Placeholder for future AI feature) */}
        <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="px-12 mt-20 mb-12"
        >
            <h3 className="text-2xl font-bold text-yellow-500 mb-6">Recommended for You</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <Card className="bg-gray-900 border border-gray-800 shadow-lg">
                <CardContent className="p-6">
                <h4 className="text-lg font-semibold text-yellow-500">Cool Sneakers</h4>
                <p className="text-gray-400 mt-2">Based on your recent shopping</p>
                </CardContent>
            </Card>
            <Card className="bg-gray-900 border border-gray-800 shadow-lg">
                <CardContent className="p-6">
                <h4 className="text-lg font-semibold text-yellow-500">Trendy Jacket</h4>
                <p className="text-gray-400 mt-2">Winter collection for you</p>
                </CardContent>
            </Card>
            <Card className="bg-gray-900 border border-gray-800 shadow-lg">
                <CardContent className="p-6">
                <h4 className="text-lg font-semibold text-yellow-500">Smart Watch</h4>
                <p className="text-gray-400 mt-2">Tech picks just for you</p>
                </CardContent>
            </Card>
            </div>
        </motion.section>
        </div>
    </ProtectedRoute>
  )
}
