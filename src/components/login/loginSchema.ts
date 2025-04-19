import { z } from "zod";

export const loginSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(32, "Username must be 32 characters or less"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(64, "Password must be 64 characters or less"),
});

export type LoginSchema = z.infer<typeof loginSchema>;
