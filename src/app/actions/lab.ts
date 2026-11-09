"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createLabProduct(formData: FormData): Promise<void> {
  const name = formData.get("name")?.toString().trim() || "";
  const tagline = formData.get("tagline")?.toString().trim() || "";
  const shortDesc = formData.get("shortDesc")?.toString().trim() || "";
  const description = formData.get("description")?.toString().trim() || "";
  const productStage = formData.get("productStage")?.toString() || "LIVE";
  const version = formData.get("version")?.toString() || "v1.0";
  const pricingModel = formData.get("pricingModel")?.toString() || "Freemium";
  const demoUrl = formData.get("demoUrl")?.toString() || "";
  const thumbnail =
    formData.get("thumbnail")?.toString() ||
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80";

  if (!name || !shortDesc) {
    return;
  }

  try {
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    let cat = await prisma.productCategory.findFirst();
    if (!cat) {
      cat = await prisma.productCategory.create({
        data: { name: "AI Tools", slug: "ai-tools" },
      });
    }

    await prisma.labProduct.create({
      data: {
        name,
        slug: `${slug}-${Date.now().toString().slice(-4)}`,
        tagline: tagline || "Innovative Digital Product",
        categoryId: cat.id,
        shortDesc,
        description: description || shortDesc,
        thumbnail,
        productStage,
        version,
        pricingModel,
        demoUrl,
        featuresJson: JSON.stringify(["Mô hình AI tự động hóa", "Giao diện không gian 3D", "API RESTful"]),
        techStackJson: JSON.stringify(["Next.js", "Three.js", "PostgreSQL"]),
        status: "PUBLISHED",
      },
    });

    revalidatePath("/lab");
    revalidatePath("/admin/lab");
  } catch (error: any) {
    console.error("Error creating lab product:", error);
  }
}
