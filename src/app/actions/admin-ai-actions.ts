"use server";

import prisma from "@/lib/prisma";
import { checkAdminPermission, logActivity } from "./admin-common";

export type AIContentType = "portfolio" | "service" | "lab" | "blog" | "homepage";
export type AITone = "LUXURY" | "TECH" | "COMMERCIAL" | "CREATIVE";

interface GenerateParams {
  type: AIContentType;
  topic: string;
  tone?: AITone;
  extraContext?: Record<string, string>;
}

// -------------------------------------------------------------
// 1. LẤY & LƯU CẤU HÌNH API KEY (GEMINI / OPENAI)
// -------------------------------------------------------------
export async function getAIStatus() {
  await checkAdminPermission();
  
  let geminiKey = process.env.GEMINI_API_KEY || "";
  let openaiKey = process.env.OPENAI_API_KEY || "";

  try {
    const dbGemini = await prisma.siteSetting.findUnique({ where: { key: "GEMINI_API_KEY" } });
    if (dbGemini?.value) geminiKey = dbGemini.value;

    const dbOpenai = await prisma.siteSetting.findUnique({ where: { key: "OPENAI_API_KEY" } });
    if (dbOpenai?.value) openaiKey = dbOpenai.value;
  } catch (err) {
    console.error("[getAIStatus] Error checking database settings:", err);
  }

  return {
    hasGeminiKey: Boolean(geminiKey && geminiKey.trim().length > 10),
    hasOpenaiKey: Boolean(openaiKey && openaiKey.trim().length > 10),
    geminiKeyMasked: geminiKey ? `${geminiKey.slice(0, 6)}...${geminiKey.slice(-4)}` : "",
  };
}

export async function saveAIKey(keyName: "GEMINI_API_KEY" | "OPENAI_API_KEY", keyValue: string) {
  const session = await checkAdminPermission();
  const cleanVal = (keyValue || "").trim();

  try {
    const existing = await prisma.siteSetting.findUnique({ where: { key: keyName } });
    if (existing) {
      await prisma.siteSetting.update({
        where: { key: keyName },
        data: { value: cleanVal, group: "INTEGRATIONS", description: `API Key cho AI Assistant (${keyName})` },
      });
    } else {
      await prisma.siteSetting.create({
        data: { key: keyName, value: cleanVal, group: "INTEGRATIONS", description: `API Key cho AI Assistant (${keyName})` },
      });
    }

    await logActivity({
      userId: session.userId,
      actorName: session.name,
      action: "UPDATE_AI_KEY",
      entity: "SiteSetting",
      details: `Đã cập nhật ${keyName} cho AI Content Assistant`,
    });

    return { success: true, message: `Đã lưu cấu hình ${keyName} thành công!` };
  } catch (err: any) {
    return { success: false, error: err?.message || "Không thể lưu API Key" };
  }
}

// -------------------------------------------------------------
// 2. PROMPT BUILDER THEO CHUẨN NGUYÊN AGENCY (LUXURY DARK TECH)
// -------------------------------------------------------------
function buildSystemPrompt(type: AIContentType, tone: AITone): string {
  const toneDesc = {
    LUXURY: "Phong cách Luxury, thượng lưu, tinh tế, uy quyền, sử dụng các từ ngữ đẳng cấp quốc tế, tôn vinh giá trị độc bản và tính duy mỹ tuyệt đối.",
    TECH: "Phong cách Công Nghệ Chuyên Sâu, hiện đại, sắc sảo, tập trung vào kiến trúc hệ thống, WebGL, 3D, AI, tốc độ xử lý 60fps, microservices, chuẩn mực bảo mật.",
    COMMERCIAL: "Phong cách Thương Mại & Chuyển Đổi Cao, kích thích quyết định đầu tư, nhấn mạnh ROI, tối ưu phễu kinh doanh và định vị dẫn đầu thị trường.",
    CREATIVE: "Phong cách Sáng Tạo Nghệ Thuật Đột Phá, phá vỡ giới hạn, táo bạo, giàu cảm xúc thị giác, mang tính tương lai và văn hóa số.",
  }[tone];

  return `Bạn là Giám đốc Sáng tạo & Copywriter Trưởng tại NGUYÊN AGENCY (nguyenagency.vn) - Digital Creative & High-End Tech Agency hàng đầu.
Thương hiệu mang đậm bản sắc Luxury Dark Brand (màu đen huyền bí, cyan neon, magenta hồng tím, 3D CGI, Three.js, WebGL, AI đột phá).

Tone giọng yêu cầu: ${toneDesc}

NHIỆM VỤ: Sinh nội dung bằng TIẾNG VIỆT tự nhiên, chuẩn chỉnh, chuyên nghiệp và có chiều sâu.
BẮT BUỘC TRẢ VỀ DUY NHẤT 1 ĐỐI TƯỢNG JSON HỢP LỆ (KHÔNG KÈM MARKDOWN CODEBLOCK \`\`\`json, KHÔNG KÈM GIẢI THÍCH).`;
}

