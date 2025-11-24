import express from "express";
import { ProjectController } from "./project.controller";
import { verifyToken } from "../../middleware/auth.middleware.ts/verifyToken";
import { requireAdmin } from "../../middleware/auth.middleware.ts/roleAccess";

const projectRoutes = express.Router();


projectRoutes.post("/newproject",verifyToken,requireAdmin ,ProjectController.createProject);

projectRoutes.get("/allproject" ,ProjectController.getAllProjects);

projectRoutes.get("/projectdetailing/:projectId", verifyToken, ProjectController.getProjectById);

projectRoutes.patch("/editproject/:projectId", verifyToken,requireAdmin, ProjectController.updateProject);

projectRoutes.delete("/delete/:id",verifyToken,requireAdmin ,ProjectController.deleteProject);

export default projectRoutes