"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Upload, Loader2, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { uploadToImgbb } from "@/lib/imgbb";
import { useCreateEquipment, useUpdateEquipment } from "@/lib/data/hooks";

const CATEGORIES = [
  "Construction Equipment", "Photography Equipment", "Vehicles & Transportation",
  "Agriculture Equipment", "Electronics", "Event Equipment",
];

const schema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(80),
  description: z.string().trim().min(5, "Description is required"),
  category: z.string().min(1, "Please select a category"),
  location: z.string().trim().min(2, "Location is required"),
  price: z.coerce.number().int().positive("Price must be a positive integer"),
  rentalType: z.enum(["daily", "weekly", "monthly"]),
  quantity: z.coerce.number().int().min(1, "Quantity must be at least 1"),
  condition: z.string().min(1, "Condition is required"),
  brand: z.string().trim().min(1, "Brand is required"),
  model: z.string().trim().min(1, "Model is required"),
  image: z.string().url("Valid image URL is required"),
  terms: z.string().trim().min(5, "Rental terms are required"),
});

export default function EquipmentForm({
  initialData = null,
  isEdit = false,
  equipmentId = null,
  returnTo = "/dashboard/owner/equipment",
}) {
  const router = useRouter();
  const createEquip = useCreateEquipment();
  const updateEquip = useUpdateEquipment();
  const [isUploading, setIsUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState(initialData?.image || "");

  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      category: initialData?.category || "Construction Equipment",
      location: initialData?.location || "Gazipur, Dhaka",
      price: initialData?.price || 18500,
      rentalType: initialData?.rentalType || "daily",
      quantity: initialData?.quantity || 1,
      condition: initialData?.condition || "Like new",
      brand: initialData?.brand || "",
      model: initialData?.model || "",
      image: initialData?.image || "",
      terms: initialData?.terms || "",
    },
  });

  async function handleImageUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsUploading(true);
      const url = await uploadToImgbb(file);
      setImageUrl(url);
      setValue("image", url, { shouldValidate: true });
      toast.success("Image uploaded to imgbb");
    } catch (err) {
      toast.error(err.message || "Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  }

  async function onSubmit(data) {
    try {
      if (isEdit && equipmentId) {
        await updateEquip.mutateAsync({ id: equipmentId, ...data });
        toast.success("Equipment updated and set to Pending for review");
      } else {
        await createEquip.mutateAsync(data);
        toast.success("Equipment submitted! Status is Pending approval.");
      }
      router.push(returnTo);
    } catch (err) {
      toast.error(err.message || "Operation failed");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 max-w-3xl text-left">
      <div className="flex flex-col gap-1 border-b border-border pb-4">
        <p className="font-mono text-xs uppercase tracking-wider text-muted">
          {isEdit ? "DASHBOARD / EDIT EQUIPMENT" : "DASHBOARD / ADD EQUIPMENT"}
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          {isEdit ? "Edit equipment" : "Add equipment"}
        </h1>
        <p className="text-xs text-muted">
          New and updated listings start as <span className="text-warning font-semibold">Pending</span> until approved.
        </p>
      </div>

      <div className="flex flex-col gap-5 rounded-[22px] border border-border bg-surface p-6 sm:p-8 shadow-sm">
        <div>
          <label className="block text-xs font-medium text-muted mb-1.5">Equipment image</label>
          <div className="flex flex-col sm:flex-row items-center gap-4 rounded-xl border border-dashed border-border bg-raised/40 p-4">
            <div className="relative size-20 shrink-0 overflow-hidden rounded-lg border border-border bg-raised flex items-center justify-center">
              {imageUrl ? (
                <Image fill src={imageUrl} alt="Preview" unoptimized className="object-cover" />
              ) : (
                <ImageIcon className="size-6 text-muted" />
              )}
            </div>
            <div className="flex flex-1 flex-col gap-2 w-full">
              <label className="relative inline-flex w-fit items-center justify-center gap-1.5 rounded-[10px] border border-border bg-raised px-3.5 py-1.5 text-xs font-semibold text-foreground hover:bg-surface cursor-pointer">
                {isUploading ? <Loader2 className="size-3.5 animate-spin" /> : <Upload className="size-3.5" />}
                <span>{isUploading ? "Uploading..." : "Upload image (imgbb)"}</span>
                <input type="file" accept="image/*" onChange={handleImageUpload} disabled={isUploading} className="sr-only" />
              </label>
              <input
                type="url"
                placeholder="Or paste direct image URL (https://...)"
                {...register("image", { onChange: (e) => setImageUrl(e.target.value) })}
                className="w-full rounded-[8px] border border-border bg-raised px-3 py-1.5 text-xs font-mono text-foreground focus-visible:outline-none focus-visible:border-primary"
              />
              {errors.image && <p className="text-xs text-danger">{errors.image.message}</p>}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-muted mb-1.5">Equipment name</label>
            <input type="text" placeholder="e.g. Hydraulic Excavator 20T" {...register("name")} className="w-full rounded-[10px] border border-border bg-raised px-3.5 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:border-primary" />
            {errors.name && <p className="text-xs text-danger mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label className="block text-xs font-medium text-muted mb-1.5">Category</label>
            <select {...register("category")} className="w-full rounded-[10px] border border-border bg-raised px-3.5 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:border-primary">
              {CATEGORIES.map((c) => (<option key={c} value={c}>{c}</option>))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-muted mb-1.5">Location</label>
            <input type="text" placeholder="Gazipur, Dhaka" {...register("location")} className="w-full rounded-[10px] border border-border bg-raised px-3.5 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:border-primary" />
            {errors.location && <p className="text-xs text-danger mt-1">{errors.location.message}</p>}
          </div>
          <div>
            <label className="block text-xs font-medium text-muted mb-1.5">Rental price (৳ integer)</label>
            <input type="number" step={1} min={1} {...register("price")} className="w-full rounded-[10px] border border-border bg-raised px-3.5 py-2 text-sm font-mono text-foreground focus-visible:outline-none focus-visible:border-primary" />
            {errors.price && <p className="text-xs text-danger mt-1">{errors.price.message}</p>}
          </div>
          <div>
            <label className="block text-xs font-medium text-muted mb-1.5">Rental type</label>
            <select {...register("rentalType")} className="w-full rounded-[10px] border border-border bg-raised px-3.5 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:border-primary">
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-muted mb-1.5">Available quantity</label>
            <input type="number" step={1} min={1} {...register("quantity")} className="w-full rounded-[10px] border border-border bg-raised px-3.5 py-2 text-sm font-mono text-foreground focus-visible:outline-none focus-visible:border-primary" />
            {errors.quantity && <p className="text-xs text-danger mt-1">{errors.quantity.message}</p>}
          </div>
          <div>
            <label className="block text-xs font-medium text-muted mb-1.5">Brand</label>
            <input type="text" placeholder="Caterpillar" {...register("brand")} className="w-full rounded-[10px] border border-border bg-raised px-3.5 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:border-primary" />
            {errors.brand && <p className="text-xs text-danger mt-1">{errors.brand.message}</p>}
          </div>
          <div>
            <label className="block text-xs font-medium text-muted mb-1.5">Model / Condition</label>
            <input type="text" placeholder="320 GC" {...register("model")} className="w-full rounded-[10px] border border-border bg-raised px-3.5 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:border-primary" />
            {errors.model && <p className="text-xs text-danger mt-1">{errors.model.message}</p>}
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-muted mb-1.5">Description</label>
          <textarea rows={2} placeholder="What is it, what's included, ideal uses…" {...register("description")} className="w-full rounded-[10px] border border-border bg-raised px-3.5 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:border-primary" />
          {errors.description && <p className="text-xs text-danger mt-1">{errors.description.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-medium text-muted mb-1.5">Rental terms &amp; conditions</label>
          <textarea rows={2} placeholder="Minimum period, fuel, damage, delivery, cancellation…" {...register("terms")} className="w-full rounded-[10px] border border-border bg-raised px-3.5 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:border-primary" />
          {errors.terms && <p className="text-xs text-danger mt-1">{errors.terms.message}</p>}
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
          <Button variant="outline" asChild type="button"><Link href={returnTo}>Cancel</Link></Button>
          <Button variant="action" type="submit" disabled={isSubmitting || isUploading}>
            {isSubmitting ? "Submitting..." : isEdit ? "Save changes" : "Submit for approval"}
          </Button>
        </div>
      </div>
    </form>
  );
}
