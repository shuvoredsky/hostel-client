"use server";

import { httpClient } from "@/lib/httpClient";
import {
  IListing,
  IListingFilters,
  ICreateListingInput,
  IUpdateListingInput,
} from "@/types/listing.types";
import { ApiResponse } from "@/types/api.types";

// ─── Public ───────────────────────────────────────────────────────────────────

export const getAllListings = async (filters?: IListingFilters) => {
  try {
    const response = await httpClient.get<IListing[]>("/listings", {
      params: filters as Record<string, unknown>,
    });
    return response;
  } catch (error) {
    console.error("Error fetching listings:", error);
    throw error;
  }
};

export const getSingleListing = async (id: string) => {
  try {
    const response = await httpClient.get<IListing>(`/listings/${id}`);
    return response;
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