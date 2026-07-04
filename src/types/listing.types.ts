import { IUser } from "./auth.types";

export type ListingType = "ROOM" | "SEAT" | "BASHA";
export type ListingStatus = "PENDING" | "APPROVED" | "REJECTED";
export type StudentDiscountPercent = 0 | 5 | 10 | 15;
export type AdvanceOption = "NO_ADVANCE" | "ONE_MONTH" | "TWO_MONTH";
export type GenderPreference = "BOYS" | "GIRLS" | "ANYONE";

export interface IListingImage {
  id: string;
  url: string;
  listingId: string;
}

export interface IListing {
  id: string;
  title: string;
  description: string;
  type: ListingType;
  price: number;
  address: string;
  area: string;
  city: string;
  totalRooms: number;
  totalSeats: number;
  studentDiscountPercent: StudentDiscountPercent;
  advanceOption: AdvanceOption;
  genderPreference: GenderPreference;
  allowHalfMonthlyPay: boolean;
  images: IListingImage[];
  status: ListingStatus;
  isAvailable: boolean;
  isDeleted: boolean;
  ownerId: string;
  owner: Pick<IUser, "id" | "name" | "email">;
  avgRating: number;
  totalReviews: number;
  isWishlisted?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IListingFilters {
  search?: string;
  type?: ListingType;
  area?: string;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  isAvailable?: boolean;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export interface ICreateListingInput {
  title: string;
  description: string;
  type: ListingType;
  price: number;
  address: string;
  area: string;
  city: string;
  totalRooms: number;
  totalSeats: number;
  studentDiscountPercent: StudentDiscountPercent;
  advanceOption: AdvanceOption;
  genderPreference: GenderPreference;
  allowHalfMonthlyPay: boolean;
  images: File[];
}

export interface IUpdateListingInput extends Partial<ICreateListingInput> {}