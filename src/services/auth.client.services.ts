import browserClient from "@/lib/browserClient";
import { IUser, ILoginInput, IRegisterInput } from "@/types/auth.types";
import { ApiResponse } from "@/types/api.types";

export const login = async (payload: ILoginInput) => {
  const response = await browserClient.post<ApiResponse<IUser>>(
    "/auth/login",
    payload
  );
  return response.data;
};

export const registerStudent = async (payload: IRegisterInput) => {
  const response = await browserClient.post<ApiResponse<IUser>>(
    "/auth/register/student",
    payload
  );
  return response.data;
};

export const registerOwner = async (payload: IRegisterInput) => {
  const response = await browserClient.post<ApiResponse<IUser>>(
    "/auth/register/owner",
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