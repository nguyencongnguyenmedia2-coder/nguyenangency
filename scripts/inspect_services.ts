import { prisma } from "../src/lib/prisma";

async function main() {
  const services = await prisma.service.findMany({
    select: {
      id: true,
      slug: true,
      title: true,
      group: true,
      thumbnail: true,
      coverImage: true,
      galleryJson: true,
      altText: true,
      status: true
    },
    orderBy: { order: "asc" }
  });

  console.log(`Total services in DB: ${services.length}`);
  for (const s of services) {
    console.log(`[${s.group}] ${s.slug} - Thumb: ${s.thumbnail ? s.thumbnail.substring(0, 30) : "EMPTY"}, Cover: ${s.coverImage ? s.coverImage.substring(0, 30) : "EMPTY"}, Gallery: ${s.galleryJson && s.galleryJson !== "[]" ? "YES" : "EMPTY"}`);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
