import sqlite3, json
src = r"d:\Nguyen wb\scripts\backup\dev.db.bak"
con = sqlite3.connect(src)
con.row_factory = sqlite3.Row
tables = [r[0] for r in con.execute(
    "select name from sqlite_master where type='table' and name not like 'sqlite_%' and name not like '_prisma%'")]
out = {}
for t in tables:
    rows = [dict(r) for r in con.execute(f'select * from "{t}"')]
    out[t] = rows
    print(t.ljust(32), len(rows))
json.dump(out, open(r"d:\Nguyen wb\scripts\backup\dump.json", "w", encoding="utf-8"), default=str)

