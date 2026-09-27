import browserClient from "@/lib/browserClient";
import { ApiResponse } from "@/types/api.types";
import { IListing } from "@/types/listing.types";

export const createListing = async (formData: FormData) => {
  const response = await browserClient.post<ApiResponse<IListing>>(
    "/listings",
    formData
  );
  return response.data;
};

export const updateListing = async (id: string, formData: FormData) => {
  const response = await browserClient.patch<ApiResponse<IListing>>(
    `/listings/owner/${id}`,
    formData
  );
  return response.data;
};

export const getMyListings = async () => {
  const response = await browserClient.get<ApiResponse<IListing[]>>(
    "/listings/owner/my-listings"
  );
  return response.data;
};

export const deleteListing = async (id: string) => {
  const response = await browserClient.delete<ApiResponse<null>>(
    `/listings/owner/${id}`
  );
  return response.data;
};
