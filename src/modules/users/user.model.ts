import { postgresDB } from "../../config/db";
import { IUser } from "./type/interface";

export const UserDB = {
  async findByEmail(email: string): Promise<IUser | null> {
    const query = "SELECT * FROM users WHERE email = $1 LIMIT 1";
    const result = await postgresDB.query(query, [email]);
    return result.rows[0] || null;
  },

  async createUser(user: Omit<IUser, "id">): Promise<IUser> {
    const query = `
      INSERT INTO users (name, email, password, role)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const result = await postgresDB.query(query, [
      user.name,
      user.email,
      user.password,
      user.role,
    ]);
    return result.rows[0];
  },

  async getAllUsers(): Promise<IUser[]> {
    const query = `
      SELECT id, name, email, role 
      FROM users
      ORDER BY id ASC;
    `;
    const result = await postgresDB.query(query);
    return result.rows;
  },
};
