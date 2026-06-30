import crypto from "crypto";
import fs from "fs";
import { config } from "dotenv";

config();
config({ path: ".env.local" });

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

if (!cloudName || !apiKey || !apiSecret) {
  console.error("Missing CLOUDINARY env vars");
  process.exit(1);
}

const pngBytes = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==",
  "base64"
);

const timestamp = Math.round(Date.now() / 1000);
const folder = "kurumalink";

function signParams(params, secret) {
  const sorted = Object.keys(params)
    .filter((k) => params[k] !== undefined && params[k] !== "")
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join("&");
  return crypto.createHash("sha1").update(sorted + secret).digest("hex");
}

const signature = signParams({ folder, timestamp }, apiSecret);

const form = new FormData();
form.append("file", new Blob([pngBytes], { type: "image/png" }), "test.png");
form.append("api_key", apiKey);
form.append("timestamp", String(timestamp));
form.append("folder", folder);
form.append("signature", signature);

const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
  method: "POST",
  body: form,
});

const text = await res.text();
console.log("Status:", res.status);
console.log(text.slice(0, 500));
