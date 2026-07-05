export type UserRole = "STUDENT" | "OWNER" | "ADMIN" | "TENANT";
export type UserStatus = "ACTIVE" | "BLOCKED";

export type Gender = "MALE" | "FEMALE" | "OTHER";

export type TenantType =
  | "JOB_HOLDER"
  | "FREELANCER"
  | "INTERN"
  | "BUSINESS_PERSON"
  | "FAMILY"
  | "OTHERS";

export type Profession =
  | "SOFTWARE_ENGINEER"
  | "DOCTOR"
  | "TEACHER"
  | "BANKER"
  | "FREELANCER"
  | "BUSINESS"
  | "OTHERS";

export interface IUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  image?: string;
  phone?: string;
  whatsappNumber?: string;
  gender?: Gender;
  profession?: Profession;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ILoginInput {
  email: string;
  password: string;
}

// Base payload — Owner registration যেহেতু extra field নেয় না
export interface IRegisterInput {
  name: string;
  email: string;
  password: string;
}

export interface IRegisterStudentInput extends IRegisterInput {
  gender: Gender;
}

export interface IRegisterOwnerInput extends IRegisterInput {
  whatsappNumber: string;
}

export interface IRegisterTenantInput extends IRegisterInput {
  gender: Gender;
  tenantType: TenantType;
  profession?: Profession;
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
