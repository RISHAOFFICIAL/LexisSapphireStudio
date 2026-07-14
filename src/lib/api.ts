import { createServerFn } from "@tanstack/react-start";
import { execute } from "~/db";

/**
 * Submit a lead from the contact form
 */
export const submitLead = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: { name: string; email: string; projectType: string; message: string } }) => {
    const result = execute(
      "INSERT INTO leads (name, email, project_type, message) VALUES (?, ?, ?, ?) RETURNING id, name, created_at",
      [data.name, data.email, data.projectType, data.message],
    );
    return result;
  },
);

/**
 * Get all leads (admin only)
 */
export const getLeads = createServerFn({ method: "GET" }).handler(async () => {
  const rows = execute("SELECT id, name, email, project_type, message, created_at FROM leads ORDER BY created_at DESC");
  return rows.map((r) => ({ ...r, created_at: String(r.created_at) }));
});

/**
 * Get all projects (admin only)
 */
export const getProjects = createServerFn({ method: "GET" }).handler(async () => {
  const rows = execute("SELECT id, client_name, project_name, scope, price, status, created_at FROM projects ORDER BY created_at DESC");
  return rows.map((r) => ({ ...r, created_at: String(r.created_at) }));
});

/**
 * Add a project (admin only)
 */
export const addProject = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: { client_name: string; project_name: string; scope: string; price: string; status: string } }) => {
    const result = execute(
      "INSERT INTO projects (client_name, project_name, scope, price, status) VALUES (?, ?, ?, ?, ?) RETURNING id",
      [data.client_name, data.project_name, data.scope, data.price, data.status],
    );
    return result;
  },
);