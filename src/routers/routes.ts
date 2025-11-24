import express from "express";
import userRoutes from "../modules/users/user.route";
import taskRoutes from "../modules/tasks/task.route";
import projectRoutes from "../modules/projects/project.route";
import authRoutes from "../modules/auth/auth.route";

const globalRoutes = express.Router();

globalRoutes.use("/users", userRoutes);
globalRoutes.use("/", taskRoutes);
globalRoutes.use("/projects", projectRoutes);
globalRoutes.use("/auth", authRoutes);

export default globalRoutes