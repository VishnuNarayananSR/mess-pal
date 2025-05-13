import { ReactNode } from "react";
import { motion } from "framer-motion";

interface PageContainerProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
}

export default function PageContainer({
  children,
  title,
  subtitle,
  className = "",
}: PageContainerProps) {
  return (
    <div className={`container mx-auto px-4 py-8 ${className}`}>
      {(title || subtitle) && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          {title && (
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
              {title}
            </h1>
          )}
          {subtitle && (
            <p className="mt-2 text-gray-600 max-w-2xl mx-auto">{subtitle}</p>
          )}
        </motion.div>
      )}
      {children}
    </div>
  );
}
