export type ProjectStatus = "PLANNED" | "ACTIVE" | "COMPLETED";

export interface IProject {
  id: number;
  name: string;
  description: string;
  status: ProjectStatus;
  created_by: number;
}