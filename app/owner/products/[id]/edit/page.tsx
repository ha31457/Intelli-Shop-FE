"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

/** Product Interface */
interface Product {
  id: number;
  shopid: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  low_stock_threshold: number;
}

export default function EditProductPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<Product | null>(null);

  /** Read product from query params */
  useEffect(() => {
    const encodedProduct = searchParams.get("product");
    if (!encodedProduct) return;

    try {
      const decoded = decodeURIComponent(encodedProduct);
      const parsedProduct: Product = JSON.parse(decoded);
      setFormData(parsedProduct);
    } catch (error) {
      console.error("Invalid product data:", error);
      toast.error("Invalid product data");
    }
  }, [searchParams]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (!formData) return;

    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: name === "price" || name === "stock" || name === "low_stock_threshold"
        ? Number(value)
        : value,
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("_rle");
    toast.success("Logged out successfully");
    setTimeout(() => router.push("/login"), 500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    setSaving(true);
    e.preventDefault();
    console.log("Updated Product:", formData);
    const shopId = formData?.shopid;
    const productId = formData?.id;

    const resp = await fetch(`http://localhost:8080/${shopId}/products/${productId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData)
    });
    const data = await resp.json();
    if(data.success){
      toast.success("Product updated successfully!");
    }else{
      toast.error(data.message);
    }
    router.push("/owner/products");
  };

  if (!formData) {
    return (
      <ProtectedRoute allowedRoles={["OWNER"]}>
        <div className="min-h-screen flex items-center justify-center bg-black text-gray-400">
          Loading product...
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={["OWNER"]}>
      <div className="min-h-screen bg-gradient-to-br from-[#1e293b] via-[#0f172a] to-black text-white">
        {/* Header */}
        <header className="flex justify-between items-center px-8 py-4 border-b border-gray-800">
          <h1
            className="text-2xl font-extrabold text-yellow-500 cursor-pointer"
            onClick={() => router.push("/owner/dashboard")}
          >
            IntelliShop
          </h1>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="cursor-pointer">
                <AvatarImage src="/Profile.png" />
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
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
        </header>

        {/* Content */}
        <div className="px-6 py-10">
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="outline"
              onClick={() => router.push("/owner/products")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            <h1 className="text-3xl font-bold text-yellow-500">Edit Product</h1>
          </div>

          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto bg-gray-900 border border-gray-700 rounded-2xl p-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 text-sm font-semibold">
                  Product Name
                </label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-semibold">
                  Price (₹)
                </label>
                <Input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-semibold">
                  Stock Quantity
                </label>
                <Input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block mb-2 text-sm font-semibold">
                  Description
                </label>
                <Textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="flex justify-end mt-8">
              <Button type="submit" className="bg-yellow-500 text-black" disabled={saving}>
                {saving ? "Updating" : "Update Product"}
              </Button>
            </div>
          </motion.form>
        </div>
      </div>
    </ProtectedRoute>
  );
}
