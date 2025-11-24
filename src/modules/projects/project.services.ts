import { ProjectDB } from "./project.model";
import { IProject } from "./type/interface";

export const ProjectService = {
  async createProject(data: Omit<IProject, "id">): Promise<IProject> {
    return await ProjectDB.createProject(data);
  },

  async getAllProjects(): Promise<IProject[]> {
    return await ProjectDB.getAllProjects();
  },

  async getProjectById(projectId: number): Promise<IProject | null> {
    return await ProjectDB.getProjectById(projectId);
  },

  async updateProject(projectId: number, updates: any): Promise<boolean> {
    return await ProjectDB.updateProject(projectId, updates);
  },

  async deleteProject(id: number): Promise<boolean> {
    return await ProjectDB.deleteProject(id);
  },
};
