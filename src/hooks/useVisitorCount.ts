import { useState, useEffect } from "react";

export function useVisitorCount() {
  const [visitorCount, setVisitorCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const updateVisitorCount = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/visit-count");

        if (!response.ok) {
          throw new Error("Failed to fetch visitor count");
        }

        const data = await response.json();
        setVisitorCount(data.count);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
        console.error("Error updating visitor count:", err);
      } finally {
        setLoading(false);
      }
    };

    updateVisitorCount();
  }, []);

  return { visitorCount, loading, error };
}
