"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { CheckCircle, Eye, ShieldCheck, XCircle } from "lucide-react";
import {
  approveVerification,
  getAllVerifications,
  rejectVerification,
} from "@/services/verification.client.services";
import { IStudentVerification, StudentVerificationStatus } from "@/types/verification.types";
import { formatDate, getImageUrl, getStatusColor } from "@/lib/utils";

export default function AdminVerificationPage() {
  const { isLoading: authLoading } = useAuth();
  const [verifications, setVerifications] = useState<IStudentVerification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<"" | StudentVerificationStatus>("");
  const [error, setError] = useState<string | null>(null);
  const [activePreviewUrl, setActivePreviewUrl] = useState<string | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchVerifications = async () => {
    try {
      setIsLoading(true);
      const response = await getAllVerifications(statusFilter || undefined);
      setVerifications(response.data || []);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load verifications");
      setVerifications([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVerifications();
  }, [statusFilter]);

  const handleApprove = async (id: string) => {
    try {
      setActionLoading(id);
      await approveVerification(id);
      toast.success("Verification approved.");
      fetchVerifications();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to approve verification.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id: string) => {
    const reason = window.prompt("Rejection reason (optional):");
    if (reason === null) return;

    try {
      setActionLoading(id);
      await rejectVerification(id, {
        rejectionReason: reason.trim() || undefined,
      });
      toast.success("Verification rejected.");
      fetchVerifications();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to reject verification.");
    } finally {
      setActionLoading(null);
    }
  };

  const openPreview = (url: string) => {
    setActivePreviewUrl(url);
    setIsPreviewOpen(true);
  };

  if (authLoading || isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-slate-500">Loading verification requests...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">Admin verification</p>
            <h1 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">Student verification review</h1>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Review student verification requests and approve or reject them with an optional reason.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
              <span>Showing</span>
              <strong className="ml-2">{verifications.length}</strong>
              <span className="ml-1">requests</span>
            </div>
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value as "" | StudentVerificationStatus)}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition-all focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            >
              <option value="">All status</option>
              <option value="PENDING">Pending</option>
              <option value="VERIFIED">Verified</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {error ? (
        <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-sm text-red-700 dark:border-red-700/50 dark:bg-red-900/20 dark:text-red-200">
          {error}
        </div>
      ) : verifications.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-16 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <ShieldCheck className="mx-auto h-10 w-10 text-emerald-600" />
          <h2 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">No verification requests found</h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Try another filter or wait for students to submit verification requests.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm text-slate-500 dark:text-slate-400">
              <thead className="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800">
                <tr>
                  <th className="px-5 py-4 font-medium text-slate-600 dark:text-slate-300">Student</th>
                  <th className="px-5 py-4 font-medium text-slate-600 dark:text-slate-300">University</th>
                  <th className="px-5 py-4 font-medium text-slate-600 dark:text-slate-300">Status</th>
                  <th className="px-5 py-4 font-medium text-slate-600 dark:text-slate-300">Submitted</th>
                  <th className="px-5 py-4 font-medium text-slate-600 dark:text-slate-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {verifications.map((verification) => (
                  <tr
                    key={verification.id}
                    className="border-b border-slate-200 last:border-0 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                  >
                    <td className="px-5 py-4">
                      <p className="font-medium text-slate-900 dark:text-white">{verification.user?.name || "Unknown"}</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500">{verification.user?.email}</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-sm font-medium text-slate-900 dark:text-white">{verification.universityName}</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500">{verification.department} · {verification.session}</p>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusColor(verification.status)}`}>
                        {verification.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-slate-500 dark:text-slate-400">{formatDate(verification.createdAt)}</td>
                    <td className="px-5 py-4 text-right space-y-2 sm:space-y-0 sm:flex sm:justify-end sm:items-center sm:gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openPreview(verification.studentIdCardUrl)}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View ID
                      </Button>
                      {verification.status === "PENDING" && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-emerald-600"
                            onClick={() => handleApprove(verification.id)}
                            disabled={actionLoading === verification.id}
                          >
                            <CheckCircle className="mr-2 h-4 w-4" />
                            {actionLoading === verification.id ? "Approving..." : "Approve"}
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleReject(verification.id)}
                            disabled={actionLoading === verification.id}
                          >
                            <XCircle className="mr-2 h-4 w-4" />
                            {actionLoading === verification.id ? "Rejecting..." : "Reject"}
                          </Button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Student ID card preview</DialogTitle>
            <DialogDescription>This image was uploaded by the student for verification review.</DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            {activePreviewUrl ? (
              <img
                src={getImageUrl(activePreviewUrl)}
                alt="Student ID card preview"
                className="w-full rounded-3xl border border-slate-200 bg-slate-100 object-contain dark:border-slate-700"
              />
            ) : (
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-10 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
                No image available.
              </div>
            )}
          </div>
          <div className="mt-6 flex justify-end">
            <DialogClose render={<Button variant="outline">Close</Button>} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
