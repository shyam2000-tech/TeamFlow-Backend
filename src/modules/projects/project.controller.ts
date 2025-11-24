import { Request, Response, NextFunction } from "express";
import { ProjectService } from "./project.services";
import { catchAsync } from "../../utils/catchAsync";
import { AppError } from "../../utils/AppError";

export const ProjectController = {
  // CREATE PROJECT
  createProject: catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const { name, description, status } = req.body;

      const created_by = req.user?.id;

      if (!created_by) {
        return next(new AppError("Unauthorized: user ID missing", 401));
      }

      if (!name || !status) {
        return next(new AppError("Missing required fields", 400));
      }

      const newProject = await ProjectService.createProject({
        name,
        description,
        status,
        created_by,
      });

      res.status(201).json({
        success: true,
        message: "Project created successfully",
        data: newProject,
      });
    }
  ),

  // GET ALL PROJECTS
  getAllProjects: catchAsync(async (req: Request, res: Response) => {
    const projects = await ProjectService.getAllProjects();
    res.status(200).json({ success: true, data: projects });
  }),

  getProjectById: catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const projectId = Number(req.params.projectId);

      if (isNaN(projectId)) {
        return next(new AppError("Invalid project ID", 400));
      }

      const project = await ProjectService.getProjectById(projectId);

      if (!project) {
        return next(new AppError("Project not found", 404));
      }

      res.status(200).json({
        success: true,
        data: project,
      });
    }
  ),

  // UPDATE STATUS
  updateProject: catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const projectId = Number(req.params.projectId);

      const allowedFields = ["name", "description", "status"];
      const updates: any = {};

      for (const key of allowedFields) {
        if (req.body[key] !== undefined) {
          updates[key] = req.body[key];
        }
      }

      if (Object.keys(updates).length === 0) {
        return next(new AppError("No valid fields to update", 400));
      }

      const updated = await ProjectService.updateProject(projectId, updates);

      if (!updated) {
        return next(new AppError("Project not found", 404));
      }

      res.status(200).json({
        success: true,
        message: "Project updated successfully",
      });
    }
  ),

  // DELETE PROJECT
  deleteProject: catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const id = Number(req.params.id);

      if (isNaN(id)) return next(new AppError("Invalid project ID", 400));

      const deleted = await ProjectService.deleteProject(id);

      if (!deleted) return next(new AppError("Project not found", 404));

      res
        .status(200)
        .json({ success: true, message: "Project deleted successfully" });
    }
  ),
};
