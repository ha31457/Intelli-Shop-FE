// app/customer/product/[id]/page.tsx
"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { toast } from "sonner"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation";



interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  image?: string;
}

//TODO: Match the product interface with backend response
export default function ProductDetailsPage() {
  // const router = useRouter();
  const searchParams = useSearchParams();
  const productParam = searchParams.get("product");
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (productParam) {
      try {
        setProduct(JSON.parse(decodeURIComponent(productParam)));
      } catch (err) {
        console.error("Failed to parse product:", err);
      }
    }
  }, [productParam]);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1e293b] via-[#0f172a] to-black text-gray-400">
        Loading product details...
      </div>
    );
  }

  const handleAddToCart = async (product: Product, quantity: number) => {
  const token = localStorage.getItem("token");

  try {
    const res = await fetch("http://localhost:8080/cart/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        productId: product.id,
        quantity: quantity,
      }),
    });

    const response = await res.json();

    if (response.success) {
      console.log("Item added to cart:", response.data);
      toast.success("Item added to cart successfully!" );
    } else {
      console.error("Add to cart failed:", response.message);
      toast.error("Failed to add item to cart.");
    }
  } catch (err) {
    console.error("Error adding to cart:", err);
    toast.error("Something went wrong. Please try again.");
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
    <div className="min-h-screen bg-gradient-to-br from-[#1e293b] via-[#0f172a] to-black text-white px-6 py-12">
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
      {/* Product Showcase */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="grid md:grid-cols-2 gap-10 max-w-6xl mx-auto"
      >
        {/* Left - Product Image */}
        <div>
          <img
            src={
              product.image ||
              "https://via.placeholder.com/600x400.png?text=No+Image" // Design an image of opened box with the logo and name of IntelliShop on it...
            }
            alt={product.name}
            className="rounded-2xl shadow-lg border border-gray-700 w-full object-cover"
          />
        </div>

        {/* Right - Product Info */}
        <Card className="bg-gray-900 border border-gray-700 rounded-2xl shadow-md p-6">
          <CardContent className="space-y-4">
            <h1 className="text-2xl font-bold text-yellow-500">
              {product.name}
            </h1>
            <p className="text-gray-300">{product.description}</p>
            <p className="text-3xl font-semibold text-yellow-500">
              ₹{product.price}
            </p>
            <p>
              {product.stock > 0 ? (
                <span className="text-green-400">In Stock</span>
              ) : (
                <span className="text-red-400">Out of Stock</span>
              )}
            </p>

            {/* Quantity Selector */}
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                className="rounded-2xl border-gray-700 text-white"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              >
                -
              </Button>
              <span className="px-3">{quantity}</span>
              <Button
                variant="outline"
                className="rounded-2xl border-gray-700 text-white"
                onClick={() => setQuantity((q) => q + 1)}
              >
                +
              </Button>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mt-6">
              <Button className="bg-yellow-500 text-black rounded-2xl flex-1 hover:opacity-90" onClick={() => handleAddToCart(product, quantity)}>
                Add to Cart
              </Button>
              <Button
                variant="outline"
                className="border-yellow-500 text-yellow-500 rounded-2xl flex-1 hover:bg-yellow-500 hover:text-black"
                //TODO: implement the buy now-function and redirect to place order page and just have this product in the order summary...
              >
                Buy Now
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Tabs Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="max-w-6xl mx-auto mt-12"
      >
        <Tabs defaultValue="description" className="w-full">
          <TabsList className="bg-yellow-500 border border-gray-700 rounded-2xl text-black">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="specs">Specifications</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="text-gray-300 p-4">
            <p>{product.description}</p>
          </TabsContent>
          <TabsContent value="specs" className="text-gray-300 p-4">
            <p>Specifications will go here...</p>
          </TabsContent>
          <TabsContent value="reviews" className="text-gray-300 p-4">
            <p>No reviews yet...</p>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
