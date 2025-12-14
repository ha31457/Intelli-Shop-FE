// app/customer/browse-shops/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { toast } from "sonner"
import ProtectedRoute from "@/components/ProtectedRoute"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"


interface Shop {
  id: number;
  ownerId: number;
  name: string;
  address: string;
  shop_type: string;
  description: string;
  avg_rating?: number;
}

export default function BrowseShopsPage() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [search, setSearch] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:8080/shops", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((response) => {
        if (response.success) {
          setShops(response.data);
        } else {
          console.error("Failed to fetch shops:", response.message);
        }
      })
      .catch(() =>
        setShops([
          {
            id: 1,
            ownerId: 10,
            name: "Trendy Threads",
            address: "MG Road, Bangalore",
            shop_type: "Clothing",
            description: "Latest fashion wear for all ages.",
            avg_rating: 4.5,
          },
          {
            id: 2,
            ownerId: 12,
            name: "Book Haven",
            address: "Park Street, Kolkata",
            shop_type: "Books",
            description: "A paradise for book lovers.",
            avg_rating: 4.8,
          },
        ])
      )
      .finally(() => setLoading(false));
  }, []);

  const handleViewShop = (shop: Shop) => {
    const encodedShop = encodeURIComponent(JSON.stringify(shop));
    router.push(`/customer/shop/${shop.id}?shop=${encodedShop}`);
  };

  const filteredShops = shops.filter((shop) =>
    shop.name.toLowerCase().includes(search.toLowerCase())
  );

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
      <div className="min-h-screen bg-gradient-to-br from-[#1e293b] via-[#0f172a] to-black text-white px-8 pt-0">
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
        
      <h1 className="text-3xl text-yellow-500 font-bold mb-10 text-center">Browse Shops</h1>

        {/* Search */}
        <div className="flex justify-center mb-12 gap-2">
          <Input
            placeholder="Search shops..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-1/3 rounded-xl bg-gray-900 text-white border-gray-700 placeholder-gray-400"
          />
          <Button className="rounded-xl bg-yellow-500 hover:opacity-90 transition">
            Search
          </Button>
        </div>

      {loading ? (
        <p className="text-gray-400">Loading shops...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredShops.map((shop, index) => (
            <motion.div
              key={shop.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="rounded-2xl shadow-lg bg-gray-900 border border-gray-700 hover:shadow-2xl transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-white">
                    {shop.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-300 line-clamp-2 mb-3">
                    {shop.description}
                  </p>
                  <p className="text-sm text-gray-400 mb-2">
                    📍 {shop.address}
                  </p>
                  <p className="text-sm text-gray-400 mb-2">
                    🏷 {shop.shop_type}
                  </p>
                  {shop.avg_rating && (
                    <p className="text-sm text-yellow-400 mb-4">
                      ⭐ {shop.avg_rating.toFixed(1)} / 5
                    </p>
                  )}
                  <Button
                    className="w-full rounded-xl bg-yellow-500 hover:opacity-90 transition"
                    onClick={() => handleViewShop(shop)}
                  >
                    View Shop
                  </Button>
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
