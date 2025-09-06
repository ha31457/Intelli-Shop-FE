"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface OrderDetails {
  id: string;
  status: string;
  date: string;
  items: OrderItem[];
  deliveryMode: "delivery" | "pickup";
  address?: string;
  paymentMethod: string;
  total: number;
}

export default function OrderDetailsPage() {
  const { id } = useParams();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const res = await fetch(`http://localhost:8080/orders/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch order details");
        const data = await res.json();
        setOrder(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (!order) {
    return <p className="text-center text-gray-400">Order not found</p>;
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-[#1e293b] via-[#0f172a] to-black text-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-6"
      >
        {/* Order Summary */}
        <Card className="bg-gray-900 border border-gray-700 rounded-2xl shadow-lg">
          <CardContent className="p-6 space-y-2">
            <h2 className="text-xl font-semibold text-yellow-500">
              Order #{order.id}
            </h2>
            <p className="text-gray-400 text-sm">Placed on {order.date}</p>
            <Badge
              className={`px-3 py-1 rounded-full ${
                order.status === "delivered"
                  ? "bg-green-600"
                  : order.status === "pending"
                  ? "bg-yellow-600"
                  : "bg-red-600"
              }`}
            >
              {order.status}
            </Badge>
          </CardContent>
        </Card>

        {/* Tracking Progress */}
        <Card className="bg-gray-900 border border-gray-700 rounded-2xl shadow-lg">
            <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 text-yellow-500">
                Order Tracking
                </h3>
                <div className="flex items-center justify-between relative">
                {["Pending", "Shipped", "Out for Delivery", "Delivered"].map(
                    (step, index) => {
                    const isCompleted =
                        [
                        "pending",
                        "shipped",
                        "out_for_delivery",
                        "delivered",
                        ].indexOf(order.status.toLowerCase()) >= index;

                    return (
                        <div
                        key={step}
                        className="flex flex-col items-center text-center w-1/4"
                        >
                        {/* Step Circle */}
                        <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                            isCompleted ? "bg-green-500" : "bg-gray-600"
                            }`}
                        >
                            {isCompleted ? "✓" : index + 1}
                        </div>

                        {/* Step Label */}
                        <p
                            className={`text-sm ${
                            isCompleted ? "text-white" : "text-gray-500"
                            }`}
                        >
                            {step}
                        </p>

                        {/* Connecting Line */}
                        {index < 3 && (
                            <div
                            className={`absolute top-4 h-1 ${
                                isCompleted ? "bg-green-500" : "bg-gray-600"
                            }`}
                            style={{
                                left: `${(index + 1) * 25 - 12.5}%`,
                                width: "25%",
                            }}
                            ></div>
                        )}
                        </div>
                    );
                    }
                )}
                </div>
            </CardContent>
        </Card>


        {/* Items */}
        <Card className="bg-gray-900 border border-gray-700 rounded-2xl shadow-lg">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-yellow-500">
              Items
            </h3>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center border-b border-gray-700 pb-2"
                >
                  <p>
                    {item.name} × {item.quantity}
                  </p>
                  <p className="font-medium">₹{item.price}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Delivery & Payment */}
        <Card className="bg-gray-900 border border-gray-700 rounded-2xl shadow-lg">
          <CardContent className="p-6 space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-yellow-500">
                Delivery Mode
              </h3>
              <p className="text-gray-300 capitalize">{order.deliveryMode}</p>
              {order.deliveryMode === "delivery" && order.address && (
                <p className="text-gray-400 text-sm mt-1">
                  Address: {order.address}
                </p>
              )}
            </div>

            <div>
              <h3 className="text-lg font-semibold text-yellow-500">
                Payment Method
              </h3>
              <p className="text-gray-300">{order.paymentMethod}</p>
            </div>
          </CardContent>
        </Card>

        {/* Total */}
        <Card className="bg-gray-900 border border-gray-700 rounded-2xl shadow-lg">
          <CardContent className="p-6 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-yellow-500">Total</h3>
            <p className="text-xl font-bold">₹{order.total}</p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
