import browserClient from "@/lib/browserClient";
import { ApiResponse } from "@/types/api.types";
import {
  IStudentVerification,
  IStudentVerificationReviewPayload,
} from "@/types/verification.types";

export const submitVerification = async (payload: FormData) => {
  const response = await browserClient.post<ApiResponse<IStudentVerification>>(
    "/verification/submit",
    payload
  );
  return response.data;
};

export const getMyVerification = async () => {
  const response = await browserClient.get<ApiResponse<IStudentVerification | null>>(
    "/verification/me"
  );
  return response.data;
};

export const getAllVerifications = async (status?: string) => {
  const response = await browserClient.get<ApiResponse<IStudentVerification[]>>(
    "/verification",
    {
      params: { status: status || undefined },
    }
  );
  return response.data;
};

export const approveVerification = async (id: string) => {
  const response = await browserClient.patch<ApiResponse<IStudentVerification>>(
    `/verification/${id}/approve`,
    {}
  );
  return response.data;
};

export const rejectVerification = async (
  id: string,
  payload: IStudentVerificationReviewPayload
) => {
  const response = await browserClient.patch<ApiResponse<IStudentVerification>>(
    `/verification/${id}/reject`,
    payload
  );
  return response.data;
};
