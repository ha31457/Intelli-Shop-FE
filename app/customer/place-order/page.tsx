// app/customer/place-order/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner"
import ProtectedRoute from "@/components/ProtectedRoute"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"


interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

//TODO: Refactor the things to match the backend structure.
export default function PlaceOrderPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [address, setAddress] = useState<string>("");
  const [deliveryMode, setDeliveryMode] = useState("Home Delivery");
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const router = useRouter();

  useEffect(() => {
    // Fetch user profile from backend API and set state
    const fetchProfile = async () => {
      let user = null
      try {
        const res = await fetch("http://localhost:8080/getUser", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        const data = await res.json()
        user = data.user
      } catch {
        toast.error("Failed to load user profile.")
      }
      if (user) {
        if (user.address) {
          setAddress(user.address)
        } else {
          setAddress("")
          toast.error("Address is missing from your profile.")
        }
      } else {
        toast.error("Failed to load user profile.")
        setTimeout(() => router.push("/login"), 600);
      }
    }
    fetchProfile()
  }, [])

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = deliveryMode === "Home Delivery" ? (subtotal > 1000 ? 0 : 50) : 0;
  const total = subtotal + shipping;

  const handlePlaceOrder = async () => {
    if (deliveryMode === "Home Delivery" && !address) {
      toast.error("Please select a delivery address");
      return;
    }

    if(address.length === 0){
      toast.error("Please add a delivery address first");
      return;
    }

    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:8080/api/place-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        deliveryMode,
        address: deliveryMode === "Home Delivery" ? address : null,
        paymentMethod,
      }),
    });

    const response = await res.json();

    if (response.success) {
      toast.success("Order placed successfully!");
      router.push("/customer/orders");
    } else {
      toast.error(response.message || "Failed to place order");
    }
  };

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
      <h1 className="text-3xl text-yellow-500 font-bold mb-10 text-center">Place Order</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Order Summary */}
        <Card className="md:col-span-2 bg-gray-900 border border-gray-700 rounded-2xl">
          <CardHeader>
            <CardTitle className="text-xl text-white">Order Summary</CardTitle>
          </CardHeader>
          <CardContent>
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex justify-between border-b border-gray-700 py-3"
              >
                <span>{item.name} × {item.quantity}</span>
                <span>₹{item.price * item.quantity}</span>
              </div>
            ))}
            <div className="mt-4 text-right">
              <p className="text-gray-400">Subtotal: ₹{subtotal}</p>
              <p className="text-gray-400">Shipping: ₹{shipping}</p>
              <p className="text-lg font-bold text-yellow-500">Total: ₹{total}</p>
            </div>
          </CardContent>
        </Card>

        {/* Delivery + Payment */}
        <Card className="bg-gray-900 border border-gray-700 rounded-2xl">
          <CardHeader>
            <CardTitle className="text-xl text-white">Delivery & Payment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Delivery Mode */}
            <div>
              <p className="mb-2 text-gray-300">Delivery Mode</p>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="Home Delivery"
                    checked={deliveryMode === "Home Delivery"}
                    onChange={(e) => setDeliveryMode(e.target.value)}
                  />
                  Home Delivery
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="Store Pickup"
                    checked={deliveryMode === "Store Pickup"}
                    onChange={(e) => setDeliveryMode(e.target.value)}
                  />
                  Store Pickup
                </label>
              </div>
            </div>

            {/* Address (only for Home Delivery) */}
            {deliveryMode === "Home Delivery" && (
            <div>
              <p className="mb-2 text-gray-300">Delivery Address</p>
              <div className="p-2 rounded-lg bg-gray-800 border border-gray-700 text-white">
                {address || "No address found"}
              </div>
              <p className="mt-2 text-sm text-orange-400">To change your address, please update it in your profile settings.</p>
            </div>
            )}


            {/* Payment */}
            <div>
              <p className="mb-2 text-gray-300">Payment Method</p>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="COD"
                    checked={paymentMethod === "COD"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  Cash on Delivery
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="UPI"
                    checked={paymentMethod === "UPI"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  UPI
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="Card"
                    checked={paymentMethod === "Card"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  Credit/Debit Card
                </label>
              </div>
            </div>

            <Button
              onClick={handlePlaceOrder}
              className="w-full rounded-xl bg-yellow-500 hover:opacity-90 transition"
            >
              Confirm & Place Order
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
    </ProtectedRoute>
  );
}
