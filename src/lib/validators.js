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
  photoURL: z.string().trim().url("Enter a valid image URL").or(z.literal("")),
  accountType: z.enum(["renter", "owner"]),
  password,
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email address"),
  password: z.string().min(1, "Enter your password"),
});
