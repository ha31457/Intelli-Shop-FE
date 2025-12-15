"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { toast } from "sonner"

interface Order {
  orderId: number;
  totalAmount: number;
  shopName: string;
  status: "PLACED" | "COMPLETED";
}


export default function OrdersPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
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

  const handleLogout = async () =>{
    localStorage.removeItem("token")
    localStorage.removeItem("_rle")
    toast.success("Logged out successfully")
    setTimeout((): void => {
      router.push("/login")
    }, 500)
  }

  useEffect(() => {
    async function fetchOrders() {
      // Replace this with API call
      try {
        const token = localStorage.getItem("token");
        const resp = await fetch("http://localhost:8080/api/get-shop-orders", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (!resp.ok) throw new Error("Failed to fetch orders");
        const json = await resp.json();
        console.log(json);

        if (json.success && json.data) {
          const allOrders = [
            ...(json.data.activeOrders || []),
            ...(json.data.completedOrders || []),
          ];
          setOrders(allOrders);
        } else {
          setOrders([]);
        }

        setLoading(false);

        return;
      } catch (err) {
        console.error("Error fetching orders:", err);
      }
      const data: Order[] = [
        {
          orderId: 1001,
          totalAmount: 2400,
          shopName: "Default shop",
          status: "PLACED",
        },
        {
          orderId: 1002,
          totalAmount: 1200,
          shopName: "Default shop",
          status: "COMPLETED",
        },
        {
          orderId: 1003,
          totalAmount: 150  ,
          shopName: "Default shop",
          status: "PLACED",
        },
      ];
      setOrders(data);
      setLoading(false);
    }
    fetchOrders();
  }, []);

  if (loading) return (
    <ProtectedRoute allowedRoles={["OWNER"]}>
      <div className="min-h-screen bg-gradient-to-br from-[#1e293b] via-[#0f172a] to-black text-white pt-0">
        <header className="flex justify-between items-center px-8 py-4 border-b border-gray-800">
          <h1
            className="text-2xl font-extrabold text-yellow-500 cursor-pointer"
            onClick={() => router.push("/owner/dashboard")}
          >
            IntelliShop
          </h1>
          <nav>
            <ul className="flex gap-6 text-gray-300">
              <li
                className="hover:text-yellow-500 cursor-pointer"
                onClick={() => router.push("/owner/products")}
              >
                Products
              </li>
              <li
                className="hover:text-yellow-500 cursor-pointer"
                onClick={() => router.push("/owner/orders")}
              >
                Shop Orders
              </li>
              <li>    
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Avatar className="cursor-pointer">
                      <AvatarImage src="/Profile.png" alt={ownerName} />
                      <AvatarFallback>{ownerName.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 p-2">
                    <DropdownMenuLabel>
                      <div>
                        <p className="font-medium">{ownerName}</p>
                        <p className="text-sm text-muted-foreground">{ownerName}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => router.push("/owner/dashboard")}>
                      Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push("/owner/orders")}>
                      Shop Orders
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push("/owner/shop/profile")}>
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
        <div className="px-6 py-10">
          <p className="text-center text-gray-400">Loading orders...</p>
        </div>
      </div>
    </ProtectedRoute>
  );

  return (
    <ProtectedRoute allowedRoles={["OWNER"]}>
      <div className="min-h-screen bg-gradient-to-br from-[#1e293b] via-[#0f172a] to-black text-white pt-0">
        <header className="flex justify-between items-center px-8 py-4 border-b border-gray-800">
          <h1
            className="text-2xl font-extrabold text-yellow-500 cursor-pointer"
            onClick={() => router.push("/owner/dashboard")}
          >
            IntelliShop
          </h1>
          <nav>
            <ul className="flex gap-6 text-gray-300">
              <li
                className="hover:text-yellow-500 cursor-pointer"
                onClick={() => router.push("/owner/products")}
              >
                Products
              </li>
              <li
                className="hover:text-yellow-500 cursor-pointer"
                onClick={() => router.push("/owner/orders")}
              >
                Shop Orders
              </li>
              <li>    
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Avatar className="cursor-pointer">
                      <AvatarImage src="/Profile.png" alt={ownerName} />
                      <AvatarFallback>{ownerName.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 p-2">
                    <DropdownMenuLabel>
                      <div>
                        <p className="font-medium">{ownerName}</p>
                        <p className="text-sm text-muted-foreground">{ownerName}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => router.push("/owner/dashboard")}>
                      Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push("/owner/orders")}>
                      Shop Orders
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push("/owner/shop/profile")}>
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
        <div className="px-6 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-3xl font-bold text-yellow-500">Orders</h1>
      </div>

      {/* Orders Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="overflow-x-auto bg-gray-900 border border-gray-700 rounded-2xl shadow-xl"
      >
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-800 text-gray-300">
            <tr>
              <th className="p-4">Order ID</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Date</th>
              <th className="p-4">Total</th>
              <th className="p-4">Status</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr
                key={order.orderId}
                className="border-b border-gray-700 hover:bg-gray-800 transition"
              >
                <td className="p-4">#{order.orderId}</td>
                <td className="p-4">{order.shopName}</td>
                <td className="p-4">—</td>
                <td className="p-4">₹ {order.totalAmount}</td>

                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      order.status === "PLACED"
                        ? "bg-yellow-500/20 text-yellow-400"
                        : "bg-green-500/20 text-green-400"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>

                <td className="p-4">
                  <Button
                    variant="outline"
                    className="border-gray-600 text-white rounded-xl hover:bg-gray-700"
                    onClick={() => router.push(`/owner/orders/${order.orderId}`)}
                  >
                    View
                  </Button>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
