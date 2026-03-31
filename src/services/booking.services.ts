import browserClient from "@/lib/browserClient";
import {
  IBooking,
  ICreateBookingInput,
  IUpdateBookingStatusInput,
  IAddExtraChargeInput,
} from "@/types/booking.types";

// ─── Student ──────────────────────────────────────────────────────────────────

export const createBooking = async (payload: ICreateBookingInput) => {
  try {
    const response = await browserClient.post<IBooking>("/bookings", payload);
    return response;
  } catch (error) {
    console.error("Error creating booking:", error);
    throw error;
  }
};

export const getMyBookings = async () => {
  try {
    const response = await browserClient.get<IBooking[]>("/bookings/my-bookings");
    return response;
  } catch (error) {
    console.error("Error fetching my bookings:", error);
    throw error;
  }
};

export const cancelBooking = async (id: string) => {
  try {
    const response = await browserClient.patch<IBooking>(
      `/bookings/cancel/${id}`,
      {}
    );
    return response;
  } catch (error) {
    console.error("Error cancelling booking:", error);
    throw error;
  }
};

// ─── Owner ────────────────────────────────────────────────────────────────────

export const getBookingRequests = async () => {
  try {
    const response = await browserClient.get<IBooking[]>(
      "/bookings/owner/requests"
    );
    return response;
  } catch (error) {
    console.error("Error fetching booking requests:", error);
    throw error;
  }
};

export const updateBookingStatus = async (
  id: string,
  payload: IUpdateBookingStatusInput
) => {
  try {
    const response = await browserClient.patch<IBooking>(
      `/bookings/owner/${id}/status`,
      payload
    );
    return response;
  } catch (error) {
    console.error("Error updating booking status:", error);
    throw error;
  }
};

export const addExtraCharge = async (
  id: string,
  payload: IAddExtraChargeInput
) => {
  try {
    const response = await browserClient.post<IBooking>(
      `/bookings/${id}/extra-charge`,
      payload
    );
    return response;
  } catch (error) {
    console.error("Error adding extra charge:", error);
    throw error;
  }
};

// ─── Common ───────────────────────────────────────────────────────────────────

export const getSingleBooking = async (id: string) => {
  try {
    const response = await browserClient.get<IBooking>(`/bookings/${id}`);
    return response;
  } catch (error) {
    console.error("Error fetching booking:", error);
    throw error;
  }
};

// ─── Admin ────────────────────────────────────────────────────────────────────

export const getAllBookings = async () => {
  try {
    const response = await browserClient.get<IBooking[]>("/bookings/admin/all");
    return response;
  } catch (error) {
    console.error("Error fetching all bookings:", error);
    throw error;
  }
};