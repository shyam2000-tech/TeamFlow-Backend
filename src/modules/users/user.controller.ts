import { Request, Response, NextFunction } from "express";
import { UserService } from "./user.services";
import { catchAsync } from "../../utils/catchAsync";
import { AppError } from "../../utils/AppError";

export const UserController = {
  
  // GET ALL USERS
  getAllUsers: catchAsync(async (req: Request, res: Response) => {
    const users = await UserService.getAllUsers();

    res.status(200).json({
      success: true,
      data: users,
    });
  }),

  // GET USER BY EMAIL
  getUserByEmail: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const email = req.params.email;

    const user = await UserService.getUserByEmail(email);

    if (!user) {
      throw new AppError("User not found", 404); 
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  }),

  // CREATE USER
  createUser: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password, role } = req.body;

    const existing = await UserService.getUserByEmail(email);
    if (existing) {
      return next(new AppError("Email already exists", 400));
    }

    const newUser = await UserService.createUser({
      name,
      email,
      password,
      role,
    });

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: newUser,
    });
  }),
};
