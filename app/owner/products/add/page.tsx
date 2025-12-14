"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";
import { ArrowLeft, Upload } from "lucide-react";
import { toast } from "sonner";

export default function AddProductPage() {
  const router = useRouter();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1e293b] via-[#0f172a] to-black text-white px-6 py-10">
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
  );
}
