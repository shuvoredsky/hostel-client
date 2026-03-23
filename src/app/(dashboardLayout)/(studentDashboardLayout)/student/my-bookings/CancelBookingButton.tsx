"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cancelBooking } from "@/services/booking.services";
import { XCircle } from "lucide-react";

export default function CancelBookingButton({
  bookingId,
}: {
  bookingId: string;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleCancel = async () => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;
    try {
      setIsLoading(true);
      await cancelBooking(bookingId);
      toast.success("Booking cancelled successfully");
      router.refresh();
    } catch {
      toast.error("Failed to cancel booking");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      size="sm"
      variant="destructive"
      onClick={handleCancel}
      disabled={isLoading}
      className="h-7 text-xs"
    >
      {isLoading ? (
        <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      ) : (
        <>
          <XCircle className="w-3 h-3 mr-1" />
          Cancel
        </>
      )}
    </Button>
  );
}