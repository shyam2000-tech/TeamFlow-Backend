import { AppError } from "../../utils/AppError";
import { TaskDB } from "./task.model";
import { ITask } from "./type/interface";

export const TaskService = {
  createTask(data: Omit<ITask, "id">): Promise<ITask> {
    return TaskDB.createTask(data);
  },

  async getTasksByProject(projectId: number, filters: any): Promise<ITask[]> {
    return TaskDB.getTasksByProject(projectId, filters);
  },

  async getTaskDetails(taskId: number, userId: number, role: string) {
    const task = await TaskDB.getTaskDetails(taskId);

    if (!task) return null;

    if (role !== "ADMIN") {
      const isAllowed = await TaskDB.checkUserMembership(taskId, userId);

      if (!isAllowed) {
        throw new AppError("You are not allowed to view this task", 403);
      }
    }

    return task;
  },

  async getTasksByProjectForUser(
    projectId: number,
    userId: number,
    filters: any
  ): Promise<ITask[]> {
    return TaskDB.getTasksByProjectForUser(projectId, userId, filters);
  },

  async updateTaskStatus(taskId: number, status: string): Promise<boolean> {
    return TaskDB.updateTaskStatus(taskId, status);
  },

  async updateTaskPosition(taskId: number, position: number): Promise<boolean> {
    return TaskDB.updateTaskPosition(taskId, position);
  },
};
