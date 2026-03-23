export type UserRole = "STUDENT" | "OWNER" | "ADMIN";
export type UserStatus = "ACTIVE" | "BLOCKED";

export interface IUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  image?: string; 
  phone?: string;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ILoginInput {
  email: string;
  password: string;
}

export interface IRegisterInput {
  name: string;
  email: string;
  password: string;
}

export interface IChangePasswordInput {
  currentPassword: string;
  newPassword: string;
}

export interface IForgotPasswordInput {
  email: string;
}

export interface IResetPasswordInput {
  email: string;
  otp: string;
  newPassword: string;
}

export interface IVerifyEmailInput {
  email: string;
  otp: string;
}