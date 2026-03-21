"use server";

import { httpClient } from "@/lib/httpClient";
import { IUser } from "@/types/auth.types";
import { IUserFilters } from "@/types/user.types";

// ─── Admin ────────────────────────────────────────────────────────────────────

export const getAllUsers = async (filters?: IUserFilters) => {
  try {
    const response = await httpClient.get<IUser[]>("/users", {
      params: filters as Record<string, unknown>,
    });
    return response;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const getSingleUser = async (id: string) => {
  try {
    const response = await httpClient.get<IUser>(`/users/${id}`);
    return response;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};

export const blockUser = async (id: string) => {
  try {
    const response = await httpClient.patch<IUser>(
      `/users/${id}/block`,
      {}
    );
    return response;
  } catch (error) {
    console.error("Error blocking user:", error);
    throw error;
  }
};

export const unblockUser = async (id: string) => {
  try {
    const response = await httpClient.patch<IUser>(
      `/users/${id}/unblock`,
      {}
    );
    return response;
  } catch (error) {
    console.error("Error unblocking user:", error);
    throw error;
  }
};

export const deleteUser = async (id: string) => {
  try {
    const response = await httpClient.delete<null>(`/users/${id}`);
    return response;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};

export const blockListing = async (id: string) => {
  try {
    const response = await httpClient.patch<null>(
      `/users/listing/${id}/block`,
      {}
    );
    return response;
  } catch (error) {
    console.error("Error blocking listing:", error);
    throw error;
  }
};