import { createClient } from "@supabase/supabase-js";
import browserClient from "@/lib/browserClient";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

let tokenPromise: Promise<string> | null = null;
let lastFetchedTime = 0;
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour cache

export const getSupabaseToken = async (): Promise<string> => {
  const now = Date.now();
  if (tokenPromise && now - lastFetchedTime < CACHE_DURATION) {
    return tokenPromise;
  }

  tokenPromise = (async () => {
    try {
      const response = await browserClient.get("/chat/realtime-token");
      const token = response.data?.data?.token;
      if (!token) throw new Error("Token not found");
      lastFetchedTime = Date.now();
      return token;
    } catch (err) {
      tokenPromise = null;
      lastFetchedTime = 0;
      throw err;
    }
  })();

  return tokenPromise;
};

export const clearSupabaseToken = () => {
  tokenPromise = null;
  lastFetchedTime = 0;
};

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
  global: {
    // Dynamic token provider for all requests (including REST and Realtime)
    headers: {},
  },
  accessToken: async () => {
    try {
      return await getSupabaseToken();
    } catch (err) {
      console.error("Supabase dynamic accessToken provider error:", err);
      return "";
    }
  },
});

export const getSupabaseClient = async () => {
  try {
    const token = await getSupabaseToken();
    supabase.realtime.setAuth(token);
  } catch (err) {
    console.error("Failed to set Supabase Realtime auth token:", err);
  }
  return supabase;
};
