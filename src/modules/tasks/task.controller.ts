import { Request, Response, NextFunction } from "express";
import { TaskService } from "./task.services";
import { catchAsync } from "../../utils/catchAsync";
import { AppError } from "../../utils/AppError";

export const TaskController = {
  // CREATE TASK
  createTask: catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const projectId = Number(req.params.projectId);

      if (!projectId) {
        return next(new AppError("Project ID missing", 400));
      }

      const { title, description, status, priority, assignee_id, position } =
        req.body;

      if (!title || !status || !priority || !assignee_id) {
        return next(new AppError("Missing required fields", 400));
      }

      const newTask = await TaskService.createTask({
        project_id: projectId,
        title,
        description,
        status,
        priority,
        assignee_id,
        position,
      });

      res.status(201).json({
        success: true,
        message: "Task created successfully",
        data: newTask,
      });
    }
  ),

  // GET TASK DETAILS
  getTaskDetails: catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const taskId = Number(req.params.taskId);
      const userId = req.user?.id;
      const role = req.user?.role;

      if (!userId) return next(new AppError("Unauthorized", 401));
      if (isNaN(taskId)) return next(new AppError("Invalid task ID", 400));

      const task = await TaskService.getTaskDetails(taskId, userId, role!);

      if (!task) {
        return next(new AppError("Task not found", 404));
      }

      res.status(200).json({
        success: true,
        data: task,
      });
    }
  ),

  // GET TASKS BY PROJECT
  getTasksByProject: catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const projectId = Number(req.params.projectId);
      const userId = req.user?.id;
      const role = req.user?.role;

      if (!userId) return next(new AppError("Unauthorized", 401));
      if (isNaN(projectId))
        return next(new AppError("Invalid project ID", 400));

      const { search, status, priority, assignee } = req.query;

      const filters = {
        search: search as string,
        status: status as string,
        priority: priority as string,
        assignee: assignee ? Number(assignee) : undefined,
      };

      let tasks;

      if (role === "ADMIN") {
        tasks = await TaskService.getTasksByProject(projectId, filters);
      } else {
        tasks = await TaskService.getTasksByProjectForUser(
          projectId,
          userId,
          filters
        );

        if (tasks.length === 0) {
          return res.status(404).json({
            success: false,
            message: "No tasks available for you in this project",
          });
        }
      }

      res.status(200).json({
        success: true,
        data: tasks,
      });
    }
  ),

  // UPDATE STATUS
  updateTask: catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const taskId = Number(req.params.taskId);
      const userId = req.user?.id;
      const role = req.user?.role;

      if (!taskId) return next(new AppError("Task ID required", 400));

      const allowedFields = ["status"];

      if (role === "ADMIN") {
        allowedFields.push(
          "title",
          "description",
          "priority",
          "assignee_id",
          "position"
        );
      }

      const updateData: any = {};

      for (const key of allowedFields) {
        if (req.body[key] !== undefined) {
          updateData[key] = req.body[key];
        }
      }

      if (Object.keys(updateData).length === 0) {
        return next(
          new AppError(
            role === "ADMIN"
              ? "No valid fields provided"
              : "Members can update only task status",
            400
          )
        );
      }

      const updated = await TaskService.updateTask(
        taskId,
        userId!,
        role!,
        updateData
      );

      if (!updated)
        return next(new AppError("Task not found or not allowed", 404));

      res.status(200).json({
        success: true,
        message: "Task updated successfully",
      });
    }
  ),

  // UPDATE POSITION
  updateTaskPosition: catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const taskId = Number(req.params.taskId);
      const { position } = req.body;

      if (position === undefined) {
        return next(new AppError("Position required", 400));
      }

      const updated = await TaskService.updateTaskPosition(taskId, position);

      if (!updated) return next(new AppError("Task not found", 404));

      res.status(200).json({
        success: true,
        message: "Position updated",
      });
    }
  ),

  // DELETE TASK
  deleteTask: catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const taskId = Number(req.params.taskId);

      if (!taskId) return next(new AppError("Task ID required", 400));

      const deleted = await TaskService.deleteTask(taskId);

      if (!deleted) {
        return next(new AppError("Task not found", 404));
      }

      res.status(200).json({
        success: true,
        message: "Task deleted successfully",
      });
    }
  ),
};
