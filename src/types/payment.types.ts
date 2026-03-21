import { IBooking } from "./booking.types";

export type PaymentStatus = "UNPAID" | "PAID" | "FAILED" | "REFUNDED";

export interface IPayment {
  id: string;
  bookingId: string;
  booking: IBooking;
  amount: number;
  status: PaymentStatus;
  transactionId?: string;
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
}