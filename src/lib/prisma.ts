import { PrismaClient } from "@prisma/client";
import path from "path";
import fs from "fs";

function resolveSqliteDatabaseUrl(): string {
  // If explicitly configured to a non-file URL (e.g. PostgreSQL/Supabase), use it
  if (process.env.DATABASE_URL && !process.env.DATABASE_URL.startsWith("file:")) {
    return process.env.DATABASE_URL;
  }

  const isServerless =
    Boolean(process.env.VERCEL) ||
    Boolean(process.env.AWS_LAMBDA_FUNCTION_NAME) ||
    process.platform === "linux";

  if (isServerless) {
    const tmpDbPath = path.join("/tmp", "dev.db");

    // Potential locations where Next.js bundles files on Lambda
    const candidatePaths = [
      path.join(process.cwd(), "prisma", "dev.db"),
      path.join(process.cwd(), ".next", "server", "prisma", "dev.db"),
      path.join(__dirname, "..", "prisma", "dev.db"),
      path.join(__dirname, "prisma", "dev.db"),
      path.resolve("prisma", "dev.db"),
    ];

    let foundSource: string | null = null;
    for (const cand of candidatePaths) {
      if (fs.existsSync(cand)) {
        foundSource = cand;
        break;
      }
    }

    if (foundSource) {
      try {
        const needsCopy =
          !fs.existsSync(tmpDbPath) ||
          fs.statSync(tmpDbPath).size !== fs.statSync(foundSource).size;

        if (needsCopy) {
          fs.copyFileSync(foundSource, tmpDbPath);
          try {
            fs.chmodSync(tmpDbPath, 0o666);
          } catch {}
        }
        return `file:${tmpDbPath}`;
      } catch (err) {
        console.warn("[Prisma] Could not copy SQLite db to /tmp, using foundSource:", err);
        return `file:${foundSource}`;
      }
    }

    if (fs.existsSync(tmpDbPath)) {
      return `file:${tmpDbPath}`;
    }

    return `file:${path.join(process.cwd(), "prisma", "dev.db")}`;
  }

  // Local development
  const localDb = path.join(process.cwd(), "prisma", "dev.db");
  return `file:${localDb}`;
}

const activeDbUrl = resolveSqliteDatabaseUrl();
process.env.DATABASE_URL = activeDbUrl;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: activeDbUrl,
      },
    },
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
