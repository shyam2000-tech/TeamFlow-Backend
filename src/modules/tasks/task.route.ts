import express from "express";
import { TaskController } from "./task.controller";
import { verifyToken } from "../../middleware/auth.middleware.ts/verifyToken";
import { requireAdmin } from "../../middleware/auth.middleware.ts/roleAccess";

const taskRoutes = express.Router();


taskRoutes.post("/tasks/:projectId",verifyToken,requireAdmin,TaskController.createTask)

taskRoutes.get("/projects/:projectId/tasks", verifyToken, TaskController.getTasksByProject);

taskRoutes.get("/details/:taskId", verifyToken, TaskController.getTaskDetails);

taskRoutes.patch("/status/:taskId", TaskController.updateTaskStatus);

taskRoutes.patch("/position/:taskId", TaskController.updateTaskPosition);

export default taskRoutes