"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Building,
  MapPin,
  DollarSign,
  FileText,
  Image as ImageIcon,
  X,
  Loader2,
  Upload,
  BedDouble,
  Users,
} from "lucide-react";
import browserClient from "@/lib/browserClient";

const createListingSchema = z.object({
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
});

type CreateListingFormData = z.infer<typeof createListingSchema>;

const LISTING_TYPES = [
  { value: "ROOM", label: "Room", desc: "Private or shared room" },
  { value: "SEAT", label: "Seat", desc: "Seat in shared space" },
  { value: "BASHA", label: "Basha", desc: "Full apartment/flat" },
];

const DHAKA_AREAS = [
  "Mirpur", "Dhanmondi", "Gulshan", "Banani", "Uttara", "Mohammadpur",
  "Tejgaon", "Farmgate", "Motijheel", "Old Dhaka", "Wari", "Lalbagh",
  "Khilgaon", "Rampura", "Badda", "Demra", "Jatrabari", "Shyampur",
  "Kadamtali", "Sabujbagh", "Paltan", "Ramna", "Shahbagh", "Sutrapur",
];

export default function CreateListingPage() {
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreateListingFormData>({
    resolver: zodResolver(createListingSchema),
    defaultValues: { totalRooms: "0", totalSeats: "0" },
  });

  const selectedType = watch("type");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (images.length + files.length > 5) {
      toast.error("Maximum 5 images allowed");
      return;
    }
    const newImages = [...images, ...files];
    setImages(newImages);
    const newPreviews = files.map((f) => URL.createObjectURL(f));
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const onSubmit = async (data: CreateListingFormData) => {
    if (images.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }

    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("type", data.type);
    formData.append("price", data.price);
    formData.append("address", data.address);
    formData.append("area", data.area);
    formData.append("city", data.city);
    formData.append("totalRooms", data.totalRooms);
    formData.append("totalSeats", data.totalSeats);
    images.forEach((img) => formData.append("images", img));

    try {
      await browserClient.post("/listings", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Listing created! Awaiting approval.");
      router.push("/owner/my-listings");
      router.refresh();
    } catch (error: any) {
      const message =
        error?.response?.data?.message || "Failed to create listing";
      toast.error(message);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Create Listing
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Fill in the details to publish your property
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Listing Type */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 space-y-3">
          <h3 className="font-semibold text-slate-900 dark:text-white text-sm">
            Listing Type
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {LISTING_TYPES.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => setValue("type", t.value as any)}
                className={`p-3 rounded-xl border-2 text-left transition-all ${
                  selectedType === t.value
                    ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
                    : "border-slate-200 dark:border-slate-700 hover:border-slate-300"
                }`}
              >
                <p
                  className={`text-sm font-semibold ${
                    selectedType === t.value
                      ? "text-emerald-600"
                      : "text-slate-900 dark:text-white"
                  }`}
                >
                  {t.label}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">{t.desc}</p>
              </button>
            ))}
          </div>
          {errors.type && (
            <p className="text-xs text-red-500">{errors.type.message}</p>
          )}
        </div>

        {/* Basic Info */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 space-y-4">
          <h3 className="font-semibold text-slate-900 dark:text-white text-sm">
            Basic Information
          </h3>

          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Title
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                {...register("title")}
                placeholder="e.g. Cozy Single Room in Mirpur"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              />
            </div>
            {errors.title && (
              <p className="text-xs text-red-500">{errors.title.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Description
            </label>
            <textarea
              {...register("description")}
              rows={4}
              placeholder="Describe your property in detail..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all resize-none"
            />
            {errors.description && (
              <p className="text-xs text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Price */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Monthly Rent (BDT)
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                {...register("price")}
                type="number"
                placeholder="e.g. 5000"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              />
            </div>
            {errors.price && (
              <p className="text-xs text-red-500">{errors.price.message}</p>
            )}
          </div>

          {/* Rooms & Seats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Total Rooms
              </label>
              <div className="relative">
                <BedDouble className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  {...register("totalRooms")}
                  type="number"
                  min={0}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                />
              </div>
              {errors.totalRooms && (
                <p className="text-xs text-red-500">
                  {errors.totalRooms.message}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Total Seats
              </label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  {...register("totalSeats")}
                  type="number"
                  min={0}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                />
              </div>
              {errors.totalSeats && (
                <p className="text-xs text-red-500">
                  {errors.totalSeats.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 space-y-4">
          <h3 className="font-semibold text-slate-900 dark:text-white text-sm">
            Location
          </h3>

          {/* Address */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Full Address
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                {...register("address")}
                placeholder="House no, road, block..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              />
            </div>
            {errors.address && (
              <p className="text-xs text-red-500">{errors.address.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Area */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Area
              </label>
              <select
                {...register("area")}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
              >
                <option value="">Select area</option>
                {DHAKA_AREAS.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
              {errors.area && (
                <p className="text-xs text-red-500">{errors.area.message}</p>
              )}
            </div>

            {/* City */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                City
              </label>
              <input
                {...register("city")}
                placeholder="e.g. Dhaka"
                defaultValue="Dhaka"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
              />
              {errors.city && (
                <p className="text-xs text-red-500">{errors.city.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-slate-900 dark:text-white text-sm">
              Photos
            </h3>
            <span className="text-xs text-slate-400">
              {images.length}/5 uploaded
            </span>
          </div>

          {/* Previews */}
          {previews.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {previews.map((src, i) => (
                <div
                  key={i}
                  className="relative aspect-square rounded-xl overflow-hidden group"
                >
                  <img
                    src={src}
                    alt={`Preview ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Upload Button */}
          {images.length < 5 && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl py-8 flex flex-col items-center gap-2 text-slate-400 hover:border-emerald-400 hover:text-emerald-500 transition-colors"
            >
              <Upload className="w-6 h-6" />
              <span className="text-sm">Click to upload images</span>
              <span className="text-xs">PNG, JPG up to 5MB each</span>
            </button>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="hidden"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium py-3 rounded-xl transition-colors"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Creating...
            </>
          ) : (
            <>
              <Building className="w-4 h-4" />
              Create Listing
            </>
          )}
        </button>
      </form>
    </div>
  );
}