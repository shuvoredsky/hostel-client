import { IUser } from "./auth.types";

export type ListingType = "ROOM" | "SEAT" | "BASHA";
export type ListingStatus = "PENDING" | "APPROVED" | "REJECTED";
export type StudentDiscountPercent = 0 | 5 | 10 | 15;
export type AdvanceOption = "NO_ADVANCE" | "ONE_MONTH" | "TWO_MONTH";
export type GenderPreference = "BOYS" | "GIRLS" | "ANYONE";


export type Amenity =
  | "WIFI"
  | "FILTERED_WATER"
  | "AC"
  | "LIFT"
  | "SECURITY_24_7"
  | "CCTV"
  | "PARKING";
export type GasType = "CYLINDER" | "SUPPLY" | "NOT_AVAILABLE";
export type NearbyLandmarkType = "UNIVERSITY" | "METRO_STATION" | "BUS_STOP";

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
  amenities: Amenity[];
  gasType: GasType;
  nearbyType?: NearbyLandmarkType;
  nearbyName?: string;
  images: IListingImage[];
  status: ListingStatus;
  isAvailable: boolean;
  isDeleted: boolean;
  ownerId: string;
  owner: Pick<IUser, "id" | "name" | "email" | "whatsappNumber">;
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

export type IUpdateListingInput = Partial<ICreateListingInput>;
