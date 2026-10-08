import React, { useState } from "react";
import { Image as ImageIcon, Upload } from "lucide-react";
import { toast } from "react-toastify";
import { uploadImage } from "../../lib/storage";
import { STORAGE_BUCKET } from "../../lib/supabase";
import { errorMessage } from "../../lib/utils";
import { MediaImage } from "../ui/MediaImage";
import { Spinner } from "../ui/Loader";

interface ImageUploadFieldProps {
  value: string;
  onChange: (url: string) => void;
  /** Folder inside the storage bucket, e.g. "courses" or "countries". */
  folder?: string;
  label?: string;
  onUploadingChange?: (uploading: boolean) => void;
}

/** Uploads straight to the Supabase storage bucket and stores the public URL. */
export const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  value,
  onChange,
  folder = "courses",
  label = "Image",
  onUploadingChange,
}) => {
  const [uploading, setUploading] = useState(false);

  const setBusy = (busy: boolean) => {
    setUploading(busy);
    onUploadingChange?.(busy);
  };

  const handleFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = ""; // allow re-selecting the same file
    if (!file) return;

    setBusy(true);
    try {
      const publicUrl = await uploadImage(file, folder);
      onChange(publicUrl);
      toast.success("Image uploaded.");
    } catch (error) {
      toast.error(errorMessage(error, "Image upload failed."));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <span className="label">{label}</span>
      <div className="flex flex-col gap-4 rounded-xl border border-dashed border-slate-300 p-4 sm:flex-row sm:items-center">
        <MediaImage
          src={value || null}
          alt="Preview"
          className="h-24 w-full shrink-0 rounded-lg sm:w-36"
          fallbackIcon={<ImageIcon className="h-6 w-6" />}
        />
        <div className="flex-1">
          <label className="btn-ghost cursor-pointer !py-2.5">
            {uploading ? <Spinner /> : <Upload className="h-4 w-4" />}
            {uploading ? "Uploading..." : "Upload image"}
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              className="hidden"
              onChange={handleFile}
              disabled={uploading}
            />
          </label>
          <p className="mt-2 text-xs text-slate-500">
            JPG, PNG, WEBP or GIF up to 5 MB. Stored in the
            <code className="mx-1 rounded bg-slate-100 px-1">{STORAGE_BUCKET}</code>
            bucket.
          </p>
          {value && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="mt-2 text-xs font-semibold text-accent hover:underline"
            >
              Remove image
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
