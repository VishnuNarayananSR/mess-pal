"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { getMessInfo, getMenuItems } from "@/lib/supabase";
import PageContainer from "@/components/layout/PageContainer";
import { FaUtensils, FaStar, FaPhone } from "react-icons/fa";

export default function HomePage() {
  const [messInfo, setMessInfo] = useState<any>(null);
  const [featuredItems, setFeaturedItems] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [info, menuItems] = await Promise.all([
          getMessInfo(),
          getMenuItems(),
        ]);

        setMessInfo(info);

        // Get a random selection of menu items to feature
        const availableItems = menuItems.filter((item) => item.is_available);
        const shuffled = [...availableItems].sort(() => 0.5 - Math.random());
        setFeaturedItems(shuffled.slice(0, 3));
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <PageContainer>
        <div className="flex justify-center items-center min-h-screen">
          <p className="text-xl">Loading...</p>
        </div>
      </PageContainer>
    );
  }

  return (
    <>
      <section className="relative h-96 md:h-screen max-h-[600px] bg-gray-900 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/images/hero-bg.jpg')",
            opacity: 0.4,
          }}
        />
        <div className="container mx-auto px-4 h-full flex items-center relative z-10">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                {messInfo?.name || "Food Mess"}
              </h1>
              <p className="text-xl text-gray-200 mb-6">
                {messInfo?.description ||
                  "Delicious homemade food at affordable prices."}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/menu"
                  className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-md transition-colors"
                >
                  View Menu
                </Link>
                {messInfo?.phone && (
                  <a
                    href={`tel:${messInfo.phone}`}
                    className="flex items-center border border-white text-white px-6 py-3 rounded-md hover:bg-white hover:text-gray-900 transition-colors"
                  >
                    <FaPhone className="mr-2" />
                    Call Us
                  </a>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Items Section */}
      <section className="py-16 bg-gray-50">
        <PageContainer>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Featured Items
            </h2>
            <p className="text-gray-600">Try our most popular dishes</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredItems.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="h-48 overflow-hidden">
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <FaUtensils className="text-gray-400 text-4xl" />
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex justify-between mb-2">
                    <h3 className="text-lg font-semibold">{item.name}</h3>
                    <span className="text-orange-500 font-bold">
                      ₹{item.price.toFixed(2)}
                    </span>
                  </div>
                  {item.description && (
                    <p className="text-gray-600 text-sm mb-4">
                      {item.description}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/menu"
              className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-md transition-colors"
            >
              Explore Full Menu
            </Link>
          </div>
        </PageContainer>
      </section>

      {/* About Us Section */}
      <section className="py-16">
        <PageContainer>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="rounded-lg overflow-hidden">
                <div className="bg-gray-200 h-64 md:h-80">
                  {/* Replace with actual image */}
                  <div className="w-full h-full flex items-center justify-center">
                    <img
                      src="/images/food-mess.jpg"
                      alt="Food Mess Image"
                      className="w-full h-full object-cover flex items-center justify-center text-gray-400 text-2xl"
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                About Our Mess
              </h2>
              <p className="text-gray-600 mb-4">
                Welcome to {messInfo?.name || "our food mess"}, where we serve
                delicious, homemade food that reminds you of the comfort of
                home. Our mess has been serving quality meals since our
                establishment.
              </p>
              <p className="text-gray-600 mb-6">
                We take pride in using fresh ingredients and traditional recipes
                to create meals that are both nutritious and satisfying. Our
                dedicated team works hard to ensure every dish meets our high
                standards.
              </p>

              {messInfo?.phone && (
                <div className="flex items-center mb-4">
                  <FaPhone className="text-orange-500 mr-2" />
                  <span>
                    Call us:{" "}
                    <a
                      href={`tel:${messInfo.phone}`}
                      className="text-orange-500 hover:underline"
                    >
                      {messInfo.phone}
                    </a>
                  </span>
                </div>
              )}

              <Link
                href="/reviews"
                className="inline-flex items-center text-orange-500 hover:text-orange-600"
              >
                <FaStar className="mr-1" /> Check our reviews
              </Link>
            </motion.div>
          </div>
        </PageContainer>
      </section>
    </>
  );
}
