import { useState } from "react";
import { Camera, Mail, User } from "lucide-react";
import toast from "react-hot-toast";

import Avatar from "../components/Avatar";
import { useAuthStore } from "../store/useAuthStore";
import { MAX_IMAGE_SIZE_MB } from "../constants";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      e.target.value = "";
      return;
    }

    if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
      toast.error(`Image must be smaller than ${MAX_IMAGE_SIZE_MB}MB`);
      e.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);

      try {
        await updateProfile({ profilePic: base64Image });
      } catch {
        // Upload failed - drop the preview so we don't show a photo that was never saved.
        setSelectedImg(null);
      }
    };
  };

  return (
    <div className="h-full overflow-y-auto bg-base-200">
      <div className="max-w-xl mx-auto px-4 py-10 space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Profile</h1>
          <p className="text-sm text-base-content/50 mt-1">Your account details</p>
        </div>

        {/* Avatar */}
        <div className="bg-base-100 border border-base-300 rounded-2xl p-6 flex flex-col items-center gap-3">
          <div className="relative">
            <div className="rounded-full ring-4 ring-base-300">
              <Avatar
                user={{ ...authUser, profilePic: selectedImg || authUser.profilePic }}
                className="size-28 text-3xl"
              />
            </div>
            <label
              htmlFor="avatar-upload"
              className={`absolute bottom-0 right-0 p-2 rounded-full bg-primary text-primary-content
                cursor-pointer hover:scale-105 transition-transform
                ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}`}
            >
              <Camera className="size-4" />
              <input
                type="file"
                id="avatar-upload"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={isUpdatingProfile}
              />
            </label>
          </div>
          <p className="text-xs text-base-content/50">
            {isUpdatingProfile ? "Uploading..." : "Click the camera icon to change your photo"}
          </p>
        </div>

        {/* Details */}
        <div className="bg-base-100 border border-base-300 rounded-2xl divide-y divide-base-300">
          <div className="p-4 flex items-center gap-3">
            <div className="size-9 rounded-xl bg-base-200 flex items-center justify-center shrink-0">
              <User className="size-4 text-base-content/60" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-base-content/50">Full name</p>
              <p className="text-sm truncate">{authUser?.fullName}</p>
            </div>
          </div>

          <div className="p-4 flex items-center gap-3">
            <div className="size-9 rounded-xl bg-base-200 flex items-center justify-center shrink-0">
              <Mail className="size-4 text-base-content/60" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-base-content/50">Email address</p>
              <p className="text-sm truncate">{authUser?.email}</p>
            </div>
          </div>
        </div>

        {/* Account info */}
        <div className="bg-base-100 border border-base-300 rounded-2xl p-4 space-y-3">
          <h2 className="text-sm font-medium">Account information</h2>
          <div className="flex items-center justify-between text-sm">
            <span className="text-base-content/50">Member since</span>
            <span>{authUser.createdAt?.split("T")[0]}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-base-content/50">Status</span>
            <span className="flex items-center gap-1.5 text-success">
              <span className="size-1.5 rounded-full bg-success" />
              Active
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
