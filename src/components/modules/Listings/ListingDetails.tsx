"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  MapPin,
  Star,
  BedDouble,
  Users,
  Heart,
  Share2,
  MessageCircle ,
  Phone,
  Mail,
  Calendar,
  CheckCircle,
  ArrowLeft,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { IListing } from "@/types/listing.types";
import { formatPrice, formatDate } from "@/lib/utils";
import { useAuth } from "@/providers/AuthProvider";
import { toggleWishlist } from "@/services/wishlist.services";
import { createBooking } from "@/services/booking.services";
import ReviewSection from "./ReviewSection";

interface ListingDetailsProps {
  listing: IListing;
}

const typeColors = {
  ROOM: "bg-blue-100 text-blue-700",
  SEAT: "bg-purple-100 text-purple-700",
  BASHA: "bg-emerald-100 text-emerald-700",
};

export default function ListingDetails({ listing }: ListingDetailsProps) {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [currentImage, setCurrentImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(
    listing.isWishlisted || false
  );
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);
  const [isBookingLoading, setIsBookingLoading] = useState(false);
  const [moveInDate, setMoveInDate] = useState("");
  const [message, setMessage] = useState("");

  const images = listing.images || [];

  const handleWishlist = async () => {
    if (!isAuthenticated || user?.role !== "STUDENT") {
      toast.error("Please login as a student to save listings");
      return;
    }
    try {
      setIsWishlistLoading(true);
      await toggleWishlist(listing.id);
      setIsWishlisted((prev) => !prev);
      toast.success(
        isWishlisted ? "Removed from wishlist" : "Added to wishlist"
      );
    } catch {
      toast.error("Failed to update wishlist");
    } finally {
      setIsWishlistLoading(false);
    }
  };

  const handleBooking = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to book this listing");
      router.push("/login");
      return;
    }
    if (user?.role !== "STUDENT") {
      toast.error("Only students can book listings");
      return;
    }
    if (!moveInDate) {
      toast.error("Please select a move-in date");
      return;
    }
    try {
      setIsBookingLoading(true);
      await createBooking({
        listingId: listing.id,
        moveInDate,
        message,
      });
      toast.success("Booking request sent successfully!");
      router.push("/student/my-bookings");
    } catch (error: any) {
      const msg =
        error?.response?.data?.message || "Failed to send booking request";
      toast.error(msg);
    } finally {
      setIsBookingLoading(false);
    }
  };


