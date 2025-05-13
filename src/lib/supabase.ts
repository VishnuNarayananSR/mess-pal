import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// For server-side admin operations (requires service role key)
export const getSupabaseAdmin = () => {
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient(supabaseUrl, supabaseServiceKey);
};

// Helper functions for data operations
export async function getMenuItems() {
  const { data, error } = await supabase
    .from("menu_items")
    .select("*")
    .order("category", { ascending: true });

  if (error) {
    console.error("Error fetching menu items:", error);
    return [];
  }

  return data;
}

export async function getMessInfo() {
  const { data, error } = await supabase.from("mess_info").select("*").single();

  if (error) {
    console.error("Error fetching mess info:", error);
    return null;
  }

  return data;
}

export async function getReviews() {
  const { data, error } = await supabase
    .from("reviews")
    .select(
      `
      *,
      profiles:user_id (name, avatar_url)
    `
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching reviews:", error);
    return [];
  }

  return data;
}

export async function submitReview(
  userId: string,
  rating: number,
  comment: string
) {
  const { data, error } = await supabase
    .from("reviews")
    .insert([{ user_id: userId, rating, comment }])
    .select();

  if (error) {
    console.error("Error submitting review:", error);
    throw error;
  }

  return data[0];
}

export async function incrementVisitorCount() {
  const adminClient = getSupabaseAdmin();

  const { data: currentData } = await adminClient
    .from("visitor_count")
    .select("*")
    .single();

  // If no record exists, create one
  if (!currentData) {
    const { data, error } = await adminClient
      .from("visitor_count")
      .insert([{ count: 1 }])
      .select();

    if (error) {
      console.error("Error creating visitor count:", error);
      return 1;
    }

    return data[0].count;
  }

  // Otherwise, increment the existing count
  const { data, error } = await adminClient
    .from("visitor_count")
    .update({ count: currentData.count + 1, last_updated: new Date() })
    .eq("id", currentData.id)
    .select();

  if (error) {
    console.error("Error updating visitor count:", error);
    return currentData.count;
  }

  return data[0].count;
}

export async function getVisitorCount() {
  const { data, error } = await supabase
    .from("visitor_count")
    .select("count")
    .single();

  if (error) {
    console.error("Error fetching visitor count:", error);
    return 0;
  }

  return data.count;
}
