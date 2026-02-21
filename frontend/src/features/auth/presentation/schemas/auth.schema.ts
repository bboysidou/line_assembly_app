import { z } from "zod";

export const userSchema = z.object({
  id_user: z.string(),
  id_user_role: z.int({ message: "User role is required" }),
  username: z.string({ message: "username is not invalid" }).trim(),
  password: z
    .string({ message: "Password is required" })
    .min(6, { message: "Password invalid" }),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
});
export const loginSchema = userSchema.pick({
  username: true,
  password: true,
});

export const registerSchema = userSchema.pick({
  id_user_role: true,
  username: true,
  password: true,
});

export type UserType = z.infer<typeof userSchema>;
export type LoginType = z.infer<typeof loginSchema>;
export type RegisterType = z.infer<typeof registerSchema>;
