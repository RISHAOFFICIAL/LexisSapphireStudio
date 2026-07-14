import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { execute } from "~/db";

// ---- Server functions ----

const getLeads = createServerFn({ method: "GET" }).handler(async () => {
  const rows = execute(
    "SELECT id, name, email, project_type, message, created_at FROM leads ORDER BY created_at DESC",
  );
  return (rows as Array<Record<string, unknown>>).map((r) => ({
    ...r,
    created_at: String(r.created_at),
  })) as Array<{
    id: number;
    name: string;
    email: string;
    project_type: string;
    message: string;
    created_at: string;
  }>;
});

const getProjects = createServerFn({ method: "GET" }).handler(async () => {
  const rows = execute(
    "SELECT id, client_name, project_name, scope, price, status, created_at FROM projects ORDER BY created_at DESC",
  );
  return (rows as Array<Record<string, unknown>>).map((r) => ({
    ...r,
    created_at: String(r.created_at),
  })) as Array<{
    id: number;
    client_name: string;
    project_name: string;
    scope: string;
    price: string;
    status: string;
    created_at: string;
  }>;
});

const addProject = createServerFn({ method: "POST" }).handler(
  async ({
    data,
  }: {
    data: {
      client_name: string;
      project_name: string;
      scope: string;
      price: string;
      status: string;
    };
  }) => {
    execute(
      "INSERT INTO projects (client_name, project_name, scope, price, status) VALUES (?, ?, ?, ?, ?)",
      [
        data.client_name,
        data.project_name,
        data.scope,
        data.price,
        data.status,
      ],
    );
    return { ok: true };
  },
);

const deleteLead = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: { id: number } }) => {
    execute("DELETE FROM leads WHERE id = ?", [data.id]);
    return { ok: true };
  },
);

const verifyPassword = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: { password: string } }) => {
    const adminPassword = process.env.ADMIN_PASSWORD || "admin";
    return { valid: data.password === adminPassword };
  },
);

// ---- Route ----

export const Route = createFileRoute("/admin")({
  component: AdminPage,
});

function AdminPage() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await verifyPassword({ data: { password } });
    if (result.valid) {
      setAuthenticated(true);
    } else {
      alert("Incorrect password");
    }
  };

  if (!authenticated) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-sapphire-950 px-6">
        <div className="w-full max-w-sm">
          <div className="rounded-xl border border-sapphire-700/50 bg-sapphire-900/50 p-8 backdrop-blur-sm">
            <h1 className="font-heading text-2xl font-bold text-white">
              Admin Access
            </h1>
            <p className="mt-2 text-sm text-sapphire-400">
              Enter the admin password to continue.
            </p>
            <form onSubmit={handleLogin} className="mt-6 space-y-4">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full rounded-lg border border-sapphire-700/50 bg-sapphire-950/50 px-4 py-3 text-sm text-white placeholder-sapphire-400 focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-500/30"
              />
              <button
                type="submit"
                className="w-full rounded-full bg-gold-500 px-6 py-3 text-sm font-semibold tracking-wider text-sapphire-950 transition-all hover:bg-gold-400"
              >
                Sign In
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return <Dashboard />;
}

