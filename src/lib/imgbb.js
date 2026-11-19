const IMGBB_ENDPOINT = "https://api.imgbb.com/1/upload";

export async function uploadToImgbb(file) {
  const key = process.env.NEXT_PUBLIC_IMGBB_KEY;

  if (!key) {
    throw new Error("Image upload is not configured (NEXT_PUBLIC_IMGBB_KEY)");
  }

  const body = new FormData();
  body.append("image", file);

  const response = await fetch(`${IMGBB_ENDPOINT}?key=${encodeURIComponent(key)}`, {
    method: "POST",
    body,
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok || !payload?.success) {
    throw new Error(payload?.error?.message || "Image upload failed");
  }

  return payload.data.url;
}
