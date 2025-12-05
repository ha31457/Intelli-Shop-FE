"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowLeft, Edit, Trash } from "lucide-react";

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  category: string;
  description: string;
  image?: string;
}

export default function ViewProductPage() {
  const router = useRouter();
  const params = useParams();   // ✅ call hook inside component
  const id = params?.id as string; // ✅ get id safely

  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    async function fetchProduct() {
      // Replace with API call
      const data: Product = {
        id: Number(id),
        name: "Luxury Cotton Shirt",
        price: 1200,
        stock: 25,
        category: "clothing",
        description: "A premium cotton shirt with a modern fit.",
        image: "https://via.placeholder.com/300x300.png?text=Product+Image",
      };
      setProduct(data);
      setLoading(false);
    }
    if (id) fetchProduct();
  }, [id]);

  if (loading) return <p className="text-center text-gray-400">Loading product...</p>;
  if (!product) return <p className="text-center text-red-500">Product not found</p>;

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
            onClick={() => alert("Delete product API here")}
          >
            <Trash className="mr-2 h-4 w-4" /> Delete
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
          {/* Image */}
          <div className="flex-shrink-0">
            <img
              src={product.image}
              alt={product.name}
              className="w-64 h-64 object-cover rounded-xl border border-gray-700"
            />
          </div>

          {/* Info */}
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-yellow-500 mb-4">{product.name}</h2>
            <p className="text-lg text-gray-300 mb-3">₹ {product.price}</p>
            <p className="text-sm text-gray-400 mb-3">Category: {product.category}</p>
            <p className="text-sm text-gray-400 mb-3">Stock: {product.stock}</p>
            <p className="text-gray-300 mt-4">{product.description}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
