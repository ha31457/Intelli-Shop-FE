"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";

interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  type?: "order" | "stock" | "system";
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    // only fetch notifications from backend which have status as unread...
    fetch("http://localhost:8080/owner/notifications", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((response) => {
        if (response.success) {
          setNotifications(response.data);
        } else {
          console.error("Failed to fetch notifications:", response.message);
        }
      })
      .catch(() =>
        setNotifications([
          {
            id: 1,
            title: "New Order Received",
            message: "Order #1234 has been placed by Riya Kapoor.",
            time: "5 min ago",
            type: "order",
          },
          {
            id: 2,
            title: "Stock Low Alert",
            message: "Product ‘Blue Denim Jacket’ has only 2 items left.",
            time: "20 min ago",
            type: "stock",
          },
          {
            id: 3,
            title: "System Maintenance",
            message:
              "Scheduled maintenance at 2:00 AM tonight. Expect minor downtime.",
            time: "2 hrs ago",
            type: "system",
          },
        ])
      )
      .finally(() => setLoading(false));
  }, []);

  return (
    <ProtectedRoute allowedRoles={["OWNER"]}>
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900 text-white px-8 py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-3">
          <Bell className="text-yellow-400 w-7 h-7" />
          <h1 className="text-3xl font-bold text-yellow-400">Notifications</h1>
        </div>
        <Button
            className="bg-yellow-500 hover:bg-yellow-600 text-black rounded-xl transition"
            onClick={async () => {
                try {
                const token = localStorage.getItem("token");

                // Replace with your actual API endpoint
                // set the state of the notification to read in the db and at the time of fetching the notifications only fetch the unread notifications...
                const res = await fetch("http://localhost:8080/owner/notifications/clear", {
                    method: "POST", 
                    headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                    },
                });

                const data = await res.json();

                if (data.success) {
                    setNotifications([]); // Clear UI instantly
                } else {
                    console.error("Failed to clear notifications:", data.message);
                }
                } catch (error) {
                console.error("Error clearing notifications:", error);
                }
            }}
        >
  Clear All
</Button>

      </div>

      {/* Notifications Section */}
      {loading ? (
        <p className="text-gray-400 text-center mt-20">Loading notifications...</p>
      ) : notifications.length === 0 ? (
        <p className="text-gray-500 text-center mt-20">No new notifications</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {notifications.map((n, i) => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
            >
              <Card className="rounded-2xl bg-gray-900 border border-gray-800 hover:border-yellow-500/40 shadow-lg hover:shadow-yellow-500/10 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-yellow-400 text-lg">
                    {n.title}
                    {n.type === "order" && (
                      <span className="text-xs bg-yellow-500/20 text-yellow-300 px-2 py-0.5 rounded-full">
                        Order
                      </span>
                    )}
                    {n.type === "stock" && (
                      <span className="text-xs bg-red-500/20 text-red-300 px-2 py-0.5 rounded-full">
                        Stock
                      </span>
                    )}
                    {n.type === "system" && (
                      <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full">
                        System
                      </span>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-300 mt-1">{n.message}</p>
                  <p className="text-xs text-gray-500 mt-3">{n.time}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
    </ProtectedRoute>
  );
}
