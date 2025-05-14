"use client";

import { useState } from "react";
import { FaLeaf, FaUtensils } from "react-icons/fa";
import { motion } from "framer-motion";
import Image from "next/image";
interface MenuItemProps {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  image_url?: string;
  is_vegetarian: boolean;
  is_available: boolean;
}

export default function MenuCard({ item }: { item: MenuItemProps }) {
  const [imageError, setImageError] = useState(false);

  if (!item.is_available) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
    >
      <div className="relative h-48 overflow-hidden">
        {item.image_url && !imageError ? (
          <Image
            width={500}
            height={500}
            src={item.image_url}
            alt={item.name}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <FaUtensils className="text-gray-400 text-4xl" />
          </div>
        )}

        {/* Category tag */}
        <div className="absolute top-3 left-3 bg-orange-500 text-white px-2 py-1 rounded-md text-xs font-medium">
          {item.category}
        </div>

        {/* Vegetarian indicator */}
        {item.is_vegetarian && (
          <div className="absolute top-3 right-3 bg-green-500 text-white p-1 rounded-full">
            <FaLeaf className="text-sm" />
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
          <span className="text-orange-500 font-bold">
            ₹{item.price.toFixed(2)}
          </span>
        </div>

        {item.description && (
          <p className="text-gray-600 text-sm">{item.description}</p>
        )}
      </div>
    </motion.div>
  );
}
