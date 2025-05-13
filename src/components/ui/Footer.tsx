"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaFacebook,
  FaInstagram,
  FaTwitter,
} from "react-icons/fa";
import { getMessInfo } from "@/lib/supabase";
import { useVisitorCount } from "@/hooks/useVisitorCount";

export default function Footer() {
  const [messInfo, setMessInfo] = useState<any>(null);
  const { visitorCount, loading: countLoading } = useVisitorCount();

  useEffect(() => {
    const fetchMessInfo = async () => {
      const info = await getMessInfo();
      setMessInfo(info);
    };

    fetchMessInfo();
  }, []);

  if (!messInfo) {
    return (
      <footer className="bg-gray-800 text-white py-6">
        <div className="container mx-auto px-4">
          <p className="text-center">Loading...</p>
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div>
            <h3 className="text-xl font-semibold mb-4 border-b border-orange-500 pb-2">
              Contact Us
            </h3>
            <ul className="space-y-3">
              {messInfo.address && (
                <li className="flex items-start">
                  <FaMapMarkerAlt className="text-orange-500 mt-1 mr-3" />
                  <span>{messInfo.address}</span>
                </li>
              )}
              {messInfo.phone && (
                <li className="flex items-center">
                  <FaPhone className="text-orange-500 mr-3" />
                  <a
                    href={`tel:${messInfo.phone}`}
                    className="hover:text-orange-300 transition-colors"
                  >
                    {messInfo.phone}
                  </a>
                </li>
              )}
              {messInfo.email && (
                <li className="flex items-center">
                  <FaEnvelope className="text-orange-500 mr-3" />
                  <a
                    href={`mailto:${messInfo.email}`}
                    className="hover:text-orange-300 transition-colors"
                  >
                    {messInfo.email}
                  </a>
                </li>
              )}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold mb-4 border-b border-orange-500 pb-2">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="hover:text-orange-300 transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/menu"
                  className="hover:text-orange-300 transition-colors"
                >
                  Menu
                </Link>
              </li>
              <li>
                <Link
                  href="/reviews"
                  className="hover:text-orange-300 transition-colors"
                >
                  Reviews
                </Link>
              </li>
            </ul>
          </div>

          {/* Opening Hours and Social Media */}
          <div>
            <h3 className="text-xl font-semibold mb-4 border-b border-orange-500 pb-2">
              Hours & Connect
            </h3>

            {messInfo.opening_hours && (
              <div className="mb-4">
                <h4 className="font-medium mb-2">Opening Hours:</h4>
                <ul className="space-y-1">
                  {Object.entries(messInfo.opening_hours).map(
                    ([day, hours]: [string, any]) => (
                      <li key={day} className="flex justify-between">
                        <span className="capitalize">{day}:</span>
                        <span>{hours}</span>
                      </li>
                    )
                  )}
                </ul>
              </div>
            )}

            <div className="mt-4">
              <h4 className="font-medium mb-2">Connect With Us:</h4>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="text-white hover:text-orange-300 transition-colors"
                  aria-label="Facebook"
                >
                  <FaFacebook size={20} />
                </a>
                <a
                  href="#"
                  className="text-white hover:text-orange-300 transition-colors"
                  aria-label="Instagram"
                >
                  <FaInstagram size={20} />
                </a>
                <a
                  href="#"
                  className="text-white hover:text-orange-300 transition-colors"
                  aria-label="Twitter"
                >
                  <FaTwitter size={20} />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Visitor Count and Copyright */}
        <div className="mt-8 pt-6 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-gray-400 mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} {messInfo.name || "Food Mess"}.
            All rights reserved.
          </div>
          <div className="text-sm text-gray-400">
            {countLoading ? (
              "Loading visitor count..."
            ) : (
              <>
                Visitors:{" "}
                <span className="text-orange-400 font-medium">
                  {visitorCount.toLocaleString()}
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
