"use server";

import { httpClient } from "@/lib/httpClient";

export interface IReview {
  id: string;
  listingId: string;
  studentId: string;
  rating: number;
  comment: string;
  student: {
    id: string;
    name: string;
    avatar?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ICreateReviewInput {
  listingId: string;
  rating: number;
  comment: string;
}

export interface IUpdateReviewInput {
  rating?: number;
  comment?: string;
}

// ─── Public ───────────────────────────────────────────────────────────────────

export const getReviewsByListing = async (listingId: string) => {
  try {
    const response = await httpClient.get<IReview[]>(
      `/reviews/listing/${listingId}`
    );
    return response;
  } catch (error) {
    console.error("Error fetching reviews:", error);
    throw error;
  }
};

// ─── Student ──────────────────────────────────────────────────────────────────

export const createReview = async (payload: ICreateReviewInput) => {
  try {
    const response = await httpClient.post<IReview>("/reviews", payload);
    return response;
  } catch (error) {
    console.error("Error creating review:", error);
    throw error;
  }
};

export const getMyReviews = async () => {
  try {
    const response = await httpClient.get<IReview[]>("/reviews/my-reviews");
    return response;
  } catch (error) {
    console.error("Error fetching my reviews:", error);
    throw error;
  }
};

export const updateReview = async (id: string, payload: IUpdateReviewInput) => {
  try {
    const response = await httpClient.patch<IReview>(`/reviews/${id}`, payload);
    return response;
  } catch (error) {
    console.error("Error updating review:", error);
    throw error;
  }
};

export const deleteReview = async (id: string) => {
  try {
    const response = await httpClient.delete<null>(`/reviews/${id}`);
    return response;
  } catch (error) {
    console.error("Error deleting review:", error);
    throw error;
  }
};