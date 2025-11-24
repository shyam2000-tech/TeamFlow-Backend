import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { AppError } from "../../utils/AppError";
import { ENV } from "../../config/env";
import { IUserTokenPayload } from "../../modules/auth/type/interface";

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const cookieToken = req.cookies?.token;

  const header = req.headers.authorization;
  const headerToken = header?.startsWith("Bearer ")
    ? header.split(" ")[1]
    : null;

  const token = cookieToken || headerToken;

  if (!token) {
    return next(new AppError("Unauthorized: Token missing", 401));
  }

  try {
    const decoded = jwt.verify(
      token,
      ENV.JWT_SECRET_KEY as string
    ) as JwtPayload;

    req.user = {
      id: decoded.id as number,
      email: decoded.email as string,
      role: decoded.role as "ADMIN" | "MEMBER",
    } as IUserTokenPayload;

    next();
  } catch (error) {
    return next(new AppError("Invalid or expired token", 401));
  }
};
