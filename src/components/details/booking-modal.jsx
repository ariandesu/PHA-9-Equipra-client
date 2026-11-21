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
import { useAvailability, useCreateBooking, useCreateCheckout } from "@/lib/data/hooks";

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
  const createCheckout = useCreateCheckout();

  const [startDate, setStartDate] = useState(futureDayUTC(1));
  const [endDate, setEndDate] = useState(futureDayUTC(3));
  const [quantity, setQuantity] = useState(1);
  const [phone, setPhone] = useState("+880 1712-345678");
  const [address, setAddress] = useState("Plot 14, Road 3, Sector 7, Uttara, Dhaka");
  const [notes, setNotes] = useState("Site gate opens at 7am. Please call 30 minutes before arrival.");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const availabilityQuery = useAvailability(item.id, startDate, endDate);
  const availabilityData = availabilityQuery.data?.data;
  const datesValid = Boolean(startDate) && Boolean(endDate) && startDate >= todayUTC() && endDate >= startDate;
  let availabilityState = availabilityData ? "success" : "loading";
  if (!datesValid) availabilityState = "idle";
  else if (availabilityQuery.isError) availabilityState = "error";
  const maxQty = availabilityState === "success" ? availabilityData.available : item.quantity;
  const effectiveQty = maxQty >= 1 ? Math.min(Math.max(quantity, 1), maxQty) : quantity;
  const soldOut = maxQty === 0;

  const quote = quoteBooking({
    startDate: startDate || todayUTC(),
    endDate: endDate || startDate || todayUTC(),
    rentalType: item.rentalType,
    price: item.price,
    quantity: effectiveQty,
  });

  async function handleSubmit(e) {
    e.preventDefault();
    const cleanPhone = phone.replace(/[\s-]/g, "");

    const schema = z.object({
      startDate: z.string().min(1, "Start date is required"),
      endDate: z.string().min(1, "End date is required"),
      quantity: z.number().int().min(1).max(maxQty, `Only ${maxQty} unit(s) free for these dates`),
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
      quantity: effectiveQty,
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
        quantity: effectiveQty,
        phone: cleanPhone,
        address: address.trim(),
        notes: notes.trim(),
      });

      const bookingId = res?.data?.id;

      // Step 2 of the 02 §5 flow: ask the server for a Stripe Checkout URL.
      let checkoutUrl = null;
      try {
        const checkout = await createCheckout.mutateAsync(bookingId);
        checkoutUrl = checkout?.url || null;
      } catch (checkoutError) {
        setIsSubmitting(false);
        if (checkoutError?.status === 503) {
          toast.error("Payments are not configured yet. Your reservation is held for 30 minutes.");
        } else {
          toast.error(checkoutError?.message || "Could not start the payment session.");
        }
        return;
      }

      onOpenChange(false);
      setIsSubmitting(false);

      if (checkoutUrl) {
        // Absolute Stripe URLs leave the app; the mock returns a relative demo path.
        if (/^https?:\/\//i.test(checkoutUrl)) {
          window.location.assign(checkoutUrl);
        } else {
          router.push(checkoutUrl);
        }
      } else {
        router.push(`/payment/success?demo=1&booking=${encodeURIComponent(bookingId)}`);
      }
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
            quantity={effectiveQty}
            setQuantity={setQuantity}
            maxQty={maxQty}
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
            quantity={effectiveQty}
            onSubmit={() => document.getElementById("submit-booking-btn")?.click()}
            availability={{
              state: availabilityState,
              available: availabilityData?.available ?? 0,
              total: availabilityData?.total ?? item.quantity,
            }}
            submitDisabled={soldOut}
          />
        </div>
      )}
    </AnimatedModal>
  );
}
