// clients.schema.ts
import { z } from "zod";

export const clientSchema = z.object({
  id_client: z.string(),
  client_name: z.string().min(1, "Client name is required"),
  client_email: z.string().email("Invalid email address"),
  client_phone: z.string().nullable().optional(),
  client_address: z.string().nullable().optional(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
});

export const createClientSchema = clientSchema.omit({
  id_client: true,
  created_at: true,
  updated_at: true,
});

export const updateClientSchema = clientSchema.omit({
  created_at: true,
  updated_at: true,
});

export const deleteClientSchema = clientSchema.pick({
  id_client: true,
});

export type ClientSchemaType = z.infer<typeof clientSchema>;
export type CreateClientSchemaType = z.infer<typeof createClientSchema>;
export type UpdateClientSchemaType = z.infer<typeof updateClientSchema>;
export type DeleteClientSchemaType = z.infer<typeof deleteClientSchema>;
