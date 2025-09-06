"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ShopDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    revenue: 0,
  });

  // Dummy fetch simulation (replace with backend call)
  useEffect(() => {
    // Here you will fetch shop stats from backend
    setStats({
      totalProducts: 42,
      totalOrders: 120,
      pendingOrders: 5,
      revenue: 85000,
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1e293b] via-[#0f172a] to-black p-6 text-white">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Shop Dashboard</h1> //TODO: Replace with shop name from backend
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full bg-gray-900 border border-gray-700 hover:bg-gray-800"
        >
          <Bell className="h-6 w-6 text-yellow-500" />
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

        <motion.div whileHover={{ scale: 1.05 }}>
          <Card className="bg-gray-900 border border-gray-700 rounded-2xl shadow-lg">
            <CardContent className="p-6 text-center">
              <h2 className="text-lg text-gray-400">Pending Orders</h2>
              <p className="text-3xl font-bold text-yellow-500 mt-2">
                {stats.pendingOrders}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }}>
          <Card className="bg-gray-900 border border-gray-700 rounded-2xl shadow-lg">
            <CardContent className="p-6 text-center">
              <h2 className="text-lg text-gray-400">Revenue</h2>
              <p className="text-3xl font-bold text-yellow-500 mt-2">
                ₹{stats.revenue.toLocaleString()}
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
            onClick={() => router.push("/shop/products")}
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
            onClick={() => router.push("/shop/orders")}
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
            onClick={() => router.push("/shop/profile")}
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
