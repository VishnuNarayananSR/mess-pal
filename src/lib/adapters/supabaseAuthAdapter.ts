import { format, SupabaseAdapterOptions } from "@auth/supabase-adapter";
import { createClient } from "@supabase/supabase-js";
import {
  Adapter,
  AdapterUser,
  AdapterAccount,
  AdapterSession,
  VerificationToken,
} from "next-auth/adapters";

export function SupabaseAuthAdapter(
  url: string,
  secret: string,
  schema: string
): Adapter {
  const supabase = createClient(url, secret, {
    db: { schema },
    auth: { persistSession: false },
  });
  return {
    async createUser(user: AdapterUser) {
      const { data, error } = await supabase
        .from("users")
        .insert({
          ...user,
          emailVerified: user.emailVerified?.toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      return format<AdapterUser>(data);
    },
    async getUser(id) {
      const { data, error } = await supabase
        .from("users")
        .select()
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      if (!data) return null;

      return format<AdapterUser>(data);
    },
    async getUserByEmail(email) {
      const { data, error } = await supabase
        .from("users")
        .select()
        .eq("email", email)
        .maybeSingle();

      if (error) throw error;
      if (!data) return null;

      return format<AdapterUser>(data);
    },
    async getUserByAccount({ providerAccountId, provider }) {
      const { data, error } = await supabase
        .from("accounts")
        .select("users (*)")
        .match({ provider, providerAccountId })
        .maybeSingle();

      if (error) throw error;
      if (!data || !data.users) return null;

      return format<AdapterUser>(data.users);
    },
    async updateUser(user) {
      const { data, error } = await supabase
        .from("users")
        .update({
          ...user,
          emailVerified: user.emailVerified?.toISOString(),
        })
        .eq("id", user.id)
        .select()
        .single();

      if (error) throw error;

      return format<AdapterUser>(data);
    },
    async deleteUser(userId) {
      const { error } = await supabase.from("users").delete().eq("id", userId);

      if (error) throw error;
    },
    async linkAccount(account: AdapterAccount) {
      const { error } = await supabase.from("accounts").insert(account);

      if (error) throw error;
    },
    async unlinkAccount({ providerAccountId, provider }) {
      const { error } = await supabase
        .from("accounts")
        .delete()
        .match({ provider, providerAccountId });

      if (error) throw error;
    },
    async createSession({ sessionToken, userId, expires }) {
      const { data, error } = await supabase
        .from("sessions")
        .insert({ sessionToken, userId, expires: expires.toISOString() })
        .select()
        .single();

      if (error) throw error;

      return format<AdapterSession>(data);
    },
    async getSessionAndUser(sessionToken) {
      const { data, error } = await supabase
        .from("sessions")
        .select("*, users(*)")
        .eq("sessionToken", sessionToken)
        .maybeSingle();

      if (error) throw error;
      if (!data) return null;

      const { users: user, ...session } = data;

      return {
        user: format<AdapterUser>(user),
        session: format<AdapterSession>(session),
      };
    },
    async updateSession(session) {
      const { data, error } = await supabase
        .from("sessions")
        .update({
          ...session,
          expires: session.expires?.toISOString(),
        })
        .eq("sessionToken", session.sessionToken)
        .select()
        .single();

      if (error) throw error;

      return format<AdapterSession>(data);
    },
    async deleteSession(sessionToken) {
      const { error } = await supabase
        .from("sessions")
        .delete()
        .eq("sessionToken", sessionToken);

      if (error) throw error;
    },
    async createVerificationToken(token) {
      const { data, error } = await supabase
        .from("verification_tokens")
        .insert({
          ...token,
          expires: token.expires.toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      const { id, ...verificationToken } = data;

      return format<VerificationToken>(verificationToken);
    },
    async useVerificationToken({ identifier, token }) {
      const { data, error } = await supabase
        .from("verification_tokens")
        .delete()
        .match({ identifier, token })
        .select()
        .maybeSingle();

      if (error) throw error;
      if (!data) return null;

      const { id, ...verificationToken } = data;

      return format<VerificationToken>(verificationToken);
    },
  };
}
