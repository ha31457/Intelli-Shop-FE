"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner"
import NotificationDrawer from "@/components/NotificationDrawer";


export default function ShopDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
  });

  // Dummy fetch simulation (replace with backend call)
  useEffect(() => {
    // Here you will fetch shop stats from backend
    // Fetch shop details from the backend localhost:8080/getShopDetails
    const resp =  fetch("http://localhost:8080/getShopDetails", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
      },
    }).then((res) => res.json())
    .then((data) => {
      console.log("shop details : ", data);
      localStorage.setItem("shopId", data.data.id);
      localStorage.setItem("shopName", data.data.name);
      localStorage.setItem("shopAddress", data.data.address);
      toast.success("Shop details fetched successfully");
    })
    .catch((err) => {
      console.log(err);
    });
    
    // Fetch shop stats from the backend
    fetch("http://localhost:8080/api/getShopStats", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
      },
    })
    .then((res) => res.json())
    .then((data) => {
      console.log("shop stats : ", data);
      setStats({
        totalProducts: data.data.totalProducts,
        totalOrders: data.data.totalOrders,
      });
    })
    .catch((err) => {
      console.log(err);
      toast.error("Failed to fetch shop stats");
    });
  }, []);
  
  const ShopName = localStorage.getItem("shopName") || "Shop";
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1e293b] via-[#0f172a] to-black p-6 text-white">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{ShopName} Dashboard</h1> {/*TODO: Replace with shop name from backend*/}
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full bg-gray-900 border border-gray-700 hover:bg-gray-800"
        >
          {/* <Bell className="h-6 w-6 text-yellow-500" /> */}
          <NotificationDrawer />
        </Button>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div whileHover={{ scale: 1.05 }}>
          <Card className="bg-gray-900 border border-gray-700 rounded-2xl shadow-lg">
            <CardContent className="p-6 text-center">
              <h2 className="text-lg text-gray-400">Total Products</h2>
              <p className="text-3xl font-bold text-yellow-500 mt-2">
                {stats.totalProducts}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }}>
          <Card className="bg-gray-900 border border-gray-700 rounded-2xl shadow-lg">
            <CardContent className="p-6 text-center">
              <h2 className="text-lg text-gray-400">Total Orders</h2>
              <p className="text-3xl font-bold text-yellow-500 mt-2">
                {stats.totalOrders}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick Navigation */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <motion.div whileHover={{ scale: 1.05 }}>
          <Card
            className="bg-gray-900 border border-gray-700 rounded-2xl shadow-lg cursor-pointer hover:border-yellow-500"
            onClick={() => router.push("/owner/products")}
          >
            <CardContent className="p-6 text-center">
              <h2 className="text-xl font-bold text-yellow-500 mb-2">Products</h2>
              <p className="text-gray-400">Manage your shop products</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }}>
          <Card
            className="bg-gray-900 border border-gray-700 rounded-2xl shadow-lg cursor-pointer hover:border-yellow-500"
            onClick={() => router.push("/owner/orders")}
          >
            <CardContent className="p-6 text-center">
              <h2 className="text-xl font-bold text-yellow-500 mb-2">Orders</h2>
              <p className="text-gray-400">View and manage customer orders</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }}>
          <Card
            className="bg-gray-900 border border-gray-700 rounded-2xl shadow-lg cursor-pointer hover:border-yellow-500"
            onClick={() => router.push("/owner/shop/profile")}
          >
            <CardContent className="p-6 text-center">
              <h2 className="text-xl font-bold text-yellow-500 mb-2">Shop Profile</h2>
              <p className="text-gray-400">Update your shop information</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
