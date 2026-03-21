import { IUser } from "./auth.types";

export interface IUpdateUserInput {
  name?: string;
  phone?: string;
  avatar?: File;
}

export interface IUserFilters {
  role?: string;
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface IUserWithStats extends IUser {
  totalBookings?: number;
  totalListings?: number;
  totalPayments?: number;
}