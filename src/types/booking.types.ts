import { IListing } from "./listing.types";
import { IUser } from "./auth.types";

export type BookingStatus =
  | "PENDING"
  | "ACCEPTED"
  | "REJECTED"
  | "CONFIRMED"
  | "CANCELLED";

export interface IExtraCharge {
  id: string;
  title: string;
  amount: number;
  description?: string;
}

export interface IBooking {
  id: string;
  listingId: string;
  listing: IListing;
  studentId: string;
  student: IUser;
  message?: string;
  moveInDate: string;
  status: BookingStatus;
  extraCharges: IExtraCharge[];
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ICreateBookingInput {
  listingId: string;
  message?: string;
  moveInDate: string;
}

export interface IUpdateBookingStatusInput {
  status: "ACCEPTED" | "REJECTED";
}

export interface IAddExtraChargeInput {
  title: string;
  amount: number;
  description?: string;
}