import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/authz";
import { cloudinaryConfigured, uploadToCloudinary } from "@/lib/cloudinary";

const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const MAX_BYTES = 5 * 1024 * 1024;

export const runtime = "nodejs";

export async function POST(req: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }
  if (!ALLOWED.has(file.type)) {
    return NextResponse.json({ error: "Unsupported type" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "File too large (max 5MB)" }, { status: 400 });
  }

  if (cloudinaryConfigured()) {
    try {
      const { result, method } = await uploadToCloudinary(file);
      return NextResponse.json(
        { url: result.secure_url, publicId: result.public_id, provider: `cloudinary:${method}` },
        { status: 201 }
      );
    } catch (err: any) {
      console.error("[upload] Cloudinary failed, falling back to inline base64:", err?.message);
    }
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const dataUri = `data:${file.type};base64,${bytes.toString("base64")}`;
  return NextResponse.json({ url: dataUri, provider: "inline" }, { status: 201 });
}
