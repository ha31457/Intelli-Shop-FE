"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner"
import ProtectedRoute from "@/components/ProtectedRoute"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"


interface CartItem {
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  totalPrice: number;
}

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setLoading(true);

    fetch("http://localhost:8080/cart", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((response) => {
        if (response.success) {
          setCart(response.data);
        } else {
          console.error("Failed to fetch cart:", response.message);
        }
      })
      .catch(() => {
        setCart([
          {
            productId: 1,
            productName: "Luxury Leather Jacket",
            quantity: 1,
            price: 249.99,
            totalPrice: 249.99,
          },
        ]);
      })
      .finally(() => setLoading(false));
  }, []);
  const updateQuantity = (productId: number, delta: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.productId === productId
          ? {
              ...item,
              quantity: Math.max(1, item.quantity + delta),
              totalPrice: item.price * Math.max(1, item.quantity + delta),
            }
          : item
      )
    );
  };

  const removeItem = (productId: number) => {
    fetch(`http://localhost:8080/cart/${productId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
    .then((res) => res.json())
    .then((response) => {
      if (response.success) {
        toast.success("Item removed from cart successfully!");
        setCart((prev) => prev.filter((item) => item.productId !== productId));
      } else {
        console.error("Failed to remove item from cart:", response.message);
      }
    })
    .catch((error) => {
      console.error("Error removing item from cart:", error);
    });
  };

  const handleLogout = async () =>{
    localStorage.removeItem("token")
    localStorage.removeItem("_rle")
    toast.success("Logged out successfully")
    setTimeout((): void => {
      router.push("/login")
    }, 500)
  }

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  if (cart.length === 0) {
    return (
      <ProtectedRoute allowedRoles={["CUSTOMER"]}>
        <div className="min-h-screen bg-gradient-to-br from-[#1e293b] via-[#0f172a] to-black text-white">
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
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)]">
          <img
            src="/EmptyCart.png"
            alt="Empty Cart"
            className="w-32 md:w-40 mb-6 opacity-70"
          />
          <h2 className="text-2xl font-semibold text-yellow-500 mb-4">
            Your cart is empty
          </h2>
          <Button
            className="bg-yellow-500 text-black rounded-2xl hover:opacity-90"
            onClick={() => router.push("/customer/browse-shop")}
          >
            Browse Shops
          </Button>
        </div>
      </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={["CUSTOMER"]}>
      <div className="min-h-screen bg-gradient-to-br from-[#1e293b] via-[#0f172a] to-black text-white px-6 pb-12">
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
      <h1 className="text-3xl font-bold text-yellow-500 text-center mb-10">
        My Cart
      </h1>

      <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {/* Left: Cart Items */}
        <div className="md:col-span-2 space-y-6">
          {cart.map((item, index) => (
            <motion.div
              key={item.productName}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Card className="bg-gray-900 border border-gray-700 rounded-2xl shadow-md p-4 flex items-center gap-4">
                {/* Product Image */}
                <img
                  src="https://via.placeholder.com/100x100.png?text=Product"
                  alt={item.productName}
                  className="w-24 h-24 object-cover rounded-xl border border-gray-700"
                />

                {/* Details */}
                <CardContent className="flex-1">
                  <h2 className="font-semibold text-lg text-white mb-2">
                    {item.productName}
                  </h2>
                  <p className="text-yellow-500 font-medium mb-3">
                    ₹{item.price.toFixed(2)}
                  </p>

                  {/* Quantity Selector */}
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      className="rounded-2xl border-gray-700 text-white"
                      onClick={() => updateQuantity(item.productId, -1)}
                    >
                      -
                    </Button>
                    <span className="px-2">{item.quantity}</span>
                    <Button
                      variant="outline"
                      className="rounded-2xl border-gray-700 text-white"
                      onClick={() => updateQuantity(item.productId, 1)}
                    >
                      +
                    </Button>
                  </div>
                </CardContent>

                {/* Subtotal + Remove */}
                <div className="flex flex-col items-end gap-3">
                  <p className="text-yellow-400 font-semibold">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </p>
                  <Button
                    variant="outline"
                    className="rounded-2xl border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                    onClick={() => removeItem(item.productId)}
                  >
                    Remove
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Right: Summary */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-gray-900 border border-gray-700 rounded-2xl shadow-lg p-6 sticky top-20">
            <h2 className="text-xl font-bold text-yellow-500 mb-4">
              Order Summary
            </h2>
            <div className="space-y-2 text-gray-300 mb-6">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Taxes & Fees</span>
                <span>₹{(subtotal * 0.05).toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-700 pt-3 flex justify-between text-yellow-400 font-semibold">
                <span>Total</span>
                <span>₹{(subtotal * 1.05).toFixed(2)}</span>
              </div>
            </div>

            {/* Actions */}
            <Button 
              className="w-full bg-yellow-500 text-black rounded-2xl hover:opacity-90 mb-3"
              onClick={() => router.push("/customer/place-order")}>
              Proceed to Checkout
            </Button>
            <Button
              variant="outline"
              className="w-full border-yellow-500 text-yellow-500 rounded-2xl hover:bg-yellow-500 hover:text-black"
              onClick={() => router.push("/customer/browse-shop")}
            >
              Continue Shopping
            </Button>
          </Card>
        </motion.div>
      </div>
    </div>
    </ProtectedRoute>
  );
}
