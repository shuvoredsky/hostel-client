"use server";

import axios from "axios";
import { httpClient } from "@/lib/httpClient";
import {
  IListing,
  IListingFilters,
  ICreateListingInput,
  IUpdateListingInput,
} from "@/types/listing.types";
import { ApiResponse } from "@/types/api.types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
if (!API_BASE_URL) {
  throw new Error("API_BASE_URL is not defined in environment variables");
}

// ─── Public ───────────────────────────────────────────────────────────────────

export const getAllListings = async (filters?: IListingFilters) => {
  try {
    const response = await axios.get<{ success: boolean; message: string; data: IListing[]; meta?: { total: number; page: number; limit: number; totalPages: number } }>(
      `${API_BASE_URL}/listings`,
      { params: filters }
    );
    return {
      data: response.data.data,
      meta: response.data.meta || { total: 0, page: 1, limit: 9, totalPages: 0 },
      success: response.data.success,
      message: response.data.message,
    };
  } catch (error) {
    console.error("Error fetching listings:", error);
    throw error;
  }
};

export const getSingleListing = async (id: string) => {
  try {
    const response = await axios.get<{ success: boolean; message: string; data: IListing }>(
      `${API_BASE_URL}/listings/${id}`
    );
    return {
      data: response.data.data,
      success: response.data.success,
      message: response.data.message,
    };
  } catch (error) {
    console.error("Error fetching listing:", error);
    throw error;
  }
};

// ─── Owner ────────────────────────────────────────────────────────────────────

export const createListing = async (formData: FormData) => {
  try {
    const response = await httpClient.post<IListing>("/listings", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response;
  } catch (error) {
    console.error("Error creating listing:", error);
    throw error;
  }
};

export const getMyListings = async () => {
  try {
    const response = await httpClient.get<IListing[]>(
      "/listings/owner/my-listings"
    );
    return response;
  } catch (error) {
    console.error("Error fetching my listings:", error);
    throw error;
  }
};

export const updateListing = async (id: string, formData: FormData) => {
  try {
    const response = await httpClient.patch<IListing>(
      `/listings/owner/${id}`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response;
  } catch (error) {
    console.error("Error updating listing:", error);
    throw error;
  }
};

export const deleteListing = async (id: string) => {
  try {
    const response = await httpClient.delete<null>(`/listings/owner/${id}`);
    return response;
  } catch (error) {
    console.error("Error deleting listing:", error);
    throw error;
  }
};

// ─── Admin ────────────────────────────────────────────────────────────────────

export const getAllListingsForAdmin = async () => {
  try {
    const response = await httpClient.get<IListing[]>("/listings/admin/all");
    return response;
  } catch (error) {
    console.error("Error fetching admin listings:", error);
    throw error;
  }
};

export const approveListing = async (id: string) => {
  try {
    const response = await httpClient.patch<IListing>(
      `/listings/admin/${id}/approve`,
      {}
    );
    return response;
  } catch (error) {
    console.error("Error approving listing:", error);
    throw error;
  }
};

export const rejectListing = async (id: string) => {
  try {
    const response = await httpClient.patch<IListing>(
      `/listings/admin/${id}/reject`,
      {}
    );
    return response;
  } catch (error) {
    console.error("Error rejecting listing:", error);
    throw error;
  }
};