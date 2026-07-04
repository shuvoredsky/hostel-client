import browserClient from "@/lib/browserClient";
import {
  IUser,
  ILoginInput,
  IRegisterStudentInput,
  IRegisterOwnerInput,
  IRegisterTenantInput,
} from "@/types/auth.types";
import { ApiResponse } from "@/types/api.types";

export const login = async (payload: ILoginInput) => {
  const response = await browserClient.post<ApiResponse<IUser>>(
    "/auth/login",
    payload
  );
  return response.data;
};

export const registerStudent = async (payload: IRegisterStudentInput) => {
  const response = await browserClient.post<ApiResponse<IUser>>(
    "/auth/register/student",
    payload
  );
  return response.data;
};

export const registerOwner = async (payload: IRegisterOwnerInput) => {
  const response = await browserClient.post<ApiResponse<IUser>>(
    "/auth/register/owner",
    payload
  );
  return response.data;
};

export const registerTenant = async (payload: IRegisterTenantInput) => {
  const response = await browserClient.post<ApiResponse<IUser>>(
    "/auth/register/tenant",
    payload
  );
  return response.data;
};

export const logout = async () => {
  const response = await browserClient.post<ApiResponse<null>>(
    "/auth/logout",
    {}
  );
  return response.data;
};