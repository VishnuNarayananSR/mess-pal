"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { FaUtensils, FaBars, FaTimes, FaPhone } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { getMessInfo } from "@/lib/supabase";
import Image from "next/image";

export default function Navbar() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [messInfo, setMessInfo] = useState<any>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fetchMessInfo = async () => {
      const info = await getMessInfo();
      setMessInfo(info);
    };

    fetchMessInfo();

    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-white shadow-md py-2" : "bg-transparent py-4"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo and Brand */}
          <Link href="/" className="flex items-center">
            <FaUtensils className="text-orange-500 mr-2 text-2xl" />
            <span className="font-bold text-xl text-gray-800">Food Mess</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/" className="nav-link">
              Home
            </Link>
            <Link href="/menu" className="nav-link">
              Menu
            </Link>
            <Link href="/reviews" className="nav-link">
              Reviews
            </Link>

            {messInfo?.phone && (
              <a
                href={`tel:${messInfo.phone}`}
                className="flex items-center text-orange-500 hover:text-orange-600"
              >
                <FaPhone className="mr-2" />
                {messInfo.phone}
              </a>
            )}

            {session ? (
              <div className="flex items-center space-x-3">
                <Image
                  width={32}
                  height={32}
                  src={session.user?.image || "/images/default-avatar.png"}
                  alt={session.user?.name || "User"}
                  className="w-8 h-8 rounded-full text-xs"
                />
                <button
                  onClick={() => signOut()}
                  className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => signIn("google")}
                className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-colors"
              >
                Sign In
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden text-gray-700" onClick={toggleMenu}>
            {isOpen ? (
              <FaTimes className="h-6 w-6" />
            ) : (
              <FaBars className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white"
          >
            <div className="px-4 py-5 space-y-4">
              <Link href="/" className="block nav-link" onClick={closeMenu}>
                Home
              </Link>
              <Link href="/menu" className="block nav-link" onClick={closeMenu}>
                Menu
              </Link>
              <Link
                href="/reviews"
                className="block nav-link"
                onClick={closeMenu}
              >
                Reviews
              </Link>

              {messInfo?.phone && (
                <a
                  href={`tel:${messInfo.phone}`}
                  className="flex items-center text-orange-500 hover:text-orange-600"
                  onClick={closeMenu}
                >
                  <FaPhone className="mr-2" />
                  {messInfo.phone}
                </a>
              )}

              {session ? (
                <div className="pt-2">
                  <div className="flex items-center space-x-3 mb-3">
                    <Image
                      width={32}
                      height={32}
                      src={session.user?.image || "/images/default-avatar.png"}
                      alt={session.user?.name || "User"}
                      className="w-8 h-8 rounded-full"
                    />
                    <span className="text-gray-800">{session.user?.name}</span>
                  </div>
                  <button
                    onClick={() => {
                      signOut();
                      closeMenu();
                    }}
                    className="w-full bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    signIn("google");
                    closeMenu();
                  }}
                  className="w-full bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-colors"
                >
                  Sign In
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
