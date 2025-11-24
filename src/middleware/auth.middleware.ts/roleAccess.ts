import { AppError } from "../../utils/AppError";
import { Request,Response,NextFunction } from "express";

export const requireAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.user?.role !== "ADMIN") {
    return next(new AppError("Only admin can perform this action", 403));
  }
  next();
};
