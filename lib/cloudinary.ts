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
  const preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
  return { cloudName, apiKey, apiSecret, preset };
}

export function cloudinaryConfigured(): boolean {
  const { cloudName, apiKey, apiSecret, preset } = getEnv();
  if (!cloudName) return false;
  return Boolean((apiKey && apiSecret) || preset);
}

function signParams(params: Record<string, string | number>, apiSecret: string): string {
  const sorted = Object.keys(params)
    .filter((k) => params[k] !== undefined && params[k] !== "")
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join("&");
  return crypto.createHash("sha1").update(sorted + apiSecret).digest("hex");
}

async function uploadSigned(file: File, folder: string): Promise<CloudinaryUploadResult> {
  const { cloudName, apiKey, apiSecret } = getEnv();
  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Signed upload requires CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET");
  }

  const timestamp = Math.round(Date.now() / 1000);
  const signature = signParams({ folder, timestamp }, apiSecret);

  const form = new FormData();
  form.append("file", file);
  form.append("api_key", apiKey);
  form.append("timestamp", String(timestamp));
  form.append("folder", folder);
  form.append("signature", signature);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: "POST", body: form }
  );
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Signed upload ${res.status}: ${text.slice(0, 250)}`);
  }
  return (await res.json()) as CloudinaryUploadResult;
}

async function uploadUnsigned(file: File, folder: string): Promise<CloudinaryUploadResult> {
  const { cloudName, preset } = getEnv();
  if (!cloudName || !preset) {
    throw new Error("Unsigned upload requires CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET");
  }

  const form = new FormData();
  form.append("file", file);
  form.append("upload_preset", preset);
  form.append("folder", folder);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: "POST", body: form }
  );
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Unsigned upload ${res.status}: ${text.slice(0, 250)}`);
  }
  return (await res.json()) as CloudinaryUploadResult;
}

export async function uploadToCloudinary(
  file: File,
  options: { folder?: string } = {}
): Promise<{ result: CloudinaryUploadResult; method: "signed" | "unsigned" }> {
  const { apiKey, apiSecret, preset } = getEnv();
  const folder = options.folder ?? "kurumalink";

  const errors: string[] = [];

  if (apiKey && apiSecret) {
    try {
      const result = await uploadSigned(file, folder);
      return { result, method: "signed" };
    } catch (err: any) {
      errors.push(`signed: ${err?.message ?? err}`);
    }
  }
  if (preset) {
    try {
      const result = await uploadUnsigned(file, folder);
      return { result, method: "unsigned" };
    } catch (err: any) {
      errors.push(`unsigned: ${err?.message ?? err}`);
    }
  }

  throw new Error(errors.join(" | ") || "Cloudinary not configured");
}
