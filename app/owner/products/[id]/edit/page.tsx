"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";
import { ArrowLeft, Upload } from "lucide-react";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params; // product id
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "",
    category: "",
    description: "",
    image: "",
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Fetch product details (replace with backend API call)
  useEffect(() => {
    async function fetchProduct() {
      // Example dummy data → replace with actual API
      const product = {
        name: "Sample Product",
        price: "1200",
        stock: "10",
        category: "clothing",
        description: "A premium cotton shirt.",
        image: "",
      };

      setFormData(product);
      setImagePreview(product.image || null);
      setLoading(false);
    }
    fetchProduct();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCategoryChange = (value: string) => {
    setFormData({ ...formData, category: value });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setFormData({ ...formData, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Product updated successfully! (Replace with backend API call)");
    router.push("/owner/products");
  };

  if (loading) return <p className="text-center text-gray-400">Loading product...</p>;

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

          {/* Category */}
          <div>
            <label className="block mb-2 text-sm font-semibold">Category</label>
            <Select value={formData.category} onValueChange={handleCategoryChange}>
              <SelectTrigger className="rounded-xl bg-gray-800 text-white border-gray-700">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-700 text-white">
                <SelectItem value="clothing">Clothing</SelectItem>
                <SelectItem value="footwear">Footwear</SelectItem>
                <SelectItem value="accessories">Accessories</SelectItem>
                <SelectItem value="electronics">Electronics</SelectItem>
              </SelectContent>
            </Select>
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

          {/* Image Upload */}
          <div className="md:col-span-2">
            <label className="block mb-2 text-sm font-semibold">Product Image</label>
            <div className="flex items-center gap-6">
              <label className="flex flex-col items-center justify-center w-40 h-40 border-2 border-dashed border-gray-700 rounded-xl cursor-pointer hover:border-yellow-500">
                <Upload className="h-8 w-8 text-gray-400" />
                <span className="text-xs mt-2 text-gray-400">Upload</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              </label>
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-40 h-40 object-cover rounded-xl border border-gray-700"
                />
              )}
            </div>
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
  );
}
