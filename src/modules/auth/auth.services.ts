import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AuthDB } from "./auth.model";
import { AppError } from "../../utils/AppError";
import { ENV } from "../../config/env";
import { IUserTokenPayload } from "./type/interface";

export const AuthService = {
  async login(email: string, password: string) {
    const user = await AuthDB.findUserByEmail(email);

    if (!user) {
      throw new AppError("Invalid email or password", 401);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new AppError("Invalid email or password", 401);
    }

    const payload: IUserTokenPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    const token = jwt.sign(payload, ENV.JWT_SECRET_KEY as string, {
      expiresIn: "7d",
    });

    return { user, token };
  }
};
