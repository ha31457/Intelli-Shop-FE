// app/customer/shop/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

interface Shop {
  id: number;
  ownerId: number;
  name: string;
  address: string;
  shop_type: string;
  description: string;
  avg_rating?: number;
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image?: string;
}

export default function ShopDetailsPage() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const [shop, setShop] = useState<Shop | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const router = useRouter();

  useEffect(() => {
    // decode shop passed from BrowseShopsPage
    const shopParam = searchParams.get("shop");
    if (shopParam) {
      try {
        setShop(JSON.parse(decodeURIComponent(shopParam)));
      } catch (error) {
        console.error("Failed to parse shop:", error);
      }
    }

    const token = sessionStorage.getItem("token");

    // Fetch products only
    fetch(`http://localhost:8080/${id}/products`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((response) => {
        if (response.success) {
          setProducts(response.data);
        } else {
          console.error("Failed to fetch products:", response.message);
        }
      })
      .catch(() =>
        setProducts([
          {
            id: 1,
            name: "Classic T-Shirt",
            description: "Cotton unisex T-shirt.",
            price: 499,
          },
          {
            id: 2,
            name: "Denim Jeans",
            description: "Slim fit blue jeans.",
            price: 1299,
          },
          {
            id: 3,
            name: "Sneakers",
            description: "Comfortable running sneakers.",
            price: 2499,
          },
        ])
      );
  }, [id, searchParams]);

  const handleViewProduct = (product: Product) => {
    const encodedProduct = encodeURIComponent(JSON.stringify(product));
    router.push(`/customer/product/${product.id}?product=${encodedProduct}`);
};

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1e293b] via-[#0f172a] to-black text-white px-8 py-12">
      {shop ? (
        <>
          {/* Shop Info */}
          <div className="max-w-4xl mx-auto mb-12">
            <Card className="rounded-2xl shadow-lg bg-gray-900 border border-gray-700">
              <CardHeader>
                <CardTitle className="text-3xl font-bold text-yellow-500">
                  {shop.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 mb-2">{shop.description}</p>
                <p className="text-sm text-gray-400">
                  📍 {shop.address} | 🏷 {shop.shop_type}
                </p>
                {shop.avg_rating && (
                  <p className="text-sm text-yellow-400 mt-2">
                    ⭐ {shop.avg_rating.toFixed(1)} / 5
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Products Section */}
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-semibold text-yellow-500">Products</h2>
            <Input
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-1/3 rounded-xl bg-gray-900 text-white border-gray-700 placeholder-gray-400"
            />
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="rounded-2xl shadow-lg bg-gray-900 border border-gray-700 hover:shadow-2xl transition-all duration-300">
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold text-white">
                        {product.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-300 line-clamp-2">
                        {product.description}
                      </p>
                      <p className="text-yellow-400 font-bold mt-3">
                        ₹{product.price}
                      </p>
                      <Button className="mt-4 w-full rounded-xl bg-yellow-400 hover:opacity-90 transition" onClick={handleViewProduct.bind(null, product)}>
                        View Details
                      </Button>
                      <Button className="mt-4 w-full rounded-xl bg-yellow-500 hover:opacity-90 transition">
                        Add to Cart
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            ) : (
              <p className="text-gray-400 col-span-full text-center">
                No products found.
              </p>
            )}
          </div>
        </>
      ) : (
        <p className="text-center text-gray-400">Loading shop details...</p>
      )}
    </div>
  );
}
