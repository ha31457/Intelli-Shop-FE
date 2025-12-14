"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useState } from "react"
import ProtectedRoute from "@/components/ProtectedRoute"

export default function RegisterShopPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [name, setShopName] = useState("")
  const [address, setShopAddress] = useState("")
  const [shop_type, setShopCategory] = useState("")
  const [description, setShopDescription] = useState("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    try{
      const token = localStorage.getItem("token")
      if(token){
        const datafe = { name, address, shop_type, description }
        const resp = await fetch("http://localhost:8080/register/shop", {
          method: "POST",
          headers: { 
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json" },
          body: JSON.stringify(datafe),
        })

        const { success, message , data} = await resp.json();
        if (!resp.ok) throw new Error("Shop registration failed");
        if(success){
          console.log("Shop registered successfully")
          console.log(data)
          setLoading(false)
          toast.success(message)
          localStorage.removeItem("role");
          localStorage.setItem("role", "OWNER");
          setTimeout(() => {
            router.push("/owner-dashboard")
          }, 600)
        }else{
          toast.error(message)
          setLoading(false)
          setTimeout(() => {
            router.push("/register-shop")
          }, 600)
        }
      }
      else{
        toast.error("You require login to access this page")
        setTimeout(() => {
          router.push("/login")
        },500)
      }
      }catch (error) {
        console.error("Error during shop registration:", error)
        toast.error("Something went wrong. Please try again.")
        setLoading(false)
      }finally{
        setLoading(false)
      }
    }


  return (
    <ProtectedRoute allowedRoles={["OWNER"]}>
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-accent/10 via-background to-primary/10 px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="w-full max-w-md"
      >
        <Card className="rounded-2xl shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-primary">Register Your Shop</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Shop Name */}
              <div>
                <Label htmlFor="shopName">Shop Name</Label>
                <Input id="shopName" type="text" required onChange={(e) => setShopName(e.target.value)}/>
              </div>

              {/* Shop Address */}
              <div>
                <Label htmlFor="shopAddress">Shop Address</Label>
                <Input id="shopAddress" type="text" required onChange={(e) => setShopAddress(e.target.value)}/>
              </div>

              {/* Category */}
              <div>
                <Label htmlFor="shopCategory">Category</Label>
                <Input id="shopCategory" type="text" required onChange={(e) => setShopCategory(e.target.value)}/>
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="shopDescription">Description</Label>
                <Textarea id="shopDescription" required placeholder="Write a short description of your shop..." onChange={(e) => setShopDescription(e.target.value)}/>
              </div>

              {/* Submit */}
              <Button type="submit" className="w-full rounded-xl" disabled={loading}> {loading ? "Registering shop" : "Register Shop"} </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
    </ProtectedRoute>
  )
}
