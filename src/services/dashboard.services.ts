"use server";

import { httpClient } from "@/lib/httpClient";

export type DashboardRange = "daily" | "weekly" | "monthly" | "yearly" | "all";

export interface IAdminDashboard {
  totalUsers: number;
  totalListings: number;
  totalBookings: number;
  totalPayments: number;
  totalRevenue: number;
  totalCommission: number;
  recentBookings: any[];
  recentPayments: any[];
  stats: any[];
}

export interface IOwnerDashboard {
  totalListings: number;
  totalBookings: number;
  totalRevenue: number;
  pendingRequests: number;
  recentBookings: any[];
  recentPayments: any[];
  stats: any[];
}

export interface IStudentDashboard {
  totalBookings: number;
  activeBookings: number;
  totalPayments: number;
  pendingPayments: number;
  recentBookings: any[];
  recentPayments: any[];
  stats: any[];
}

export const getAdminDashboard = async (range: DashboardRange = "monthly") => {
  try {
    const response = await httpClient.get<IAdminDashboard>("/dashboard/admin", {
      params: { range },
    });
    return response;
  } catch (error) {
    console.error("Error fetching admin dashboard:", error);
    throw error;
  }
};

export const getOwnerDashboard = async (range: DashboardRange = "monthly") => {
  try {
    const response = await httpClient.get<IOwnerDashboard>(
      "/dashboard/owner",
      { params: { range } }
    );
    return response;
  } catch (error) {
    console.error("Error fetching owner dashboard:", error);
    throw error;
  }
};

export const getStudentDashboard = async (
  range: DashboardRange = "monthly"
) => {
  try {
    const response = await httpClient.get<IStudentDashboard>(
      "/dashboard/student",
      { params: { range } }
    );
    return response;
  } catch (error) {
    console.error("Error fetching student dashboard:", error);
    throw error;
  }
};