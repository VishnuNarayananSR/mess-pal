"use client";
import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

//Props
interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url?: string;
  category: string;
  is_available: boolean;
  dietary_info?: string[];
}

interface MenuSectionProps {
  category: string;
  items: MenuItem[];
}

const MenuSection: React.FC<MenuSectionProps> = ({ category, items }) => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  // Format price to currency
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="mb-12"
    >
      <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">
        {category}
      </h2>

      <motion.div
        variants={containerVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {items.map((item) => (
          <motion.div
            key={item.id}
            variants={itemVariants}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            {item.image_url && (
              <div className="relative h-48 w-full">
                <Image
                  src={item.image_url}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-medium text-gray-900">
                  {item.name}
                </h3>
                <span className="text-orange-600 font-semibold">
                  {formatPrice(item.price)}
                </span>
              </div>

              {item.description && (
                <p className="text-gray-600 text-sm mb-3">{item.description}</p>
              )}

              {item.dietary_info && item.dietary_info.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {item.dietary_info.map((info, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-xs rounded-full text-gray-600"
                    >
                      {info}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  );
};

export default MenuSection;
