import { postgresDB } from "../../config/db";
import { IProject, ProjectStatus } from "./type/interface";

export const ProjectDB = {
  // CREATE PROJECT
  async createProject(data: Omit<IProject, "id">): Promise<IProject> {
    const query = `
      INSERT INTO projects (name, description, status, created_by)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const values = [data.name, data.description, data.status, data.created_by];

    const result = await postgresDB.query(query, values);
    return result.rows[0];
  },

  // GET ALL PROJECTS
  async getAllProjects(): Promise<IProject[]> {
    const query = `SELECT * FROM projects ORDER BY id ASC`;
    const result = await postgresDB.query(query);
    return result.rows;
  },

  async getProjectById(projectId: number): Promise<IProject | null> {
    const query = `SELECT * FROM projects WHERE id = $1`;
    const result = await postgresDB.query(query, [projectId]);

    return result.rows[0] || null;
  },

  // UPDATE STATUS
  async updateProject(projectId: number, updates: any): Promise<boolean> {
    const fields = Object.keys(updates);
    const values = Object.values(updates);

    if (fields.length === 0) return false;

    const setQuery = fields
      .map((field, index) => `${field}=$${index + 1}`)
      .join(", ");

    const query = `UPDATE projects SET ${setQuery} WHERE id=$${
      fields.length + 1
    }`;

    const result = await postgresDB.query(query, [...values, projectId]);

    return (result.rowCount ?? 0) > 0;
  },

  // DELETE PROJECT
  async deleteProject(id: number): Promise<boolean> {
    const query = `DELETE FROM projects WHERE id = $1`;
    const result = await postgresDB.query(query, [id]);

    return (result.rowCount ?? 0) > 0;
  },
};
