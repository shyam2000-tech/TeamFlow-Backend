export type UserRole = "ADMIN" | "MEMBER";

export interface IUser {
  id: number;
  name: string;
  email: string;
  password: string;
  role: UserRole;
}