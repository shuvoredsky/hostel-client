import { createClient } from "@supabase/supabase-js";
import browserClient from "@/lib/browserClient";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

let tokenPromise: Promise<string> | null = null;

export const getSupabaseToken = async (): Promise<string> => {
  if (tokenPromise) return tokenPromise;

  tokenPromise = (async () => {
    try {
      const response = await browserClient.get("/chat/realtime-token");
      const token = response.data?.data?.token;
      if (!token) throw new Error("Token not found");
      return token;
    } catch (err) {
      tokenPromise = null;
      throw err;
    }
  })();

  return tokenPromise;
};

export const clearSupabaseToken = () => {
  tokenPromise = null;
};

export const getSupabaseClient = async () => {
  try {
    const token = await getSupabaseToken();
    supabase.realtime.setAuth(token);
  } catch (err) {
    console.error("Failed to set Supabase Realtime auth token:", err);
  }
  return supabase;
};
