import crypto from "crypto";

export type CloudinaryUploadResult = {
  secure_url: string;
  public_id: string;
  width?: number;
  height?: number;
  format?: string;
};

function getEnv() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !apiSecret) return null;
  return { cloudName, apiKey, apiSecret };
}

export function cloudinaryConfigured(): boolean {
  return getEnv() !== null;
}

function signParams(params: Record<string, string | number>, apiSecret: string): string {
  const sorted = Object.keys(params)
    .filter((k) => params[k] !== undefined && params[k] !== "")
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join("&");
  return crypto.createHash("sha1").update(sorted + apiSecret).digest("hex");
}

export async function uploadToCloudinary(
  file: File,
  options: { folder?: string } = {}
): Promise<CloudinaryUploadResult> {
  const env = getEnv();
  if (!env) throw new Error("Cloudinary not configured");

  const timestamp = Math.round(Date.now() / 1000);
  const folder = options.folder ?? "kurumalink";

  const signed = signParams({ folder, timestamp }, env.apiSecret);

  const form = new FormData();
  form.append("file", file);
  form.append("api_key", env.apiKey);
  form.append("timestamp", String(timestamp));
  form.append("folder", folder);
  form.append("signature", signed);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${env.cloudName}/image/upload`,
    { method: "POST", body: form }
  );

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Cloudinary upload failed: ${res.status} ${text}`);
  }

  const json = (await res.json()) as CloudinaryUploadResult;
  return json;
}
