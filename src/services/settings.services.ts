"use server";

import axios from "axios";
import { httpClient } from "@/lib/httpClient";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
if (!API_BASE_URL) {
  throw new Error("API_BASE_URL is not defined in environment variables");
}

export interface IBanner {
  id: string;
  title: string;
  image: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ISiteSettings {
  id: string;
  logo?: string;
  banners: IBanner[];
  createdAt: string;
  updatedAt: string;
}

export interface IUpdateBannerInput {
  title?: string;
  order?: number;
  isActive?: boolean;
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