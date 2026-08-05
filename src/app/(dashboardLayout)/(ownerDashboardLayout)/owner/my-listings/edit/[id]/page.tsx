"use client";

import { useState, useRef, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRouter, useParams } from "next/navigation";
import {
  Building,
  MapPin,
  X,
  Loader2,
  Wifi,
  Droplet,
  Snowflake,
  ArrowUpDown,
  ShieldCheck,
  Camera,
  ParkingCircle,
  GraduationCap,
  TrainFront,
  Bus,
  Upload,
  BedDouble,
  Users,
} from "lucide-react";
import { getSingleListing, updateListing } from "@/services/listing.services";
import { Switch } from "@/components/ui/switch";
import { createListingSchema, CreateListingFormData } from "@/zod/listing.validation";

type ListingType = "ROOM" | "SEAT" | "BASHA";

const LISTING_TYPES: Array<{ value: ListingType; label: string; desc: string }> = [
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

const STUDENT_DISCOUNT_OPTIONS = [
  { value: "0", label: "0%" },
  { value: "5", label: "5%" },
  { value: "10", label: "10%" },
  { value: "15", label: "15%" },
] as const;

const ADVANCE_OPTIONS = [
  { value: "NO_ADVANCE", label: "No Advance", desc: "No advance payment" },
  { value: "ONE_MONTH", label: "1 Month Advance", desc: "One month advance required" },
  { value: "TWO_MONTH", label: "2 Month Advance", desc: "Two months advance required" },
] as const;

const GENDER_PREFERENCE_OPTIONS = [
  { value: "BOYS", label: "Boys Only" },
  { value: "GIRLS", label: "Girls Only" },
  { value: "FAMILY", label: "Family" },
  { value: "ANYONE", label: "Anyone" },
] as const;

const AMENITY_OPTIONS = [
  { value: "WIFI", label: "WiFi", icon: Wifi },
  { value: "FILTERED_WATER", label: "Filtered Water", icon: Droplet },
  { value: "AC", label: "AC", icon: Snowflake },
  { value: "LIFT", label: "Lift", icon: ArrowUpDown },
  { value: "SECURITY_24_7", label: "24/7 Security", icon: ShieldCheck },
  { value: "CCTV", label: "CCTV", icon: Camera },
  { value: "PARKING", label: "Parking", icon: ParkingCircle },
] as const;

const GAS_TYPE_OPTIONS = [
  { value: "CYLINDER", label: "Cylinder" },
  { value: "SUPPLY", label: "Supply Line" },
  { value: "NOT_AVAILABLE", label: "Not Available" },
] as const;

const NEARBY_TYPE_OPTIONS = [
  { value: "UNIVERSITY", label: "University", icon: GraduationCap, placeholder: "e.g. Dhaka University" },
  { value: "METRO_STATION", label: "Metro Station", icon: TrainFront, placeholder: "e.g. Kazipara Metro Station" },
  { value: "BUS_STOP", label: "Bus Stop", icon: Bus, placeholder: "e.g. Mirpur 10 Bus Stop" },
] as const;

export default function EditListingPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [isLoadingListing, setIsLoadingListing] = useState(true);
  const [existingImages, setExistingImages] = useState<Array<{ id: string; url: string }>>([]);
  const [removedImageIds, setRemovedImageIds] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [newPreviews, setNewPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateListingFormData>({
    resolver: zodResolver(createListingSchema),
    defaultValues: {
      totalRooms: "0",
      totalSeats: "0",
      type: "ROOM",
      studentDiscountPercent: "0",
      advanceOption: "NO_ADVANCE",
      genderPreference: "ANYONE",
      allowHalfMonthlyPay: false,
      amenities: [],
      gasType: "NOT_AVAILABLE",
    },
  });

  const selectedType = useWatch({ control, name: "type" }) as ListingType;
  const selectedDiscount = useWatch({ control, name: "studentDiscountPercent" }) as CreateListingFormData["studentDiscountPercent"];
  const selectedAdvance = useWatch({ control, name: "advanceOption" }) as CreateListingFormData["advanceOption"];
  const selectedGenderPreference = useWatch({ control, name: "genderPreference" }) as CreateListingFormData["genderPreference"];
  const allowHalfMonthlyPay = useWatch({ control, name: "allowHalfMonthlyPay" }) as boolean;
  const selectedAmenities = useWatch({ control, name: "amenities" }) as CreateListingFormData["amenities"];
  const selectedGasType = useWatch({ control, name: "gasType" }) as CreateListingFormData["gasType"];
  const selectedNearbyType = useWatch({ control, name: "nearbyType" }) as CreateListingFormData["nearbyType"];

  useEffect(() => {
    if (!id) return;
    const fetchListingData = async () => {
      try {
        setIsLoadingListing(true);
        const response = await getSingleListing(id);
        const listing = response.data;
        if (listing) {
          setExistingImages(listing.images || []);
          reset({
            title: listing.title,
            description: listing.description,
            type: listing.type,
            price: String(listing.price),
            address: listing.address,
            area: listing.area,
            city: listing.city || "Dhaka",
            totalRooms: String(listing.totalRooms ?? 0),
            totalSeats: String(listing.totalSeats ?? 0),
            studentDiscountPercent: String(listing.studentDiscountPercent ?? 0) as any,
            advanceOption: listing.advanceOption,
            genderPreference: listing.genderPreference,
            allowHalfMonthlyPay: listing.allowHalfMonthlyPay || false,
            amenities: listing.amenities || [],
            gasType: listing.gasType || "NOT_AVAILABLE",
            nearbyType: listing.nearbyType || undefined,
            nearbyName: listing.nearbyName || "",
            googleMapsLink: listing.googleMapsLink || "",
          });
        }
      } catch {
        toast.error("Failed to load listing details");
        router.push("/owner/my-listings");
      } finally {
        setIsLoadingListing(false);
      }
    };
    fetchListingData();
  }, [id, reset, router]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (existingImages.length + newImages.length + files.length > 5) {
      toast.error("Maximum 5 images allowed in total");
      return;
    }
    setNewImages((prev) => [...prev, ...files]);
    const previews = files.map((f) => URL.createObjectURL(f));
    setNewPreviews((prev) => [...prev, ...previews]);
  };

  const removeExistingImage = (imageId: string) => {
    setExistingImages((prev) => prev.filter((img) => img.id !== imageId));
    setRemovedImageIds((prev) => [...prev, imageId]);
  };

  const removeNewImage = (index: number) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
    setNewPreviews((prev) => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const onSubmit = async (data: CreateListingFormData) => {
    const totalImages = existingImages.length + newImages.length;
    if (totalImages === 0) {
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
    formData.append("studentDiscountPercent", data.studentDiscountPercent);
    formData.append("advanceOption", data.advanceOption);
    formData.append("genderPreference", data.genderPreference);
    formData.append("allowHalfMonthlyPay", String(data.allowHalfMonthlyPay));
    formData.append("amenities", JSON.stringify(data.amenities));
    formData.append("gasType", data.gasType);
    if (data.nearbyType) formData.append("nearbyType", data.nearbyType);
    if (data.nearbyName) formData.append("nearbyName", data.nearbyName);
    if (data.googleMapsLink) formData.append("googleMapsLink", data.googleMapsLink);

    formData.append("removeImages", JSON.stringify(removedImageIds));
    newImages.forEach((img) => formData.append("images", img));

    try {
      await updateListing(id, formData);
      toast.success("Listing updated successfully!");
      router.push("/owner/my-listings");
      router.refresh();
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to update listing";
      toast.error(message);
    }
  };

  if (isLoadingListing) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
        <span className="ml-2 text-slate-500">Loading listing details...</span>
      </div>
    );
  }

  const currentTotalImages = existingImages.length + newImages.length;

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Edit Listing
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Update the details of your property
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
                onClick={() => setValue("type", t.value)}
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
            <input
              {...register("title")}
              placeholder="e.g. Spacious Student Room near DU"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
            />
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
              placeholder="Describe the rooms, house rules, and amenities..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
            />
            {errors.description && (
              <p className="text-xs text-red-500">{errors.description.message}</p>
            )}
          </div>

          {/* Rent & Accommodation */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Rent / month (BDT)
              </label>
              <input
                {...register("price")}
                type="number"
                min={0}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
              />
              {errors.price && (
                <p className="text-xs text-red-500">{errors.price.message}</p>
              )}
            </div>
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
                <p className="text-xs text-red-500">{errors.totalRooms.message}</p>
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
                <p className="text-xs text-red-500">{errors.totalSeats.message}</p>
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
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
              />
              {errors.city && (
                <p className="text-xs text-red-500">{errors.city.message}</p>
              )}
            </div>
          </div>

          {/* Google Maps Link */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Google Maps Link (Optional)
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                {...register("googleMapsLink")}
                placeholder="e.g. https://maps.app.goo.gl/..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              />
            </div>
            {errors.googleMapsLink && (
              <p className="text-xs text-red-500 mt-1">{errors.googleMapsLink.message}</p>
            )}
          </div>
        </div>

        {/* Student Exclusive Offers */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 space-y-4">
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white text-sm">
              Student Exclusive Offers
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Update discount and payment preferences for student bookings.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Student Discount %
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {STUDENT_DISCOUNT_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setValue("studentDiscountPercent", option.value)}
                    className={`rounded-full border px-4 py-2 text-sm font-medium transition-all ${
                      selectedDiscount === option.value
                        ? "border-emerald-600 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300"
                        : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Advance Option
              </p>
              <div className="mt-3 grid gap-2 sm:grid-cols-3">
                {ADVANCE_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setValue("advanceOption", option.value)}
                    className={`rounded-2xl border px-4 py-3 text-left text-sm transition-all ${
                      selectedAdvance === option.value
                        ? "border-emerald-600 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300"
                        : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
                    }`}
                  >
                    <p className="font-semibold">{option.label}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{option.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Gender Preference
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {GENDER_PREFERENCE_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setValue("genderPreference", option.value)}
                    className={`rounded-full border px-4 py-2 text-sm font-medium transition-all ${
                      selectedGenderPreference === option.value
                        ? "border-emerald-600 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300"
                        : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-900">
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-white">
                  Allow Half-Monthly Pay
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Let students split rent into two installments.
                </p>
              </div>
              <Switch
                checked={allowHalfMonthlyPay}
                onCheckedChange={(value) => setValue("allowHalfMonthlyPay", value)}
              />
            </div>
          </div>
        </div>

        {/* Amenities & Nearby */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 space-y-4">
          <h3 className="font-semibold text-slate-900 dark:text-white text-sm">
            Amenities & Nearby
          </h3>

          <div>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Amenities
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {AMENITY_OPTIONS.map((option) => {
                const isSelected = selectedAmenities?.includes(option.value);
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      const current = selectedAmenities || [];
                      setValue(
                        "amenities",
                        isSelected
                          ? current.filter((v) => v !== option.value)
                          : [...current, option.value]
                      );
                    }}
                    className={`flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-all ${
                      isSelected
                        ? "border-emerald-600 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300"
                        : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
                    }`}
                  >
                    <option.icon className="w-3.5 h-3.5" />
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Gas Type
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {GAS_TYPE_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setValue("gasType", option.value)}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition-all ${
                    selectedGasType === option.value
                      ? "border-emerald-600 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300"
                      : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Nearby Landmark
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {NEARBY_TYPE_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() =>
                    setValue(
                      "nearbyType",
                      selectedNearbyType === option.value ? undefined : option.value
                    )
                  }
                  className={`flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-all ${
                    selectedNearbyType === option.value
                      ? "border-emerald-600 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300"
                      : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
                  }`}
                >
                  <option.icon className="w-3.5 h-3.5" />
                  {option.label}
                </button>
              ))}
            </div>

            {selectedNearbyType && (
              <div className="mt-3">
                <input
                  {...register("nearbyName")}
                  placeholder={
                    NEARBY_TYPE_OPTIONS.find((o) => o.value === selectedNearbyType)
                      ?.placeholder
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                />
                {errors.nearbyName && (
                  <p className="text-xs text-red-500 mt-1">{errors.nearbyName.message}</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Photos */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-slate-900 dark:text-white text-sm">
              Photos
            </h3>
            <span className="text-xs text-slate-400">
              {currentTotalImages}/5 uploaded
            </span>
          </div>

          {/* Existing Previews */}
          {(existingImages.length > 0 || newPreviews.length > 0) && (
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {existingImages.map((img) => (
                <div
                  key={img.id}
                  className="relative aspect-square rounded-xl overflow-hidden group"
                >
                  <img
                    src={img.url}
                    alt="Listing Image"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeExistingImage(img.id)}
                    className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              {newPreviews.map((src, i) => (
                <div
                  key={i}
                  className="relative aspect-square rounded-xl overflow-hidden group border border-dashed border-emerald-500"
                >
                  <img
                    src={src}
                    alt={`New Preview ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeNewImage(i)}
                    className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Upload Button */}
          {currentTotalImages < 5 && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl py-8 flex flex-col items-center gap-2 text-slate-400 hover:border-emerald-400 hover:text-emerald-500 transition-colors"
            >
              <Upload className="w-6 h-6" />
              <span className="text-sm">Click to upload new images</span>
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
              Updating...
            </>
          ) : (
            <>
              <Building className="w-4 h-4" />
              Update Listing
            </>
          )}
        </button>
      </form>
    </div>
  );
}
