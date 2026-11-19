import { z } from "zod";
import { PASSWORD_RULE_MESSAGE } from "@/lib/auth-rules";

// Mirrors src/lib/auth-rules.js exactly: >= 6 chars, one uppercase, one
// lowercase, ASCII classes, so client and server agree byte for byte.
const password = z
  .string()
  .min(6, PASSWORD_RULE_MESSAGE)
  .regex(/[A-Z]/, PASSWORD_RULE_MESSAGE)
  .regex(/[a-z]/, PASSWORD_RULE_MESSAGE);

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Enter your full name").max(80, "Name is too long"),
  email: z.string().trim().toLowerCase().email("Enter a valid email address"),
  // Optional, so the empty case must be accepted before the URL check. A
  // refinement validates only when a value was actually typed.
  photoURL: z
    .string()
    .trim()
    .refine((value) => value === "" || /^https?:\/\/\S+$/i.test(value), {
      message: "Enter a valid image URL",
    }),
  accountType: z.enum(["renter", "owner"]),
  password,
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email address"),
  password: z.string().min(1, "Enter your password"),
});
