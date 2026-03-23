"use server";

import { httpClient } from "@/lib/httpClient";
import { IUser } from "@/types/auth.types";
import {
  IChangePasswordInput,
  IForgotPasswordInput,
  IResetPasswordInput,
  IVerifyEmailInput,
} from "@/types/auth.types";

// ─── Server Side Only ─────────────────────────────────────────────────────────

export const getMe = async () => {
  try {
    const response = await httpClient.get<IUser>("/auth/me");
    return response;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};

export const changePassword = async (payload: IChangePasswordInput) => {
  try {
    const response = await httpClient.post<null>(
      "/auth/change-password",
      payload
    );
    return response;
  } catch (error) {
    console.error("Error changing password:", error);
    throw error;
  }
};

export const verifyEmail = async (payload: IVerifyEmailInput) => {
  try {
    const response = await httpClient.post<null>(
      "/auth/verify-email",
      payload
    );
    return response;
  } catch (error) {
    console.error("Error verifying email:", error);
    throw error;
  }
};

export const forgotPassword = async (payload: IForgotPasswordInput) => {
  try {
    const response = await httpClient.post<null>(
      "/auth/forget-password",
      payload
    );
    return response;
  } catch (error) {
    console.error("Error sending forgot password:", error);
    throw error;
  }
};

export const resetPassword = async (payload: IResetPasswordInput) => {
  try {
    const response = await httpClient.post<null>(
      "/auth/reset-password",
      payload
    );
    return response;
  } catch (error) {
    console.error("Error resetting password:", error);
    throw error;
  }
};