function buildTypePrompt(type: AIContentType, topic: string, extraContext?: Record<string, string>): string {
  const ctx = extraContext ? `Thông tin hiện tại: ${JSON.stringify(extraContext)}` : "";

  switch (type) {
    case "portfolio":
      return `Chủ đề dự án / Case Study: "${topic}".
${ctx}
Hãy sinh ra 1 JSON hợp lệ với cấu trúc sau:
{
  "title": "Tên dự án đầy ấn tượng (VD: Apex - Nền Tảng 3D Digital Twin)",
  "clientName": "Tên khách hàng / Tập đoàn đối tác tương xứng",
  "year": "2026",
  "shortDesc": "Mô tả ngắn 1-2 câu tóm tắt điểm sáng giá nhất của dự án",
  "objective": "Mục tiêu chiến lược của dự án (2-3 câu sâu sắc)",
  "challenge": "Thách thức kỹ thuật và thị giác cần vượt qua (2-3 câu)",
  "solution": "Giải pháp công nghệ và thiết kế độc bản do NGUYÊN Agency triển khai (2-3 câu)",
  "technologies": ["Next.js", "Three.js", "WebGL", "TailwindCSS", "PostgreSQL", "AI Engine"],
  "results": ["Tăng 220% thời lượng on-site người dùng", "Duy trì 60 FPS ổn định trên thiết bị di động", "Tăng 180% tỷ lệ chuyển đổi khách hàng VIP"]
}`;

    case "service":
      return `Chủ đề dịch vụ cần viết: "${topic}".
${ctx}
Hãy sinh ra 1 JSON hợp lệ với cấu trúc sau:
{
  "title": "Tên dịch vụ ngắn gọn, cao cấp",
  "tagline": "Khẩu hiệu / Tagline định vị độc bản cực chất",
  "shortDesc": "Mô tả ngắn 1-2 câu cho phần Hero Lead",
  "description": "Nội dung phân tích chi tiết dịch vụ, quy trình và giá trị cốt lõi (2-3 đoạn văn chuẩn agency)",
  "features": ["Hạng mục bàn giao 1", "Hạng mục bàn giao 2", "Hạng mục bàn giao 3", "Hạng mục bàn giao 4"],
  "benefits": ["Lợi ích vượt trội 1", "Lợi ích vượt trội 2", "Lợi ích vượt trội 3"],
  "estimatedTime": "2 - 4 tuần",
  "priceLabel": "Từ 35.000.000 VNĐ"
}`;

    case "lab":
      return `Chủ đề sản phẩm thử nghiệm Phòng LAB Số: "${topic}".
${ctx}
Hãy sinh ra 1 JSON hợp lệ với cấu trúc sau:
{
  "name": "Tên sản phẩm công nghệ LAB (VD: Aura Neural Shaders v2)",
  "productStage": "BETA",
  "version": "v2.5.0",
  "shortDesc": "Mô tả ngắn 1-2 câu về giải pháp công nghệ tiên phong này",
  "description": "Mô tả chi tiết kiến trúc, bài toán kỹ thuật đột phá được giải quyết",
  "features": ["Tính năng nổi bật 1", "Tính năng nổi bật 2", "Tính năng nổi bật 3"],
  "techStack": ["WebGPU", "Three.js", "GLSL Shaders", "TypeScript", "WASM"],
  "demoUrl": "https://lab.nguyenagency.vn/demo"
}`;

    case "blog":
      return `Chủ đề bài viết Blog / Tin tức: "${topic}".
${ctx}
Hãy sinh ra 1 JSON hợp lệ với cấu trúc sau:
{
  "title": "Tiêu đề bài viết thu hút, chuẩn SEO, khẳng định chuyên môn cao cấp",
  "readTime": "6 phút đọc",
  "tags": "WebGL, Three.js, AI, Thiết Kế Số, Xu Hướng 2026",
  "excerpt": "Đoạn trích dẫn ngắn (2-3 câu) tóm tắt giá trị cốt lõi của bài viết",
  "content": "Nội dung bài viết đầy đủ định dạng Markdown (có các đề mục ## 01. Tiêu đề mục 1, nội dung chi tiết, quote > Trích dẫn đắt giá, gạch đầu dòng -, và kết luận kêu gọi hành động)."
}`;

    case "homepage":
      return `Chủ đề / Yêu cầu Section Trang Chủ: "${topic}".
${ctx}
Hãy sinh ra 1 JSON hợp lệ với cấu trúc sau:
{
  "name": "Tên gợi nhớ section (VD: 01. Hero Banner 3D Luxury)",
  "title": "Tiêu đề chính ấn tượng, cô đọng, viết hoa (VD: VƯỢT CHUẨN SỐ HÓA. ĐỊNH HÌNH TƯƠNG LAI.)",
  "subtitle": "Tiêu đề phụ hoặc badge (VD: NGUYÊN AGENCY • DIGITAL CRAFTSMANSHIP)",
  "description": "Mô tả section 2 câu làm nổi bật năng lực và vị thế thương hiệu",
  "ctaText": "Khám Phá Dự Án",
  "ctaLink": "/portfolio"
}`;
  }
}

