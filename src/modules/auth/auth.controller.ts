import { Request, Response } from "express";
import { AuthService } from "./auth.services";
import { catchAsync } from "../../utils/catchAsync";

export const AuthController = {
  login: catchAsync(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const { user, token } = await AuthService.login(email, password);

    res.cookie("token", token, {
      httpOnly: true,
      secure: false, 
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000 
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      }
    });
  })
};
