import express from "express";
import { AuthController } from "./auth.controller";

const authRoutes = express.Router();

authRoutes.post("/login", AuthController.login);

export default authRoutes;