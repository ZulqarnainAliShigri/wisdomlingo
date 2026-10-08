import React, { useEffect, useState } from "react";
import { Image as ImageIcon, KeyRound, Trash2, Upload, UserRound } from "lucide-react";
import { toast } from "react-toastify";
import { useAuth } from "../../hooks/useAuth";
import { isSupabaseConfigured, supabase } from "../../lib/supabase";
import { deleteImageByUrl, uploadImage } from "../../lib/storage";
import { errorMessage } from "../../lib/utils";
import { Avatar } from "../ui/Avatar";
import { Spinner } from "../ui/Loader";
import { Modal } from "../ui/Modal";

/** Photos live beside the course images, in their own folder of the same bucket. */
const AVATAR_FOLDER = "avatars";

type ProfileUser = { email?: string; user_metadata?: Record<string, any> } | null;

/** The name to greet the admin by: their chosen name, else the local part of the email. */
export function displayName(user: ProfileUser): string {
  const full = (user?.user_metadata?.full_name as string | undefined)?.trim();
  if (full) return full;
  return user?.email?.split("@")[0] ?? "Admin";
}

export function avatarUrl(user: ProfileUser): string | null {
  return (user?.user_metadata?.avatar_url as string | undefined) || null;
}

export const ProfileModal: React.FC<{ open: boolean; onClose: () => void }> = ({
  open,
  onClose,
}) => {
  const { user, refreshUser } = useAuth();

  const [name, setName] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const [savingProfile, setSavingProfile] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  // Re-seed from the session each time the dialog opens, so a cancelled edit
  // does not linger the next time it is opened.
  useEffect(() => {
    if (!open) return;
    setName((user?.user_metadata?.full_name as string | undefined) ?? "");
    setPhoto(avatarUrl(user));
    setPassword("");
    setConfirmPassword("");
  }, [open, user]);

  const email = user?.email ?? "";
  const savedName = ((user?.user_metadata?.full_name as string | undefined) ?? "").trim();
  const dirty = name.trim() !== savedName || photo !== avatarUrl(user);

  const handlePhoto = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = ""; // allow re-selecting the same file
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadImage(file, AVATAR_FOLDER);
      setPhoto(url);
      toast.success("Photo uploaded. Save to apply it.");
    } catch (error) {
      toast.error(errorMessage(error, "Could not upload the photo."));
    } finally {
      setUploading(false);
    }
  };

  const saveProfile = async () => {
    if (!isSupabaseConfigured) {
      toast.error("Supabase is not connected, so the profile cannot be saved.");
      return;
    }
    setSavingProfile(true);
    const previous = avatarUrl(user);
    try {
      const { error } = await supabase.auth.updateUser({
        data: { full_name: name.trim(), avatar_url: photo },
      });
      if (error) throw error;

      // Only once the new URL is safely stored is the old file removed, so a
      // failed save never leaves the account pointing at a deleted image.
      if (previous && previous !== photo) await deleteImageByUrl(previous);

      await refreshUser();
      toast.success("Profile updated.");
    } catch (error) {
      toast.error(errorMessage(error, "Could not save the profile."));
    } finally {
      setSavingProfile(false);
    }
  };

  const changePassword = async () => {
    if (password.length < 8) {
      toast.error("Use at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("The two passwords do not match.");
      return;
    }
    setChangingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast.success("Password changed. Use it the next time you sign in.");
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      toast.error(errorMessage(error, "Could not change the password."));
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <Modal open={open} title="Your profile" onClose={onClose} width="max-w-lg">
      <div className="space-y-7">
        {/* Photo and name */}
        <section>
          <h4 className="flex items-center gap-2 text-sm font-bold text-slate-900">
            <UserRound className="h-4 w-4 text-primary" /> Photo and name
          </h4>

          <div className="mt-4 flex items-center gap-4">
            <Avatar src={photo} name={name || email} className="h-16 w-16 text-xl" />
            <div className="flex flex-wrap gap-2">
              <label className="btn-ghost cursor-pointer !py-2.5 text-xs">
                {uploading ? <Spinner /> : <Upload className="h-4 w-4" />}
                {uploading ? "Uploading..." : photo ? "Change photo" : "Upload photo"}
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  className="hidden"
                  onChange={handlePhoto}
                  disabled={uploading || !isSupabaseConfigured}
                />
              </label>
              {photo && (
                <button
                  type="button"
                  onClick={() => setPhoto(null)}
                  className="btn-ghost !py-2.5 text-xs text-accent"
                >
                  <Trash2 className="h-4 w-4" /> Remove
                </button>
              )}
            </div>
          </div>

          <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-400">
            <ImageIcon className="h-3.5 w-3.5" /> JPG, PNG, WEBP or GIF up to 5 MB.
          </p>

          <div className="mt-5">
            <label className="label" htmlFor="profile-name">
              Display name
            </label>
            <input
              id="profile-name"
              className="input"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="e.g. Raza Abidi"
              autoComplete="name"
            />
            <p className="mt-1.5 text-xs text-slate-400">
              Shown in the dashboard header. It is not published on the website.
            </p>
          </div>

          <div className="mt-5 rounded-xl bg-slate-50 p-4">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Email</p>
            <p className="mt-0.5 text-sm font-semibold text-slate-800">{email}</p>
            <p className="mt-1 text-xs text-slate-500">
              The sign-in address is fixed here. Change it in Supabase, under Authentication then
              Users.
            </p>
          </div>

          <button
            type="button"
            onClick={saveProfile}
            disabled={savingProfile || uploading || !dirty || !isSupabaseConfigured}
            className="btn-primary mt-4 w-full sm:w-auto"
          >
            {savingProfile ? <Spinner /> : <UserRound className="h-4 w-4" />}
            Save profile
          </button>
        </section>

        <hr className="border-slate-200" />

        {/* Password */}
        <section>
          <h4 className="flex items-center gap-2 text-sm font-bold text-slate-900">
            <KeyRound className="h-4 w-4 text-primary" /> Password
          </h4>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="profile-password">
                New password
              </label>
              <input
                id="profile-password"
                type="password"
                className="input"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="At least 8 characters"
                autoComplete="new-password"
              />
            </div>
            <div>
              <label className="label" htmlFor="profile-password-confirm">
                Confirm new password
              </label>
              <input
                id="profile-password-confirm"
                type="password"
                className="input"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Type it again"
                autoComplete="new-password"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={changePassword}
            disabled={changingPassword || !password || !isSupabaseConfigured}
            className="btn-ghost mt-4 w-full sm:w-auto"
          >
            {changingPassword ? <Spinner /> : <KeyRound className="h-4 w-4" />}
            Change password
          </button>
        </section>
      </div>
    </Modal>
  );
};
