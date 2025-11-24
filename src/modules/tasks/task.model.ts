import { postgresDB } from "../../config/db";
import { ITask } from "./type/interface";

export const TaskDB = {
  // CREATE TASK
  async createTask(data: Omit<ITask, "id">): Promise<ITask> {
    const query = `
      INSERT INTO tasks (project_id, title, description, status, priority, assignee_id, position)
      VALUES ($1,$2,$3,$4,$5,$6,$7)
      RETURNING *;
    `;
    const values = [
      data.project_id,
      data.title,
      data.description,
      data.status,
      data.priority,
      data.assignee_id,
      data.position,
    ];

    const result = await postgresDB.query(query, values);
    return result.rows[0];
  },

  // GET TASK DETAILS
  async getTaskDetails(taskId: number): Promise<ITask | null> {
    const query = `
    SELECT t.*, 
      u.name AS assignee_name,
      p.name AS project_name
    FROM tasks t
    LEFT JOIN users u ON t.assignee_id = u.id
    LEFT JOIN projects p ON t.project_id = p.id
    WHERE t.id = $1
  `;

    const result = await postgresDB.query(query, [taskId]);
    return result.rows[0] || null;
  },

  // CHECKING THE USER HAVE THIS TASK
  async checkUserMembership(taskId: number, userId: number): Promise<boolean> {
    const query = `
    SELECT * FROM tasks
    WHERE id = $1 AND assignee_id = $2
  `;

    const result = await postgresDB.query(query, [taskId, userId]);
    return (result.rowCount ?? 0) > 0;
  },

  // GET ALL TASKS IN A PROJECT
  async getTasksByProject(projectId: number, filters: any): Promise<ITask[]> {
    const values: any[] = [projectId];
    let index = 2;

    let where = `WHERE project_id = $1`;

    if (filters.search) {
      where += ` AND LOWER(title) LIKE LOWER($${index})`;
      values.push(`%${filters.search}%`);
      index++;
    }

    if (filters.status) {
      where += ` AND status = $${index}`;
      values.push(filters.status);
      index++;
    }

    if (filters.priority) {
      where += ` AND priority = $${index}`;
      values.push(filters.priority);
      index++;
    }

    if (filters.assignee) {
      where += ` AND assignee_id = $${index}`;
      values.push(filters.assignee);
      index++;
    }

    const query = `
    SELECT * FROM tasks
    ${where}
    ORDER BY position ASC;
  `;

    const result = await postgresDB.query(query, values);
    return result.rows;
  },

  //   GET USERS THEIR OWN TASK IN THE PROJECT
  async getTasksByProjectForUser(
    projectId: number,
    userId: number,
    filters: any
  ): Promise<ITask[]> {
    const values: any[] = [projectId, userId];
    let index = 3;

    let where = `WHERE project_id = $1 AND assignee_id = $2`;

    if (filters.search) {
      where += ` AND LOWER(title) LIKE LOWER($${index})`;
      values.push(`%${filters.search}%`);
      index++;
    }

    if (filters.status) {
      where += ` AND status = $${index}`;
      values.push(filters.status);
      index++;
    }

    if (filters.priority) {
      where += ` AND priority = $${index}`;
      values.push(filters.priority);
      index++;
    }

    const query = `
    SELECT * FROM tasks
    ${where}
    ORDER BY position ASC;
  `;

    const result = await postgresDB.query(query, values);
    return result.rows;
  },

  // UPDATE TASK STATUS
  async updateTaskStatus(taskId: number, status: string): Promise<boolean> {
    const result = await postgresDB.query(
      `UPDATE tasks SET status=$1 WHERE id=$2`,
      [status, taskId]
    );
    return (result.rowCount ?? 0) > 0;
  },

  // UPDATE POSITION
  async updateTaskPosition(taskId: number, position: number): Promise<boolean> {
    const result = await postgresDB.query(
      `UPDATE tasks SET position=$1 WHERE id=$2`,
      [position, taskId]
    );
    return (result.rowCount ?? 0) > 0;
  },
};
