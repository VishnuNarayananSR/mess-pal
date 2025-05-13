"use client";

import { useState, useEffect } from "react";
import { getMenuItems } from "@/lib/supabase";
import PageContainer from "@/components/layout/PageContainer";
import MenuSection from "@/components/ui/MenuSection";
import { motion } from "framer-motion";
import { FaSearch } from "react-icons/fa";

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const items = await getMenuItems();
        setMenuItems(items);

        // Extract unique categories
        const uniqueCategories = Array.from(
          new Set(items.map((item) => item.category))
        ) as string[];

        setCategories(uniqueCategories);
      } catch (error) {
        console.error("Error fetching menu items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, []);

  // Filter items based on search term
  const filteredItems = menuItems.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.description &&
        item.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Group items by category for filtered results
  const categorizedItems = categories
    .map((category) => ({
      category,
      items: filteredItems.filter(
        (item) => item.category === category && item.is_available
      ),
    }))
    .filter((group) => group.items.length > 0);

  if (loading) {
    return (
      <PageContainer>
        <div className="flex justify-center items-center min-h-screen">
          <p className="text-xl">Loading menu...</p>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="Our Menu"
      subtitle="Explore our diverse selection of delicious meals"
      className="py-12"
    >
      {/* Search Box */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 max-w-md mx-auto"
      >
        <div className="relative">
          <input
            type="text"
            placeholder="Search our menu..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full py-3 pl-4 pr-10 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <FaSearch className="absolute right-3 top-3.5 text-gray-400" />
        </div>
      </motion.div>

      {filteredItems.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-xl text-gray-600">No items match your search.</p>
        </div>
      ) : (
        categorizedItems.map(({ category, items }) => (
          <MenuSection key={category} category={category} items={items} />
        ))
      )}
    </PageContainer>
  );
}
