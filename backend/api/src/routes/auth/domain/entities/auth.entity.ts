export class UserEntity {
  public readonly id_user: string;
  public readonly id_user_role: number;
  public readonly username: string;
  public readonly password: string;
  public readonly created_at: Date;
  public readonly updated_at: Date;

  constructor(props: UserEntity) {
    this.id_user = props.id_user;
    this.id_user_role = props.id_user_role;
    this.username = props.username;
    this.password = props.password;
    this.created_at = props.created_at;
    this.updated_at = props.updated_at;
  }
}

export type LoginEntity = Pick<UserEntity, "username" | "password">;
export type RegisterEntity = StrictOmit<
  UserEntity,
  "id_user" | "created_at" | "updated_at"
>;
