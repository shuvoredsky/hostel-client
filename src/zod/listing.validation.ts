import { z } from "zod";

export const createListingSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  type: z.enum(["ROOM", "SEAT", "BASHA"], {
    error: "Please select a listing type",
  }),
  price: z
    .string()
    .min(1, "Price is required")
    .refine((v) => !isNaN(Number(v)) && Number(v) > 0, "Enter a valid price"),
  address: z.string().min(5, "Address is required"),
  area: z.string().min(2, "Area is required"),
  city: z.string().min(2, "City is required"),
  totalRooms: z
    .string()
    .min(1, "Required")
    .refine((v) => !isNaN(Number(v)) && Number(v) >= 0, "Enter a valid number"),
  totalSeats: z
    .string()
    .min(1, "Required")
    .refine((v) => !isNaN(Number(v)) && Number(v) >= 0, "Enter a valid number"),
  studentDiscountPercent: z.enum(["0", "5", "10", "15"]),
  advanceOption: z.enum(["NO_ADVANCE", "ONE_MONTH", "TWO_MONTH"], {
    error: "Please select an advance option",
  }),
  genderPreference: z.enum(["BOYS", "GIRLS", "FAMILY", "ANYONE"], {
    error: "Please select a gender preference",
  }),
  allowHalfMonthlyPay: z.boolean(),
  amenities: z.array(
    z.enum(["WIFI", "FILTERED_WATER", "AC", "LIFT", "SECURITY_24_7", "CCTV", "PARKING"])
  ),
  gasType: z.enum(["CYLINDER", "SUPPLY", "NOT_AVAILABLE"]),
  nearbyType: z.enum(["UNIVERSITY", "METRO_STATION", "BUS_STOP"]).optional(),
  nearbyName: z.string().optional(),
  googleMapsLink: z
    .string()
    .url("Please enter a valid URL")
    .refine(
      (val) => val.includes("google.com/maps") || val.includes("goo.gl") || val.includes("maps.app.goo.gl"),
      "Please enter a valid Google Maps link"
    )
    .optional()
    .or(z.literal("")),
}).superRefine((data, ctx) => {
  if (data.nearbyType && !data.nearbyName?.trim()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Please enter the name/location",
      path: ["nearbyName"],
    });
  }
});

export type CreateListingFormData = z.infer<typeof createListingSchema>;
