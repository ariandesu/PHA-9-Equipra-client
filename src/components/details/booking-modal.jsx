"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { toast } from "sonner";
import { X } from "lucide-react";
import AnimatedModal from "@/components/fx/animated-modal";
import MultiStepLoader from "@/components/fx/multi-step-loader";
import BookingForm from "@/components/details/booking-form";
import BookingSummary from "@/components/details/booking-summary";
import { quoteBooking } from "@/lib/pricing";
import { useCreateBooking } from "@/lib/data/hooks";

const BD_PHONE_REGEX = /^(?:\+?880|0)1[3-9]\d{8}$/;

function todayUTC() {
  return new Date().toISOString().slice(0, 10);
}

function futureDayUTC(days) {
  return new Date(Date.now() + days * 86400000).toISOString().slice(0, 10);
}

export default function BookingModal({ item, open, onOpenChange }) {
  const router = useRouter();
  const createBooking = useCreateBooking();

  const [startDate, setStartDate] = useState(futureDayUTC(1));
  const [endDate, setEndDate] = useState(futureDayUTC(3));
  const [quantity, setQuantity] = useState(1);
  const [phone, setPhone] = useState("+880 1712-345678");
  const [address, setAddress] = useState("Plot 14, Road 3, Sector 7, Uttara, Dhaka");
  const [notes, setNotes] = useState("Site gate opens at 7am. Please call 30 minutes before arrival.");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const quote = quoteBooking({
    startDate: startDate || todayUTC(),
    endDate: endDate || startDate || todayUTC(),
    rentalType: item.rentalType,
    price: item.price,
    quantity,
  });

  async function handleSubmit(e) {
    e.preventDefault();
    const cleanPhone = phone.replace(/[\s-]/g, "");

    const schema = z.object({
      startDate: z.string().min(1, "Start date is required"),
      endDate: z.string().min(1, "End date is required"),
      quantity: z.number().int().min(1).max(item.quantity, `Max available is ${item.quantity}`),
      phone: z.string().regex(BD_PHONE_REGEX, "Enter a valid Bangladesh phone number"),
      address: z.string().trim().min(3, "Please enter a complete delivery address"),
      notes: z.string().optional(),
    }).refine((data) => data.startDate >= todayUTC(), {
      message: "Start date cannot be in the past",
      path: ["startDate"],
    }).refine((data) => data.endDate >= data.startDate, {
      message: "End date must be on or after start date",
      path: ["endDate"],
    });

    const parsed = schema.safeParse({
      startDate,
      endDate,
      quantity,
      phone: cleanPhone,
      address,
      notes,
    });

    if (!parsed.success) {
      toast.error(parsed.error.errors[0]?.message || "Validation failed");
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await createBooking.mutateAsync({
        equipmentId: item.id,
        startDate,
        endDate,
        quantity,
        phone: cleanPhone,
        address: address.trim(),
        notes: notes.trim(),
      });

      setTimeout(() => {
        setIsSubmitting(false);
        onOpenChange(false);
        const bookingId = res?.data?.id || "demo-booking";
        router.push(`/payment/success?demo=1&booking=${encodeURIComponent(bookingId)}`);
      }, 1400);
    } catch (err) {
      setIsSubmitting(false);
      toast.error(err.message || "Failed to create booking");
    }
  }

  return (
    <AnimatedModal
      open={open}
      onOpenChange={(v) => !isSubmitting && onOpenChange(v)}
      title={`Book ${item.name}`}
      description="Select dates, quantity and delivery address to book equipment."
    >
      {isSubmitting ? (
        <div className="flex min-h-[440px] items-center justify-center p-6">
          <MultiStepLoader
            title="Preparing your booking…"
            kicker="BOOKING REQUEST · SECURING HOLD"
          />
        </div>
      ) : (
        <div className="relative grid grid-cols-1 md:grid-cols-12 text-left">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            aria-label="Close booking modal"
            className="absolute top-4 right-4 z-20 flex size-8 items-center justify-center rounded-full bg-raised text-muted hover:text-foreground"
          >
            <X className="size-4" />
          </button>

          <BookingForm
            item={item}
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
            quantity={quantity}
            setQuantity={setQuantity}
            phone={phone}
            setPhone={setPhone}
            address={address}
            setAddress={setAddress}
            notes={notes}
            setNotes={setNotes}
            today={todayUTC()}
            onSubmit={handleSubmit}
          />

          <BookingSummary
            item={item}
            quote={quote}
            quantity={quantity}
            onSubmit={() => document.getElementById("submit-booking-btn")?.click()}
          />
        </div>
      )}
    </AnimatedModal>
  );
}
