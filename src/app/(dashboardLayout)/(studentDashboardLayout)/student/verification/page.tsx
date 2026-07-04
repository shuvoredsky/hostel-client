"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/providers/AuthProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { CheckCircle, Clock, ShieldCheck, UploadCloud, XCircle } from "lucide-react";
import {
  getMyVerification,
  submitVerification,
} from "@/services/verification.client.services";
import { studentVerificationSchema, StudentVerificationFormValues } from "@/zod/verification.validation";
import { getImageUrl, getStatusColor } from "@/lib/utils";
import { IStudentVerification } from "@/types/verification.types";

export default function StudentVerificationPage() {
  const { isLoading: authLoading } = useAuth();
  const [verification, setVerification] = useState<IStudentVerification | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<StudentVerificationFormValues>({
    resolver: zodResolver(studentVerificationSchema),
    defaultValues: {
      universityName: "",
      department: "",
      session: "",
    },
  });

  useEffect(() => {
    const loadVerification = async () => {
      try {
        setIsLoading(true);
        const response = await getMyVerification();
        setVerification(response.data || null);
        setError(null);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load verification status");
        setVerification(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadVerification();
  }, []);

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const onSubmit = async (values: StudentVerificationFormValues) => {
    if (!selectedFile) {
      toast.error("Please upload your student ID card image.");
      return;
    }

    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append("universityName", values.universityName);
      formData.append("department", values.department);
      formData.append("session", values.session);
      formData.append("studentIdCard", selectedFile);

      const response = await submitVerification(formData);
      setVerification(response.data);
      toast.success("Verification request submitted successfully.");
      reset();
      setSelectedFile(null);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to submit verification request.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-slate-500">Loading verification status...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">Student Verification</p>
            <h1 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">Verify your student status</h1>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 max-w-2xl">
              Submit your university details and student ID card so admin can review and verify your account.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span>Verification is required for student bookings</span>
          </div>
        </div>
      </div>

      {verification ? (
        <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Verification details</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Your latest submission is shown below.</p>
              </div>
              <Badge variant={verification.status === "VERIFIED" ? "secondary" : verification.status === "PENDING" ? "default" : "destructive"}>
                {verification.status}
              </Badge>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">University</p>
                <p className="mt-2 text-sm font-medium text-slate-900 dark:text-white">{verification.universityName}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Department</p>
                <p className="mt-2 text-sm font-medium text-slate-900 dark:text-white">{verification.department}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Session</p>
                <p className="mt-2 text-sm font-medium text-slate-900 dark:text-white">{verification.session}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Submitted</p>
                <p className="mt-2 text-sm font-medium text-slate-900 dark:text-white">{new Date(verification.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            {verification.status === "REJECTED" && (
              <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-700/50 dark:bg-red-900/20 dark:text-red-200">
                <p className="font-semibold">Rejected reason</p>
                <p className="mt-1">{verification.rejectionReason || "No reason provided."}</p>
              </div>
            )}
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-2 text-slate-900 dark:text-white">
              {verification.status === "VERIFIED" ? (
                <CheckCircle className="h-5 w-5 text-emerald-600" />
              ) : verification.status === "PENDING" ? (
                <Clock className="h-5 w-5 text-amber-600" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600" />
              )}
              <h3 className="text-lg font-semibold">Current status</h3>
            </div>
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
              {verification.status === "VERIFIED"
                ? "Your student account is verified. You can continue booking with confidence."
                : verification.status === "PENDING"
                ? "Your request is pending review. Admin will update the status soon."
                : "Your request was rejected. Update your details and submit again."}
            </p>

            <div className="mt-6 rounded-2xl bg-slate-50 p-4 dark:bg-slate-800">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Student ID card</p>
              <div className="mt-3 overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
                <img
                  src={getImageUrl(verification.studentIdCardUrl)}
                  alt="Student ID card"
                  className="w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {(!verification || verification.status === "REJECTED") && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-2 text-slate-900 dark:text-white">
            <UploadCloud className="h-5 w-5 text-emerald-600" />
            <h2 className="text-lg font-semibold">Submit verification request</h2>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-5">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  University name
                </label>
                <Input
                  type="text"
                  placeholder="Example: Dhaka University"
                  {...register("universityName")}
                />
                {errors.universityName && (
                  <p className="mt-1 text-sm text-red-600">{errors.universityName.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Department
                </label>
                <Input type="text" placeholder="Example: Computer Science" {...register("department")} />
                {errors.department && (
                  <p className="mt-1 text-sm text-red-600">{errors.department.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Session
              </label>
              <Input type="text" placeholder="Example: 2023-24" {...register("session")} />
              {errors.session && (
                <p className="mt-1 text-sm text-red-600">{errors.session.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Student ID card image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(event) => {
                  const file = event.target.files?.[0] ?? null;
                  setSelectedFile(file);
                }}
                className="mt-2 block w-full text-sm text-slate-500 file:mr-4 file:rounded-full file:border-0 file:bg-emerald-600 file:px-4 file:py-2 file:text-sm file:text-white focus:outline-none"
              />
              {previewUrl && (
                <div className="mt-3 rounded-2xl border border-slate-200 p-3 dark:border-slate-700">
                  <p className="text-xs text-slate-400">Preview</p>
                  <img src={previewUrl} alt="Preview" className="mt-2 max-h-64 w-full object-contain rounded-xl" />
                </div>
              )}
            </div>

            <div className="flex items-center justify-between gap-4 pt-2">
              <div className="text-sm text-slate-500 dark:text-slate-400">
                {verification?.status === "REJECTED"
                  ? "Edit the fields and upload a new ID card to resubmit your request."
                  : "Upload your student ID card and university information to submit a verification request."}
              </div>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : verification?.status === "REJECTED" ? "Resubmit" : "Submit"}
              </Button>
            </div>
          </form>
        </div>
      )}

      {error && (
        <div className="rounded-3xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-700/50 dark:bg-red-900/20 dark:text-red-200">
          {error}
        </div>
      )}
    </div>
  );
}
