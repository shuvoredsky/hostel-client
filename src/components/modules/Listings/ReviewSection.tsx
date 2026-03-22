"use client";

import { useState, useEffect } from "react";
import { Star, Send, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/providers/AuthProvider";
import {
  getReviewsByListing,
  createReview,
  updateReview,
  deleteReview,
  IReview,
} from "@/services/review.services";
import { formatDate } from "@/lib/utils";

interface ReviewSectionProps {
  listingId: string;
}

export default function ReviewSection({ listingId }: ReviewSectionProps) {
  const { user, isAuthenticated } = useAuth();
  const [reviews, setReviews] = useState<IReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editRating, setEditRating] = useState(0);
  const [editComment, setEditComment] = useState("");

  const fetchReviews = async () => {
    try {
      setIsLoading(true);
      const response = await getReviewsByListing(listingId);
      setReviews(response?.data || []);
    } catch {
      setReviews([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [listingId]);

  const handleSubmit = async () => {
    if (!rating) {
      toast.error("Please select a rating");
      return;
    }
    if (!comment.trim()) {
      toast.error("Please write a comment");
      return;
    }
    try {
      setIsSubmitting(true);
      await createReview({ listingId, rating, comment });
      toast.success("Review submitted successfully!");
      setRating(0);
      setComment("");
      fetchReviews();
    } catch (error: any) {
      const msg =
        error?.response?.data?.message || "Failed to submit review";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = async (id: string) => {
    try {
      await updateReview(id, { rating: editRating, comment: editComment });
      toast.success("Review updated!");
      setEditingId(null);
      fetchReviews();
    } catch {
      toast.error("Failed to update review");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteReview(id);
      toast.success("Review deleted!");
      fetchReviews();
    } catch {
      toast.error("Failed to delete review");
    }
  };

  const startEdit = (review: IReview) => {
    setEditingId(review.id);
    setEditRating(review.rating);
    setEditComment(review.comment);
  };

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-slate-900 dark:text-white text-lg">
          Reviews ({reviews.length})
        </h3>
        {reviews.length > 0 && (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${
                    star <= Math.round(averageRating)
                      ? "fill-amber-400 text-amber-400"
                      : "text-slate-300"
                  }`}
                />
              ))}
            </div>
            <span className="font-semibold text-slate-900 dark:text-white">
              {averageRating.toFixed(1)}
            </span>
          </div>
        )}
      </div>

      {/* Write Review — Student Only */}
      {isAuthenticated && user?.role === "STUDENT" && (
        <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4 mb-6">
          <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">
            Write a Review
          </h4>

          {/* Star Rating */}
          <div className="flex items-center gap-1 mb-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
                className="transition-transform hover:scale-110"
              >
                <Star
                  className={`w-6 h-6 transition-colors ${
                    star <= (hoverRating || rating)
                      ? "fill-amber-400 text-amber-400"
                      : "text-slate-300 dark:text-slate-500"
                  }`}
                />
              </button>
            ))}
            {rating > 0 && (
              <span className="text-sm text-slate-500 ml-2">
                {["", "Poor", "Fair", "Good", "Very Good", "Excellent"][rating]}
              </span>
            )}
          </div>

          {/* Comment */}
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience..."
            rows={3}
            className="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-emerald-400 resize-none mb-3"
          />

          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Submitting...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Send className="w-4 h-4" />
                Submit Review
              </div>
            )}
          </Button>
        </div>
      )}

      {/* Reviews List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse flex gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/4" />
                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
              </div>
            </div>
          ))}
        </div>
      ) : reviews.length > 0 ? (
        <div className="space-y-5">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="flex gap-3 pb-5 border-b border-slate-100 dark:border-slate-700 last:border-0 last:pb-0"
            >
              <Avatar className="w-10 h-10 shrink-0">
                <AvatarImage src={review.student?.avatar} />
                <AvatarFallback className="bg-emerald-100 text-emerald-600 text-sm">
                  {review.student?.name?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white text-sm">
                      {review.student?.name}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-3 h-3 ${
                              star <= review.rating
                                ? "fill-amber-400 text-amber-400"
                                : "text-slate-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-slate-400">
                        {formatDate(review.createdAt)}
                      </span>
                    </div>
                  </div>

                  {/* Edit/Delete — Own Review */}
                  {user?.id === review.studentId && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => startEdit(review)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(review.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Edit Form */}
                {editingId === review.id ? (
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setEditRating(star)}
                        >
                          <Star
                            className={`w-5 h-5 ${
                              star <= editRating
                                ? "fill-amber-400 text-amber-400"
                                : "text-slate-300"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                    <textarea
                      value={editComment}
                      onChange={(e) => setEditComment(e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-emerald-400 resize-none"
                    />
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleEdit(review.id)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white"
                      >
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingId(null)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                    {review.comment}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <Star className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            No reviews yet. Be the first to review!
          </p>
        </div>
      )}
    </div>
  );
}