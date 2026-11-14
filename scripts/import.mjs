// Copies the repo's research docs and seed files into Supabase through the running app.
// Keeps edits made in the app (edited file content, hidden or archived files, approvals).
//   npm run db:import            (dev server on port 3100)
const BASE = process.env.CLIENTOS_URL ?? "http://localhost:3100";
const res = await fetch(`${BASE}/api/admin/import`, { method: "POST", headers: process.env.CLIENTOS_ADMIN_TOKEN ? { "x-clientos-admin": process.env.CLIENTOS_ADMIN_TOKEN } : {} });
const text = await res.text();
console.log(res.ok ? JSON.parse(text).log.join("\n") : `Import failed (${res.status}): ${text}`);
process.exit(res.ok ? 0 : 1);
