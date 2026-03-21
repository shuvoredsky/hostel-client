"use server";

import { httpClient } from "@/lib/httpClient";
import { IPayment } from "@/types/payment.types";

// ─── Student ──────────────────────────────────────────────────────────────────

export const initiatePayment = async (bookingId: string) => {
  try {
    const response = await httpClient.post<{ paymentUrl: string }>(
      `/payments/initiate/${bookingId}`,
      {}
    );
    return response;
  } catch (error) {
    console.error("Error initiating payment:", error);
    throw error;
  }
};

export const getMyPayments = async () => {
  try {
    const response = await httpClient.get<IPayment[]>("/payments/my-payments");
    return response;
  } catch (error) {
    console.error("Error fetching my payments:", error);
    throw error;
  }
};

// ─── Owner ────────────────────────────────────────────────────────────────────

export const getOwnerPayments = async () => {
  try {
    const response = await httpClient.get<IPayment[]>("/payments/owner/all");
    return response;
  } catch (error) {
    console.error("Error fetching owner payments:", error);
    throw error;
  }
};

export const getInvoiceUrl = (paymentId: string): string => {
  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api/v1";
  return `${baseUrl}/payments/invoice/${paymentId}`;
};

// ─── Admin ────────────────────────────────────────────────────────────────────

export const getAllPayments = async () => {
  try {
    const response = await httpClient.get<IPayment[]>("/payments/admin/all");
    return response;
  } catch (error) {
    console.error("Error fetching all payments:", error);
    throw error;
  }
};