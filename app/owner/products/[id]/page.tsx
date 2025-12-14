"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowLeft, Edit, Trash } from "lucide-react";
import { toast } from "sonner";

interface Product {
  id: number;
  shopid: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  low_stock_threshold: number;
}

export default function ViewProductPage() {
  const router = useRouter();
   const params = useParams();
  const id = params?.id as string | undefined;

  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<Product>();

  useEffect(() => {
    async function fetchProduct() {
      if (!id) {
        setLoading(false);
        return;
      }
      const resp = await fetch(`http://localhost:8080/api/product/${id}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await resp.json();
      console.log("fetch product data : ", data);
      setProduct(data.data);
      setLoading(false);
      // Replace with API call
      
    }
    fetchProduct();
  }, [id]);

  if (loading) return <p className="text-center text-gray-400">Loading product...</p>;
  if (!product) return <p className="text-center text-red-500">Product not found</p>;

  const deleteProduct = async (id: number) => {
    const shopId = localStorage.getItem("shopId");
    const resp = fetch(`http://localhost:8080/${shopId}/products/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
      },
    }).then(async (res) => await res.json())
    .then((data) => {
      console.log("delete product data : ", data);
      if(data.success){
        toast.success(data.message);
        router.push("/owner/products");
      }else{
        toast.error(data.message);
        router.push(`/owner/products/${id}`);
      }
    }).catch((err) => {
      console.error("Failed to delete product:", err);
      toast.error("Failed to delete product. Please try again.");
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1e293b] via-[#0f172a] to-black text-white px-6 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <Button
          variant="outline"
          className="text-white border-gray-600 hover:bg-gray-800 rounded-xl"
          onClick={() => router.push("/owner/products")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <div className="flex gap-3">
          <Button
            className="bg-yellow-500 text-black rounded-xl hover:opacity-90"
            onClick={() => router.push(`/owner/products/${product.id}/edit`)}
          >
            <Edit className="mr-2 h-4 w-4" /> Edit
          </Button>
          <Button
            variant="destructive"
            className="rounded-xl"
            onClick={() => deleteProduct(product.id)}
          >
            <Trash className="mr-2 h-4 w-4"/> Delete
          </Button>
        </div>
      </div>

      {/* Product Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-3xl mx-auto bg-gray-900 border border-gray-700 rounded-2xl shadow-xl p-8"
      >
        <div className="flex flex-col md:flex-row gap-8">
          {/* Info */}
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-yellow-500 mb-4">{product.name}</h2>
            <p className="text-lg text-gray-300 mb-3">₹ {product.price}</p>
            <p className="text-sm text-gray-400 mb-3">Low Stock Threshold: {product.low_stock_threshold}</p>
            <p className="text-sm text-gray-400 mb-3">Stock: {product.stock}</p>
            <p className="text-gray-300 mt-4">{product.description}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
