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

async function fixMissing() {
  // 1. Cover for video-production
  const videoCoverUrl = "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1920&q=85";
  const videoCoverDest = path.join(process.cwd(), "public", "uploads", "services", "video-production", "cover.jpg");
  await downloadImage(videoCoverUrl, videoCoverDest);
  await prisma.service.updateMany({
    where: { slug: "video-production" },
    data: { coverImage: "/uploads/services/video-production/cover.jpg" }
  });
  console.log("✓ Fixed cover for video-production");

  // 2. Thumbnail for ai-integration
  const aiThumbUrl = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80";
  const aiThumbDest = path.join(process.cwd(), "public", "uploads", "services", "ai-integration", "thumbnail.jpg");
  await downloadImage(aiThumbUrl, aiThumbDest);
  await prisma.service.updateMany({
    where: { slug: "ai-integration" },
    data: { thumbnail: "/uploads/services/ai-integration/thumbnail.jpg" }
  });
  console.log("✓ Fixed thumbnail for ai-integration");
}

fixMissing().catch(console.error).finally(() => prisma.$disconnect());

