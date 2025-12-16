"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function AddProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  interface Product {
    shopid: number;
    name: string;
    description: string;
    price: number;
     stock: number;
    low_stock_threshold: number;   
  }
  const [product, setProduct] = useState<Product>({
    shopid: parseInt(localStorage.getItem("shopId") || "0"),
    name: "",
    description: "",
    price: 0,
    stock: 0,
    low_stock_threshold: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProduct({ ...product, shopid: parseInt(localStorage.getItem("shopId") || "0") });
    console.log("product", product);
    setLoading(true);
    const resp = await fetch("http://localhost:8080/addProducts", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(product),
    });
    const { success, message, data } = await resp.json();
    if(success){
      toast.success(message);
      router.push("/owner/products");
    }else{
      toast.error(message);
      router.push("/owner/products/add");
    }
    setLoading(false);
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
    <ProtectedRoute allowedRoles={["OWNER"]}>
      <div className="min-h-screen bg-gradient-to-br from-[#1e293b] via-[#0f172a] to-black text-white pt-0">
        <header className="flex justify-between items-center px-8 py-4 border-b border-gray-800">
          <h1
            className="text-2xl font-extrabold text-yellow-500 cursor-pointer"
            onClick={() => router.push("/owner/dashboard")}
          >
            IntelliShop
          </h1>
          <nav>
            <ul className="flex gap-6 text-gray-300">
              <li
                className="hover:text-yellow-500 cursor-pointer"
                onClick={() => router.push("/owner/products")}
              >
                Products
              </li>
              <li
                className="hover:text-yellow-500 cursor-pointer"
                onClick={() => router.push("/owner/orders")}
              >
                Shop Orders
              </li>
              <li>    
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Avatar className="cursor-pointer">
                      <AvatarImage src="/Profile.png" />
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 p-2">
                    <DropdownMenuItem onClick={() => router.push("/owner/dashboard")}>
                      Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push("/owner/orders")}>
                      Shop Orders
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push("/owner/shop/profile")}>
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
        <div className="px-6 py-10">
      </div>    
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="outline"
          className="text-white border-gray-600 hover:bg-gray-800 rounded-xl"
          onClick={() => router.push("/owner/products")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <h1 className="text-3xl font-bold text-yellow-500">Add New Product</h1>
      </div>

      {/* Form */}
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-4xl mx-auto bg-gray-900 border border-gray-700 rounded-2xl shadow-xl p-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Product Name */}
          <div>
            <label className="block mb-2 text-sm font-semibold">Product Name <span className="text-red-500">*</span></label>
            <Input
              required
              value={product.name}
              onChange={(e) => setProduct({ ...product, name: e.target.value })}
              placeholder="Enter product name"
              className="rounded-xl bg-gray-800 text-white border-gray-700"
            />
          </div>

          {/* Price */}
          <div>
            <label className="block mb-2 text-sm font-semibold">Price (₹) <span className="text-red-500">*</span></label>
            <Input
              type="number"
              required
              value={product.price || ""}
              onChange={(e) => setProduct({ ...product, price: parseFloat(e.target.value) || 0 })}
              placeholder="Enter price"
              className="rounded-xl bg-gray-800 text-white border-gray-700"
            />
          </div>

          {/* Stock */}
          <div>
            <label className="block mb-2 text-sm font-semibold">Stock Quantity <span className="text-red-500">*</span></label>
            <Input
              type="number"
              required
              value={product.stock || ""}
              onChange={(e) => setProduct({ ...product, stock: parseInt(e.target.value) || 0 })}
              placeholder="Enter stock quantity"
              className="rounded-xl bg-gray-800 text-white border-gray-700"
            />
          </div>

          {/* Low Stock Threshold */}
          <div>
            <label className="block mb-2 text-sm font-semibold">Low Stock Threshold <span className="text-red-500">*</span></label>
            <Input
              type="number"
              required
              value={product.low_stock_threshold || ""}
              onChange={(e) => setProduct({ ...product, low_stock_threshold: parseInt(e.target.value) || 0 })}
              placeholder="Enter low stock threshold"
              className="rounded-xl bg-gray-800 text-white border-gray-700"
            />
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label className="block mb-2 text-sm font-semibold">Description <span className="text-red-500">*</span></label>
            <Textarea
              required
              value={product.description}
              onChange={(e) => setProduct({ ...product, description: e.target.value })}
              placeholder="Enter product description"
              className="rounded-xl bg-gray-800 text-white border-gray-700 h-28"
            />
          </div>

        </div>

        {/* Submit Button */}
        <div className="flex justify-end mt-8">
          <Button
            type="submit"
            className="bg-yellow-500 text-black font-semibold px-6 py-3 rounded-xl hover:opacity-90"
            disabled={loading}
          >
            Add Product
          </Button>
        </div>
      </motion.form>
    </div>
    </ProtectedRoute>
  );
}
