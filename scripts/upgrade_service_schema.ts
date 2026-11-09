import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Adding columns to Service table...");

  try {
    await prisma.$executeRawUnsafe(`ALTER TABLE "Service" ADD COLUMN "coverImage" TEXT;`);
    console.log("Successfully added coverImage column.");
  } catch (err: any) {
    if (err.message.includes("duplicate column")) {
      console.log("coverImage column already exists.");
    } else {
      console.log("coverImage:", err.message);
    }
  }

  try {
    await prisma.$executeRawUnsafe(`ALTER TABLE "Service" ADD COLUMN "galleryJson" TEXT DEFAULT '[]';`);
    console.log("Successfully added galleryJson column.");
  } catch (err: any) {
    if (err.message.includes("duplicate column")) {
      console.log("galleryJson column already exists.");
    } else {
      console.log("galleryJson:", err.message);
    }
  }

  try {
    await prisma.$executeRawUnsafe(`ALTER TABLE "Service" ADD COLUMN "altText" TEXT;`);
    console.log("Successfully added altText column.");
  } catch (err: any) {
    if (err.message.includes("duplicate column")) {
      console.log("altText column already exists.");
    } else {
      console.log("altText:", err.message);
    }
  }

  try {
    await prisma.$executeRawUnsafe(`ALTER TABLE "MediaAsset" ADD COLUMN "storagePath" TEXT;`);
    console.log("Successfully added storagePath to MediaAsset.");
  } catch (err: any) {
    if (err.message.includes("duplicate column")) {
      console.log("storagePath column already exists.");
    } else {
      console.log("storagePath:", err.message);
    }
  }

  // Delete leftover test services
  await prisma.service.deleteMany({
    where: {
      slug: {
        in: ["dich-vu-kiem-thu-12527", "dich-vu-kiem-thu-12527-2584"],
      },
    },
  });
  console.log("Cleaned up leftover test services.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
