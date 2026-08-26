import { STORAGE_BUCKET, isSupabaseConfigured, supabase } from "./supabase";

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5 MB
export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

/**
 * Uploads an image to the Supabase storage bucket `course-images`
 * and returns its public URL. Throws on validation or network failure.
 */
export async function uploadImage(
  file: File,
  folder: string = "courses"
): Promise<string> {
  if (!isSupabaseConfigured) {
    throw new Error("Supabase is not configured - image upload is unavailable.");
  }
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    throw new Error("Only JPG, PNG, WEBP or GIF images are allowed.");
  }
  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error("Image is larger than 5 MB. Please choose a smaller file.");
  }

  const extension = (file.name.split(".").pop() || "jpg").toLowerCase();
  const unique = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  const path = `${folder}/${unique}.${extension}`;

  const { error: uploadError } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(path, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type,
    });

  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
  if (!data?.publicUrl) throw new Error("Could not resolve the public image URL.");
  return data.publicUrl;
}

/** Removes an uploaded image from the bucket, given its public URL. */
export async function deleteImageByUrl(publicUrl: string | null): Promise<void> {
  if (!publicUrl || !isSupabaseConfigured) return;
  const marker = `/${STORAGE_BUCKET}/`;
  const index = publicUrl.indexOf(marker);
  if (index === -1) return; // external URL, nothing of ours to delete
  const path = publicUrl.slice(index + marker.length);
  await supabase.storage.from(STORAGE_BUCKET).remove([path]);
}
