"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import ProtectedRoute from "@/components/ProtectedRoute";

interface OrderItemDTO{
  productId: number;
  quantity: number;
  unitPrice: number;
}

interface Order {
  orderId: number;
  totalAmount: number;
  shopName: string;
  items: OrderItemDTO[];
  status: string;
  message: string;
}

export default function OrderDetailsPage() {
  const params = useParams();
  const orderId = params?.id;
  const router = useRouter();
  console.log(orderId);

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [ownerName, setOwnerName] = useState("Owner");

  useEffect(() => {
    const response = fetch("http://localhost:8080/getUser", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      }
    }).then(res => res.json())
    .then(response => {
      if(response.success){ 
        setOwnerName(response.data.name)
      }
    })
  }, [])

  // Client-only fetch
  const handleLogout = async () =>{
    localStorage.removeItem("token")
    localStorage.removeItem("_rle")
    toast.success("Logged out successfully")
    setTimeout((): void => {
      router.push("/login")
    }, 500)
  }

  useEffect(() => {
    if (!orderId) return;

    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      toast.error("User not authenticated");
      return;
    }

    fetch(`http://localhost:8080/api/getOrderDetailsCustomer/${orderId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        console.log("HTTP status:", res.status);
    
        // Read response as text first
        const text = await res.text();
        console.log("Raw response text:", text);
    
        if (!text) {
          throw new Error("Empty response from server");
        }
    
        // Parse JSON only if text exists
        return JSON.parse(text);
      })
      .then((response) => {
        console.log("API response:", response);
    
        if (response.success) {
          // Assuming response.data has activeOrders and completedOrders arrays
          const { activeOrders, completedOrders } = response.data;
          const order = activeOrders[0] || completedOrders[0] || [];
          setOrder(order);
        } else {
          toast.error(response.message || "Failed to fetch order");
          setOrder(null);
        }
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        toast.error("Something went wrong");
        setOrder(null);
      })
      .finally(() => setLoading(false));
  }, [orderId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0f172a] text-gray-400">
        Loading order details...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0f172a] text-red-400">
        Order not found
      </div>
    );
  }

  return (
    <ProtectedRoute allowedRoles={["CUSTOMER"]}>
      <div className="min-h-screen bg-gradient-to-br from-[#1e293b] via-[#0f172a] to-black text-white px-8 py-12">
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
                <li>    
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Avatar className="cursor-pointer">
                            <AvatarImage src="/Profile.png" />
                            </Avatar>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent className="w-56 p-2">
                          
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
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h1 className="text-3xl text-yellow-500 font-bold mb-8 text-center">Order Details</h1>
          <Card className="bg-gray-900 border border-gray-800 rounded-2xl shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-white">Order #{order.orderId}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">

              <div>
                <h2 className="text-lg font-semibold text-yellow-400 mb-2">Order Information</h2>
                <p>🕓 Status: <span className="font-semibold text-yellow-400">{order.status}</span></p>
                <p>💰 Total Amount: ₹{order.totalAmount}</p>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-yellow-400 mb-2">Products Ordered</h2>
                <div className="space-y-3">
                  <p> Product Id : {order.items[0]?.productId}</p>
                  <p> Quantity : {order.items[0]?.quantity}</p>
                  <p> Unit Price : {order.items[0]?.unitPrice}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </ProtectedRoute>
  );
}
