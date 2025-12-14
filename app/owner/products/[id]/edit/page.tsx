"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";
import { ArrowLeft, Upload } from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { toast } from "sonner"

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params; // product id
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    id: "",
    shopid: "",
    name: "",
    description: "",
    price: "",
    stock: "",
    low_stock_threshold: "",
  });

  useEffect(() => {
    const resp = fetch(`http://localhost:8080/api/product/${id}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data.data);
        setFormData(data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch product:", err);
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogout = async () =>{
    localStorage.removeItem("token")
    localStorage.removeItem("_rle")
    toast.success("Logged out successfully")
    setTimeout((): void => {
      router.push("/login")
    }, 500)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
      alert("Product updated successfully! (Replace with backend API call)");
    router.push("/owner/products");
  };

  if (loading) return (
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
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
          <p className="text-gray-400">Loading product...</p>
        </div>
      </div>
    </ProtectedRoute>
  );

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
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="outline"
          className="text-white border-gray-600 hover:bg-gray-800 rounded-xl"
          onClick={() => router.push("/owner/products")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <h1 className="text-3xl font-bold text-yellow-500">Edit Product</h1>
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
            <label className="block mb-2 text-sm font-semibold">Product Name</label>
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="rounded-xl bg-gray-800 text-white border-gray-700"
            />
          </div>

          {/* Price */}
          <div>
            <label className="block mb-2 text-sm font-semibold">Price (₹)</label>
            <Input
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              required
              className="rounded-xl bg-gray-800 text-white border-gray-700"
            />
          </div>

          {/* Stock */}
          <div>
            <label className="block mb-2 text-sm font-semibold">Stock Quantity</label>
            <Input
              name="stock"
              type="number"
              value={formData.stock}
              onChange={handleChange}
              required
              className="rounded-xl bg-gray-800 text-white border-gray-700"
            />
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label className="block mb-2 text-sm font-semibold">Description</label>
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              className="rounded-xl bg-gray-800 text-white border-gray-700 h-28"
            />
          </div>

        </div>

        {/* Submit Button */}
        <div className="flex justify-end mt-8">
          <Button
            type="submit"
            className="bg-yellow-500 text-black font-semibold px-6 py-3 rounded-xl hover:opacity-90"
          >
            Update Product
          </Button>
        </div>
      </motion.form>
        </div>
      </div>
    </ProtectedRoute>
  );
}
