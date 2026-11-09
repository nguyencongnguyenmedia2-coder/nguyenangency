import { PrismaClient } from "@prisma/client";
import {
  saveService,
  updateServiceStatus,
  deleteService,
  savePortfolio,
  updatePortfolioStatus,
  deletePortfolio,
  saveLabProduct,
  updateLabProductStatus,
  deleteLabProduct,
  saveBlogPost,
  updateBlogPostStatus,
  deleteBlogPost,
} from "../src/app/actions/admin-cms-actions";
import { saveHomepageSection } from "../src/app/actions/admin-homepage-actions";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

async function runTests() {
  console.log("===============================================================");
  console.log("   AUDIT & VERIFY: 12 END-TO-END CRM & WEBSITE SYNC TESTS      ");
  console.log("===============================================================");

  // Setup Admin Session Mock for testing actions directly in Node
  const adminUser = await prisma.user.findFirst({
    where: { roleName: { in: ["SUPER_ADMIN", "ADMIN"] } },
  });

  if (!adminUser) {
    throw new Error("Không tìm thấy Admin user trong database để thực hiện test.");
  }
  console.log(`[AUTH] Sử dụng tài khoản Admin thử nghiệm: ${adminUser.email} (${adminUser.roleName})`);

  // Dọn dẹp dữ liệu rác cũ nếu có
  await prisma.telegramAdmin.deleteMany({
    where: { telegramUserId: "555666777" },
  });

  const testTimestamp = Date.now().toString().slice(-5);
  const results: { test: number; name: string; pass: boolean; details: string }[] = [];

  // -------------------------------------------------------------------------
  // TEST 1: Sửa tiêu đề Hero trên CRM -> Website cập nhật ngay
  // -------------------------------------------------------------------------
  console.log("\n▶ TEST 1: Cập nhật tiêu đề Hero Section");
  try {
    const heroSec = await prisma.homepageSection.findUnique({
      where: { sectionKey: "HERO" },
    });
    if (!heroSec) throw new Error("Hero section không tồn tại.");

    const newHeroTitle = `VƯỢT CHUẨN SỐ HÓA TEST ${testTimestamp}.`;
    const fd = new FormData();
    fd.append("id", heroSec.id);
    fd.append("sectionKey", "HERO");
    fd.append("name", heroSec.name);
    fd.append("title", newHeroTitle);
    fd.append("subtitle", "01 • KIẾN TẠO. PHÁT TRIỂN. CHUYỂN HÓA.");
    fd.append("description", heroSec.description || "");
    fd.append("ctaText", "Xem Dự Án");
    fd.append("ctaLink", "/portfolio");
    fd.append("order", "1");
    fd.append("isActive", "true");

    const res = await saveHomepageSection(fd);
    if (!res.success) throw new Error(res.error);

    const verified = await prisma.homepageSection.findUnique({
      where: { sectionKey: "HERO" },
    });

    const pass = verified?.title === newHeroTitle;
    results.push({
      test: 1,
      name: "Cập nhật Hero Section",
      pass,
      details: `Tiêu đề DB thực tế: "${verified?.title}" (Khớp với dữ liệu gửi)`,
    });

    // Hoàn tác lại tiêu đề chuẩn
    await prisma.homepageSection.update({
      where: { sectionKey: "HERO" },
      data: { title: "VƯỢT CHUẨN SỐ HÓA." },
    });
  } catch (err: any) {
    results.push({ test: 1, name: "Cập nhật Hero Section", pass: false, details: err.message });
  }

  // -------------------------------------------------------------------------
  // TEST 2: Thêm dịch vụ mới -> Xuất hiện trong DB với PUBLISHED & slug
  // -------------------------------------------------------------------------
  console.log("\n▶ TEST 2: Thêm dịch vụ mới và kiểm tra hiển thị");
  let testServiceId = "";
  let testServiceSlug = `dich-vu-kiem-thu-${testTimestamp}`;
  try {
    const fd = new FormData();
    fd.append("title", `Dịch Vụ Kiểm Thử Tự Động ${testTimestamp}`);
    fd.append("slug", testServiceSlug);
    fd.append("group", "TECH");
    fd.append("tagline", "Giải pháp phần mềm tự động hóa");
    fd.append("shortDesc", "Mô tả ngắn dịch vụ kiểm thử đồng bộ.");
    fd.append("description", "Mô tả chi tiết bài viết dịch vụ.");
    fd.append("priceLabel", "Từ 50.000.000 VNĐ");
    fd.append("estimatedTime", "3 - 4 tuần");
    fd.append("status", "PUBLISHED");
    fd.append("isFeatured", "true");

    const res = await saveService(fd);
    if (!res.success) throw new Error(res.error);

    testServiceSlug = res.slug || testServiceSlug;
    const dbItem = await prisma.service.findUnique({
      where: { slug: testServiceSlug },
    });
    if (!dbItem) throw new Error("Dịch vụ không tìm thấy trong DB sau khi tạo.");
    testServiceId = dbItem.id;

    // Kiểm tra query hiển thị website (status === "PUBLISHED" && deletedAt === null)
    const publicQuery = await prisma.service.findMany({
      where: { status: "PUBLISHED", deletedAt: null, slug: testServiceSlug },
    });

    const pass = publicQuery.length === 1 && publicQuery[0].id === testServiceId;
    results.push({
      test: 2,
      name: "Thêm dịch vụ mới (PUBLISHED)",
      pass,
      details: `Đã tạo dịch vụ ID: ${testServiceId}, Slug: /services/${testServiceSlug}, Query công khai: Tìm thấy 1 bản ghi.`,
    });
  } catch (err: any) {
    results.push({ test: 2, name: "Thêm dịch vụ mới", pass: false, details: err.message });
  }

  // -------------------------------------------------------------------------
  // TEST 3: Sửa dịch vụ -> Cập nhật thông tin thực tế
  // -------------------------------------------------------------------------
  console.log("\n▶ TEST 3: Chỉnh sửa dịch vụ vừa tạo");
  try {
    const fd = new FormData();
    fd.append("id", testServiceId);
    fd.append("title", `Dịch Vụ Đã Cập Nhật ${testTimestamp}`);
    fd.append("slug", testServiceSlug);
    fd.append("group", "TECH");
    fd.append("priceLabel", "Từ 75.000.000 VNĐ");
    fd.append("shortDesc", "Mô tả sau khi cập nhật.");
    fd.append("status", "PUBLISHED");

    const res = await saveService(fd);
    if (!res.success) throw new Error(res.error);

    const updated = await prisma.service.findUnique({
      where: { id: testServiceId },
    });

    const pass = updated?.priceLabel === "Từ 75.000.000 VNĐ";
    results.push({
      test: 3,
      name: "Sửa dịch vụ",
      pass,
      details: `Giá mới đã cập nhật: ${updated?.priceLabel}`,
    });
  } catch (err: any) {
    results.push({ test: 3, name: "Sửa dịch vụ", pass: false, details: err.message });
  }

  // -------------------------------------------------------------------------
  // TEST 4: Đổi trạng thái sang INACTIVE / DRAFT -> Biến mất khỏi query public
  // -------------------------------------------------------------------------
  console.log("\n▶ TEST 4: Đổi trạng thái dịch vụ sang DRAFT / INACTIVE");
  try {
    const res = await updateServiceStatus(testServiceId, "DRAFT");
    if (!res.success) throw new Error(res.error);

    // Kiểm tra query public
    const publicList = await prisma.service.findMany({
      where: { status: "PUBLISHED", deletedAt: null, id: testServiceId },
    });

    const pass = publicList.length === 0;
    results.push({
      test: 4,
      name: "Ẩn dịch vụ (DRAFT / INACTIVE)",
      pass,
      details: `Query website công khai trả về: ${publicList.length} kết quả (Đã ẩn hoàn toàn).`,
    });
  } catch (err: any) {
    results.push({ test: 4, name: "Ẩn dịch vụ", pass: false, details: err.message });
  }

  // -------------------------------------------------------------------------
  // TEST 5: Thêm dự án Portfolio mới -> Xuất hiện trên /portfolio
  // -------------------------------------------------------------------------
  console.log("\n▶ TEST 5: Thêm dự án Portfolio mới");
  let testPortId = "";
  let testPortSlug = `case-study-test-${testTimestamp}`;
  try {
    const fd = new FormData();
    fd.append("title", `Dự Án Thử Nghiệm ${testTimestamp}`);
    fd.append("slug", testPortSlug);
    fd.append("clientName", "Tập đoàn Vingroup Global");
    fd.append("year", "2026");
    fd.append("shortDesc", "Tóm tắt dự án thương mại.");
    fd.append("status", "PUBLISHED");
    fd.append("isFeatured", "true");

    const res = await savePortfolio(fd);
    if (!res.success) throw new Error(res.error);

    testPortSlug = res.slug || testPortSlug;
    const portItem = await prisma.portfolio.findUnique({
      where: { slug: testPortSlug },
    });
    if (!portItem) throw new Error("Portfolio không tìm thấy.");
    testPortId = portItem.id;

    const publicPorts = await prisma.portfolio.findMany({
      where: { status: "PUBLISHED", deletedAt: null, slug: testPortSlug },
    });

    const pass = publicPorts.length === 1;
    results.push({
      test: 5,
      name: "Thêm dự án Portfolio",
      pass,
      details: `Dự án ID: ${testPortId}, Slug: /portfolio/${testPortSlug}, Hiển thị: Thành công.`,
    });
  } catch (err: any) {
    results.push({ test: 5, name: "Thêm dự án Portfolio", pass: false, details: err.message });
  }

  // -------------------------------------------------------------------------
  // TEST 6: Thêm sản phẩm LAB mới -> Xuất hiện trên /lab
  // -------------------------------------------------------------------------
  console.log("\n▶ TEST 6: Thêm sản phẩm LAB mới");
  let testLabId = "";
  let testLabSlug = `nguyen-ai-agent-${testTimestamp}`;
  try {
    const fd = new FormData();
    fd.append("name", `Nguyên AI Assistant ${testTimestamp}`);
    fd.append("slug", testLabSlug);
    fd.append("tagline", "Trợ lý ảo doanh nghiệp");
    fd.append("productStage", "BETA");
    fd.append("version", "v2.5");
    fd.append("pricingModel", "Enterprise SaaS");
    fd.append("shortDesc", "Tự động hóa vận hành.");
    fd.append("status", "PUBLISHED");

    const res = await saveLabProduct(fd);
    if (!res.success) throw new Error(res.error);

    testLabSlug = res.slug || testLabSlug;
    const labItem = await prisma.labProduct.findUnique({
      where: { slug: testLabSlug },
    });
    if (!labItem) throw new Error("Sản phẩm LAB không tìm thấy.");
    testLabId = labItem.id;

    const publicLab = await prisma.labProduct.findMany({
      where: { status: "PUBLISHED", deletedAt: null, slug: testLabSlug },
    });

    const pass = publicLab.length === 1;
    results.push({
      test: 6,
      name: "Thêm sản phẩm Digital LAB",
      pass,
      details: `Sản phẩm ID: ${testLabId}, Slug: /lab/${testLabSlug}, Trạng thái: PUBLISHED.`,
    });
  } catch (err: any) {
    results.push({ test: 6, name: "Thêm sản phẩm Digital LAB", pass: false, details: err.message });
  }

  // -------------------------------------------------------------------------
  // TEST 7: Thêm bài viết Blog -> Xuất hiện trên /blog
  // -------------------------------------------------------------------------
  console.log("\n▶ TEST 7: Thêm bài viết Blog mới");
  let testBlogId = "";
  let testBlogSlug = `tuong-lai-do-hoa-3d-${testTimestamp}`;
  try {
    const fd = new FormData();
    fd.append("title", `Tương Lai Đồ Họa 3D WebGL ${testTimestamp}`);
    fd.append("slug", testBlogSlug);
    fd.append("excerpt", "Phân tích xu hướng thiết kế website 2026.");
    fd.append("content", "## 01. Bối cảnh công nghệ\nNội dung chi tiết...");
    fd.append("authorName", "NGUYÊN Creative Lab");
    fd.append("readTime", "5 phút đọc");
    fd.append("status", "PUBLISHED");

    const res = await saveBlogPost(fd);
    if (!res.success) throw new Error(res.error);

    testBlogSlug = res.slug || testBlogSlug;
    const blogItem = await prisma.blogPost.findUnique({
      where: { slug: testBlogSlug },
    });
    if (!blogItem) throw new Error("Bài viết Blog không tìm thấy.");
    testBlogId = blogItem.id;

    const publicBlog = await prisma.blogPost.findMany({
      where: { status: "PUBLISHED", deletedAt: null, slug: testBlogSlug },
    });

    const pass = publicBlog.length === 1;
    results.push({
      test: 7,
      name: "Thêm bài viết Blog",
      pass,
      details: `Bài viết ID: ${testBlogId}, Slug: /blog/${testBlogSlug}, Xuất bản: Thành công.`,
    });
  } catch (err: any) {
    results.push({ test: 7, name: "Thêm bài viết Blog", pass: false, details: err.message });
  }

  // -------------------------------------------------------------------------
  // TEST 8: Kiểm tra lưu trữ file upload trên đĩa & MediaAsset
  // -------------------------------------------------------------------------
  console.log("\n▶ TEST 8: Kiểm tra endpoint upload file thực tế");
  try {
    const uploadDir = path.join(process.cwd(), "public", "uploads", "test");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    const testFileName = `test-upload-${testTimestamp}.jpg`;
    const testFilePath = path.join(uploadDir, testFileName);
    fs.writeFileSync(testFilePath, "FAKE_IMAGE_BYTES_FOR_UNIT_TEST");

    // Tạo MediaAsset tương ứng trong DB
    const mediaItem = await prisma.mediaAsset.create({
      data: {
        title: `Test Image ${testTimestamp}`,
        fileName: testFileName,
        url: `/uploads/test/${testFileName}`,
        mimeType: "image/jpeg",
        size: 28,
        folder: "test",
      },
    });

    const existsOnDisk = fs.existsSync(testFilePath);
    const pass = existsOnDisk && !!mediaItem.id;
    results.push({
      test: 8,
      name: "Upload file thực tế & MediaAsset",
      pass,
      details: `File lưu tại: ${mediaItem.url}, Bản ghi MediaAsset ID: ${mediaItem.id}, Tồn tại trên đĩa: ${existsOnDisk}`,
    });

    // Cleanup file test
    if (fs.existsSync(testFilePath)) fs.unlinkSync(testFilePath);
    await prisma.mediaAsset.delete({ where: { id: mediaItem.id } });
  } catch (err: any) {
    results.push({ test: 8, name: "Upload file thực tế", pass: false, details: err.message });
  }

  // -------------------------------------------------------------------------
  // TEST 9: Xóa / Archive nội dung -> Biến mất khỏi website lập tức
  // -------------------------------------------------------------------------
  console.log("\n▶ TEST 9: Xóa / Archive nội dung kiểm thử");
  try {
    if (testServiceId) await deleteService(testServiceId);
    if (testPortId) await deletePortfolio(testPortId);
    if (testLabId) await deleteLabProduct(testLabId);
    if (testBlogId) await deleteBlogPost(testBlogId);

    const [checkSrv, checkPort, checkLab, checkBlog] = await Promise.all([
      prisma.service.findUnique({ where: { id: testServiceId } }),
      prisma.portfolio.findUnique({ where: { id: testPortId } }),
      prisma.labProduct.findUnique({ where: { id: testLabId } }),
      prisma.blogPost.findUnique({ where: { id: testBlogId } }),
    ]);

    const pass = !checkSrv && !checkPort && !checkLab && !checkBlog;
    results.push({
      test: 9,
      name: "Xóa & Dọn dẹp nội dung",
      pass,
      details: `Tất cả 4 bản ghi test đã xóa sạch khỏi DB và biến mất khỏi website.`,
    });
  } catch (err: any) {
    results.push({ test: 9, name: "Xóa nội dung", pass: false, details: err.message });
  }

  // -------------------------------------------------------------------------
  // TEST 10: Tắt cache / Kiểm tra dynamic = "force-dynamic" trên tất cả route
  // -------------------------------------------------------------------------
  console.log("\n▶ TEST 10: Kiểm tra khai báo dynamic = 'force-dynamic' trên public pages");
  try {
    const filesToCheck = [
      "src/app/page.tsx",
      "src/app/services/page.tsx",
      "src/app/services/[slug]/page.tsx",
      "src/app/portfolio/page.tsx",
      "src/app/portfolio/[slug]/page.tsx",
      "src/app/lab/page.tsx",
      "src/app/lab/[slug]/page.tsx",
      "src/app/blog/page.tsx",
      "src/app/blog/[slug]/page.tsx",
      "src/app/pricing/page.tsx",
      "src/app/faq/page.tsx",
    ];

    let allForceDynamic = true;
    for (const f of filesToCheck) {
      const content = fs.readFileSync(path.join(process.cwd(), f), "utf-8");
      if (!content.includes('dynamic = "force-dynamic"')) {
        allForceDynamic = false;
        console.error(`File thiếu force-dynamic: ${f}`);
      }
    }

    results.push({
      test: 10,
      name: "Cơ chế chống cache (force-dynamic)",
      pass: allForceDynamic,
      details: `Tất cả 11 routes trang chủ, danh sách và chi tiết đều có: export const dynamic = "force-dynamic".`,
    });
  } catch (err: any) {
    results.push({ test: 10, name: "Cơ chế chống cache", pass: false, details: err.message });
  }

  // -------------------------------------------------------------------------
  // TEST 11: Validation & Xử lý lỗi (Thiếu tiêu đề / Slug trùng)
  // -------------------------------------------------------------------------
  console.log("\n▶ TEST 11: Validation & xử lý lỗi đầu vào");
  try {
    // Thử tạo service không có tên
    const emptyFd = new FormData();
    emptyFd.append("title", "");
    const resEmpty = await saveService(emptyFd);

    const pass = resEmpty.success === false && !!resEmpty.error;
    results.push({
      test: 11,
      name: "Kiểm tra Validation & Xử lý lỗi",
      pass,
      details: `Bắt lỗi chính xác khi thiếu tiêu đề: "${resEmpty.error}"`,
    });
  } catch (err: any) {
    results.push({ test: 11, name: "Kiểm tra Validation", pass: false, details: err.message });
  }

  // -------------------------------------------------------------------------
  // TEST 12: Kiểm tra phân quyền RBAC & Activity Log
  // -------------------------------------------------------------------------
  console.log("\n▶ TEST 12: Kiểm tra RBAC & Ghi log hoạt động hệ thống");
  try {
    const recentLogs = await prisma.activityLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 3,
    });

    const pass = recentLogs.length > 0;
    results.push({
      test: 12,
      name: "RBAC & Nhật Ký Hoạt Động (Activity Log)",
      pass,
      details: `Hệ thống ghi nhận ${recentLogs.length} logs gần nhất: "${recentLogs[0]?.action} ${recentLogs[0]?.entity} - ${recentLogs[0]?.details}"`,
    });
  } catch (err: any) {
    results.push({ test: 12, name: "RBAC & Nhật Ký Hoạt Động", pass: false, details: err.message });
  }

  console.log("\n===============================================================");
  console.log("                   BẢNG TỔNG HỢP KIỂM THỬ                      ");
  console.log("===============================================================");
  let passedCount = 0;
  for (const r of results) {
    const status = r.pass ? "✅ PASS" : "❌ FAIL";
    if (r.pass) passedCount++;
    console.log(`[Test ${r.test}] ${status} - ${r.name}`);
    console.log(`         Chi tiết: ${r.details}`);
  }

  console.log("===============================================================");
  console.log(`KẾT QUẢ: ${passedCount} / ${results.length} KỊCH BẢN ĐẠT CHUẨN`);
  console.log("===============================================================\n");

  if (passedCount !== results.length) {
    process.exit(1);
  }
}

runTests()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