const handleMessageOwner = async () => {
  if (!isAuthenticated) {
    toast.error("Please login to message the owner");
    router.push("/login");
    return;
  }
  if (user?.role !== "STUDENT") {
    toast.error("Only students can message owners");
    return;
  }
  try {
    const { getOrCreateConversation } = await import("@/services/chat.service");
    const conversation = await getOrCreateConversation(listing.owner.id);
    // conversation id সহ chat page এ redirect
    router.push(`/student/chat?conversationId=${conversation.id}`);
  } catch {
    toast.error("Failed to open chat");
  }
};


  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-slate-500 hover:text-emerald-600 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Listings
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700">
              {/* Main Image */}
              <div className="relative h-80 sm:h-96">
                {images.length > 0 ? (
                  <Image
                    src={images[currentImage]?.url}
                    alt={listing.title}
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="w-full h-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                    <BedDouble className="w-16 h-16 text-slate-400" />
                  </div>
                )}

                {/* Type Badge */}
                <div className="absolute top-4 left-4">
                  <span
                    className={`inline-flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-full ${
                      typeColors[listing.type]
                    }`}
                  >
                    {listing.type}
                  </span>
                </div>
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-2 p-4 overflow-x-auto">
                  {images.map((img, index) => (
                    <button
                      key={img.id}
                      onClick={() => setCurrentImage(index)}
                      className={`relative w-16 h-16 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                        currentImage === index
                          ? "border-emerald-600"
                          : "border-transparent"
                      }`}
                    >
                      <Image
                        src={img.url}
                        alt={`Image ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
              {/* Title & Actions */}
              <div className="flex items-start justify-between gap-4 mb-4">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                  {listing.title}
                </h1>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={handleWishlist}
                    disabled={isWishlistLoading}
                    className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all ${
                      isWishlisted
                        ? "bg-red-500 border-red-500 text-white"
                        : "border-slate-200 dark:border-slate-600 text-slate-500 hover:text-red-500"
                    }`}
                  >
                    <Heart
                      className={`w-4 h-4 ${isWishlisted ? "fill-white" : ""}`}
                    />
                  </button>
                  <button className="w-9 h-9 rounded-full border border-slate-200 dark:border-slate-600 flex items-center justify-center text-slate-500 hover:text-emerald-600 transition-colors">
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 mb-4">
                <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  {listing.address}, {listing.area}, {listing.city}
                </span>
              </div>

              {/* Rating */}
              {listing.avgRating > 0 && (
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= listing.avgRating
                            ? "fill-amber-400 text-amber-400"
                            : "text-slate-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-medium text-slate-700 dark:text-slate-300">
                    {listing.avgRating.toFixed(1)}
                  </span>
                  <span className="text-slate-400">
                    ({listing.totalReviews} reviews)
                  </span>
                </div>
              )}

              {/* Info Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
                <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-3 text-center">
                  <BedDouble className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Rooms
                  </p>
                  <p className="font-semibold text-slate-900 dark:text-white">
                    {listing.totalRooms || "N/A"}
                  </p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-3 text-center">
                  <Users className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Seats
                  </p>
                  <p className="font-semibold text-slate-900 dark:text-white">
                    {listing.totalSeats || "N/A"}
                  </p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-3 text-center">
                  <CheckCircle className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Status
                  </p>
                  <p
                    className={`font-semibold text-sm ${
                      listing.isAvailable
                        ? "text-emerald-600"
                        : "text-red-500"
                    }`}
                  >
                    {listing.isAvailable ? "Available" : "Unavailable"}
                  </p>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                  Description
                </h3>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                  {listing.description}
                </p>
              </div>
            </div>

            {/* Reviews */}
            <ReviewSection listingId={listing.id} />
          </div>

          {/* Right Column — Booking + Owner */}
          <div className="space-y-4">
            {/* Price Card */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 sticky top-24">
              <div className="mb-4">
                <span className="text-3xl font-bold text-emerald-600">
                  {formatPrice(listing.price)}
                </span>
                <span className="text-slate-400">/month</span>
              </div>

              {/* Booking Form — Student Only */}
              {isAuthenticated && user?.role === "STUDENT" && (
                <div className="space-y-3 mb-4">
                  <div>
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">
                      Move-in Date
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="date"
                        value={moveInDate}
                        onChange={(e) => setMoveInDate(e.target.value)}
                        min={new Date().toISOString().split("T")[0]}
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-emerald-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">
                      Message (Optional)
                    </label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Introduce yourself..."
                      rows={3}
                      className="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-emerald-400 resize-none"
                    />
                  </div>

                  <Button
                    onClick={handleBooking}
                    disabled={isBookingLoading || !listing.isAvailable}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    {isBookingLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Sending Request...
                      </div>
                    ) : (
                      "Send Booking Request"
                    )}
                  </Button>
                </div>
              )}



              {/* Message Owner Button — Student Only */}
{isAuthenticated && user?.role === "STUDENT" && (
  <Button
    onClick={handleMessageOwner}
    variant="outline"
    className="w-full border-emerald-600 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 mb-2"
  >
    <MessageCircle className="w-4 h-4 mr-2" />
    Message Owner
  </Button>
)}


              {/* Not logged in */}
              {!isAuthenticated && (
                <Button
                  onClick={() => router.push("/login")}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white mb-4"
                >
                  Login to Book
                </Button>
              )}

              {/* Owner Info */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-700">
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">
                  Owner Information
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                      <span className="text-emerald-600 font-semibold text-xs">
                        {listing.owner?.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="font-medium text-slate-900 dark:text-white">
                      {listing.owner?.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                    <Mail className="w-4 h-4 text-emerald-600" />
                    <span>{listing.owner?.email}</span>
                  </div>
                </div>
              </div>

              {/* Listed Date */}
              <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-700">
                <p className="text-xs text-slate-400">
                  Listed on {formatDate(listing.createdAt)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}