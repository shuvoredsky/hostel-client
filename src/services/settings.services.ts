"use server";

import { httpClient } from "@/lib/httpClient";

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
    const response = await httpClient.get<ISiteSettings>("/settings");
    return response;
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