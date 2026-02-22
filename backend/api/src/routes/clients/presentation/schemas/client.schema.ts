// client.schema.ts
import { z } from "zod";

// Base schema with all fields
export const clientSchema = z.object({
  id_client: z.string({ message: "ID is required" }),
  client_name: z.string({ message: "Client name is required" }),
  client_email: z.string({ message: "Client email is required" }).email("Invalid email format"),
  client_phone: z.string().nullable().optional(),
  client_address: z.string().nullable().optional(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
});

// Schema for creating new clients (excludes auto-generated fields)
export const createClientSchema = clientSchema.omit({
  id_client: true,
  created_at: true,
  updated_at: true,
});

// Schema for updating clients (includes id, excludes timestamps)
export const updateClientSchema = clientSchema.omit({
  created_at: true,
  updated_at: true,
});

// Schema for delete operations (only id)
export const deleteClientSchema = clientSchema.pick({
  id_client: true,
});

// Type exports for TypeScript
export type ClientSchemaType = z.infer<typeof clientSchema>;
export type CreateClientSchemaType = z.infer<typeof createClientSchema>;
export type UpdateClientSchemaType = z.infer<typeof updateClientSchema>;
export type DeleteClientSchemaType = z.infer<typeof deleteClientSchema>;
