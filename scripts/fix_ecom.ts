import { prisma } from "../src/lib/prisma";
import fs from "fs";
import path from "path";
import https from "https";

function downloadImage(url: string, destPath: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadImage(res.headers.location, destPath).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed to download ${url}: status code ${res.statusCode}`));
      }

      const chunks: Buffer[] = [];
      res.on("data", (chunk) => chunks.push(chunk));
      res.on("end", () => {
        const buffer = Buffer.concat(chunks);
        fs.mkdirSync(path.dirname(destPath), { recursive: true });
        fs.writeFileSync(destPath, buffer);
        resolve(buffer);
      });
      res.on("error", reject);
    }).on("error", reject);
  });
}

async function fixEcommerce() {
  const ecomThumbUrl = "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=1200&q=80";
  const ecomThumbDest = path.join(process.cwd(), "public", "uploads", "services", "ecommerce-website", "thumbnail.jpg");
  await downloadImage(ecomThumbUrl, ecomThumbDest);
  await prisma.service.updateMany({
    where: { slug: "ecommerce-website" },
    data: { thumbnail: "/uploads/services/ecommerce-website/thumbnail.jpg" }
  });
  console.log("✓ Fixed thumbnail for ecommerce-website");
}

fixEcommerce().catch(console.error).finally(() => prisma.$disconnect());

