"use server";

import axios from "axios";
import { httpClient } from "@/lib/httpClient";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
if (!API_BASE_URL) {
  throw new Error("API_BASE_URL is not defined in environment variables");
}

export type BannerMediaType = 'IMAGE' | 'VIDEO';

export interface IBanner {
  id: string;
  title?: string;
  imageUrl: string;
  videoUrl?: string | null;
  mediaType?: BannerMediaType;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ISiteSettingsData {
  id: string;
  logoUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ISiteSettings {
  settings: ISiteSettingsData | null;
  banners: IBanner[];
}

export interface IUpdateBannerInput {
  title?: string;
  order?: number;
  isActive?: boolean;
  mediaType?: BannerMediaType;
  imageUrl?: string;
  videoUrl?: string | null;
}

// ─── Public ───────────────────────────────────────────────────────────────────

export const getSiteSettings = async () => {
  try {
    const response = await axios.get<{
  success: boolean;
  message: string;
  data: ISiteSettings;
}>(`${API_BASE_URL}/settings`);

    return {
      data: response.data.data,
      success: response.data.success,
      message: response.data.message,
    };
  } catch (error) {
    console.error("Error fetching site settings:", error);
    throw error;
  }
};

// ─── Admin ────────────────────────────────────────────────────────────────────

export const updateLogo = async (formData: FormData) => {
  try {
    const response = await httpClient.patch<ISiteSettings>(
      "/settings/logo",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response;
  } catch (error) {
    console.error("Error updating logo:", error);
    throw error;
  }
};

export const addBanner = async (formData: FormData) => {
  try {
    const response = await httpClient.post<IBanner>(
      "/settings/banner",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response;
  } catch (error) {
    console.error("Error adding banner:", error);
    throw error;
  }
};

export const addVideoBanner = async (formData: FormData) => {
  try {
    const response = await httpClient.post<IBanner>(
      "/settings/banner/video",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response;
  } catch (error) {
    console.error("Error adding video banner:", error);
    throw error;
  }
};

export const getAllBannersForAdmin = async () => {
  try {
    const response = await httpClient.get<IBanner[]>("/settings/admin/banners");
    return response;
  } catch (error) {
    console.error("Error fetching admin banners:", error);
    throw error;
  }
};

export const updateBanner = async (
  id: string,
  payload: IUpdateBannerInput
) => {
  try {
    const response = await httpClient.patch<IBanner>(
      `/settings/banner/${id}`,
      payload
    );
    return response;
  } catch (error) {
    console.error("Error updating banner:", error);
    throw error;
  }
};

export const deleteBanner = async (id: string) => {
  try {
    const response = await httpClient.delete<null>(`/settings/banner/${id}`);
    return response;
  } catch (error) {
    console.error("Error deleting banner:", error);
    throw error;
  }
};

export const reorderBanners = async (payload: { orders: { id: string; order: number }[] }) => {
  try {
    const response = await httpClient.patch<IBanner[]>(
      "/settings/banner/reorder",
      payload
    );
    return response;
  } catch (error) {
    console.error("Error reordering banners:", error);
    throw error;
  }
};