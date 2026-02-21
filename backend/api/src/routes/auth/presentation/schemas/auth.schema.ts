import { z } from "zod";

export const authSchema = z.object({
  id_user: z.string(),
  id_user_role: z.int(),
  username: z.string({ message: "Username is required" }),
  password: z.string({ message: "Password is required" }),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
});

export const loginSchema = authSchema.pick({
  username: true,
  password: true,
});

export const registerSchema = authSchema.omit({
  id_user: true,
  created_at: true,
  updated_at: true,
});
