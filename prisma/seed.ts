import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { OFFICIAL_24_SERVICES } from "../src/data/services-data";

const prisma = new PrismaClient();

async function main() {
  console.log("🚀 Starting NGUYÊN AGENCY seed data...");

  // 1. Roles & Permissions
  const superAdminRole = await prisma.role.upsert({
    where: { name: "SUPER_ADMIN" },
    update: {},
    create: {
      name: "SUPER_ADMIN",
      displayName: "Tổng Quản Trị (Super Admin)",
      description: "Toàn quyền hệ thống, phân quyền, cấu hình và CMS",
    },
  });

  const adminRole = await prisma.role.upsert({
    where: { name: "ADMIN" },
    update: {},
    create: {
      name: "ADMIN",
      displayName: "Quản Trị Viên (Admin)",
      description: "Quản lý nội dung, CRM, báo giá và dự án",
    },
  });

  const staffRole = await prisma.role.upsert({
    where: { name: "STAFF" },
    update: {},
    create: {
      name: "STAFF",
      displayName: "Nhân Viên Kỹ Thuật / Sáng Tạo",
      description: "Thực hiện dự án, cập nhật task và tiến độ",
    },
  });

  const clientRole = await prisma.role.upsert({
    where: { name: "CLIENT" },
    update: {},
    create: {
      name: "CLIENT",
      displayName: "Khách Hàng (Client Portal)",
      description: "Xem dự án, hợp đồng, báo giá và phản hồi",
    },
  });

  // 2. Users
  const passwordHash = await bcrypt.hash("Nguyen@2026", 10);

  const adminUser = await prisma.user.upsert({
    where: { email: "admin@nguyenagency.vn" },
    update: {},
    create: {
      email: "admin@nguyenagency.vn",
      name: "Nguyên Director",
      passwordHash,
      roleName: "SUPER_ADMIN",
      roleId: superAdminRole.id,
      title: "Creative & Technical Director",
      phone: "0344979307",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    },
  });

  const clientUser = await prisma.user.upsert({
    where: { email: "client@nexus.com" },
    update: {},
    create: {
      email: "client@nexus.com",
      name: "Alex Trần",
      passwordHash,
      roleName: "CLIENT",
      roleId: clientRole.id,
      title: "CEO - Nexus FinTech",
      phone: "0912345678",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    },
  });

  // Customer profile for Client
  const nexusCustomer = await prisma.customer.upsert({
    where: { email: "client@nexus.com" },
    update: {},
    create: {
      code: "CUS-2026-001",
      userId: clientUser.id,
      name: "Nexus FinTech Global",
      email: "client@nexus.com",
      phone: "0912345678",
      company: "Nexus FinTech Group",
      position: "Chief Executive Officer",
      address: "Landmark 81, TP. Hồ Chí Minh",
      website: "https://nexusfintech.io",
      tier: "VIP",
      source: "Trực tiếp",
      careStatus: "ACTIVE",
      notes: "Đối tác chiến lược - Triển khai nền tảng Core Banking & Web 3D",
    },
  });

  // 3. Service Categories & Services
  const mediaCat = await prisma.serviceCategory.upsert({
    where: { slug: "media-creative" },
    update: {},
    create: {
      name: "MEDIA & CREATIVE",
      slug: "media-creative",
      group: "MEDIA",
      description: "Nhận diện thương hiệu đỉnh cao, truyền thông thị giác và thiết kế kỹ thuật số đa phương tiện.",
      order: 1,
    },
  });

  const techCat = await prisma.serviceCategory.upsert({
    where: { slug: "tech-software" },
    update: {},
    create: {
      name: "TECH & SOFTWARE",
      slug: "tech-software",
      group: "TECH",
      description: "Phát triển web app, mobile app, hệ thống quản trị và tích hợp giải pháp AI thế hệ mới.",
      order: 2,
    },
  });

  // Seed 24 Official Services (12 Media + 12 Tech)
  console.log("Seeding 24 official services with preserved uploaded images...");
  for (const s of OFFICIAL_24_SERVICES) {
    const isMedia = s.group === "MEDIA";
    const catId = isMedia ? mediaCat.id : techCat.id;
    const folder = s.slug === "e-commerce-website" ? "ecommerce-website" : s.slug;
    const localThumb = `/uploads/services/${folder}/thumbnail.jpg`;
    const localCover = `/uploads/services/${folder}/cover.jpg`;
    const localGallery = JSON.stringify([
      `/uploads/services/${folder}/gallery-1.jpg`,
      `/uploads/services/${folder}/gallery-2.jpg`,
      `/uploads/services/${folder}/gallery-3.jpg`,
    ]);

    await prisma.service.upsert({
      where: { slug: s.slug },
      update: {
        title: s.title,
        group: s.group,
        categoryId: catId,
        tagline: s.titleVn,
        shortDesc: s.shortDesc,
        description: s.intro,
        metaTitle: s.seoTitle,
        metaDescription: s.metaDescription,
        thumbnail: localThumb,
        coverImage: localCover,
        galleryJson: localGallery,
        benefitsJson: JSON.stringify(s.proposedItems),
        featuresJson: JSON.stringify(s.deliverables),
        processJson: JSON.stringify(s.process),
        order: s.order,
      },
      create: {
        title: s.title,
        slug: s.slug,
        group: s.group,
        categoryId: catId,
        tagline: s.titleVn,
        shortDesc: s.shortDesc,
        description: s.intro,
        metaTitle: s.seoTitle,
        metaDescription: s.metaDescription,
        thumbnail: localThumb,
        coverImage: localCover,
        galleryJson: localGallery,
        icon: isMedia ? "Palette" : "Cpu",
        benefitsJson: JSON.stringify(s.proposedItems),
        featuresJson: JSON.stringify(s.deliverables),
        processJson: JSON.stringify(s.process),
        estimatedTime: isMedia ? "3 - 10 ngày" : "2 - 6 tuần",
        startingPrice: isMedia ? 5000000 : 15000000,
        priceLabel: isMedia ? "Báo giá theo gói" : "Tư vấn & Báo giá",
        isFeatured: s.order <= 4,
        order: s.order,
        status: "PUBLISHED",
      },
    });

    // Also support alias slug if exists (e.g., ecommerce-website)
    if (s.aliases && s.aliases.length > 0) {
      for (const alias of s.aliases) {
        await prisma.service.upsert({
          where: { slug: alias },
          update: {
            title: s.title,
            group: s.group,
            categoryId: catId,
            tagline: s.titleVn,
            shortDesc: s.shortDesc,
            description: s.intro,
            metaTitle: s.seoTitle,
            metaDescription: s.metaDescription,
            thumbnail: localThumb,
            coverImage: localCover,
            galleryJson: localGallery,
            benefitsJson: JSON.stringify(s.proposedItems),
            featuresJson: JSON.stringify(s.deliverables),
            processJson: JSON.stringify(s.process),
            order: s.order,
          },
          create: {
            title: s.title,
            slug: alias,
            group: s.group,
            categoryId: catId,
            tagline: s.titleVn,
            shortDesc: s.shortDesc,
            description: s.intro,
            metaTitle: s.seoTitle,
            metaDescription: s.metaDescription,
            thumbnail: localThumb,
            coverImage: localCover,
            galleryJson: localGallery,
            icon: isMedia ? "Palette" : "Cpu",
            benefitsJson: JSON.stringify(s.proposedItems),
            featuresJson: JSON.stringify(s.deliverables),
            processJson: JSON.stringify(s.process),
            estimatedTime: isMedia ? "3 - 10 ngày" : "2 - 6 tuần",
            startingPrice: isMedia ? 5000000 : 15000000,
            priceLabel: isMedia ? "Báo giá theo gói" : "Tư vấn & Báo giá",
            isFeatured: false,
            order: s.order + 100,
            status: "PUBLISHED",
          },
        });
      }
    }
  }

  // 4. Portfolio Projects
  const brandingCat = await prisma.portfolioCategory.upsert({
    where: { slug: "branding" },
    update: {},
    create: { name: "Branding", slug: "branding", order: 1 },
  });

  const webAppCat = await prisma.portfolioCategory.upsert({
    where: { slug: "web-app" },
    update: {},
    create: { name: "Web App", slug: "web-app", order: 2 },
  });

  const aiProjectCat = await prisma.portfolioCategory.upsert({
    where: { slug: "ai-projects" },
    update: {},
    create: { name: "AI Projects", slug: "ai-projects", order: 3 },
  });

  const samplePortfolios = [
    {
      title: "Nexus FinTech – Global Trading Portal",
      slug: "nexus-fintech-trading-portal",
      clientName: "Nexus FinTech Group",
      categoryId: webAppCat.id,
      year: "2026",
      shortDesc: "Nền tảng giao dịch tài chính thời gian thực kết hợp WebGL 3D Visualization và độ trễ dưới 12ms.",
      thumbnail: "https://images.unsplash.com/photo-1642543492481-44e81e3914a7?auto=format&fit=crop&w=1200&q=80",
      objective: "Xây dựng cổng giao dịch thế hệ mới với giao diện futuristic dark mode cho hơn 200,000 trader chuyên nghiệp.",
      challenge: "Xử lý luồng dữ liệu WebSocket hàng triệu gói tin/giây mà không gây sụt giảm khung hình giao diện Three.js.",
      solution: "Tách biệt Worker thread cho data streaming và sử dụng InstancedMesh Three.js cho biểu đồ không gian 3D.",
      technologiesJson: JSON.stringify(["Next.js", "Three.js", "WebSockets", "Prisma", "PostgreSQL", "Tailwind CSS"]),
      resultsJson: JSON.stringify([
        "Tăng 180% thời gian on-site của người dùng",
        "Độ trễ render giảm từ 48ms xuống 11ms",
        "Đạt giải thưởng Webby Awards 2026 cho Hạng mục FinTech",
      ]),
      isFeatured: true,
      liveUrl: "https://nexus.nguyenagency.vn",
    },
    {
      title: "AURA Lumina – Luxury Fashion House",
      slug: "aura-lumina-luxury-fashion",
      clientName: "AURA Group Paris",
      categoryId: brandingCat.id,
      year: "2026",
      shortDesc: "Định vị nhận diện thương hiệu xa xỉ cùng trải nghiệm Virtual Showroom 3D tương tác chân thực.",
      thumbnail: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=80",
      objective: "Tạo sự đột phá trong ngành thời trang cao cấp bằng việc số hóa showroom thực tế ảo.",
      challenge: "Tái tạo độ phản xạ của chất liệu vải lụa và kim cương dưới ánh sáng studio trên trình duyệt web di động.",
      solution: "Phát triển Shader PBR tùy biến và hệ thống dynamic lighting tối ưu hóa Draco nén mô hình.",
      technologiesJson: JSON.stringify(["WebGL", "Three.js", "GLSL Shaders", "GSAP ScrollTrigger", "Lenis"]),
      resultsJson: JSON.stringify([
        "3.4 triệu lượt trải nghiệm showroom ảo trong tháng ra mắt",
        "Doanh số đơn hàng Pre-order tăng 240%",
      ]),
      isFeatured: true,
      liveUrl: "https://auralumina.fr",
    },
    {
      title: "Synapse AI – Neural Automation Platform",
      slug: "synapse-ai-neural-automation",
      clientName: "Synapse Labs San Francisco",
      categoryId: aiProjectCat.id,
      year: "2026",
      shortDesc: "Hệ điều hành quản trị tác nhân AI tự hành kết nối hàng nghìn workflow doanh nghiệp thông minh.",
      thumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
      objective: "Giao diện điều khiển Agent Swarm trực quan dạng node-based graph không gian 3 chiều.",
      challenge: "Vẽ đồ thị 50,000 node tương tác mượt mà ở tần số 60 FPS trên máy tính thông thường.",
      solution: "Sử dụng WebGL Instancing và Octree partitioning để culling các node nằm ngoài tầm nhìn camera.",
      technologiesJson: JSON.stringify(["React Three Fiber", "Next.js", "Python FastApi", "Vector DB", "Redis"]),
      resultsJson: JSON.stringify([
        "Tiết kiệm 70% thời gian vận hành hệ thống",
        "Gọi vốn Series A thành công 18 triệu USD",
      ]),
      isFeatured: true,
      liveUrl: "https://synapse.ai",
    },
  ];

  for (const p of samplePortfolios) {
    await prisma.portfolio.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        ...p,
        galleryJson: JSON.stringify([
          p.thumbnail,
          "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80",
        ]),
        processJson: JSON.stringify([
          { phase: "Giai đoạn 1", title: "Khảo sát & Kiến trúc", duration: "2 tuần" },
          { phase: "Giai đoạn 2", title: "Prototype & 3D Modeling", duration: "3 tuần" },
          { phase: "Giai đoạn 3", title: "Development & Tuning", duration: "4 tuần" },
        ]),
      },
    });
  }

  // 5. Digital LAB Products
  const labCatAI = await prisma.productCategory.upsert({
    where: { slug: "ai-tools" },
    update: {},
    create: { name: "AI Tools", slug: "ai-tools", order: 1 },
  });

  const labCatSaaS = await prisma.productCategory.upsert({
    where: { slug: "saas-platforms" },
    update: {},
    create: { name: "SaaS Platforms", slug: "saas-platforms", order: 2 },
  });

  const sampleProducts = [
    {
      name: "Kroma Studio AI",
      slug: "kroma-studio-ai",
      tagline: "Automated 3D Motion & Visual Branding Engine",
      categoryId: labCatAI.id,
      shortDesc: "Công cụ AI biến ý tưởng văn bản thành video render 3D chuẩn điện ảnh chỉ trong 90 giây.",
      description: "Kroma Studio AI do NGUYÊN LAB nghiên cứu phát triển kết hợp mô hình Diffusion thế hệ mới và Three.js rendering pipeline trên cloud, giải phóng các nhà sáng tạo khỏi hàng giờ render truyền thống.",
      thumbnail: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1200&q=80",
      productStage: "LIVE",
      version: "v2.4",
      pricingModel: "Freemium ($29/mo Pro)",
      ctaText: "Mở Bản Dùng Thử",
      isFeatured: true,
      demoUrl: "https://kroma.nguyenagency.vn",
      websiteUrl: "https://kroma.nguyenagency.vn",
      featuresJson: JSON.stringify([
        "Chuyển đổi Text sang Scene 3D tương tác",
        "Xuất file GLB, MP4 4K 60fps và ProRes 4444",
        "Tích hợp API trực tiếp vào Figma và Blender",
        "Kho thư viện vật liệu kim loại và ánh sáng cinematic độc quyền",
      ]),
      techStackJson: JSON.stringify(["Next.js", "WebGPU", "Three.js", "Python PyTorch", "CUDA Cloud Cluster"]),
    },
    {
      name: "PulseDesk ERP",
      slug: "pulsedesk-erp",
      tagline: "Next-Gen Agency Operations & CRM Orchestrator",
      categoryId: labCatSaaS.id,
      shortDesc: "Hệ thống quản trị tinh gọn toàn diện cho các Digital Agency và Studio sáng tạo hiện đại.",
      description: "PulseDesk kết nối liền mạch giữa luồng khách hàng (CRM), quản lý hợp đồng điện tử, bảng Kanban dự án và hóa đơn tài chính với bảo mật cấp ngân hàng.",
      thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
      productStage: "BETA",
      version: "v1.2-rc",
      pricingModel: "Enterprise Subscription",
      ctaText: "Yêu Cầu Demo Riêng",
      isFeatured: true,
      demoUrl: "https://pulse.nguyenagency.vn",
      websiteUrl: "https://pulse.nguyenagency.vn",
      featuresJson: JSON.stringify([
        "Kanban tiến độ tương tác thời gian thực",
        "Khu vực Client Portal đăng nhập riêng cho khách hàng",
        "Tự động xuất báo giá và hợp đồng định dạng PDF",
        "Phân quyền động Role-Based Access Control",
      ]),
      techStackJson: JSON.stringify(["Next.js App Router", "Prisma ORM", "PostgreSQL", "Tailwind CSS", "Server Actions"]),
    },
  ];

  for (const prod of sampleProducts) {
    await prisma.labProduct.upsert({
      where: { slug: prod.slug },
      update: {},
      create: {
        ...prod,
        status: "PUBLISHED",
        galleryJson: JSON.stringify([
          prod.thumbnail,
          "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80",
        ]),
      },
    });
  }

  // 6. Pricing Packages
  const samplePackages = [
    {
      name: "Khởi Nghiệp (Startup Identity)",
      slug: "brand-package-startup",
      packageGroup: "Branding Packages",
      categoryId: mediaCat.id,
      description: "Giải pháp hoàn chỉnh xây dựng nhận diện thương hiệu chuyên nghiệp cho doanh nghiệp mới thành lập.",
      price: 25000000,
      priceDisplay: "25.000.000 VNĐ",
      deliveryTime: "2 tuần",
      isPopular: false,
      isCustomQuote: false,
      featuresJson: JSON.stringify([
        "Thiết kế Logo 3 phương án độc bản",
        "Bộ màu sắc chuẩn (Color Palette) & Typography",
        "Bộ nhận diện văn phòng (Namecard, Tiêu đề thư, Bao thư)",
        "Brand Guidelines cơ bản 30 trang",
        "Bàn giao trọn gói file vector gốc (.AI, .PDF, .PNG)",
      ]),
      ctaText: "Chọn Gói Khởi Nghiệp",
    },
    {
      name: "Thương Hiệu Doanh Nghiệp (Corporate)",
      slug: "brand-package-corporate",
      packageGroup: "Branding Packages",
      categoryId: mediaCat.id,
      description: "Định vị vị thế dẫn đầu với hệ thống nhận diện số cao cấp, bao gồm tư vấn chiến lược và visual 3D.",
      price: 55000000,
      priceDisplay: "55.000.000 VNĐ",
      deliveryTime: "3 - 4 tuần",
      isPopular: true,
      isCustomQuote: false,
      featuresJson: JSON.stringify([
        "Tất cả quyền lợi của gói Khởi Nghiệp",
        "Logo 3D Animation mở đầu video intro",
        "Hệ thống tài liệu Marketing số (Brochure, Profile công ty 24 trang)",
        "Bộ template Social Media chuẩn hóa 15 định dạng",
        "Brand Guidelines nâng cao 80+ trang",
        "Đăng ký bảo hộ nhãn hiệu hỗ trợ pháp lý",
      ]),
      ctaText: "Chọn Gói Doanh Nghiệp",
    },
    {
      name: "Digital Flagship 3D Website",
      slug: "web-package-flagship-3d",
      packageGroup: "Website Packages",
      categoryId: techCat.id,
      description: "Trải nghiệm đỉnh cao với Three.js, chuyển động GSAP mượt mà và nền tảng quản trị CMS độc lập.",
      price: 85000000,
      priceDisplay: "85.000.000 VNĐ",
      deliveryTime: "4 - 5 tuần",
      isPopular: true,
      isCustomQuote: false,
      featuresJson: JSON.stringify([
        "Thiết kế UI/UX độc quyền trên Figma chuẩn quốc tế",
        "Hiệu ứng 3D Three.js tương tác chuột & con quay hồi chuyển",
        "GSAP Timeline & ScrollTrigger animation",
        "CMS quản trị nội dung hoàn toàn tùy biến",
        "Tối ưu SEO On-page 100/100 chuẩn Google",
        "Bảo hành kỹ thuật & sao lưu đám mây 12 tháng",
      ]),
      ctaText: "Xây Dựng Website 3D",
    },
    {
      name: "Nền Tảng May Đo (Custom Enterprise)",
      slug: "custom-enterprise-solution",
      packageGroup: "Website Packages",
      categoryId: techCat.id,
      description: "Hệ thống Web App, SaaS hoặc phần mềm quản lý tích hợp trí tuệ nhân tạo quy mô lớn.",
      price: null,
      priceDisplay: "Báo giá theo yêu cầu",
      deliveryTime: "Theo Scope",
      isPopular: false,
      isCustomQuote: true,
      featuresJson: JSON.stringify([
        "Kiến trúc Microservices / Serverless mở rộng hàng triệu user",
        "Tích hợp mô hình AI riêng biệt bảo mật dữ liệu tuyệt đối",
        "Phát triển Cổng khách hàng (Client Portal) & Billing tự động",
        "SLA phản hồi sự cố 24/7 dưới 15 phút",
        "Bàn giao toàn bộ mã nguồn và tài liệu kiến trúc hệ thống",
      ]),
      ctaText: "Yêu Cầu Báo Giá May Đo",
    },
  ];

  for (let i = 0; i < samplePackages.length; i++) {
    const pkg = samplePackages[i];
    await prisma.servicePackage.upsert({
      where: { slug: pkg.slug },
      update: {},
      create: {
        ...pkg,
        order: i + 1,
      },
    });
  }

  // 7. Active Project for Client Portal
  const clientProject = await prisma.project.upsert({
    where: { slug: "nexus-trading-v2" },
    update: {},
    create: {
      code: "PRJ-2026-001",
      name: "Nexus Global 3D Trading Platform",
      slug: "nexus-trading-v2",
      customerId: nexusCustomer.id,
      category: "Web Application & 3D WebGL",
      description: "Xây dựng cổng giao dịch thế hệ mới tích hợp biểu đồ nến 3D và hệ sinh thái tài chính cao cấp.",
      status: "IN_PROGRESS",
      priority: "HIGH",
      progress: 68,
      budget: 150000000,
      startDate: new Date("2026-01-15"),
      deadline: new Date("2026-03-30"),
      managerName: "Nguyên Director",
      notes: "Sprint 4: Hoàn tất Shader tối ưu hóa trên thiết bị di động iOS.",
      discussionJson: JSON.stringify([
        {
          id: "disc-1",
          author: "Alex Trần (CEO Nexus)",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
          role: "CLIENT",
          time: "2 ngày trước",
          message: "Team Nguyên Agency xem xét thêm biểu đồ volume dạng hologram 3D trên màn hình chi tiết được không?",
        },
        {
          id: "disc-2",
          author: "Nguyên Director",
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
          role: "AGENCY",
          time: "1 ngày trước",
          message: "Đã ghi nhận yêu cầu của anh Alex! Đội ngũ 3D đã dựng xong shader hologram và đang benchmark hiệu năng ở 60fps.",
        },
      ]),
    },
  });

  // Project Tasks
  const tasks = [
    { title: "Nghiên cứu UX luồng đặt lệnh phái sinh", status: "COMPLETED", priority: "HIGH", order: 1 },
    { title: "Thiết kế Design System Figma & Token Dark Mode", status: "COMPLETED", priority: "HIGH", order: 2 },
    { title: "Lập trình Three.js 3D Market Map & Lighting", status: "IN_PROGRESS", priority: "HIGH", order: 3 },
    { title: "Kết nối WebSocket Server & API Khớp Lệnh", status: "IN_PROGRESS", priority: "MEDIUM", order: 4 },
    { title: "Kiểm thử tải stress test 100k kết nối đồng thời", status: "PENDING", priority: "HIGH", order: 5 },
  ];

  for (const t of tasks) {
    await prisma.projectTask.create({
      data: {
        projectId: clientProject.id,
        title: t.title,
        status: t.status,
        priority: t.priority,
        order: t.order,
        assigneeName: "Nguyên Director",
      },
    });
  }

  // Project Deliverable Files
  await prisma.projectFile.createMany({
    data: [
      {
        projectId: clientProject.id,
        name: "Nexus-Brand-Guidelines-3D-v2.pdf",
        fileUrl: "/assets/downloads/nexus-guidelines.pdf",
        fileType: "PDF",
        fileSize: "14.8 MB",
        version: "v2.0",
        isDeliverable: true,
      },
      {
        projectId: clientProject.id,
        name: "Figma-Design-System-Production.fig",
        fileUrl: "https://figma.com/@nguyenagency/nexus",
        fileType: "FIGMA",
        fileSize: "Cloud File",
        version: "v1.4",
        isDeliverable: true,
      },
      {
        projectId: clientProject.id,
        name: "Security-Audit-Report-Q1-2026.pdf",
        fileUrl: "/assets/downloads/security-audit.pdf",
        fileType: "PDF",
        fileSize: "3.2 MB",
        version: "v1.0",
        isDeliverable: true,
      },
    ],
  });

  // Quotation Sample
  await prisma.quotation.upsert({
    where: { code: "QT-2026-0001" },
    update: {},
    create: {
      code: "QT-2026-0001",
      customerId: nexusCustomer.id,
      clientName: "Alex Trần",
      clientEmail: "client@nexus.com",
      clientPhone: "0912345678",
      clientCompany: "Nexus FinTech Group",
      serviceGroup: "TECH",
      serviceName: "Web Application 3D",
      packageName: "Digital Flagship 3D Website",
      requirements: "Xây dựng cổng thông tin giao dịch phái sinh thế hệ mới với trải nghiệm 3D Three.js và realtime stream.",
      budgetRange: "150.000.000 - 200.000.000 VNĐ",
      desiredTimeline: "2 tháng",
      subtotal: 150000000,
      taxAmount: 12000000,
      totalAmount: 162000000,
      status: "APPROVED",
      validUntil: new Date("2026-06-30"),
    },
  });

  // Contract Sample
  await prisma.contract.upsert({
    where: { code: "CTR-2026-001" },
    update: {},
    create: {
      code: "CTR-2026-001",
      title: "Hợp đồng phát triển nền tảng Nexus 3D Web Platform",
      customerId: nexusCustomer.id,
      projectId: clientProject.id,
      totalValue: 162000000,
      signedDate: new Date("2026-01-10"),
      startDate: new Date("2026-01-15"),
      endDate: new Date("2026-03-30"),
      status: "ACTIVE",
      termsSummary: "Thanh toán theo 3 đợt: 40% khởi động, 40% nghiệm thu UAT, 20% bàn giao production và bảo hành 12 tháng.",
    },
  });

  // Invoice Sample
  await prisma.invoice.upsert({
    where: { code: "INV-2026-001" },
    update: {},
    create: {
      code: "INV-2026-001",
      title: "Đợt 1 – Tạm ứng 40% khởi động dự án Nexus Platform",
      customerId: nexusCustomer.id,
      projectId: clientProject.id,
      amount: 64800000,
      taxAmount: 5184000,
      totalAmount: 69984000,
      dueDate: new Date("2026-01-20"),
      paidDate: new Date("2026-01-18"),
      status: "PAID",
      notes: "Đã nhận chuyển khoản qua Vietcombank. Cảm ơn quý khách!",
    },
  });

  // 8. Testimonials
  const testimonials = [
    {
      clientName: "Alexandre Laurent",
      clientRole: "Creative Director",
      company: "AURA Lumina (Paris)",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
      content: "NGUYÊN AGENCY đưa trải nghiệm showroom thực tế ảo lên đẳng cấp mà chúng tôi chưa từng thấy ở các agency quốc tế khác. Tốc độ tải và độ mượt mà của 3D trên mobile thực sự hoàn hảo.",
      rating: 5,
      projectType: "3D Virtual Showroom",
    },
    {
      clientName: "Nguyễn Minh Châu",
      clientRole: "Managing Director",
      company: "Nexus FinTech Group",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80",
      content: "Làm việc với team Nguyên là trải nghiệm vượt ngoài mong đợi. Đội ngũ không chỉ có gu thẩm mỹ vị lai sắc sảo mà năng lực code backend Next.js và Three.js cực kỳ vững chắc.",
      rating: 5,
      projectType: "FinTech Web Application",
    },
    {
      clientName: "David Sterling",
      clientRole: "Founder & CEO",
      company: "Synapse Labs San Francisco",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
      content: "The best digital design & tech agency we've ever partnered with. Their deep understanding of generative AI and 3D interactions helped us close our $18M Series A round.",
      rating: 5,
      projectType: "AI Product Architecture",
    },
  ];

  for (let i = 0; i < testimonials.length; i++) {
    const t = testimonials[i];
    await prisma.testimonial.create({
      data: {
        ...t,
        order: i + 1,
      },
    });
  }

  // 9. FAQ Items
  const faqData = [
    {
      question: "NGUYÊN AGENCY có gì khác biệt so với các đơn vị thiết kế website thông thường?",
      answer: "Chúng tôi định vị là một Premium Creative Digital Agency. NGUYÊN AGENCY kết hợp giữa nghệ thuật thị giác Luxury Dark, công nghệ 3D Three.js tương tác thực tế và kiến trúc công nghệ Next.js/PostgreSQL chịu tải cao. Chúng tôi không sử dụng template có sẵn mà phát triển kiến trúc độc bản riêng cho từng khách hàng.",
      category: "General",
      order: 1,
    },
    {
      question: "Website có hiệu ứng 3D Three.js và GSAP có bị nặng hoặc giật trên điện thoại di động không?",
      answer: "Hoàn toàn không. Chúng tôi áp dụng quy tắc Progressive Enhancement: trên thiết bị di động, hệ thống tự động tối ưu hóa số lượng polygon, hạ pixel-ratio, nén mô hình Draco và điều chỉnh camera để duy trì tốc độ khung hình 60 FPS ổn định mà không hao pin.",
      category: "Tech",
      order: 2,
    },
    {
      question: "Sau khi bàn giao, chúng tôi có thể tự cập nhật nội dung mà không cần biết lập trình không?",
      answer: "Chắc chắn có. NGUYÊN AGENCY xây dựng hệ thống Admin CMS độc lập cao cấp. Bạn có thể dễ dàng thêm bài viết, cập nhật dự án portfolio, thêm sản phẩm vào Digital LAB hoặc quản trị khách hàng chỉ qua vài cú click chuột.",
      category: "Services",
      order: 3,
    },
    {
      question: "Quy trình làm việc và thanh toán tại NGUYÊN AGENCY diễn ra như thế nào?",
      answer: "Quy trình chuẩn 6 bước: Discover → Strategy → Design → Develop → Launch → Optimize. Các mốc thanh toán thông thường chia thành 3 đợt tương ứng với từng giai đoạn nghiệm thu rõ ràng trong hợp đồng.",
      category: "Process",
      order: 4,
    },
  ];

  for (const f of faqData) {
    await prisma.fAQ.create({ data: f });
  }

  // 10. Site Settings
  const settings = [
    { key: "SITE_NAME", value: "NGUYÊN AGENCY", group: "GENERAL", description: "Tên thương hiệu chính" },
    { key: "SITE_SLOGAN", value: "BEYOND DIGITAL.", group: "GENERAL", description: "Slogan nhận diện chính" },
    { key: "SITE_SUB_SLOGAN", value: "Creative Minds. Digital Experiences. Powerful Technology.", group: "GENERAL", description: "Slogan phụ" },
    { key: "CONTACT_EMAIL", value: "contact@nguyenagency.vn", group: "CONTACT", description: "Email nhận liên hệ" },
    { key: "CONTACT_PHONE", value: "+84 344 979 307", group: "CONTACT", description: "Hotline hỗ trợ" },
    { key: "OFFICE_ADDRESS", value: "TP. Quảng Ngãi - TP. Hồ Chí Minh", group: "CONTACT", description: "Địa chỉ trụ sở" },
    { key: "ZALO_URL", value: "https://zalo.me/0344979307", group: "SOCIAL", description: "Kênh liên hệ Zalo Official" },
    { key: "FACEBOOK_URL", value: "https://www.facebook.com/nguyenads7", group: "SOCIAL", description: "Fanpage Facebook" },
  ];

  for (const s of settings) {
    await prisma.siteSetting.upsert({
      where: { key: s.key },
      update: { value: s.value },
      create: s,
    });
  }

  console.log("✅ Seed data populated successfully with 24 services, portfolios, LAB products, and portal data!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

