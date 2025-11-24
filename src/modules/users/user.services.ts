import bcrypt from "bcryptjs";
import { UserDB } from "./user.model";
import { IUser } from "./type/interface";

export const UserService = {
  // Get ALL users
  async getAllUsers(): Promise<IUser[]> {
    return await UserDB.getAllUsers();
  },

  // Get user by email
  async getUserByEmail(email: string): Promise<IUser | null> {
    return await UserDB.findByEmail(email);
  },

  // Create user
  async createUser(data: Omit<IUser, "id">): Promise<IUser> {
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(data.password, saltRounds);

    const userData = {
      ...data,
      password: hashedPassword,
    };

    return await UserDB.createUser(userData);
  },
};
