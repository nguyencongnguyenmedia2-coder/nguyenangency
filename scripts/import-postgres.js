const { Client } = require("pg");
const fs = require("fs");
const dump = JSON.parse(fs.readFileSync(__dirname + "/backup/dump.json", "utf8"));

function conv(v, type) {
  if (v === null || v === undefined) return null;
  if (type.startsWith("timestamp")) {
    if (typeof v === "number") return new Date(v);
    if (/^\d+$/.test(String(v))) return new Date(Number(v));
    return new Date(String(v).replace(" ", "T"));
  }
  if (type === "boolean") return v === true || v === 1 || v === "1" || v === "true";
  if (type === "integer" || type === "bigint") return Math.round(Number(v));
  if (type === "double precision" || type === "numeric") return Number(v);
  return typeof v === "object" ? JSON.stringify(v) : String(v);
}

(async () => {
  const c = new Client({
    connectionString: process.env.PG_URL,
    ssl: { rejectUnauthorized: false },
  });
  await c.connect();
  await c.query("set search_path to nguyen_cms");
  let replica = true;
  try { await c.query("set session_replication_role = replica"); }
  catch (e) { replica = false; console.log("replication_role not allowed:", e.message); }

  // Prisma model table names match SQLite table names
  const pgTables = (await c.query(
    "select table_name from information_schema.tables where table_schema='nguyen_cms'")).rows.map(r => r.table_name);

  for (const [table, rows] of Object.entries(dump)) {
    if (!pgTables.includes(table)) { console.log("skip (no pg table):", table, rows.length); continue; }
    if (!rows.length) { console.log(table.padEnd(30), 0); continue; }
    const cols = (await c.query(
      "select column_name, data_type from information_schema.columns where table_schema='nguyen_cms' and table_name=$1", [table])).rows;
    const types = Object.fromEntries(cols.map(r => [r.column_name, r.data_type]));
    let ok = 0, fail = 0;
    for (const row of rows) {
      const keys = Object.keys(row).filter(k => k in types);
      const vals = keys.map(k => conv(row[k], types[k]));
      const sql = `insert into "${table}" (${keys.map(k => `"${k}"`).join(",")}) values (${keys.map((_, i) => "$" + (i + 1)).join(",")}) on conflict do nothing`;
      try { await c.query(sql, vals); ok++; }
      catch (e) { fail++; if (fail <= 2) console.log("  ERR", table, e.message); }
    }
    console.log(table.padEnd(30), "ok", ok, "fail", fail);
  }
  await c.end();
})().catch(e => { console.error("FATAL", e.message); process.exit(1); });

