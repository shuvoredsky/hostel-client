export type StudentVerificationStatus = "PENDING" | "VERIFIED" | "REJECTED";

export interface IStudentVerification {
  id: string;
  userId: string;
  studentIdCardUrl: string;
  universityName: string;
  department: string;
  session: string;
  status: StudentVerificationStatus;
  rejectionReason?: string | null;
  reviewedById?: string | null;
  reviewedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
  };
}

export interface IStudentVerificationSubmitPayload {
  universityName: string;
  department: string;
  session: string;
  studentIdCard: File;
}

export interface IStudentVerificationReviewPayload {
  rejectionReason?: string;
}
