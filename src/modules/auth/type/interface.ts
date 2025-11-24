export interface IUserTokenPayload {
  id: number;
  email: string;
  role: "ADMIN" | "MEMBER";
}