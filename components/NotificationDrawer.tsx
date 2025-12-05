"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Bell, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";


interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
}

export default function NotificationDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  // Dummy notifications (replace with real data fetching)
  const [notifications] = useState<Notification[]>([
    {
      id: 1,
      title: "New Order Received",
      message: "You have a new order for 2 T-Shirts from StyleStore.",
      time: "2 min ago",
    },
    {
      id: 2,
      title: "Low Stock Alert",
      message: "Product 'Denim Jacket' has low stock (3 remaining).",
      time: "15 min ago",
    },
  ]);

  return (
    <>
      {/* Bell Button */}
      <Button
        variant="ghost"
        size="icon"
        className="relative text-yellow-400 hover:text-yellow-300"
        onClick={() => setIsOpen(true)}
      >
        <Bell className="w-6 h-6" />
        {notifications.length > 0 && (
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-yellow-400 rounded-full animate-pulse" />
        )}
      </Button>

      {/* Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            {/* Drawer Panel */}
            <motion.div
              className="fixed top-0 right-0 h-full w-full sm:w-96 bg-gradient-to-br from-gray-900 via-gray-950 to-black border-l border-gray-800 z-50 shadow-2xl flex flex-col rounded-l-2xl overflow-hidden"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 250, damping: 30 }}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-gray-900/60">
                <h2 className="text-lg font-semibold text-yellow-400">
                  Notifications
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-yellow-400"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Notifications List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-900/40 rounded-2xl">
                {notifications.map((n) => (
                  <motion.div
                    key={n.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="bg-gray-800/80 border border-gray-700 rounded-xl p-4 hover:bg-gray-700/80 transition shadow-sm"
                  >
                    <h3 className="text-sm font-semibold text-yellow-400">
                      {n.title}
                    </h3>
                    <p className="text-gray-300 text-sm mt-1 break-words">
                      {n.message}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">{n.time}</p>
                  </motion.div>
                ))}

                {notifications.length === 0 && (
                  <p className="text-gray-500 text-center mt-10">
                    No new notifications
                  </p>
                )}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-gray-800 bg-gray-900/60 flex justify-center">
                <Button
                  variant="outline"
                  className="border-yellow-500 text-yellow-400 hover:bg-yellow-500 hover:text-black transition"
                  onClick={() => {
                    setIsOpen(false);  // close the drawer first
                    router.push("/owner/notifications");  // navigate to full page
                  }}
                >
                  View All Notifications
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
