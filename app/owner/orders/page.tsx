"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface Order {
  id: number;
  customer: string;
  date: string;
  total: number;
  status: "Pending" | "Shipped" | "Delivered" | "Cancelled";
}

export default function OrdersPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    async function fetchOrders() {
      // Replace this with API call
      const data: Order[] = [
        {
          id: 1001,
          customer: "John Doe",
          date: "2025-09-13",
          total: 2400,
          status: "Pending",
        },
        {
          id: 1002,
          customer: "Jane Smith",
          date: "2025-09-12",
          total: 1500,
          status: "Shipped",
        },
        {
          id: 1003,
          customer: "Michael Lee",
          date: "2025-09-11",
          total: 3200,
          status: "Delivered",
        },
      ];
      setOrders(data);
      setLoading(false);
    }
    fetchOrders();
  }, []);

  if (loading) return <p className="text-center text-gray-400">Loading orders...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1e293b] via-[#0f172a] to-black text-white px-6 py-10">
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
                key={order.id}
                className="border-b border-gray-700 hover:bg-gray-800 transition"
              >
                <td className="p-4">#{order.id}</td>
                <td className="p-4">{order.customer}</td>
                <td className="p-4">{order.date}</td>
                <td className="p-4">₹ {order.total}</td>
                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      order.status === "Pending"
                        ? "bg-yellow-500/20 text-yellow-400"
                        : order.status === "Shipped"
                        ? "bg-blue-500/20 text-blue-400"
                        : order.status === "Delivered"
                        ? "bg-green-500/20 text-green-400"
                        : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="p-4">
                  <Button
                    variant="outline"
                    className="border-gray-600 text-white rounded-xl hover:bg-gray-700"
                    onClick={() => router.push(`/owner/orders/${order.id}`)}
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
  );
}
