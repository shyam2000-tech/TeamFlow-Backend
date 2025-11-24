import { postgresDB } from "../../config/db";
import { IUser } from "../users/type/interface";

export const AuthDB = {
  async findUserByEmail(email: string): Promise<IUser | null> {
    const query = `SELECT * FROM users WHERE email=$1 LIMIT 1`;
    const result = await postgresDB.query(query, [email]);
    return result.rows[0] || null;
  }
};
