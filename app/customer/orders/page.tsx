"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {useRouter} from "next/navigation";
import { toast } from "sonner"
import ProtectedRoute from "@/components/ProtectedRoute"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"


interface Item {
  productId: number;
  quantity: number;
  unitPrice: number;
}

interface Order {
  orderId: number;
  totalAmount: number;
  shopName: string;
  items: Item[];
  status: "Placed" | "Shipped" | "Delivered" | "Cancelled";
  message: string;
}

export default function OrdersPage() {
  const [activeOrders, setactiveOrders] = useState<Order[]>([]);
  const [completedOrders, setcompletedOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:8080/api/get-orders", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((response) => {
        if (response.success) {
          setactiveOrders(response.data.activeOrders);
          setcompletedOrders(response.data.completedOrders);
        } else {
          console.error("Failed to fetch orders:", response.message);
        }
      })
      .catch(() => {
        // fallback dummy data
        setactiveOrders([
          {
            orderId: 101,
            totalAmount: 2499,
            shopName: "Denim World",
            items: [{ productId: 1, quantity: 1, unitPrice: 2499 }],
            status: "Shipped",
            message: "",
          },
        ]);
        setcompletedOrders([
          {
            orderId: 102,
            totalAmount: 4998,
            shopName: "Sneaker Hub",
            items: [{ productId: 2, quantity: 2, unitPrice: 2499 }],
            status: "Delivered",
            message: "",
          },
        ]);
      })
      .finally(() => setLoading(false));
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Placed":
        return "bg-blue-500";
      case "Shipped":
        return "bg-yellow-500";
      case "Delivered":
        return "bg-green-500";
      case "Cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const renderOrders = (orders: Order[]) =>
    orders.map((order, index) => {
      const firstItem = order.items[0];
      return (
        <motion.div
          key={order.orderId}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <Card className="rounded-2xl shadow-lg bg-gray-900 border border-gray-700 hover:shadow-2xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-white">
                Order #{order.orderId}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-300 mb-2">
                Shop: <span className="font-medium">{order.shopName}</span>
              </p>
              <p className="text-sm text-gray-300 mb-2">
                Items:{" "}
                <span className="font-medium">
                  {order.items.length} item
                  {order.items.length > 1 ? "s" : ""}
                </span>
              </p>
              {firstItem && (
                <p className="text-sm text-gray-300 mb-2">
                  Qty (1st item): {firstItem.quantity}
                </p>
              )}
              <p className="text-sm text-gray-300 mb-2">
                Total: ₹{order.totalAmount}
              </p>
              <Badge
                className={`rounded-full px-3 py-1 text-white ${getStatusColor(
                  order.status
                )} hover:${getStatusColor(order.status)}`}
              >
                {order.status}
              </Badge>
            </CardContent>
          </Card>
        </motion.div>
      );
    });

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
      <div className="min-h-screen bg-gradient-to-br from-[#1e293b] via-[#0f172a] to-black text-white px-8 pb-12">
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
      <h1 className="text-3xl text-yellow-500 font-bold mb-10 text-center">
        My Orders
      </h1>
      <div className="sticky top-0 z-50 bg-gradient-to-br from-[#1e293b] via-[#0f172a] to-black py-4 mb-8 -mx-8 px-8">
        <div className="flex gap-7">
          <Button className="rounded-2xl"><Link href={"#active-orders"}>Active Orders</Link></Button>
          <Button className="rounded-2xl"><Link href={"#completed-orders"}>Completed Orders</Link></Button>
        </div>
      </div>

      {loading ? (
        <p className="text-gray-400 text-center">Loading your orders...</p>
      ) : (
        <>
          {/* Active Orders */}
          <section id="active-orders" className="mb-16">
            <h2 className="text-2xl font-semibold mb-6 text-yellow-500">
              Active Orders
            </h2>
            {activeOrders.length === 0 ? (
              <p className="text-gray-400">No active orders.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {renderOrders(activeOrders)}
              </div>
            )}
          </section>

          {/* Completed Orders */}
          <section id="completed-orders" className="mb-16">
            <h2 className="text-2xl font-semibold mb-6 text-yellow-500">
              Completed Orders
            </h2>
            {completedOrders.length === 0 ? (
              <p className="text-gray-400">No completed orders.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {renderOrders(completedOrders)}
              </div>
            )}
          </section>
        </>
      )}
    </div>
    </ProtectedRoute>
  );
}
