// app/customer/place-order/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

//TODO: Refactor the things to match the backend structure.
export default function PlaceOrderPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [address, setAddress] = useState<String>("");
  const [deliveryMode, setDeliveryMode] = useState("Home Delivery");
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const router = useRouter();

  useEffect(() => {
    const token = sessionStorage.getItem("token");

    // Fetch cart
    fetch("http://localhost:8080/cart", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) setCart(res.data);
      });

    // Fetch addresses
    const userString = sessionStorage.getItem("user");
    if(userString){
      const user = JSON.parse(userString);
      setAddress(user.address || "");
    }
  }, []);

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

    const token = sessionStorage.getItem("token");

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1e293b] via-[#0f172a] to-black text-white px-8 py-12">
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
  );
}
