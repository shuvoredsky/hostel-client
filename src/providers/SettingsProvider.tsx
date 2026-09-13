"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import browserClient from "@/lib/browserClient";

const LOGO_CACHE_KEY = "dhakastay_logo_url";

interface ISettingsContext {
  logoUrl: string | null;
  setLogoUrl: (url: string | null) => void;
  refetchSettings: () => Promise<void>;
}

const SettingsContext = createContext<ISettingsContext | undefined>(undefined);

export default function SettingsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [logoUrl, setLogoUrlState] = useState<string | null>(null);

  // Load from localStorage in useEffect after hydration
  useEffect(() => {
    try {
      const cached = localStorage.getItem(LOGO_CACHE_KEY);
      if (cached) {
        setLogoUrlState(cached);
      }
    } catch {
      // ignore
    }
  }, []);

  const setLogoUrl = useCallback((url: string | null) => {
    setLogoUrlState(url);
    try {
      if (url) {
        localStorage.setItem(LOGO_CACHE_KEY, url);
      } else {
        localStorage.removeItem(LOGO_CACHE_KEY);
      }
    } catch {
      // ignore storage errors
    }
  }, []);

  const fetchSettings = useCallback(async () => {
    try {
      const response = await browserClient.get("/settings");
      const fetchedLogo = response?.data?.data?.settings?.logoUrl || null;
      if (fetchedLogo) {
        setLogoUrl(fetchedLogo);
      }
    } catch {
      // Keep cached logo on error
    }
  }, [setLogoUrl]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  return (
    <SettingsContext.Provider
      value={{
        logoUrl,
        setLogoUrl,
        refetchSettings: fetchSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => {
  const context = useContext(SettingsContext);
  return context;
};
