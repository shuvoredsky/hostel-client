import { IBooking } from "./booking.types";

export type PaymentStatus = "UNPAID" | "PAID" | "FAILED" | "REFUNDED";

export interface IPaymentInstallment {
  id: string;
  installmentNo: number;
  amount: number;
  dueDate?: string;
  status: "PENDING" | "PAID" | "OVERDUE";
  transactionId?: string;
  paidAt?: string;
}

export interface IPayment {
  id: string;
  bookingId: string;
  booking: IBooking;
  amount: number;
  originalAmount?: number;
  discountPercent?: number;
  discountAmount?: number;
  commission?: number;
  status: PaymentStatus;
  transactionId?: string;
  paidAt?: string;
  installments?: IPaymentInstallment[];
  daysWaiting?: number;
  createdAt: string;
  updatedAt: string;
}