import { IUser } from "./auth.types";

export type ListingType = "ROOM" | "SEAT" | "BASHA";
export type ListingStatus = "PENDING" | "APPROVED" | "REJECTED";

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
  images: File[];
}

export interface IUpdateListingInput extends Partial<ICreateListingInput> {}