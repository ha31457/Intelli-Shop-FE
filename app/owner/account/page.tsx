"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";

export default function AccountSettingsPage() {
  const [formData, setFormData] = useState({
    name: "Arjun Mehta",
    email: "arjun@trendythreads.com",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    // Handle update API call here
    console.log("Updated account info:", formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1e293b] via-[#0f172a] to-black text-white px-6 py-12 flex justify-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-3xl"
      >
        <h1 className="text-3xl font-bold text-yellow-500 mb-10 text-center">
          Account Settings
        </h1>

        {/* Profile Info Card */}
        <Card className="bg-gray-900/80 border border-gray-700 rounded-2xl shadow-2xl backdrop-blur-md mb-8">
          <CardHeader>
            <CardTitle className="text-xl text-yellow-500">Profile Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div>
              <label className="text-gray-300 text-sm mb-1 block">Full Name</label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="bg-gray-800 border-gray-700 text-white rounded-xl"
              />
            </div>

            <div>
              <label className="text-gray-300 text-sm mb-1 block">Email</label>
              <Input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="bg-gray-800 border-gray-700 text-white rounded-xl"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button
              onClick={handleSave}
              className="bg-yellow-500 hover:opacity-90 text-black rounded-xl font-semibold"
            >
              Save Changes
            </Button>
          </CardFooter>
        </Card>

        {/* Security Section */}
        <Card className="bg-gray-900/80 border border-gray-700 rounded-2xl shadow-2xl backdrop-blur-md mb-8">
          <CardHeader>
            <CardTitle className="text-xl text-yellow-500">Security</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div>
              <label className="text-gray-300 text-sm mb-1 block">New Password</label>
              <Input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter new password"
                className="bg-gray-800 border-gray-700 text-white rounded-xl"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button
              onClick={() => console.log("Password updated")}
              className="bg-yellow-500 hover:opacity-90 text-black rounded-xl font-semibold"
            >
              Update Password
            </Button>
          </CardFooter>
        </Card>

        {/* Danger Zone */}
        <Card className="bg-red-900/30 border border-red-700/40 rounded-2xl shadow-lg backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-xl text-red-400">Danger Zone</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400 mb-4">
              Deleting your account will permanently remove all your data including shop information and products.
            </p>
            <Button
              variant="destructive"
              className="bg-red-600 hover:bg-red-700 rounded-xl font-semibold"
              onClick={() => console.log("Account deleted")}
            >
              Delete Account
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
