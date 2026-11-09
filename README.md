# NGUYÊN AGENCY – Premium Creative Digital Agency Platform

> **BEYOND DIGITAL.**  
> *Creative Minds. Digital Experiences. Powerful Technology.*

Nền tảng website Digital Agency cao cấp mang bản sắc độc quyền của **NGUYÊN AGENCY**, kết hợp hài hòa giữa mỹ thuật thị giác Luxury Dark, đồ họa không gian 3D Three.js tương tác thực tế, chuyển động GSAP mượt mà và kiến trúc backend Next.js App Router, Prisma ORM với hệ thống CMS & CRM độc lập.

---

## 💎 Điểm Nhấn Kiến Trúc & Tính Năng

1. **Brand Identity & Color System:**
   - Primary Black `#0A0A0A` (70%)
   - Technology Blue `#007BA7` (20%)
   - Creative Pink `#FF2D95` (10%)
   - Phong cách Futuristic Luxury Dark, tối ưu độ tương phản và loại bỏ cảm giác template thương mại đại trà.

2. **Hệ Thống 3D Motion (Three.js & GSAP):**
   - **Hero 3D Scene**: Khối Monogram kim loại 3D chữ `N.` với hiệu ứng xoay theo con trỏ chuột, dynamic keylight xanh/hồng, hai vòng lượng tử orbital và trường hạt 3D Particle Field chuyển động không gian.
   - **Performance**: Progressive enhancement tự động tối ưu hóa DPR (1–1.5), nén tài nguyên, tương thích hoàn toàn trên thiết bị di động và tôn trọng `prefers-reduced-motion`.
   - **Smooth Scrolling**: Tích hợp Lenis Smooth Scroll và Custom Cursor tương tác động trên desktop.

3. **Hệ Thống Dịch Vụ Hoàn Chỉnh (24 Services):**
   - **12 Dịch vụ MEDIA**: Branding, Logo, Graphic, Banner, Poster, Menu, Social, Ads Creative, Video TVC, AI Video, Digital Marketing, Content.
   - **12 Dịch vụ TECH**: Business Website, Corporate, Landing Page 3D, E-commerce, Web App SaaS, Mobile App, CRM, Management Software, Custom Software, AI Integration, Website Maintenance, UI/UX Design.
   - Toàn bộ dữ liệu được quản lý động từ database, có chi tiết quy trình, deliverables và giá tham khảo.

4. **Digital LAB (AI & Tech Products):**
   - Trung tâm nghiên cứu và phát triển độc lập `/lab`.
   - Các sản phẩm số như Kroma Studio AI, PulseDesk ERP.
   - Admin CMS có thể xuất bản sản phẩm mới, tự động đồng bộ lên trang `/lab` theo thời gian thực mà không cần chạm vào code.

5. **Client Portal (Khu Vực Khách Hàng Riêng Biệt):**
   - Đăng nhập bảo mật JWT Cookie: `client@nexus.com` / `Nguyen@2026`.
   - Xem tiến độ dự án thời gian thực (Sprint Tasks, Progress Bar).
   - Tải file bàn giao & tài nguyên thiết kế (Brand Guidelines, Figma tokens, Audit report).
   - Trao đổi phản hồi, yêu cầu chỉnh sửa (Revisions).
   - Quản lý báo giá, hợp đồng điện tử và hóa đơn minh bạch.

6. **Admin Dashboard (CMS & CRM Độc Lập):**
   - Đăng nhập quyền hạn: `admin@nguyenagency.vn` / `Nguyen@2026`.
   - Tổng quan metrics: Khách hàng, Dự án đang chạy, Lead pipeline, Dịch vụ CMS, Sản phẩm LAB.
   - Module CRM quản lý Pipeline Lead chuyển đổi tự động từ Contact Form.
   - Module quản trị 24 dịch vụ và quản trị sản phẩm Digital LAB.

---

## 🛠️ Công Nghệ Sử Dụng (Tech Stack)

- **Frontend:** Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Lucide React, Lenis.
- **3D & Motion:** Three.js, React Three Fiber (`@react-three/fiber`), `@react-three/drei`, GSAP.
- **Backend & Database:** Next.js Server Actions, Route Handlers, Prisma ORM, SQLite (local) / PostgreSQL (production ready).
- **Authentication & Security:** Jose JWT Cookie (HttpOnly), Bcryptjs, Role-Based Access Control (RBAC).

---

## 🚀 Hướng Dẫn Chạy Cục Bộ (Local Development)

### 1. Cài đặt thư viện:
\`\`\`bash
npm install --legacy-peer-deps
\`\`\`

### 2. Thiết lập cơ sở dữ liệu:
Hệ thống mặc định sử dụng SQLite không cần cài đặt thêm server DB cục bộ:
\`\`\`bash
# Tạo cấu trúc database
npx prisma migrate dev --name init

# Nạp dữ liệu mẫu ban đầu (24 services, projects, LAB products, portal data)
npx tsx prisma/seed.ts
\`\`\`

### 3. Khởi động môi trường dev:
\`\`\`bash
npm run dev
\`\`\`
Mở trình duyệt tại: [http://localhost:3000](http://localhost:3000)

---

## 🔑 Tài Khoản Thử Nghiệm

| Vai trò | Email | Mật khẩu |
|---|---|---|
| **Admin CMS** | `admin@nguyenagency.vn` | `Nguyen@2026` |
| **Khách Hàng (Client)** | `client@nexus.com` | `Nguyen@2026` |

*(Trang đăng nhập có sẵn nút 1-Click Fast Fill tiện lợi cho việc kiểm thử).*

---

## 🌐 Hướng Dẫn Deploy Production (Vercel & PostgreSQL)

1. Đẩy mã nguồn lên GitHub.
2. Tạo cơ sở dữ liệu PostgreSQL (Neon, Supabase, hoặc Vercel Postgres).
3. Đổi datasource trong `prisma/schema.prisma` sang provider `postgresql` hoặc sử dụng file có sẵn `prisma/schema.postgresql.prisma`.
4. Cấu hình biến môi trường trên Vercel:
   - `DATABASE_URL` hoặc `POSTGRES_PRISMA_URL`
   - `JWT_SECRET`
   - `NEXT_PUBLIC_SITE_URL`
5. Vercel Build Command:
   \`\`\`bash
   npm run build
   \`\`\`

