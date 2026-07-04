import { z } from "zod";

export const studentVerificationSchema = z.object({
  universityName: z.string().min(1, "University name is required"),
  department: z.string().min(1, "Department is required"),
  session: z.string().min(1, "Session is required"),
});

export type StudentVerificationFormValues = z.infer<
  typeof studentVerificationSchema
>;

export const verificationRejectSchema = z.object({
  rejectionReason: z.string().optional(),
});

export type VerificationRejectFormValues = z.infer<
  typeof verificationRejectSchema
>;
