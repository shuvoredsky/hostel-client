import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
});

export const genderEnum = z.enum(["MALE", "FEMALE", "OTHER"]);

export const tenantTypeEnum = z.enum([
  "JOB_HOLDER",
  "FREELANCER",
  "INTERN",
  "BUSINESS_PERSON",
  "FAMILY",
  "OTHERS",
]);

export const professionEnum = z.enum([
  "SOFTWARE_ENGINEER",
  "DOCTOR",
  "TEACHER",
  "BANKER",
  "FREELANCER",
  "BUSINESS",
  "OTHERS",
]);

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, "Name is required")
      .min(3, "Name must be at least 3 characters"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Invalid email address"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    role: z.enum(["STUDENT", "OWNER", "TENANT"]),
    gender: genderEnum.optional(),
    tenantType: tenantTypeEnum.optional(),
    profession: professionEnum.optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .refine(
    (data) =>
      data.role === "STUDENT" || data.role === "TENANT"
        ? !!data.gender
        : true,
    {
      message: "Please select your gender",
      path: ["gender"],
    }
  )
  .refine((data) => (data.role === "TENANT" ? !!data.tenantType : true), {
    message: "Please select what best describes you",
    path: ["tenantType"],
  });

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address"),
});

export const resetPasswordSchema = z
  .object({
    otp: z
      .string()
      .min(1, "OTP is required")
      .length(6, "OTP must be 6 digits"),
    newPassword: z
      .string()
      .min(1, "Password is required")
      .min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(1, "New password is required")
      .min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;