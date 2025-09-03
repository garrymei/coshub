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

// 直传单文件到对象存储
export async function uploadFile(
  filePath: string,
  scene = "common",
): Promise<{ url: string }> {
  const config: any = await getUploadConfig();
  const uploadUrl = config?.data?.uploadUrl || (config as any).uploadUrl;
  const formData = config?.data?.formData || (config as any).formData || {};
  const res = await wx.uploadFile({
    url: uploadUrl,
    filePath,
    name: "file",
    formData: { ...formData, scene },
  });
  const result = JSON.parse((res as any).data || "{}");
  return { url: result.url || result.data?.url };
}
