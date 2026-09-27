import { API_URL } from "../config";

export const DEFAULT_CAR_IMAGE =
  "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=800";

/**
 * Resolves vehicle image URLs cleanly:
 * - If already a Cloudinary or remote HTTPS link, returns as-is.
 * - If pointing to localhost:5000 in production, swaps it with active API_URL.
 * - If a relative path (/uploads/...), prepends API_URL.
 * - If invalid/empty, returns a high-res default car placeholder.
 */
export const formatVehicleImageUrl = (imgInput) => {
  let imgUrl = imgInput;
  if (Array.isArray(imgInput)) {
    imgUrl = imgInput.find((img) => typeof img === "string" && img.trim() !== "") || null;
  }

  if (!imgUrl || typeof imgUrl !== "string" || imgUrl.trim() === "") {
    return DEFAULT_CAR_IMAGE;
  }

  const trimmed = imgUrl.trim();

  // If it's a blob/object URL or inline data URI, return as-is
  if (trimmed.startsWith("blob:") || trimmed.startsWith("data:")) {
    return trimmed;
  }

  // If it's a localhost link from an older upload or local DB
  if (trimmed.startsWith("http://localhost:5000") || trimmed.startsWith("http://127.0.0.1:5000")) {
    if (API_URL && !API_URL.includes("localhost")) {
      return trimmed.replace(/http:\/\/(localhost|127\.0\.0\.1):5000/, API_URL.replace(/\/$/, ""));
    }
  }

  // If it's a relative path (/uploads/...)
  if (trimmed.startsWith("/uploads/")) {
    return `${API_URL.replace(/\/$/, "")}${trimmed}`;
  }

  return trimmed;
};

/**
 * Image onError handler to prevent broken image icons / text
 */
export const handleImageError = (e, fallbackUrl = DEFAULT_CAR_IMAGE) => {
  if (e?.target) {
    e.target.onerror = null; // Prevent infinite error loops
    e.target.src = fallbackUrl;
  }
};
