// client.entity.ts
export class ClientEntity {
  public readonly id_client: string;
  public readonly client_name: string;
  public readonly client_email: string;
  public readonly client_phone?: string;
  public readonly client_address?: string;
  public readonly created_at: Date;
  public readonly updated_at: Date;

  constructor(props: ClientEntity) {
    this.id_client = props.id_client;
    this.client_name = props.client_name;
    this.client_email = props.client_email;
    this.client_phone = props.client_phone;
    this.client_address = props.client_address;
    this.created_at = props.created_at;
    this.updated_at = props.updated_at;
  }
}

export type CreateClientEntity = StrictOmit<
  ClientEntity,
  "id_client" | "created_at" | "updated_at"
>;

export type UpdateClientEntity = StrictOmit<
  ClientEntity,
  "created_at" | "updated_at"
>;