function Dashboard() {
  const [activeTab, setActiveTab] = useState<"leads" | "projects">("leads");

  return (
    <div className="min-h-dvh bg-sapphire-50">
      {/* Admin header */}
      <header className="border-b border-sapphire-100 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <h1 className="font-heading text-xl font-bold text-sapphire-800">
            CRM Dashboard
          </h1>
          <a
            href="/"
            className="text-sm font-medium text-sapphire-500 transition-colors hover:text-gold-500"
          >
            ← Back to site
          </a>
        </div>
      </header>

      {/* Tab navigation */}
      <div className="mx-auto max-w-6xl px-6 pt-8">
        <div className="flex gap-1 rounded-lg bg-sapphire-100 p-1">
          {(["leads", "projects"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 rounded-md px-4 py-2 text-sm font-medium capitalize transition-all ${
                activeTab === tab
                  ? "bg-white text-sapphire-800 shadow-sm"
                  : "text-sapphire-500 hover:text-sapphire-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-6xl px-6 py-8">
        {activeTab === "leads" ? <LeadsPanel /> : <ProjectsPanel />}
      </div>
    </div>
  );
}

function LeadsPanel() {
  const [leads, setLeads] = useState<
    Array<{
      id: number;
      name: string;
      email: string;
      project_type: string;
      message: string;
      created_at: string;
    }>
  >([]);
  const [loading, setLoading] = useState(true);

  // Load leads on mount
  useEffect(() => {
    getLeads().then((data) => {
      setLeads(data);
      setLoading(false);
    });
  }, []);

  const handleDelete = async (id: number) => {
    await deleteLead({ data: { id } });
    setLeads((prev) => prev.filter((l) => l.id !== id));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-sapphire-400">
        Loading...
      </div>
    );
  }

  if (leads.length === 0) {
    return (
      <div className="rounded-xl border border-sapphire-100 bg-white p-12 text-center">
        <p className="text-sapphire-400">No leads yet.</p>
        <p className="mt-1 text-sm text-sapphire-300">
          Contact form submissions will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {leads.map((lead) => (
        <div
          key={lead.id}
          className="rounded-xl border border-sapphire-100 bg-white p-6 shadow-sm"
        >
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-heading text-lg font-bold text-sapphire-900">
                {lead.name}
              </h3>
              <p className="text-sm text-sapphire-500">{lead.email}</p>
            </div>
            <div className="flex items-center gap-3">
              {lead.project_type && (
                <span className="rounded-full bg-sapphire-100 px-3 py-1 text-xs font-medium text-sapphire-600">
                  {lead.project_type}
                </span>
              )}
              <button
                onClick={() => handleDelete(lead.id)}
                className="text-xs text-red-400 transition-colors hover:text-red-600"
              >
                Delete
              </button>
            </div>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-sapphire-600">
            {lead.message}
          </p>
          <p className="mt-2 text-xs text-sapphire-400">
            {new Date(lead.created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      ))}
    </div>
  );
}

function ProjectsPanel() {
  const [projects, setProjects] = useState<
    Array<{
      id: number;
      client_name: string;
      project_name: string;
      scope: string;
      price: string;
      status: string;
      created_at: string;
    }>
  >([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    client_name: "",
    project_name: "",
    scope: "",
    price: "",
    status: "active",
  });

  // Load projects on mount
  useEffect(() => {
    getProjects().then((data) => {
      setProjects(data);
      setLoading(false);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addProject({ data: form });
    setForm({ client_name: "", project_name: "", scope: "", price: "", status: "active" });
    setShowForm(false);
    // Reload
    const data = await getProjects();
    setProjects(data);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-sapphire-400">
        Loading...
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-heading text-xl font-bold text-sapphire-900">
          Projects ({projects.length})
        </h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="rounded-full bg-sapphire-800 px-5 py-2 text-xs font-semibold tracking-wider text-white transition-all hover:bg-gold-500"
        >
          {showForm ? "Cancel" : "+ Add Project"}
        </button>
      </div>

      {/* Add project form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-6 rounded-xl border border-sapphire-100 bg-white p-6 shadow-sm"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <input
              type="text"
              placeholder="Client name"
              value={form.client_name}
              onChange={(e) =>
                setForm({ ...form, client_name: e.target.value })
              }
              required
              className="rounded-lg border border-sapphire-200 px-4 py-2.5 text-sm text-sapphire-900 placeholder-sapphire-400 focus:border-gold-500 focus:outline-none"
            />
            <input
              type="text"
              placeholder="Project name"
              value={form.project_name}
              onChange={(e) =>
                setForm({ ...form, project_name: e.target.value })
              }
              required
              className="rounded-lg border border-sapphire-200 px-4 py-2.5 text-sm text-sapphire-900 placeholder-sapphire-400 focus:border-gold-500 focus:outline-none"
            />
            <input
              type="text"
              placeholder="Scope (e.g., Full website)"
              value={form.scope}
              onChange={(e) => setForm({ ...form, scope: e.target.value })}
              className="rounded-lg border border-sapphire-200 px-4 py-2.5 text-sm text-sapphire-900 placeholder-sapphire-400 focus:border-gold-500 focus:outline-none"
            />
            <input
              type="text"
              placeholder="Price (e.g., $5,000)"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="rounded-lg border border-sapphire-200 px-4 py-2.5 text-sm text-sapphire-900 placeholder-sapphire-400 focus:border-gold-500 focus:outline-none"
            />
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="rounded-lg border border-sapphire-200 px-4 py-2.5 text-sm text-sapphire-900 focus:border-gold-500 focus:outline-none"
            >
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="paused">Paused</option>
              <option value="planning">Planning</option>
            </select>
          </div>
          <button
            type="submit"
            className="mt-4 rounded-full bg-gold-500 px-6 py-2.5 text-sm font-semibold tracking-wider text-sapphire-950 transition-all hover:bg-gold-400"
          >
            Add Project
          </button>
        </form>
      )}

      {/* Project list */}
      {projects.length === 0 ? (
        <div className="rounded-xl border border-sapphire-100 bg-white p-12 text-center">
          <p className="text-sapphire-400">No projects yet.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-sapphire-100 bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-sapphire-100 bg-sapphire-50">
                <th className="px-4 py-3 font-medium text-sapphire-600">
                  Client
                </th>
                <th className="px-4 py-3 font-medium text-sapphire-600">
                  Project
                </th>
                <th className="hidden px-4 py-3 font-medium text-sapphire-600 sm:table-cell">
                  Scope
                </th>
                <th className="hidden px-4 py-3 font-medium text-sapphire-600 sm:table-cell">
                  Price
                </th>
                <th className="px-4 py-3 font-medium text-sapphire-600">
                  Status
                </th>
                <th className="hidden px-4 py-3 font-medium text-sapphire-600 md:table-cell">
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr
                  key={project.id}
                  className="border-b border-sapphire-50 transition-colors hover:bg-sapphire-50/50"
                >
                  <td className="px-4 py-3 font-medium text-sapphire-900">
                    {project.client_name}
                  </td>
                  <td className="px-4 py-3 text-sapphire-700">
                    {project.project_name}
                  </td>
                  <td className="hidden px-4 py-3 text-sapphire-500 sm:table-cell">
                    {project.scope}
                  </td>
                  <td className="hidden px-4 py-3 text-sapphire-500 sm:table-cell">
                    {project.price}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        project.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : project.status === "active"
                            ? "bg-blue-100 text-blue-700"
                            : project.status === "planning"
                              ? "bg-gold-100 text-gold-700"
                              : "bg-sapphire-100 text-sapphire-600"
                      }`}
                    >
                      {project.status}
                    </span>
                  </td>
                  <td className="hidden px-4 py-3 text-xs text-sapphire-400 md:table-cell">
                    {new Date(project.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}