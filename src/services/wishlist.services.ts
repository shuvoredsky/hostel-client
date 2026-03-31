import browserClient from "@/lib/browserClient";
import { IListing } from "@/types/listing.types";

export interface IWishlist {
  id: string;
  studentId: string;
  listingId: string;
  listing: IListing;
  createdAt: string;
}

export interface IWishlistStatus {
  isWishlisted: boolean;
}

export interface IWishlistCount {
  count: number;
}

// ─── Student ──────────────────────────────────────────────────────────────────

export const toggleWishlist = async (listingId: string) => {
  try {
    const response = await browserClient.post<IWishlist>(
      `/wishlist/toggle/${listingId}`,
      {}
    );
    return response;
  } catch (error) {
    console.error("Error toggling wishlist:", error);
    throw error;
  }
};

export const getMyWishlist = async () => {
  try {
    const response = await browserClient.get<IWishlist[]>(
      "/wishlist/my-wishlist"
    );
    return response;
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    throw error;
  }
};

export const checkWishlistStatus = async (listingId: string) => {
  try {
    const response = await browserClient.get<IWishlistStatus>(
      `/wishlist/status/${listingId}`
    );
    return response;
  } catch (error) {
    console.error("Error checking wishlist status:", error);
    throw error;
  }
};

// ─── Public ───────────────────────────────────────────────────────────────────

export const getListingWishlistCount = async (listingId: string) => {
  try {
    const response = await browserClient.get<IWishlistCount>(
      `/wishlist/count/${listingId}`
    );
    return response;
  } catch (error) {
    console.error("Error fetching wishlist count:", error);
    throw error;
  }
};