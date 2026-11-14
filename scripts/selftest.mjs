// Live checks against the running app and Supabase.
//   npm run test:live              (dev server on port 3100)
//   npm run test:live -- --stella  also runs one workflow with Stella (about $0.20)
const BASE = process.env.CLIENTOS_URL ?? "http://localhost:3100";
const stella = process.argv.includes("--stella");
let failed = 0;
const line = (ok, name, detail) => { if (!ok) failed++; console.log(`${ok ? "PASS" : "FAIL"} ${name}${detail ? ` · ${detail}` : ""}`); };

// Sign-in gate, seen from outside: a browser with no session is sent to the login page and refused by the API.
const page = await fetch(`${BASE}/projects/heritage`, { redirect: "manual" });
line(page.status === 307 && /\/login/.test(page.headers.get("location") ?? ""), "signed-out pages redirect to /login", `${page.status} ${page.headers.get("location") ?? ""}`);
const api = await fetch(`${BASE}/api/chats`, { headers: { "sec-fetch-site": "same-origin" } });
line(api.status === 401, "signed-out browser API calls are refused", String(api.status));
const login = await (await fetch(`${BASE}/login`)).text();
line(/Continue with Google/.test(login) && !/World Emblem|Heritage/.test(login), "login page shows Google and no project data");

// Everything else runs inside the app, with its own credentials.
const res = await fetch(`${BASE}/api/admin/selftest${stella ? "?stella=1" : ""}`);
const body = await res.json().catch(async () => ({ checks: [{ name: "selftest route", ok: false, detail: await res.text() }] }));
for (const c of body.checks ?? []) line(c.ok, c.name, c.detail);
console.log(failed ? `\n${failed} failed` : "\nall passed");
process.exit(failed ? 1 : 0);