// -------------------------------------------------------------
// 3. NGUYÊN AGENCY CREATIVE FALLBACK ENGINE (KHI CHƯA CÓ API KEY HOẶC LỖI MẠNG)
// -------------------------------------------------------------
function generateBuiltInFallback(type: AIContentType, topic: string, tone: AITone): any {
  const cleanTopic = topic.trim() || "Chuyển Đổi Số Cao Cấp";
  const isEnglish = /[a-zA-Z]{5,}/.test(cleanTopic) && !/[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i.test(cleanTopic);

  if (type === "portfolio") {
    return {
      title: `${cleanTopic} - Trải Nghiệm Số Không Gian Tương Tác`,
      clientName: `Tập Đoàn Quốc Tế ${cleanTopic.split(" ")[0] || "Global"} Holdings`,
      year: "2026",
      shortDesc: `Dự án số hóa trải nghiệm toàn diện cho ${cleanTopic}, kết hợp công nghệ đồ họa 3D thời gian thực và kiến trúc dữ liệu thông minh chuẩn quốc tế.`,
      objective: `Tái định vị vị thế thương hiệu trên không gian số, tạo ra trải nghiệm thị giác đột phá thu hút đối tác chiến lược và gia tăng tỷ lệ chuyển đổi đơn hàng giá trị cao.`,
      challenge: `Tối ưu hóa hàng nghìn hiệu ứng ánh sáng và vật liệu mô phỏng phức tạp trên trình duyệt mà vẫn đảm bảo độ phản hồi 60 FPS mượt mà trên mọi thiết bị di động.`,
      solution: `Ứng dụng Next.js App Router kết hợp Three.js và shader tùy biến, đồng bộ hóa dữ liệu thời gian thực qua Supabase và CDN toàn cầu.`,
      technologies: ["Next.js 14", "Three.js / WebGL", "TailwindCSS", "PostgreSQL", "GSAP Cinematic", "AI Analytics"],
      results: [
        "Tăng 240% thời gian tương tác trung bình của khách hàng",
        "Hiệu suất khung hình 60 FPS ổn định trên 99.2% thiết bị",
        "Tăng 165% số lượng cuộc hẹn tư vấn dịch vụ chất lượng cao",
      ],
    };
  }

  if (type === "service") {
    return {
      title: `Dịch Vụ ${cleanTopic} Độc Bản`,
      tagline: `Nâng tầm vị thế thương hiệu thông qua giải pháp ${cleanTopic.toLowerCase()} chuẩn quốc tế`,
      shortDesc: `Giải pháp ${cleanTopic.toLowerCase()} cao cấp được may đo độc quyền bởi NGUYÊN AGENCY, kết hợp tư duy duy mỹ và công nghệ số hiện đại.`,
      description: `Chúng tôi mang đến giải pháp ${cleanTopic.toLowerCase()} toàn diện, từ khâu chiến lược định vị, thiết kế giao diện tương tác 3D đa chiều đến lập trình hệ thống hiệu năng cao. Mỗi sản phẩm là một tác phẩm số hoàn mỹ giúp doanh nghiệp khẳng định uy quyền trên thị trường.`,
      features: [
        `Khảo sát chuyên sâu & xây dựng chiến lược ${cleanTopic.toLowerCase()}`,
        "Thiết kế 3 concepts độc bản chuẩn Luxury Dark Aesthetic",
        "Lập trình tương tác mượt mà, tối ưu hóa tốc độ tải dưới 1.5 giây",
        "Tích hợp báo cáo phân tích hành vi và tự động hóa chuyển đổi",
      ],
      benefits: [
        "Khẳng định vị thế dẫn đầu tuyệt đối so với đối thủ trong ngành",
        "Tối đa hóa giá trị vòng đời khách hàng và chỉ số ROI",
        "Bảo hành hệ thống và hỗ trợ kỹ thuật chuyên sâu 24/7 trong 12 tháng",
      ],
      estimatedTime: "2 - 4 tuần",
      priceLabel: "Từ 35.000.000 VNĐ",
    };
  }

  if (type === "lab") {
    return {
      name: `${cleanTopic} Core Engine`,
      productStage: "BETA",
      version: "v2.4.0",
      shortDesc: `Mô đun nghiên cứu thử nghiệm tiên phong của NGUYÊN Creative Lab phục vụ ${cleanTopic.toLowerCase()}.`,
      description: `Được phát triển nội bộ để giải quyết bài toán xử lý tương tác thời gian thực cho ${cleanTopic.toLowerCase()}, mang lại độ trễ tiệm cận 0ms và trải nghiệm mượt mà vượt bậc.`,
      features: [
        "Xử lý song song thuật toán AI tối ưu tài nguyên phần cứng",
        "Giao diện điều khiển trực quan thời gian thực",
        "Tương thích kiến trúc Microservices và Webhook tự động",
      ],
      techStack: ["WebGPU", "Three.js", "TypeScript", "Python AI Core", "Supabase"],
      demoUrl: "https://lab.nguyenagency.vn/demo",
    };
  }

  if (type === "blog") {
    return {
      title: `${cleanTopic}: Xu Hướng & Đột Phá Công Nghệ Số 2026`,
      readTime: "6 phút đọc",
      tags: `${cleanTopic}, Công Nghệ 2026, 3D Web, UX Luxury, NGUYÊN Agency`,
      excerpt: `Phân tích chuyên sâu về tác động của ${cleanTopic.toLowerCase()} đối với sự phát triển của các thương hiệu hàng đầu trong kỷ nguyên chuyển đổi số 2026.`,
      content: `## 01. Bối cảnh chuyển dịch và tầm nhìn chiến lược
Trong bối cảnh thị trường số ngày càng cạnh tranh khốc liệt, việc áp dụng **${cleanTopic.toLowerCase()}** không chỉ đơn thuần là theo đuổi xu hướng công nghệ, mà là một bước chuyển mình mang tính sống còn đối với các doanh nghiệp muốn khẳng định vị thế dẫn đầu.

> "Sự khác biệt giữa một thương hiệu bình thường và một thương hiệu xa xỉ nằm ở mức độ hoàn thiện tinh xảo trong từng điểm chạm kỹ thuật số."

## 02. Những đột phá cốt lõi cần làm chủ
Để triển khai thành công mô hình này, doanh nghiệp cần chú trọng 3 trụ cột kỹ thuật:
- **Tối ưu hóa trải nghiệm thị giác:** Đồ họa tương tác 3D mượt mà chuẩn 60 FPS, mang lại cảm xúc chân thực cho người dùng.
- **Tốc độ và tính sẵn sàng cao:** Giảm thiểu tối đa độ trễ, tối ưu hóa kích thước bundle và cấu trúc CDN toàn cầu.
- **Cá nhân hóa bằng trí tuệ nhân tạo:** Tự động điều chỉnh giao diện và nội dung theo chân dung từng nhóm đối tượng mục tiêu.

## 03. Đúc kết từ thực tiễn tại NGUYÊN AGENCY
Qua hàng loạt dự án triển khai cho các khách hàng cao cấp, chúng tôi nhận thấy rằng việc kết hợp giữa thẩm mỹ tối giản sang trọng (Luxury Dark) và công nghệ nền tảng vững chắc luôn tạo ra giá trị bền vững vượt trội theo thời gian.`,
    };
  }

  // homepage
  return {
    name: `Section: ${cleanTopic}`,
    title: `${cleanTopic.toUpperCase()} • ĐỈNH CAO SỐ HÓA`,
    subtitle: "NGUYÊN AGENCY • DIGITAL CRAFTSMANSHIP & INNOVATION",
    description: `Khám phá năng lực kiến tạo giải pháp ${cleanTopic.toLowerCase()} đẳng cấp quốc tế, nơi mỹ thuật đương đại hội tụ cùng công nghệ tương tác tối tân.`,
    ctaText: "Liên Hệ Khởi Tạo Dự Án",
    ctaLink: "/services",
  };
}

// -------------------------------------------------------------
// 4. MAIN GENERATE ACTION
// -------------------------------------------------------------
export async function generateCMSContent(params: GenerateParams) {
  await checkAdminPermission();
  const { type, topic, tone = "LUXURY", extraContext } = params;

  if (!topic || !topic.trim()) {
    return { success: false, error: "Vui lòng nhập chủ đề hoặc từ khóa để AI sinh nội dung!" };
  }

  // Lấy API Key từ DB hoặc ENV
  let geminiKey = process.env.GEMINI_API_KEY || "";
  let openaiKey = process.env.OPENAI_API_KEY || "";

  try {
    const dbGemini = await prisma.siteSetting.findUnique({ where: { key: "GEMINI_API_KEY" } });
    if (dbGemini?.value) geminiKey = dbGemini.value;

    const dbOpenai = await prisma.siteSetting.findUnique({ where: { key: "OPENAI_API_KEY" } });
    if (dbOpenai?.value) openaiKey = dbOpenai.value;
  } catch (err) {
    // ignore
  }

  const systemPrompt = buildSystemPrompt(type, tone);
  const userPrompt = buildTypePrompt(type, topic, extraContext);

  // 1. Thử gọi Gemini API nếu có Key
  if (geminiKey && geminiKey.trim().length > 10) {
    try {
      // Ưu tiên gemini-1.5-flash tốc độ cao và chi phí tối ưu
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey.trim()}`;
      const payload = {
        contents: [
          {
            role: "user",
            parts: [
              { text: `${systemPrompt}\n\n${userPrompt}` }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          responseMimeType: "application/json",
        }
      };

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(15000), // 15s timeout
      });

      if (res.ok) {
        const data = await res.json();
        const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (rawText) {
          const parsed = JSON.parse(rawText.replace(/```json/g, "").replace(/```/g, "").trim());
          return {
            success: true,
            provider: "Gemini 1.5 Flash",
            data: parsed,
          };
        }
      } else {
        const errBody = await res.text();
        console.warn("[generateCMSContent] Gemini API returned error:", res.status, errBody);
      }
    } catch (apiErr: any) {
      console.warn("[generateCMSContent] Gemini call failed, falling back:", apiErr?.message);
    }
  }

  // 2. Thử gọi OpenAI API nếu có Key
  if (openaiKey && openaiKey.trim().length > 10) {
    try {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${openaiKey.trim()}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          response_format: { type: "json_object" },
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
          ],
          temperature: 0.7,
        }),
        signal: AbortSignal.timeout(15000),
      });

      if (res.ok) {
        const data = await res.json();
        const content = data?.choices?.[0]?.message?.content;
        if (content) {
          const parsed = JSON.parse(content);
          return {
            success: true,
            provider: "OpenAI GPT-4o-mini",
            data: parsed,
          };
        }
      }
    } catch (openAiErr: any) {
      console.warn("[generateCMSContent] OpenAI call failed, falling back:", openAiErr?.message);
    }
  }

  // 3. Sử dụng Creative Engine độc quyền chuẩn Agency nếu chưa cấu hình key
  const fallbackData = generateBuiltInFallback(type, topic, tone);
  return {
    success: true,
    provider: "NGUYÊN Agency Creative Engine (Nội bộ)",
    data: fallbackData,
    notice: "Đang sử dụng bộ máy sinh nội dung độc quyền NGUYÊN Agency. Bạn có thể cài đặt Google Gemini API Key để mở khóa AI động cao cấp.",
  };
}

