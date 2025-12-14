// app/owner/profile/page.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Building2, MapPin, Upload, X, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

type Shop = {
  id: number;
  owner_id: number;
  name: string;
  address: string;
  shop_type: string;
  description: string;
  avg_rating: number;
};

export default function OwnerShopProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Base state (what's saved on server)
  const [shop, setShop] = useState<Shop | null>(null);

  // Draft form state (what user edits)
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [shopType, setShopType] = useState("");

  // Media uploads (local previews)
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);

  const bannerInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const bannerPreview = useMemo(
    () => (bannerFile ? URL.createObjectURL(bannerFile) : null),
    [bannerFile]
  );
  const logoPreview = useMemo(
    () => (logoFile ? URL.createObjectURL(logoFile) : null),
    [logoFile]
  );

  useEffect(() => {
    const token = localStorage.getItem("token");

    // Fetch current shop profile (owner's shop)
    fetch("http://localhost:8080/getShopDetails", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((res) => {
        if (res?.success && res?.data) {
          const s: Shop = res.data;
          setShop(s);
          setName(s.name || "");
          setDescription(s.description || "");
          setAddress(s.address || "");
          setShopType(s.shop_type || "");
        } else {
          toast.error(res?.message || "Failed to load shop profile");
        }
      })
      .catch(() => {
        // Fallback demo data
        const demo: Shop = {
          id: 1,
          owner_id: 1,
          name: "Auric Atelier",
          description:
            "Curated luxury essentials with timeless aesthetics. Crafted for the discerning.",
          address: "12, Crescent Park, Indiranagar, Bengaluru, KA",
          shop_type: "Fashion",
          avg_rating: 4.5,
        };
        setShop(demo);
        setName(demo.name);
        setDescription(demo.description);
        setAddress(demo.address);
        setShopType(demo.shop_type);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("Shop name is required");
      return;
    }
    const payload = {
      name, 
      address,
      shop_type: shopType,
      description
    }

    setSaving(true);
    const token = localStorage.getItem("token");
    const shopId = localStorage.getItem("shopId")
    try {

      const res = await fetch(`http://localhost:8080/${shopId}/update`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Profile updated successfully");
        setShop(data.data);
        setBannerFile(null);
        setLogoFile(null);
      } else {
        toast.error(data.message || "Failed to update profile");
      }
    } catch (e) {
      toast.error("Something went wrong while saving");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1e293b] via-[#0f172a] to-black text-white px-6 py-10">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-yellow-500">Shop Profile</h1>
          <p className="text-gray-400 mt-1">
            Manage and personalize how your shop appears to customers.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left: Preview */}
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-gray-900 border border-gray-700 rounded-2xl shadow-xl overflow-hidden">
            <CardContent className="p-0">
              {loading ? (
                <Skeleton className="h-40 w-full rounded-none" />
              ) : bannerPreview ? (
                <div className="relative">
                  <img
                    src={bannerPreview}
                    alt="Shop banner"
                    className="h-40 w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/70 via-transparent to-transparent" />
                </div>
              ) : (
                <div className="h-40 w-full bg-gray-800 flex items-center justify-center">
                  <ImageIcon className="w-8 h-8 text-gray-500" />
                </div>
              )}

              <div className="px-6 pb-6 -mt-10">
                <div className="flex items-end gap-4">
                  <div className="relative">
                    {loading ? (
                      <Skeleton className="w-20 h-20 rounded-2xl border border-gray-700" />
                    ) : logoPreview ? (
                      <img
                        src={logoPreview}
                        alt="Logo"
                        className="w-20 h-20 rounded-2xl object-cover border-4 border-[#0f172a]"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-2xl bg-gray-800 border-4 border-[#0f172a] flex items-center justify-center">
                        <Building2 className="w-8 h-8 text-gray-500" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    {loading ? (
                      <>
                        <Skeleton className="h-6 w-48 mb-2" />
                        <Skeleton className="h-4 w-72" />
                      </>
                    ) : (
                      <>
                        <h2 className="text-xl font-semibold">{name || "Your Shop Name"}</h2>
                        <p className="text-gray-400 text-sm">
                          {description || "Your short, premium tagline goes here."}
                        </p>
                      </>
                    )}
                  </div>
                </div>

                <div className="mt-6 grid gap-3 text-sm">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 mt-0.5 text-yellow-500" />
                    <span className="text-gray-300">
                      {address || "Add your business address"}
                    </span>
                  </div>
                  {shop && (
                    <>
                      <div className="flex items-center gap-3">
                        <Building2 className="w-4 h-4 text-yellow-500" />
                        <span className="text-gray-300">
                          Type: {shop.shop_type || "Not set"}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-yellow-500">★</span>
                        <span className="text-gray-300">
                          Rating: {shop.avg_rating?.toFixed(1) || "0.0"}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Right: Form */}
        <motion.div
          className="lg:col-span-3"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
        >
          <Card className="bg-gray-900 border border-gray-700 rounded-2xl shadow-xl">
            <CardContent className="p-6 space-y-8">
              {/* Basic Info */}
              <section className="space-y-4">
                <h3 className="text-lg font-semibold text-yellow-500">Basic Info</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="shop-name">Shop Name</Label>
                    <Input
                      id="shop-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g., Auric Atelier"
                      className="bg-gray-950 border-gray-700 text-white rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="shop-type">Shop Type</Label>
                    <Input
                      id="shop-type"
                      value={shopType}
                      onChange={(e) => setShopType(e.target.value)}
                      placeholder="e.g., Fashion, Electronics, Grocery"
                      className="bg-gray-950 border-gray-700 text-white rounded-xl"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Tell customers what makes your shop special..."
                      className="bg-gray-950 border-gray-700 text-white rounded-xl min-h-[100px]"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address">Business Address</Label>
                    <Textarea
                      id="address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Street, Area, City, State"
                      className="bg-gray-950 border-gray-700 text-white rounded-xl min-h-[80px]"
                    />
                  </div>
                </div>
              </section>

              {/* Media */}
              <section className="space-y-4">
                <h3 className="text-lg font-semibold text-yellow-500">Media</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Banner Upload */}
                  <div className="space-y-2">
                    <Label>Shop Banner</Label>
                    <div className="rounded-2xl border-2 border-dashed border-gray-700 bg-gray-950 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <Upload className="w-5 h-5 text-yellow-500" />
                          <span className="text-sm text-gray-300">
                            Upload a wide image (1600×400 recommended)
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {bannerFile && (
                            <Button
                              variant="outline"
                              className="rounded-xl border-gray-700 text-white"
                              onClick={() => setBannerFile(null)}
                            >
                              <X className="w-4 h-4 mr-1" /> Remove
                            </Button>
                          )}
                          <Button
                            className="rounded-xl bg-yellow-500 hover:opacity-90"
                            onClick={() => bannerInputRef.current?.click()}
                          >
                            Choose File
                          </Button>
                          <input
                            ref={bannerInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) setBannerFile(file);
                            }}
                          />
                        </div>
                      </div>
                      {bannerPreview && (
                        <div className="mt-4">
                          <img
                            src={bannerPreview}
                            alt="Banner preview"
                            className="w-full h-40 object-cover rounded-xl border border-gray-700"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Logo Upload */}
                  <div className="space-y-2">
                    <Label>Shop Logo</Label>
                    <div className="rounded-2xl border-2 border-dashed border-gray-700 bg-gray-950 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <Upload className="w-5 h-5 text-yellow-500" />
                          <span className="text-sm text-gray-300">
                            Upload a square image (512×512 recommended)
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {logoFile && (
                            <Button
                              variant="outline"
                              className="rounded-xl border-gray-700 text-white"
                              onClick={() => setLogoFile(null)}
                            >
                              <X className="w-4 h-4 mr-1" /> Remove
                            </Button>
                          )}
                          <Button
                            className="rounded-xl bg-yellow-500 hover:opacity-90"
                            onClick={() => logoInputRef.current?.click()}
                          >
                            Choose File
                          </Button>
                          <input
                            ref={logoInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) setLogoFile(file);
                            }}
                          />
                        </div>
                      </div>
                      {logoPreview && (
                        <div className="mt-4">
                          <img
                            src={logoPreview}
                            alt="Logo preview"
                            className="w-28 h-28 object-cover rounded-2xl border border-gray-700"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </section>

              {/* Actions (duplicate save at bottom for convenience) */}
              <div className="flex justify-end">
                <Button
                  onClick={handleSave}
                  disabled={saving || loading}
                  className="rounded-2xl bg-yellow-500 hover:opacity-90 transition px-5"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
