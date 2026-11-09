import { prisma } from "../src/lib/prisma";
import fs from "fs";
import path from "path";
import { uploadToSupabaseBucket, checkSupabaseConnection } from "../src/lib/supabase";

async function runAudit() {
  console.log("==================================================");
  console.log("   KIỂM TRA TOÀN DIỆN HỆ THỐNG HÌNH ẢNH DỊCH VỤ   ");
  console.log("==================================================\n");

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

  console.log(`▶ Tổng số dịch vụ trong hệ thống: ${services.length}`);

  let validThumbs = 0;
  let validCovers = 0;
  let validGalleries = 0;
  let missingFiles = 0;

  for (const s of services) {
    const hasThumb = Boolean(s.thumbnail);
    const hasCover = Boolean(s.coverImage);
    let galleryCount = 0;
    try {
      const g = JSON.parse(s.galleryJson || "[]");
      galleryCount = Array.isArray(g) ? g.length : 0;
    } catch {}

    if (hasThumb) validThumbs++;
    if (hasCover) validCovers++;
    if (galleryCount >= 3) validGalleries++;

    // Kiểm tra file trên ổ đĩa nếu là local URL
    if (s.thumbnail?.startsWith("/uploads/")) {
      const fullPath = path.join(process.cwd(), "public", s.thumbnail);
      if (!fs.existsSync(fullPath)) {
        console.warn(`  ⚠️ Thiếu file ổ đĩa: ${fullPath}`);
        missingFiles++;
      }
    }

    if (s.coverImage?.startsWith("/uploads/")) {
      const fullPath = path.join(process.cwd(), "public", s.coverImage);
      if (!fs.existsSync(fullPath)) {
        console.warn(`  ⚠️ Thiếu file ổ đĩa: ${fullPath}`);
        missingFiles++;
      }
    }
  }

  console.log(`\n▶ Kết quả kiểm tra dữ liệu hình ảnh:`);
  console.log(`  - Dịch vụ có Thumbnail hợp lệ: ${validThumbs}/${services.length} (${validThumbs === services.length ? "PASS 100%" : "FAIL"})`);
  console.log(`  - Dịch vụ có Cover Banner hợp lệ: ${validCovers}/${services.length} (${validCovers === services.length ? "PASS 100%" : "FAIL"})`);
  console.log(`  - Dịch vụ có Gallery >= 3 ảnh: ${validGalleries}/${services.length} (${validGalleries === services.length ? "PASS 100%" : "FAIL"})`);
  console.log(`  - File thiếu sót trên ổ đĩa: ${missingFiles}`);

  // Kiểm tra kết nối Supabase Storage
  console.log(`\n▶ Kiểm tra Supabase Storage:`);
  const supaStatus = await checkSupabaseConnection();
  console.log(`  - Trạng thái kết nối Supabase Cloud: ${supaStatus.connected ? "ĐÃ KẾT NỐI (" + supaStatus.url + ")" : "CHƯA KẾT NỐI"}`);
  console.log(`  - Service Role Key: ${supaStatus.hasServiceRole ? "Đã cấu hình" : "Chưa cấu hình (đang dùng Publishable Key)"}`);
  console.log(`  - Thông điệp: ${supaStatus.message}`);

  console.log("\n==================================================");
  if (validThumbs === services.length && validCovers === services.length && validGalleries === services.length && missingFiles === 0) {
    console.log("🎉 TẤT CẢ CÁC TIÊU CHÍ HÌNH ẢNH ĐẠT YÊU CẦU 100%!");
  } else {
    console.log("⚠️ CẦN KHẮC PHỤC CÁC MỤC THIẾU!");
  }
  console.log("==================================================");
}

runAudit().catch(console.error).finally(() => prisma.$disconnect());

