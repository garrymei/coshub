import { request } from "@/utils/api";

interface GetUploadConfigResponse {
  uploadUrl: string;
  formData: Record<string, string>;
}

export async function getUploadConfig(): Promise<GetUploadConfigResponse> {
  return request({
    url: "/upload/config",
    method: "GET",
  });
}
