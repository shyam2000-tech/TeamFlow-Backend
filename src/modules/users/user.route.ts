import express from "express";
import { UserController } from "./user.controller";
import { requireAdmin } from "../../middleware/auth.middleware.ts/roleAccess";
import { verifyToken } from "../../middleware/auth.middleware.ts/verifyToken";

const userRouter = express.Router();


userRouter.get("/getallusers",verifyToken,requireAdmin, UserController.getAllUsers);

userRouter.get("/:email", UserController.getUserByEmail);

userRouter.post("/createuser",verifyToken,requireAdmin, UserController.createUser);

export default userRouter;
