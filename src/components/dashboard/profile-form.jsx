"use client";

import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Upload, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useMe, useUpdateMe } from "@/lib/data/hooks";
import { uploadToImgbb } from "@/lib/imgbb";
import { initialsOf } from "@/components/layout/user-menu";

const BD_PHONE_REGEX = /^(?:\+?880|0)1[3-9]\d{8}$/;

const profileSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(80, "Name cannot exceed 80 characters"),
  image: z.string().url("Must be a valid URL").or(z.literal("")).optional(),
  phone: z.string().refine((val) => !val || BD_PHONE_REGEX.test(val.replace(/[\s-]/g, "")), {
    message: "Enter a valid Bangladesh phone number (+8801... or 01...)",
  }),
  address: z.string().max(200, "Address cannot exceed 200 characters").optional(),
});

function InnerProfileForm({ user, role, onSaveSuccess }) {
  const updateMe = useUpdateMe();
  const [name, setName] = useState(user?.name || "");
  const [image, setImage] = useState(user?.image || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [address, setAddress] = useState(user?.address || "");
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  async function handleImageUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const url = await uploadToImgbb(file);
      setImage(url);
      toast.success("Image uploaded successfully");
    } catch (err) {
      toast.error(err.message || "Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const parsed = profileSchema.safeParse({ name, image, phone, address });
    if (!parsed.success) {
      toast.error(parsed.error.errors[0]?.message || "Validation failed");
      return;
    }

    try {
      setIsSaving(true);
      await updateMe.mutateAsync({
        name: name.trim(),
        image: image.trim() || null,
        phone: phone ? phone.replace(/[\s-]/g, "") : "",
        address: address.trim(),
      });
      toast.success("Profile saved successfully");
      onSaveSuccess?.();
    } catch (err) {
      toast.error(err.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 rounded-[22px] border border-border bg-surface p-6 sm:p-8 shadow-sm">
      <div className="flex items-center gap-4 border-b border-border pb-6">
        <Avatar className="size-16 border-2 border-border">
          {image && <AvatarImage src={image} alt={name} />}
          <AvatarFallback className="bg-primary text-primary-foreground font-mono text-base font-bold">
            {initialsOf(name, user?.email)}
          </AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-lg font-bold text-foreground">{name || "User"}</h2>
          <p className="text-xs text-muted capitalize">{role || user?.role || "Customer"}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-muted mb-1.5">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-[10px] border border-border bg-raised px-3.5 py-2.5 text-sm text-foreground focus-visible:outline-none focus-visible:border-primary"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-muted mb-1.5">Email</label>
          <input
            type="email"
            disabled
            value={user?.email || ""}
            className="w-full rounded-[10px] border border-border bg-raised/50 px-3.5 py-2.5 text-sm text-muted cursor-not-allowed opacity-75"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-muted mb-1.5">Photo URL or Upload</label>
        <div className="flex gap-2">
          <input
            type="url"
            placeholder="https://..."
            value={image}
            onChange={(e) => setImage(e.target.value)}
            className="flex-1 rounded-[10px] border border-border bg-raised px-3.5 py-2 text-xs font-mono text-foreground focus-visible:outline-none focus-visible:border-primary"
          />
          <label className="relative inline-flex items-center justify-center gap-1.5 rounded-[10px] border border-border bg-raised px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-surface cursor-pointer">
            {isUploading ? <Loader2 className="size-3.5 animate-spin" /> : <Upload className="size-3.5" />}
            <span>Upload</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={isUploading}
              className="sr-only"
            />
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-muted mb-1.5">Phone number</label>
          <input
            type="tel"
            placeholder="+880 1712-345678"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full rounded-[10px] border border-border bg-raised px-3.5 py-2.5 text-sm font-mono text-foreground focus-visible:outline-none focus-visible:border-primary"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-muted mb-1.5">Address</label>
          <input
            type="text"
            placeholder="City, District"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full rounded-[10px] border border-border bg-raised px-3.5 py-2.5 text-sm text-foreground focus-visible:outline-none focus-visible:border-primary"
          />
        </div>
      </div>

      <div className="pt-2 flex justify-start">
        <Button variant="action" type="submit" disabled={isSaving || isUploading}>
          {isSaving ? "Saving..." : "Save profile"}
        </Button>
      </div>
    </form>
  );
}

export default function ProfileForm({ title = "Profile", role = "Customer" }) {
  const { data: meData, isPending } = useMe();
  const user = meData?.data || meData?.user || meData;

  return (
    <div className="flex flex-col gap-6 max-w-2xl text-left">
      <div className="flex flex-col gap-1 border-b border-border pb-4">
        <p className="font-mono text-xs uppercase tracking-wider text-muted">DASHBOARD / PROFILE</p>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">{title}</h1>
      </div>

      {isPending ? (
        <div className="flex items-center gap-2 text-sm text-muted animate-pulse py-8">
          <Loader2 className="size-4 animate-spin" />
          <span>Loading profile...</span>
        </div>
      ) : (
        <InnerProfileForm key={user?._id || user?.id || user?.email} user={user} role={role} />
      )}
    </div>
  );
}
