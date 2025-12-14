"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { toast } from "sonner"
import ProtectedRoute from "@/components/ProtectedRoute";

interface Product {
  id: number;
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: number;
  customerName: string;
  customerEmail: string;
  customerAddress?: string;
  deliveryMode: "DELIVERY" | "PICKUP";
  paymentMode: string;
  status: string;
  totalAmount: number;
  products: Product[];
}

export default function OrderDetailsPage() {
  const params = useSearchParams();
  const orderId = params.get("id");
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!orderId) return;

    fetch(`http://localhost:8080/api/getOrderDetails/${orderId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((response) => {
        if (response.success) {
          setOrder(response.data);
        } else {
          console.error("Failed to fetch order details:", response.message);
        }
      })
      .catch(() =>
        // fallback dummy order for UI testing
        setOrder({
          id: 101,
          customerName: "Rahul Mehta",
          customerEmail: "rahul.mehta@example.com",
          customerAddress: "123, MG Road, Bangalore",
          deliveryMode: "DELIVERY",
          paymentMode: "UPI",
          status: "Pending",
          totalAmount: 2499,
          products: [
            { id: 1, name: "Blue Denim Jacket", quantity: 1, price: 1499 },
            { id: 2, name: "White Cotton Shirt", quantity: 1, price: 1000 },
          ],
        })
      )
      .finally(() => setLoading(false));
  }, [orderId]);

  const handleStatusUpdate = (newStatus: string) => {
    if (!orderId) return;
    const token = localStorage.getItem("token");

    fetch(`http://localhost:8080/orders/${orderId}`, { //TODO: update the path for updating order status
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status: newStatus }), // TODO: change the body structure and match it with backend
    })
      .then((res) => res.json())
      .then((response) => {
        if (response.success) {
          toast.success(`Order status updated to ${newStatus}`);
          setOrder((prev) => (prev ? { ...prev, status: newStatus } : prev));
        } else {
          toast.error("Failed to update status");
        }
      })
      .catch(() => toast.error("Something went wrong"));
  };

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
    <ProtectedRoute allowedRoles={["OWNER"]}>
      <div className="min-h-screen bg-gradient-to-br from-[#1e293b] via-[#0f172a] to-black text-white px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl text-yellow-500 font-bold mb-8 text-center">
          Order Details
        </h1>

        <Card className="bg-gray-900 border border-gray-800 rounded-2xl shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-white">
              Order #{order.id}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Customer Info */}
            <div>
              <h2 className="text-lg font-semibold text-yellow-400 mb-2">
                Customer Details
              </h2>
              <p>👤 {order.customerName}</p>
              <p>📧 {order.customerEmail}</p>
              {order.deliveryMode === "DELIVERY" && (
                <p>🏠 {order.customerAddress}</p>
              )}
            </div>

            {/* Order Info */}
            <div>
              <h2 className="text-lg font-semibold text-yellow-400 mb-2">
                Order Information
              </h2>
              <p>💳 Payment Mode: {order.paymentMode}</p>
              <p>🚚 Delivery Mode: {order.deliveryMode}</p>
              <p>
                🕓 Status:{" "}
                <span className="font-semibold text-yellow-400">
                  {order.status}
                </span>
              </p>
              <p>💰 Total Amount: ₹{order.totalAmount}</p>
            </div>

            {/* Product List */}
            <div>
              <h2 className="text-lg font-semibold text-yellow-400 mb-2">
                Products Ordered
              </h2>
              <div className="space-y-3">
                {order.products.map((p) => (
                  <div
                    key={p.id}
                    className="flex justify-between bg-gray-800 px-4 py-3 rounded-xl"
                  >
                    <p>
                      {p.name} × {p.quantity}
                    </p>
                    <p>₹{p.price}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Status Update Buttons */}
            <div className="flex flex-wrap gap-3 pt-4">
              {["Pending", "Shipped", "Delivered", "Cancelled"].map((s) => (
                <Button
                  key={s}
                  onClick={() => handleStatusUpdate(s)}
                  className={`rounded-xl transition px-6 ${
                    order.status === s
                      ? "bg-yellow-500 text-black"
                      : "bg-gray-800 hover:bg-yellow-600"
                  }`}
                >
                  {s}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
    </ProtectedRoute>
  );
}
