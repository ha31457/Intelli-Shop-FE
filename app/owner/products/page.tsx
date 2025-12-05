"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Edit, Eye, Trash2, Plus } from "lucide-react";
import path from "path";

interface Product {
  id: number;
  shopid: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  low_stock_threshold: number;
}

export default function ProductListPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const ShopId = localStorage.getItem("shopId") || "";
        const path = `http://localhost:8080/${ShopId}/products`; // TODO: Replace with actual shop ID
        const resp = await fetch(path, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }, 
        });
        const data = await resp.json();
        console.log(data);
        if(!resp.ok) throw new Error("Failed to fetch products");
        setProducts(data.data);
      } catch (error) {
        // fallback to mock data or handle error
        setProducts([
          {
            id: 1,
            shopid: 1,
            name: "Premium T-Shirt",
            description: "Luxury cotton T-shirt",
            price: 999,
            stock: 20,
            low_stock_threshold: 5
          },
          {
            id: 2,
            shopid: 1,
            name: "Stylish Sneakers",
            description: "Comfortable everyday wear",
            price: 2999,
            stock: 10,
            low_stock_threshold: 3
          },
        ]);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1e293b] via-[#0f172a] to-black text-white px-6 py-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-yellow-500">My Products</h1>
        <Button
          className="bg-yellow-500 text-black font-semibold hover:opacity-90 rounded-xl"
          onClick={() => router.push("/owner/products/add")}
        >
          <Plus className="mr-2 h-5 w-5" /> Add Product
        </Button>
      </div>

      {/* Search */}
      <div className="flex justify-center mb-8">
        <Input
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-1/3 rounded-xl bg-gray-900 text-white border-gray-700 placeholder-gray-400"
        />
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <p className="text-gray-400 text-center">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Card className="bg-gray-900 border border-gray-700 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-yellow-500">
                    {product.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <img
                    src={product.imageUrl || "https://via.placeholder.com/300"}
                    alt={product.name}
                    className="w-full h-40 object-cover rounded-xl mb-4"
                  />
                  <p className="text-sm text-gray-400 line-clamp-2 mb-2">
                    {product.description}
                  </p>
                  <p className="text-sm text-gray-300 mb-1">
                    ₹{product.price} | Stock: {product.stock}
                  </p>
                  <p className="text-sm text-gray-400 mb-4">
                    Category: {product.category}
                  </p>

                  <div className="flex justify-between">
                    <Button
                      size="sm"
                      className="bg-yellow-500 text-black rounded-xl hover:opacity-90"
                      onClick={() => router.push(`/owner/products/${product.id}/edit`)}
                    >
                      <Edit className="h-4 w-4 mr-1" /> Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-white border-gray-600 hover:bg-gray-800 rounded-xl"
                      onClick={() => router.push(`/owner/products/${product.id}`)}
                    >
                      <Eye className="h-4 w-4 mr-1" /> View
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="rounded-xl"
                      onClick={() => alert("Delete product logic here")}
                    >
                      <Trash2 className="h-4 w-4 mr-1" /> Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
