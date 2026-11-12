/**
 * DỮ LIỆU CHÍNH THỨC 24 DỊCH VỤ - NGUYÊN AGENCY
 * Đạt chuẩn SEO On-page, UX Content, cấu trúc Schema.org và bảo đảm bản sắc Luxury Dark Tech.
 */

export interface ServiceDetailData {
  id: string;
  order: number;
  title: string; // Tên tiếng Anh chính thức
  titleVn: string; // Tên tiếng Việt hỗ trợ SEO
  slug: string;
  aliases?: string[];
  group: "TECH" | "MEDIA";
  categoryName: string;
  shortDesc: string; // Mô tả chính thức chuẩn từ prompt
  seoTitle: string;
  metaDescription: string;
  primaryKeyword: string;
  proposedItems: string[]; // Hạng mục đề xuất chuẩn
  intro: string; // 150-250 từ giới thiệu nhu cầu thực tế
  clientProblems: string[]; // 3-5 vấn đề thực tế của khách hàng
  solution: string; // 150-250 từ giải pháp của Nguyên Agency
  process: { step: string; name: string; desc: string }[]; // 4-6 bước quy trình thực tế
  deliverables: string[]; // Sản phẩm bàn giao cụ thể
  targetAudience: string[]; // Nhóm khách hàng phù hợp
  faqs: { question: string; answer: string }[]; // 4-6 câu hỏi thường gặp
  relatedSlugs: string[]; // 3-4 dịch vụ liên quan
  thumbnail: string;
  coverImage?: string;
}

export const OFFICIAL_24_SERVICES: ServiceDetailData[] = [
  // -------------------------------------------------------------
  // 01. Business Website
  // -------------------------------------------------------------
  {
    id: "srv-01",
    order: 1,
    title: "Business Website",
    titleVn: "Thiết Kế Website Kinh Doanh",
    slug: "business-website",
    group: "TECH",
    categoryName: "Web & Software",
    shortDesc:
      "Thiết kế website kinh doanh chuyên nghiệp, giới thiệu sản phẩm và dịch vụ rõ ràng, hỗ trợ khách hàng tìm hiểu, gửi yêu cầu tư vấn và liên hệ thuận tiện.",
    seoTitle: "Thiết Kế Website Kinh Doanh | Nguyên Agency",
    metaDescription:
      "Nguyên Agency cung cấp giải pháp thiết kế website kinh doanh chuyên nghiệp, giao diện responsive, giới thiệu dịch vụ, biểu mẫu liên hệ và quản trị nội dung.",
    primaryKeyword: "thiết kế website kinh doanh",
    proposedItems: [
      "Giao diện responsive tương thích mọi thiết bị",
      "Trang dịch vụ và danh mục sản phẩm chi tiết",
      "Biểu mẫu liên hệ và đặt lịch tư vấn tự động",
      "Hệ thống quản trị nội dung (CMS) độc lập, dễ sử dụng",
    ],
    intro:
      "Trong bối cảnh hành vi người tiêu dùng và đối tác ngày càng phụ thuộc vào kênh trực tuyến, một website kinh doanh không chỉ đơn thuần là tấm danh thiếp số mà là kênh bán hàng và khẳng định uy tín trọng yếu của doanh nghiệp. Rất nhiều doanh nghiệp tại Quảng Ngãi và các tỉnh thành đang gặp khó khăn khi website cũ tải chậm, thông tin dịch vụ rối rắm hoặc không tối ưu trên điện thoại di động, khiến khách hàng rời đi chỉ sau vài giây. Dịch vụ thiết kế website kinh doanh của Nguyên Agency được xây dựng dựa trên sự thấu hiểu hành vi khách hàng mục tiêu, trình bày thông tin sản phẩm mạch lạc, gia tăng độ tin cậy và thúc đẩy chuyển đổi liên hệ thực tế.",
    clientProblems: [
      "Website hiện tại tải chậm, cấu trúc cũ kỹ làm giảm sút uy tín doanh nghiệp.",
      "Thông tin sản phẩm và dịch vụ trình bày rời rạc, khách hàng khó tra cứu.",
      "Không hiển thị chuẩn xác trên điện thoại thông minh, tỷ lệ thoát trang cao.",
      "Khó khăn trong việc tự cập nhật bài viết, hình ảnh hay thông báo mới.",
    ],
    solution:
      "Nguyên Agency xây dựng website kinh doanh bằng công nghệ Next.js hiện đại, đảm bảo tốc độ tải trang dưới 1.5 giây và điểm số hiệu năng Core Web Vitals tối ưu. Chúng tôi bố trí cấu trúc trang logic theo phễu tâm lý người xem: từ giới thiệu năng lực cốt lõi, bảng dịch vụ chi tiết, minh chứng dự án đã thực hiện đến form liên hệ trực quan kết nối tức thì về email và Telegram. Giao diện quản trị CMS được may đo thân thiện, giúp đội ngũ của bạn cập nhật nội dung dễ dàng mà không cần am hiểu kỹ thuật lập trình.",
    process: [
      { step: "01", name: "Tiếp nhận nhu cầu", desc: "Khảo sát ngành hàng, mục tiêu kinh doanh và đối tượng khách hàng." },
      { step: "02", name: "Phân tích cấu trúc", desc: "Xây dựng sitemap và khung sườn bố cục nội dung (Wireframe)." },
      { step: "03", name: "Thiết kế giao diện", desc: "Phối màu sắc, typography đồng bộ nhận diện thương hiệu." },
      { step: "04", name: "Phát triển tính năng", desc: "Lập trình frontend responsive, form liên hệ và hệ thống CMS." },
      { step: "05", name: "Kiểm thử & tối ưu", desc: "Kiểm tra tốc độ tải trang, bảo mật SSL và hiển thị đa thiết bị." },
      { step: "06", name: "Bàn giao & hướng dẫn", desc: "Chuyển giao mã nguồn, hướng dẫn sử dụng và kích hoạt bảo hành." },
    ],
    deliverables: [
      "Mã nguồn website hoàn chỉnh kèm cơ sở dữ liệu độc lập",
      "Tài khoản quản trị CMS toàn quyền",
      "Chứng chỉ bảo mật SSL/HTTPS cài đặt sẵn",
      "Tài liệu và video hướng dẫn quản trị chi tiết",
    ],
    targetAudience: [
      "Doanh nghiệp vừa và nhỏ (SMEs) cần nâng tầm hình ảnh chuyên nghiệp",
      "Công ty cung cấp dịch vụ kỹ thuật, tư vấn, giáo dục, xây dựng",
      "Cơ sở kinh doanh đang muốn mở rộng thị trường ra ngoài địa phương",
    ],
    faqs: [
      {
        question: "Thời gian hoàn thành một website kinh doanh là bao lâu?",
        answer: "Thời gian thông thường từ 10 đến 15 ngày làm việc tùy thuộc vào khối lượng nội dung và các tính năng cụ thể theo thỏa thuận.",
      },
      {
        question: "Doanh nghiệp có tự thay đổi được hình ảnh và bài viết không?",
        answer: "Có. Chúng tôi tích hợp hệ thống quản trị nội dung trực quan, kèm tài liệu hướng dẫn để bạn tự quản lý bài viết và hình ảnh thuận tiện.",
      },
      {
        question: "Website có hiển thị tốt trên điện thoại di động không?",
        answer: "Toàn bộ website được lập trình theo chuẩn Responsive Design, tự động co giãn và hiển thị tối ưu trên smartphone, máy tính bảng và desktop.",
      },
      {
        question: "Chính sách bảo hành và hỗ trợ kỹ thuật như thế nào?",
        answer: "Nguyên Agency bảo hành kỹ thuật 12 tháng, hỗ trợ kiểm tra định kỳ và khắc phục các vấn đề phát sinh trong quá trình vận hành.",
      },
    ],
    relatedSlugs: ["corporate-website", "landing-page", "e-commerce-website", "website-maintenance"],
    thumbnail: "https://ftwfwhxfbrqnrwmjrmrq.supabase.co/storage/v1/object/public/nguyen-agency-media/services/1794467100302-b95b267f-992f-4d6f-9815-3729272a6794.png",
    coverImage: "https://ftwfwhxfbrqnrwmjrmrq.supabase.co/storage/v1/object/public/nguyen-agency-media/services/1794467100302-b95b267f-992f-4d6f-9815-3729272a6794.png",
  },

  // -------------------------------------------------------------
  // 02. Branding & Identity
  // -------------------------------------------------------------
  {
    id: "srv-02",
    order: 2,
    title: "Branding & Identity",
    titleVn: "Thiết Kế Bộ Nhận Diện Thương Hiệu",
    slug: "branding-identity",
    group: "MEDIA",
    categoryName: "Branding & Visual",
    shortDesc:
      "Xây dựng hình ảnh thương hiệu nhất quán từ màu sắc, kiểu chữ đến hệ thống ấn phẩm, giúp doanh nghiệp tạo dấu ấn riêng trên môi trường số và ngoài đời thực.",
    seoTitle: "Thiết Kế Bộ Nhận Diện Thương Hiệu | Nguyên Agency",
    metaDescription:
      "Xây dựng hình ảnh thương hiệu nhất quán từ màu sắc, kiểu chữ đến hệ thống ấn phẩm nhận diện tại Nguyên Agency, giúp doanh nghiệp tạo dấu ấn riêng biệt.",
    primaryKeyword: "thiết kế bộ nhận diện thương hiệu",
    proposedItems: [
      "Định hướng hình ảnh và phong cách thẩm mỹ thương hiệu",
      "Bộ nhận diện ứng dụng (danh thiếp, phong bì, tiêu đề thư)",
      "Quy chuẩn sử dụng thương hiệu (Brand Guidelines chi tiết)",
    ],
    intro:
      "Hình ảnh thương hiệu nhất quán là tài sản vô giá giúp doanh nghiệp ghi điểm trong mắt đối tác và tạo dựng niềm tin bền vững với khách hàng. Nhiều doanh nghiệp thường gặp tình trạng sử dụng màu sắc lộn xộn, kiểu chữ tùy tiện trên các kênh truyền thông và tài liệu in ấn, khiến hình ảnh công ty trở nên thiếu chuyên nghiệp và mờ nhạt trước đối thủ cạnh tranh. Dịch vụ Branding & Identity của Nguyên Agency giúp doanh nghiệp chuẩn hóa toàn diện mọi điểm chạm thị giác, từ logo, bảng màu, font chữ đến ấn phẩm văn phòng và truyền thông số, kiến tạo bản sắc thương hiệu vững chắc và trường tồn.",
    clientProblems: [
      "Thương hiệu thiếu phong cách nhất quán, mỗi kênh thể hiện một kiểu.",
      "Ấn phẩm văn phòng và tài liệu giao dịch chưa đồng bộ, thiếu tính chuyên nghiệp.",
      "Khó khăn trong việc hướng dẫn các nhà in hay đối tác thiết kế đúng chuẩn.",
      "Khách hàng khó ghi nhớ và dễ nhầm lẫn thương hiệu với đối thủ cùng ngành.",
    ],
    solution:
      "Chúng tôi xây dựng hệ thống nhận diện thương hiệu bắt đầu từ việc nghiên cứu giá trị cốt lõi, ngành nghề và cá tính thương hiệu của bạn. Đội ngũ thiết kế sáng tạo hệ thống màu sắc biểu trưng, typography chuẩn xác, các họa tiết nhận diện phụ trợ và quy chuẩn ứng dụng thực tế. Kết quả được đóng gói thành cuốn cẩm nang Brand Guidelines rõ ràng, đóng vai trò như kim chỉ nam giúp doanh nghiệp ứng dụng chuẩn xác trên mọi phương tiện truyền thông số lẫn đời thực.",
    process: [
      { step: "01", name: "Khảo sát cốt lõi", desc: "Tìm hiểu định hướng phát triển, tầm nhìn và giá trị của thương hiệu." },
      { step: "02", name: "Định hướng thị giác", desc: "Xây dựng Moodboard về màu sắc, phong cách và cảm xúc chủ đạo." },
      { step: "03", name: "Thiết kế hệ thống", desc: "Sáng tạo các hạng mục nhận diện cốt lõi và ấn phẩm văn phòng." },
      { step: "04", name: "Ứng dụng thực tế", desc: "Mô phỏng phối cảnh Mockup trên các chất liệu in ấn và giao diện số." },
      { step: "05", name: "Soạn thảo Guidelines", desc: "Biên tập quy chuẩn khoảng cách, màu sắc, font chữ và điều cấm kỵ." },
      { step: "06", name: "Bàn giao tài nguyên", desc: "Bàn giao file vector gốc và hướng dẫn đối tác triển khai thực tế." },
    ],
    deliverables: [
      "File cẩm nang Brand Guidelines định dạng PDF chất lượng cao",
      "Bộ file vector gốc in ấn (AI, EPS, PDF, SVG)",
      "File thiết kế bộ ấn phẩm văn phòng (danh thiếp, phong bì, tiêu đề thư)",
      "Bộ tài nguyên avatar, cover chuẩn cho các kênh mạng xã hội",
    ],
    targetAudience: [
      "Doanh nghiệp mới thành lập cần định hình hình ảnh chuẩn mực từ đầu",
      "Doanh nghiệp lâu năm muốn tái định vị thương hiệu (Rebranding)",
      "Công ty chuẩn bị tham gia đấu thầu hoặc mở rộng hợp tác quốc tế",
    ],
    faqs: [
      {
        question: "Brand Guidelines gồm những nội dung chính nào?",
        answer: "Cẩm nang quy định chi tiết về logo, bảng mã màu chuẩn (CMYK, RGB, Pantone), font chữ, khoảng cách an toàn và quy cách ứng dụng trên ấn phẩm văn phòng, đồng phục, biển hiệu.",
      },
      {
        question: "Doanh nghiệp có nhận được file gốc để mang đi in không?",
        answer: "Có. Nguyên Agency bàn giao 100% file gốc vector độ phân giải cao dùng cho in ấn công nghiệp mà không bị vỡ nét.",
      },
      {
        question: "Nếu có nhu cầu thiết kế thêm ấn phẩm ngoài gói có được không?",
        answer: "Hoàn toàn được. Dựa trên cẩm nang đã xây dựng, chúng tôi có thể hỗ trợ mở rộng thêm các ấn phẩm như bao bì, catalogue hay backdrop sự kiện.",
      },
      {
        question: "Thời gian hoàn thành một bộ nhận diện thương hiệu là bao lâu?",
        answer: "Thông thường từ 15 đến 20 ngày làm việc để hoàn thiện từ khâu nghiên cứu đến cẩm nang hoàn chỉnh.",
      },
    ],
    relatedSlugs: ["logo-design", "graphic-design", "corporate-website", "advertising-creative"],
    thumbnail: "https://ftwfwhxfbrqnrwmjrmrq.supabase.co/storage/v1/object/public/nguyen-agency-media/services/1794467285238-09f29d30-24fd-458b-9b4c-949049f621b4.png",
    coverImage: "https://ftwfwhxfbrqnrwmjrmrq.supabase.co/storage/v1/object/public/nguyen-agency-media/services/1794467285238-09f29d30-24fd-458b-9b4c-949049f621b4.png",
  },

  // -------------------------------------------------------------
  // 03. Corporate Website
  // -------------------------------------------------------------
  {
    id: "srv-03",
    order: 3,
    title: "Corporate Website",
    titleVn: "Thiết Kế Website Doanh Nghiệp",
    slug: "corporate-website",
    group: "TECH",
    categoryName: "Web & Software",
    shortDesc:
      "Phát triển website giới thiệu doanh nghiệp, năng lực, lĩnh vực hoạt động, dự án và thông tin tuyển dụng với cấu trúc rõ ràng, dễ mở rộng.",
    seoTitle: "Thiết Kế Website Doanh Nghiệp | Nguyên Agency",
    metaDescription:
      "Phát triển website giới thiệu doanh nghiệp, hồ sơ năng lực, dự án và tin tức tuyển dụng với cấu trúc chuẩn SEO, bảo mật cao tại Nguyên Agency.",
    primaryKeyword: "thiết kế website doanh nghiệp",
    proposedItems: [
      "Trang giới thiệu lịch sử, tầm nhìn và ban lãnh đạo",
      "Hồ sơ năng lực trực tuyến (E-Profile)",
      "Danh mục dự án và công trình tiêu biểu",
      "Trang tin tức hoạt động và tuyển dụng nhân sự",
      "Hệ thống quản trị dữ liệu phân quyền an toàn",
    ],
    intro:
      "Đối với các tổng công ty, tập đoàn và doanh nghiệp có quy mô, website doanh nghiệp là phương tiện truyền thông chiến lược khẳng định năng lực pháp lý, quy mô hoạt động và vị thế trên thị trường. Các đối tác lớn, chủ đầu tư và ngân hàng thường thẩm định mức độ uy tín thông qua hồ sơ năng lực và các công trình dự án được trình bày trên website công ty. Dịch vụ phát triển Corporate Website của Nguyên Agency chú trọng vào cấu trúc thông tin quy củ, phân luồng nội dung khoa học, tính năng bảo mật dữ liệu nghiêm ngặt và khả năng mở rộng linh hoạt theo từng giai đoạn phát triển của tổ chức.",
    clientProblems: [
      "Website công ty chưa toát lên được tầm vóc, năng lực và quy mô thực tế.",
      "Khó khăn trong việc cập nhật hồ sơ các dự án mới đã và đang triển khai.",
      "Thông tin tuyển dụng và văn hóa doanh nghiệp chưa được truyền tải hấp dẫn.",
      "Hạ tầng website cũ tiềm ẩn rủi ro bảo mật và tốc độ tải trang chậm khi lưu trữ nhiều tài liệu.",
    ],
    solution:
      "Nguyên Agency xây dựng Corporate Website với tiêu chuẩn kiến trúc hiện đại, kết hợp giao diện sang trọng, chỉn chu và hệ thống phân quyền quản trị nội bộ chặt chẽ. Chúng tôi xây dựng các module chuyên biệt: trang lịch sử phát triển theo dòng thời gian, trang dự án tương tác có bộ lọc theo ngành/năm, chuyên mục tuyển dụng hỗ trợ nhận CV trực tuyến và cổng tải hồ sơ năng lực PDF nhanh chóng. Hệ thống được bảo vệ bằng các lớp bảo mật SSL, tường lửa chống tấn công và sao lưu dữ liệu tự động định kỳ.",
    process: [
      { step: "01", name: "Khảo sát tổ chức", desc: "Nghiên cứu cơ cấu tổ chức, các đơn vị thành viên và mục tiêu truyền thông." },
      { step: "02", name: "Quy hoạch cấu trúc", desc: "Thiết lập sơ đồ trang (Sitemap) chi tiết cho từng khối thông tin." },
      { step: "03", name: "Thiết kế UI/UX", desc: "Thiết kế giao diện mang tính chuẩn mực, trang trọng và đáng tin cậy." },
      { step: "04", name: "Lập trình hệ thống", desc: "Xây dựng các module dự án, hồ sơ năng lực và cổng tuyển dụng." },
      { step: "05", name: "Bảo mật & nghiệm thu", desc: "Kiểm tra an toàn thông tin, tối ưu tải trang và nghiệm thu chức năng." },
      { step: "06", name: "Chuyển giao & vận hành", desc: "Tập huấn cho ban biên tập và chuyển giao toàn bộ mã nguồn." },
    ],
    deliverables: [
      "Website doanh nghiệp hoàn chỉnh trên tên miền chính thức",
      "Mã nguồn Git độc lập và cơ sở dữ liệu doanh nghiệp",
      "Hệ thống CMS phân quyền quản trị cho nhiều nhân sự biên tập",
      "Biên bản nghiệm thu và cam kết bảo hành kỹ thuật",
    ],
    targetAudience: [
      "Tập đoàn, tổng công ty và các doanh nghiệp đa ngành",
      "Doanh nghiệp sản xuất, xây dựng, bất động sản, logistics",
      "Công ty chuẩn bị gọi vốn, niêm yết hoặc mở rộng đấu thầu dự án lớn",
    ],
    faqs: [
      {
        question: "Website có hỗ trợ hiển thị đa ngôn ngữ (tiếng Anh, tiếng Nhật...) không?",
        answer: "Có. Chúng tôi có thể tích hợp tính năng chuyển đổi đa ngôn ngữ với cấu trúc URL chuẩn SEO cho từng thứ tiếng theo yêu cầu.",
      },
      {
        question: "Doanh nghiệp có thể phân quyền nhiều người quản trị cùng lúc không?",
        answer: "Hệ thống CMS hỗ trợ phân quyền theo cấp bậc: Quản trị viên tối cao, biên tập viên tin tức, phụ trách tuyển dụng...",
      },
      {
        question: "Dữ liệu hồ sơ dự án có bị giới hạn dung lượng lưu trữ không?",
        answer: "Dữ liệu được lưu trữ trên hạ tầng đám mây chuyên nghiệp, không giới hạn số lượng bài viết và hình ảnh dự án tải lên.",
      },
      {
        question: "Mức độ bảo mật của website như thế nào?",
        answer: "Website được thiết lập chứng chỉ SSL, cơ chế ngăn chặn mã độc, bảo vệ form chống spam và sao lưu định kỳ.",
      },
    ],
    relatedSlugs: ["business-website", "branding-identity", "management-software", "website-maintenance"],
    thumbnail: "https://ftwfwhxfbrqnrwmjrmrq.supabase.co/storage/v1/object/public/nguyen-agency-media/services/1794467323218-2d522889-5531-4f1a-802e-3e663b67be80.png",
    coverImage: "https://ftwfwhxfbrqnrwmjrmrq.supabase.co/storage/v1/object/public/nguyen-agency-media/services/1794467323218-2d522889-5531-4f1a-802e-3e663b67be80.png",
  },

  // -------------------------------------------------------------
  // 04. Logo Design
  // -------------------------------------------------------------
  {
    id: "srv-04",
    order: 4,
    title: "Logo Design",
    titleVn: "Thiết Kế Logo Chuyên Nghiệp",
    slug: "logo-design",
    group: "MEDIA",
    categoryName: "Branding & Visual",
    shortDesc:
      "Thiết kế logo phù hợp tính cách thương hiệu, ngành nghề và đối tượng khách hàng, dễ nhận diện trên website, bao bì, biển hiệu và mạng xã hội.",
    seoTitle: "Thiết Kế Logo Chuyên Nghiệp | Nguyên Agency",
    metaDescription:
      "Nguyên Agency thiết kế logo phù hợp nhận diện thương hiệu, ngành nghề và khách hàng mục tiêu, với các phiên bản sử dụng trên website và ấn phẩm.",
    primaryKeyword: "thiết kế logo chuyên nghiệp",
    proposedItems: [
      "Phương án logo đa dạng ý tưởng concept",
      "Các phiên bản màu (âm bản, dương bản, đơn sắc)",
      "Trọn bộ file vector gốc chất lượng cao",
      "Hướng dẫn sử dụng logo (tỷ lệ, font chữ, mã màu)",
    ],
    intro:
      "Logo là dấu ấn thị giác đầu tiên và quan trọng nhất đại diện cho uy tín, thông điệp và linh hồn của một thương hiệu. Một biểu trưng logo thành công cần đảm bảo sự đơn giản, độc bản, dễ nhớ và có khả năng thích ứng linh hoạt trên nhiều chất liệu khác nhau — từ màn hình điện thoại nhỏ gọn đến biển hiệu quảng cáo ngoài trời khổ lớn. Rất nhiều doanh nghiệp gặp rắc rối khi sử dụng các mẫu logo sao chép sẵn trên mạng dẫn đến việc không thể đăng ký nhãn hiệu bảo hộ hoặc bị vỡ nét khi phóng to in ấn. Dịch vụ thiết kế logo của Nguyên Agency mang đến giải pháp sáng tạo độc bản, được nghiên cứu kỹ lưỡng theo ngành nghề và phong thủy thị giác, giúp bạn tự tin xây dựng thương hiệu vững bền.",
    clientProblems: [
      "Logo hiện tại sao chép, mờ nhạt, không tạo được ấn tượng với khách hàng.",
      "Không có file thiết kế gốc (vector), khi mang đi in ấn hay làm biển quảng cáo bị nhòe vỡ.",
      "Mẫu logo quá rườm rà, khó nhận diện khi thu nhỏ làm avatar trên mạng xã hội.",
      "Không đủ điều kiện để tra cứu và đăng ký bảo hộ nhãn hiệu độc quyền.",
    ],
    solution:
      "Nguyên Agency tiếp cận thiết kế logo bằng quy trình bài bản: nghiên cứu ngành hàng, phân tích đối thủ cạnh tranh và phác thảo các concept ý tưởng đa dạng. Chúng tôi trau chuốt từng đường nét theo tỷ lệ vàng hình học, lựa chọn bảng màu chuẩn mực và thử nghiệm độ hiển thị trên nhiều chất liệu thực tế. Khách hàng nhận được bộ phương án hoàn thiện kèm đầy đủ các định dạng file vector gốc và cẩm nang hướng dẫn sử dụng chi tiết.",
    process: [
      { step: "01", name: "Tiếp nhận brief", desc: "Trao đổi về ý nghĩa tên thương hiệu, ngành nghề và đối tượng mục tiêu." },
      { step: "02", name: "Phác thảo concept", desc: "Lên các ý tưởng tạo hình sơ khởi trên bản vẽ phác thảo." },
      { step: "03", name: "Hoàn thiện vector", desc: "Dựng hình chính xác trên phần mềm chuyên dụng và phối màu sắc." },
      { step: "04", name: "Trình bày phương án", desc: "Trình chiếu các phương án trên mockup thực tế kèm thuyết minh ý nghĩa." },
      { step: "05", name: "Tinh chỉnh hoàn thiện", desc: "Tiếp thu phản hồi của khách hàng và điều chỉnh chi tiết." },
      { step: "06", name: "Đóng gói bàn giao", desc: "Xuất trọn bộ file vector in ấn, file hiển thị số và tài liệu hướng dẫn." },
    ],
    deliverables: [
      "File vector gốc (AI, EPS, SVG, PDF in ấn độ phân giải cao)",
      "File ảnh trong suốt PNG không nền dùng cho website và chèn văn bản",
      "Các phiên bản màu chuẩn: đầy đủ màu, âm bản trắng, dương bản đen",
      "Tài liệu hướng dẫn tỷ lệ an toàn, font chữ phối hợp và bảng mã màu",
    ],
    targetAudience: [
      "Doanh nghiệp, công ty mới thành lập hoặc ra mắt nhãn hàng mới",
      "Cửa hàng, quán cafe, nhà hàng, thương hiệu thời trang, mỹ phẩm",
      "Tổ chức cần làm mới (Redesign) biểu tượng logo sau nhiều năm hoạt động",
    ],
    faqs: [
      {
        question: "Doanh nghiệp được chọn trong bao nhiêu phương án logo?",
        answer: "Chúng tôi gửi từ 2 đến 3 phương án concept ý tưởng khác biệt để bạn lựa chọn và góp ý tinh chỉnh phương án ưng ý nhất.",
      },
      {
        question: "Logo có đăng ký bảo hộ độc quyền được không?",
        answer: "Các mẫu logo do Nguyên Agency sáng tạo là nguyên bản 100%, không sao chép và đáp ứng các tiêu chuẩn tra cứu bảo hộ nhãn hiệu tại Cục Sở Hữu Trí Tuệ.",
      },
      {
        question: "Tôi có nhận được file để đi in thiệp, làm biển hiệu không?",
        answer: "Có. Chúng tôi bàn giao đầy đủ file vector AI, EPS chất lượng in công nghiệp, nhà in có thể phóng to bất kỳ kích thước nào mà không giảm chất lượng.",
      },
      {
        question: "Thời gian thiết kế logo mất bao lâu?",
        answer: "Thông thường từ 5 đến 7 ngày làm việc để gửi các phương án phác thảo ban đầu.",
      },
    ],
    relatedSlugs: ["branding-identity", "graphic-design", "poster-design", "menu-design"],
    thumbnail: "https://ftwfwhxfbrqnrwmjrmrq.supabase.co/storage/v1/object/public/nguyen-agency-media/services/1794467361674-354038ef-3fbe-43fe-a89c-e523f91a441c.png",
    coverImage: "https://ftwfwhxfbrqnrwmjrmrq.supabase.co/storage/v1/object/public/nguyen-agency-media/services/1794467361674-354038ef-3fbe-43fe-a89c-e523f91a441c.png",
  },

  // -------------------------------------------------------------
  // 05. Landing Page
  // -------------------------------------------------------------
  {
    id: "srv-05",
    order: 5,
    title: "Landing Page",
    titleVn: "Thiết Kế Landing Page Chuyển Đổi",
    slug: "landing-page",
    group: "TECH",
    categoryName: "Web & Software",
    shortDesc:
      "Xây dựng trang đích cho chiến dịch quảng cáo, ra mắt sản phẩm hoặc thu thập khách hàng tiềm năng, tập trung vào thông điệp và hành động chuyển đổi.",
    seoTitle: "Thiết Kế Landing Page Chuyển Đổi Cao | Nguyên Agency",
    metaDescription:
      "Xây dựng landing page chuyên nghiệp cho chiến dịch quảng cáo, ra mắt sản phẩm và thu thập khách hàng tiềm năng, tối ưu hóa tỷ lệ chuyển đổi tại Nguyên Agency.",
    primaryKeyword: "thiết kế landing page",
    proposedItems: [
      "Landing page chuẩn responsive tải nhanh",
      "Hệ thống nút kêu gọi hành động (CTA) kích thích tương tác",
      "Form đăng ký thu thập thông tin khách hàng tiềm năng (Leads)",
      "Tích hợp đo lường sự kiện (Google Analytics, Facebook Pixel)",
    ],
    intro:
      "Trong các chiến dịch chạy quảng cáo Facebook Ads, Google Ads hay TikTok Ads, việc dẫn người dùng về trang chủ chung chung thường làm phân tán sự chú ý và lãng phí đáng kể ngân sách marketing. Một Landing Page chuyên biệt được thiết kế với cấu trúc tinh gọn, tập trung vào một sản phẩm hoặc một thông điệp duy nhất sẽ dẫn dắt tâm lý người đọc theo lộ trình thuyết phục từ khơi gợi nhu cầu, giải quyết nỗi đau đến hành động mua hàng hoặc để lại thông tin tư vấn. Dịch vụ thiết kế Landing Page của Nguyên Agency kết hợp giữa mỹ thuật thị giác hiện đại và tâm lý học hành vi, giúp tối đa hóa tỷ lệ chuyển đổi đơn hàng trên từng lượt nhấp chuột.",
    clientProblems: [
      "Chạy quảng cáo tốn kém nhưng tỷ lệ khách để lại thông tin quá thấp.",
      "Trang đích tải chậm, khách hàng bấm vào rồi thoát ra trước khi đọc nội dung.",
      "Nội dung dàn trải, không có điểm nhấn kích thích hành động (Call to Action).",
      "Không đo lường được người dùng tương tác đến nút bấm hay vị trí nào trên trang.",
    ],
    solution:
      "Nguyên Agency xây dựng Landing Page với tiêu chí tốc độ tải trang cực nhanh và cấu trúc nội dung có tính thuyết phục cao. Chúng tôi thiết kế giao diện hấp dẫn, làm nổi bật thông điệp cốt lõi ngay ở màn hình đầu tiên (Hero Section), sắp xếp các khối lợi ích sản phẩm, cảm nhận khách hàng và bảng giá rõ ràng. Biểu mẫu đăng ký được tối ưu hóa số lượng trường nhập liệu, kết nối dữ liệu tức thì về Google Sheets, Email hoặc Telegram Bot của doanh nghiệp giúp đội ngũ chốt đơn kịp thời.",
    process: [
      { step: "01", name: "Xác định mục tiêu", desc: "Làm rõ mục tiêu chiến dịch (thu lead, bán hàng hay sự kiện)." },
      { step: "02", name: "Lập dàn ý nội dung", desc: "Xây dựng kịch bản nội dung (Copywriting) theo mô hình AIDA." },
      { step: "03", name: "Thiết kế trực quan", desc: "Thiết kế giao diện bắt mắt, làm nổi bật các khối CTA chuyển đổi." },
      { step: "04", name: "Lập trình & tích hợp", desc: "Lập trình mã nguồn, tối ưu hiển thị di động và gắn mã pixel đo lường." },
      { step: "05", name: "Kiểm tra đo lường", desc: "Test form đăng ký, kiểm tra luồng gửi data và tốc độ load." },
      { step: "06", name: "Bàn giao & kích hoạt", desc: "Gắn tên miền chiến dịch và bàn giao hệ thống theo dõi kết quả." },
    ],
    deliverables: [
      "Landing Page hoàn chỉnh tối ưu trên cả điện thoại và máy tính",
      "Biểu mẫu đăng ký tự động đổ dữ liệu về Google Sheet / Email / Telegram",
      "Mã theo dõi đo lường chuyển đổi (Facebook Pixel, GA4, TikTok Pixel)",
      "Toàn bộ mã nguồn trang đích không phụ thuộc nền tảng bên thứ ba",
    ],
    targetAudience: [
      "Doanh nghiệp đang chuẩn bị chạy chiến dịch quảng cáo trả phí (Paid Ads)",
      "Dự án bất động sản, khóa học, trung tâm đào tạo, thẩm mỹ viện",
      "Nhãn hàng ra mắt sản phẩm mới hoặc mở đợt khuyến mãi tri ân",
    ],
    faqs: [
      {
        question: "Landing Page có chạy được trên tên miền riêng của tôi không?",
        answer: "Có. Landing page có thể chạy trực tiếp trên tên miền chính hoặc tên miền con (subdomain) như khuyenmai.tenmien.com thuận tiện.",
      },
      {
        question: "Dữ liệu khách hàng đăng ký sẽ được gửi về đâu?",
        answer: "Dữ liệu có thể được chuyển đồng thời về Google Sheet, Email ban kinh doanh và thông báo ngay lập tức qua Telegram Bot để bạn gọi lại cho khách trong vài phút.",
      },
      {
        question: "Landing Page có tối ưu hiển thị trên màn hình điện thoại không?",
        answer: "Vì hơn 80% lưu lượng quảng cáo đến từ điện thoại, chúng tôi ưu tiên thiết kế theo phương pháp Mobile First để trải nghiệm chạm lướt mượt mà nhất.",
      },
      {
        question: "Thời gian triển khai một Landing Page là bao lâu?",
        answer: "Thông thường từ 3 đến 5 ngày làm việc khi đã có đầy đủ thông tin sản phẩm và nội dung cần truyền tải.",
      },
    ],
    relatedSlugs: ["business-website", "advertising-creative", "digital-marketing", "e-commerce-website"],
    thumbnail: "https://ftwfwhxfbrqnrwmjrmrq.supabase.co/storage/v1/object/public/nguyen-agency-media/services/1794467432296-9cf0b83a-be6c-472a-846e-ac294e3df8cf.png",
    coverImage: "https://ftwfwhxfbrqnrwmjrmrq.supabase.co/storage/v1/object/public/nguyen-agency-media/services/1794467432296-9cf0b83a-be6c-472a-846e-ac294e3df8cf.png",
  },

  // -------------------------------------------------------------
  // 06. Graphic Design
  // -------------------------------------------------------------
  {
    id: "srv-06",
    order: 6,
    title: "Graphic Design",
    titleVn: "Dịch Vụ Thiết Kế Đồ Họa",
    slug: "graphic-design",
    group: "MEDIA",
    categoryName: "Branding & Visual",
    shortDesc:
      "Thiết kế hình ảnh truyền thông cho hoạt động kinh doanh, giới thiệu sản phẩm và các chiến dịch quảng bá, bảo đảm nội dung dễ đọc và đồng bộ nhận diện.",
    seoTitle: "Dịch Vụ Thiết Kế Đồ Họa Chuyên Nghiệp | Nguyên Agency",
    metaDescription:
      "Dịch vụ thiết kế đồ họa truyền thông, ấn phẩm số và in ấn quảng bá đồng bộ nhận diện thương hiệu cho doanh nghiệp tại Nguyên Agency.",
    primaryKeyword: "dịch vụ thiết kế đồ họa",
    proposedItems: [
      "Ấn phẩm số hoặc ấn phẩm in ấn theo yêu cầu cụ thể",
      "File xuất định dạng tiêu chuẩn (PNG, JPG, PDF in)",
      "File thiết kế gốc theo thỏa thuận hợp đồng",
    ],
    intro:
      "Trong kỷ nguyên số, hình ảnh là yếu tố quyết định người dùng có dừng lại xem thông điệp của bạn hay lướt qua trong tích tắc. Một ấn phẩm đồ họa chất lượng không chỉ cần đẹp mắt mà phải truyền tải nội dung súc tích, dễ đọc và thể hiện đúng tính cách của thương hiệu. Rất nhiều doanh nghiệp đang tốn nhiều thời gian tự thiết kế bằng các công cụ nghiệp dư dẫn đến ấn phẩm thiếu cân đối về bố cục, màu sắc nhạt nhòa và không đúng quy chuẩn kỹ thuật in ấn. Dịch vụ thiết kế đồ họa của Nguyên Agency cung cấp giải pháp sáng tạo hình ảnh toàn diện cho các hoạt động bán hàng, sự kiện và chiến dịch marketing với chất lượng thẩm mỹ cao.",
    clientProblems: [
      "Hình ảnh truyền thông thiếu đồng bộ, trông rời rạc và kém chuyên nghiệp.",
      "Không có nhân sự thiết kế chuyên trách, tốn nhiều thời gian mày mò thủ công.",
      "File gửi đi in bị sai hệ màu (RGB/CMYK) khiến bản in bị tối hoặc lệch màu.",
      "Nội dung quá nhiều chữ, bố cục lộn xộn khiến người xem khó nắm bắt ý chính.",
    ],
    solution:
      "Đội ngũ Designer của Nguyên Agency hỗ trợ doanh nghiệp hiện thực hóa các ý tưởng truyền thông thành những tác phẩm thị giác ấn tượng. Chúng tôi xử lý khoa học hệ thống lưới bố cục (Grid), kết hợp kiểu chữ có cấp bậc rõ ràng và lựa chọn màu sắc tạo cảm xúc. Mọi ấn phẩm đều được kiểm tra kỹ lưỡng theo đúng mục đích sử dụng: tối ưu dung lượng cho hiển thị trực tuyến hoặc thiết lập đúng độ phân giải 300 DPI, hệ màu CMYK và khoảng bù xén cho in ấn thực tế.",
    process: [
      { step: "01", name: "Tiếp nhận yêu cầu", desc: "Xác định mục đích sử dụng (in ấn hay đăng mạng xã hội) và nội dung." },
      { step: "02", name: "Tư vấn bố cục", desc: "Định hướng phong cách trình bày và kích thước tiêu chuẩn phù hợp." },
      { step: "03", name: "Thiết kế phương án", desc: "Triển khai thiết kế chi tiết trên phần mềm đồ họa chuyên nghiệp." },
      { step: "04", name: "Góp ý & chỉnh sửa", desc: "Gửi bản demo xem thử và tiếp thu chỉnh sửa theo phản hồi." },
      { step: "05", name: "Xuất file chuẩn", desc: "Xuất các định dạng phù hợp mục đích in ấn hoặc hiển thị màn hình." },
      { step: "06", name: "Bàn giao", desc: "Chuyển giao toàn bộ file thành phẩm cho khách hàng." },
    ],
    deliverables: [
      "File ảnh chất lượng cao (JPG, PNG sắc nét) dùng cho digital",
      "File PDF chuẩn in ấn độ phân giải cao (300 DPI, hệ màu CMYK)",
      "File thiết kế gốc (AI, PSD) theo phạm vi thỏa thuận dịch vụ",
    ],
    targetAudience: [
      "Doanh nghiệp cần thiết kế ấn phẩm bán hàng: tờ rơi, brochure, catalogue",
      "Đơn vị tổ chức sự kiện, hội thảo cần backdrop, thiệp mời, tài liệu",
      "Hộ kinh doanh cần hình ảnh giới thiệu sản phẩm định kỳ",
    ],
    faqs: [
      {
        question: "Tôi có thể yêu cầu thiết kế theo kích thước riêng biệt không?",
        answer: "Hoàn toàn được. Chúng tôi tiếp nhận thiết kế theo mọi kích thước khổ in hoặc tỷ lệ hiển thị kỹ thuật số mà bạn mong muốn.",
      },
      {
        question: "File in ấn có đảm bảo khi mang ra xưởng in không bị lỗi không?",
        answer: "Mọi file in ấn đều được xuất chuẩn CMYK, 300 DPI, có bù tràn lề và khóa font chữ (create outlines) để xưởng in mở ra không bị lỗi font.",
      },
      {
        question: "Tôi được chỉnh sửa bao nhiêu lần trong quá trình thiết kế?",
        answer: "Quy trình tiêu chuẩn bao gồm các vòng góp ý chỉnh sửa chi tiết để đảm bảo bạn hài lòng với ấn phẩm cuối cùng.",
      },
      {
        question: "Thời gian bàn giao một ấn phẩm đồ họa là bao lâu?",
        answer: "Đối với ấn phẩm đơn lẻ thông thường từ 1 đến 3 ngày làm việc; các ấn phẩm nhiều trang như catalogue từ 5 đến 7 ngày.",
      },
    ],
    relatedSlugs: ["branding-identity", "banner-design", "poster-design", "social-media-design"],
    thumbnail: "https://ftwfwhxfbrqnrwmjrmrq.supabase.co/storage/v1/object/public/nguyen-agency-media/services/1794467400702-a3c13222-0ec7-44fe-b597-f8906e4bb0a3.png",
    coverImage: "https://ftwfwhxfbrqnrwmjrmrq.supabase.co/storage/v1/object/public/nguyen-agency-media/services/1794467400702-a3c13222-0ec7-44fe-b597-f8906e4bb0a3.png",
  },

  // -------------------------------------------------------------
  // 07. E-commerce Website
  // -------------------------------------------------------------
  {
    id: "srv-07",
    order: 7,
    title: "E-commerce Website",
    titleVn: "Thiết Kế Website Bán Hàng Trực Tuyến",
    slug: "e-commerce-website",
    aliases: ["ecommerce-website"],
    group: "TECH",
    categoryName: "Web & Software",
    shortDesc:
      "Xây dựng website bán hàng với danh mục sản phẩm, tìm kiếm, giỏ hàng, đặt hàng và công cụ quản lý, giúp doanh nghiệp chủ động kênh bán trực tuyến.",
    seoTitle: "Thiết Kế Website Bán Hàng E-Commerce | Nguyên Agency",
    metaDescription:
      "Giải pháp thiết kế website bán hàng trực tuyến với giỏ hàng, tìm kiếm, thanh toán tự động và công cụ quản trị đơn hàng chuyên nghiệp tại Nguyên Agency.",
    primaryKeyword: "thiết kế website bán hàng",
    proposedItems: [
      "Danh mục sản phẩm phân cấp khoa học và bộ lọc tìm kiếm",
      "Tính năng giỏ hàng và thanh toán trực tuyến thuận tiện",
      "Quy trình đặt hàng tinh gọn, thông báo đơn về email/SMS",
      "Trang quản trị sản phẩm, tồn kho và đơn hàng trực quan",
    ],
    intro:
      "Sở hữu một website bán hàng độc lập là bước đi chiến lược giúp doanh nghiệp thoát khỏi sự phụ thuộc vào các nền tảng mạng xã hội và sàn thương mại điện tử vốn ngày càng gia tăng chi phí chiết khấu và rủi ro khóa tài khoản. Một website E-commerce hoàn chỉnh cho phép bạn toàn quyền sở hữu tệp dữ liệu khách hàng, tự do xây dựng chương trình khuyến mãi và mang lại trải nghiệm mua sắm nhanh chóng, tiện lợi cho người tiêu dùng. Dịch vụ thiết kế website bán hàng của Nguyên Agency chú trọng vào tốc độ tải trang, luồng thanh toán liền mạch và hệ thống quản lý đơn hàng tối ưu, giúp việc kinh doanh trực tuyến của bạn đạt hiệu quả cao nhất.",
    clientProblems: [
      "Kinh doanh phụ thuộc vào mạng xã hội, thường xuyên bị hạn chế tương tác.",
      "Quy trình chốt đơn thủ công tốn nhiều nhân sự và dễ xảy ra nhầm lẫn.",
      "Khách hàng khó tra cứu mẫu mã, phân loại sản phẩm (màu sắc, kích thước).",
      "Website bán hàng cũ tải chậm, thao tác thanh toán phức tạp làm khách bỏ giỏ hàng.",
    ],
    solution:
      "Nguyên Agency phát triển nền tảng website bán hàng với giao diện hiện đại, tối ưu trải nghiệm mua sắm trên thiết bị di động. Khách hàng dễ dàng tìm kiếm sản phẩm bằng bộ lọc thông minh, xem hình ảnh sắc nét, chọn biến thể và tiến hành đặt hàng chỉ trong vài thao tác đơn giản. Chúng tôi tích hợp sẵn các phương thức thanh toán quen thuộc như chuyển khoản ngân hàng quét mã QR tự động (VietQR), ví điện tử và thanh toán khi nhận hàng (COD). Hệ thống quản trị nội bộ giúp bạn theo dõi trạng thái đơn hàng, doanh thu và lượng tồn kho theo thời gian thực.",
    process: [
      { step: "01", name: "Khảo sát ngành hàng", desc: "Xác định danh mục sản phẩm, biến thể và chính sách vận chuyển." },
      { step: "02", name: "Thiết kế luồng mua", desc: "Thiết kế giao diện trang danh mục, trang chi tiết và giỏ hàng." },
      { step: "03", name: "Lập trình tính năng", desc: "Phát triển bộ lọc tìm kiếm, giỏ hàng và cổng thanh toán QR." },
      { step: "04", name: "Xây dựng CMS quản trị", desc: "Thiết lập module quản lý đơn hàng, kho và khách hàng." },
      { step: "05", name: "Kiểm thử quy trình", desc: "Đặt thử đơn hàng, kiểm tra tính tiền, phí ship và bảo mật." },
      { step: "06", name: "Bàn giao & vận hành", desc: "Hướng dẫn đăng sản phẩm, xử lý đơn và chuyển giao hệ thống." },
    ],
    deliverables: [
      "Website bán hàng hoàn chỉnh kết nối cổng thanh toán",
      "Hệ thống quản lý sản phẩm, đơn hàng và khách hàng",
      "Mã nguồn độc lập và quyền sở hữu toàn bộ cơ sở dữ liệu",
      "Tài liệu hướng dẫn vận hành và quy trình xử lý đơn hàng",
    ],
    targetAudience: [
      "Doanh nghiệp phân phối bán lẻ, thời trang, mỹ phẩm, đồ gia dụng",
      "Chuỗi cửa hàng đặc sản địa phương tại Quảng Ngãi muốn bán hàng toàn quốc",
      "Các đơn vị bán buôn (B2B) cần danh mục đặt hàng online chuyên nghiệp",
    ],
    faqs: [
      {
        question: "Website có tích hợp thanh toán quét mã VietQR tự động không?",
        answer: "Có. Chúng tôi hỗ trợ tích hợp giải pháp thanh toán quét mã QR động, khách quét mã là tự điền đúng số tiền và nội dung đơn hàng.",
      },
      {
        question: "Tôi có thể đăng tải bao nhiêu sản phẩm lên website?",
        answer: "Hệ thống không giới hạn số lượng sản phẩm đăng tải. Bạn có thể tự do mở rộng danh mục kinh doanh bất kỳ lúc nào.",
      },
      {
        question: "Website có kết nối được với các đơn vị vận chuyển (GHTK, GHN...) không?",
        answer: "Chúng tôi có thể tích hợp API đồng bộ đơn hàng sang các đơn vị vận chuyển theo nhu cầu cụ thể của doanh nghiệp.",
      },
      {
        question: "Thời gian hoàn thành một website bán hàng là bao lâu?",
        answer: "Thông thường từ 15 đến 25 ngày làm việc tùy thuộc vào quy mô tính năng và cổng kết nối thanh toán.",
      },
    ],
    relatedSlugs: ["business-website", "landing-page", "crm-system", "digital-marketing"],
    thumbnail: "https://ftwfwhxfbrqnrwmjrmrq.supabase.co/storage/v1/object/public/nguyen-agency-media/services/1794467947204-877fce9c-c454-4a02-9486-055d640b303f.png",
    coverImage: "https://ftwfwhxfbrqnrwmjrmrq.supabase.co/storage/v1/object/public/nguyen-agency-media/services/1794467947204-877fce9c-c454-4a02-9486-055d640b303f.png",
  },

  // -------------------------------------------------------------
  // 08. Banner Design
  // -------------------------------------------------------------
  {
    id: "srv-08",
    order: 8,
    title: "Banner Design",
    titleVn: "Thiết Kế Banner Quảng Cáo",
    slug: "banner-design",
    group: "MEDIA",
    categoryName: "Branding & Visual",
    shortDesc:
      "Thiết kế banner nổi bật thông điệp, sản phẩm và chương trình quảng cáo, phù hợp nhiều kích thước trên website, Facebook và các nền tảng truyền thông.",
    seoTitle: "Thiết Kế Banner Quảng Cáo Đa Nền Tảng | Nguyên Agency",
    metaDescription:
      "Thiết kế banner quảng cáo chuyên nghiệp, nổi bật thông điệp sản phẩm và chương trình ưu đãi, chuẩn kích thước website, Facebook và Google Ads tại Nguyên Agency.",
    primaryKeyword: "thiết kế banner quảng cáo",
    proposedItems: [
      "Bộ banner thiết kế theo chuẩn kích thước đa nền tảng",
      "Các phiên bản nội dung phục vụ thử nghiệm quảng cáo",
      "File xuất chất lượng cao tối ưu dung lượng hiển thị",
    ],
    intro:
      "Banner quảng cáo là vũ khí trực quan then chốt quyết định sự thành bại của các chiến dịch Digital Marketing. Khi lướt mạng xã hội hay duyệt web, người dùng chỉ dành chưa đầy 2 giây để nhìn lướt qua một hình ảnh quảng cáo. Nếu banner không có tiêu đề bắt mắt, hình ảnh sản phẩm mờ nhạt hoặc bố cục rối ren, chiến dịch của bạn sẽ bị lãng phí ngân sách mà không mang lại kết quả. Dịch vụ thiết kế banner quảng cáo của Nguyên Agency giúp doanh nghiệp sở hữu những ấn phẩm thị giác sắc sảo, làm nổi bật thông điệp ưu đãi cốt lõi và thôi thúc người dùng nhấp chuột tương tác.",
    clientProblems: [
      "Banner tự làm trông nghiệp dư, không thu hút được sự chú ý của khách hàng.",
      "Kích thước sai lệch khiến banner bị cắt cụt tiêu đề hoặc mờ khi đăng lên web/mạng xã hội.",
      "Thông điệp quảng cáo chứa quá nhiều chữ, vi phạm chính sách hiển thị của các nền tảng.",
      "Chiến dịch chạy quảng cáo không đạt hiệu quả do hình ảnh thiếu tính thuyết phục.",
    ],
    solution:
      "Nguyên Agency thiết kế banner dựa trên sự kết hợp hài hòa giữa yếu tố nghệ thuật và tính hiệu quả thương mại. Chúng tôi tạo điểm nhấn thị giác bằng hình ảnh sản phẩm chất lượng cao, phối hợp typography tương phản mạnh và nút kêu gọi hành động (Call to Action) nổi bật. Mọi banner đều được xuất theo đúng bộ kích thước tiêu chuẩn: Banner trang chủ website (16:9, slider), Facebook Ads (vuông 1:1, dọc 4:5), Google Display Network và Story (9:16), đảm bảo hiển thị sắc nét với dung lượng tải nhẹ.",
    process: [
      { step: "01", name: "Xác định mục tiêu", desc: "Nắm bắt thông điệp ưu đãi, sản phẩm trọng tâm và kênh hiển thị." },
      { step: "02", name: "Tư vấn kích thước", desc: "Lựa chọn bộ kích thước tiêu chuẩn phù hợp với từng nền tảng." },
      { step: "03", name: "Lên bố cục concept", desc: "Sắp xếp tiêu đề, hình ảnh và nút bấm theo trật tự thị giác." },
      { step: "04", name: "Phối màu & đồ họa", desc: "Hoàn thiện chi tiết màu sắc, ánh sáng và hiệu ứng thu hút." },
      { step: "05", name: "Phóng tác kích thước", desc: "Nhân bản thiết kế sang các tỷ lệ khung hình khác nhau theo gói." },
      { step: "06", name: "Xuất file & bàn giao", desc: "Bàn giao file ảnh nén tối ưu dung lượng cho quảng cáo." },
    ],
    deliverables: [
      "Bộ file ảnh banner (JPG, PNG) sắc nét theo từng kích thước yêu cầu",
      "Phiên bản tối ưu dung lượng hiển thị nhanh cho website và quảng cáo",
      "File thiết kế gốc theo phạm vi thỏa thuận hợp đồng",
    ],
    targetAudience: [
      "Doanh nghiệp chuẩn bị chạy các đợt ưu đãi, khuyến mãi Black Friday, Tết...",
      "Chủ website cần thay mới banner trượt (Slider) trang chủ theo mùa",
      "Các nhà quảng cáo Facebook Ads, Google Display Network cần tài nguyên chạy Ads",
    ],
    faqs: [
      {
        question: "Banner có bị dính lỗi quá nhiều chữ khi chạy quảng cáo Facebook không?",
        answer: "Chúng tôi tuân thủ nghiêm ngặt nguyên tắc bố cục cân đối của các nền tảng quảng cáo, đảm bảo tỷ lệ chữ và hình ảnh tối ưu nhất.",
      },
      {
        question: "Tôi có thể đặt gói thiết kế banner theo tháng được không?",
        answer: "Có. Nguyên Agency cung cấp các gói dịch vụ thiết kế đồ họa định kỳ theo tháng giúp doanh nghiệp luôn có banner mới cập nhật.",
      },
      {
        question: "Thời gian hoàn thành một bộ banner là bao lâu?",
        answer: "Thông thường từ 24 đến 48 giờ làm việc sau khi thống nhất thông điệp và hình ảnh sản phẩm.",
      },
      {
        question: "Nếu cần sửa đổi câu chữ sau khi thiết kế xong thì sao?",
        answer: "Chúng tôi hỗ trợ chỉnh sửa câu từ và thông số ưu đãi để phù hợp với diễn biến chiến dịch thực tế của bạn.",
      },
    ],
    relatedSlugs: ["graphic-design", "poster-design", "advertising-creative", "social-media-design"],
    thumbnail: "https://ftwfwhxfbrqnrwmjrmrq.supabase.co/storage/v1/object/public/nguyen-agency-media/services/1794467861207-527a0c1e-36e7-48c9-97a8-c2316ca55989.png",
    coverImage: "https://ftwfwhxfbrqnrwmjrmrq.supabase.co/storage/v1/object/public/nguyen-agency-media/services/1794467861207-527a0c1e-36e7-48c9-97a8-c2316ca55989.png",
  },

  // -------------------------------------------------------------
  // 09. Web Application
  // -------------------------------------------------------------
  {
    id: "srv-09",
    order: 9,
    title: "Web Application",
    titleVn: "Phát Triển Ứng Dụng Web",
    slug: "web-application",
    group: "TECH",
    categoryName: "Web & Software",
    shortDesc:
      "Phát triển ứng dụng web phục vụ quy trình nghiệp vụ, xử lý dữ liệu và cộng tác trực tuyến, với giao diện phù hợp vai trò người sử dụng.",
    seoTitle: "Phát Triển Ứng Dụng Web Chuyên Sâu | Nguyên Agency",
    metaDescription:
      "Lập trình ứng dụng web xử lý quy trình nghiệp vụ, phân quyền dữ liệu và cộng tác trực tuyến chuẩn kiến trúc mở rộng tại Nguyên Agency.",
    primaryKeyword: "phát triển ứng dụng web",
    proposedItems: [
      "Ứng dụng web xây dựng theo quy trình nghiệp vụ thực tế",
      "Hệ thống phân quyền truy cập theo vai trò người dùng (RBAC)",
      "Cơ sở dữ liệu an toàn, xử lý truy vấn dữ liệu luồng lớn",
      "Tài liệu hướng dẫn sử dụng và bàn giao kỹ thuật",
    ],
    intro:
      "Khi quy mô hoạt động mở rộng, các công cụ quản lý thủ công như sổ sách hay bảng tính Excel bắt đầu bộc lộ hạn chế nghiêm trọng: dữ liệu rời rạc, khó kiểm soát phiên bản, thiếu bảo mật và không hỗ trợ làm việc cộng tác từ xa. Một ứng dụng web (Web Application) chạy trực tiếp trên trình duyệt là giải pháp tối ưu giúp số hóa quy trình vận hành, đồng bộ dữ liệu tập trung và cho phép nhân viên cũng như ban lãnh đạo truy cập làm việc mọi lúc, mọi nơi trên mọi thiết bị mà không cần cài đặt phần mềm phức tạp. Dịch vụ phát triển ứng dụng web của Nguyên Agency mang đến giải pháp lập trình may đo theo bài toán riêng của doanh nghiệp với tính ổn định và bảo mật cao.",
    clientProblems: [
      "Quản lý công việc bằng file Excel rời rạc, dễ bị ghi đè dữ liệu hoặc thất thoát.",
      "Nhân viên làm việc ở nhiều chi nhánh không thể đồng bộ dữ liệu thời gian thực.",
      "Các phần mềm đóng gói sẵn trên thị trường quá cồng kềnh, thừa tính năng không dùng đến nhưng lại thiếu tính năng đặc thù.",
      "Chi phí thuê bao phần mềm hàng tháng quá cao khi số lượng người dùng tăng lên.",
    ],
    solution:
      "Nguyên Agency phân tích sâu quy trình làm việc thực tế của doanh nghiệp để xây dựng ứng dụng web với luồng tính năng tinh gọn, chính xác. Chúng tôi áp dụng kiến trúc hiện đại (Next.js, Node.js, PostgreSQL/Supabase), thiết lập cơ chế phân quyền tài khoản chặt chẽ theo từng vị trí (nhân viên, quản lý, ban giám đốc). Ứng dụng web được tối ưu hóa giao diện thân thiện, dễ học, tích hợp dashboard thống kê biểu đồ trực quan và bảo mật dữ liệu theo các tiêu chuẩn mã hóa tiên tiến.",
    process: [
      { step: "01", name: "Khảo sát nghiệp vụ", desc: "Lắng nghe bài toán vận hành, luồng xử lý công việc và báo cáo cần có." },
      { step: "02", name: "Đặc tả yêu cầu", desc: "Xây dựng tài liệu mô tả chi tiết chức năng và thiết kế luồng dữ liệu." },
      { step: "03", name: "Thiết kế UI/UX", desc: "Mô phỏng giao diện các màn hình thao tác phù hợp người sử dụng." },
      { step: "04", name: "Lập trình hệ thống", desc: "Phát triển frontend, backend, phân quyền và kết nối database." },
      { step: "05", name: "Kiểm thử UAT", desc: "Doanh nghiệp trực tiếp thử nghiệm nhập liệu thực tế và nghiệm thu." },
      { step: "06", name: "Triển khai & bàn giao", desc: "Cài đặt lên máy chủ sản xuất, đào tạo nhân sự và bàn giao mã nguồn." },
    ],
    deliverables: [
      "Ứng dụng web hoàn chỉnh vận hành ổn định trên đám mây",
      "Toàn bộ mã nguồn phát triển và cơ sở dữ liệu thuộc quyền sở hữu doanh nghiệp",
      "Tài liệu hướng dẫn thao tác chi tiết theo từng vai trò phân quyền",
      "Chính sách bảo hành, vá lỗi và hỗ trợ kỹ thuật định kỳ",
    ],
    targetAudience: [
      "Doanh nghiệp dịch vụ, vận tải, kho bãi cần quản lý đơn hàng nội bộ",
      "Các tổ chức cần cổng thông tin kết nối đại lý, đối tác hoặc học viên",
      "Các công ty khởi nghiệp (Startups) cần phát triển sản phẩm phần mềm SaaS",
    ],
    faqs: [
      {
        question: "Ứng dụng web có sử dụng được trên điện thoại không?",
        answer: "Có. Giao diện được thiết kế tương thích hoàn toàn trên trình duyệt điện thoại và máy tính bảng, nhân sự có thể xử lý công việc di động dễ dàng.",
      },
      {
        question: "Doanh nghiệp có phải trả phí bản quyền người dùng hàng tháng không?",
        answer: "Không. Đây là phần mềm may đo chuyển giao 100% mã nguồn, bạn không phải trả chi phí thuê bao tính trên đầu người dùng.",
      },
      {
        question: "Dữ liệu kinh doanh của công ty được bảo mật như thế nào?",
        answer: "Dữ liệu được lưu trữ trên máy chủ hoặc cơ sở dữ liệu riêng của doanh nghiệp bạn, có mã hóa đường truyền và sao lưu tự động.",
      },
      {
        question: "Sau này có thể nâng cấp thêm tính năng mới không?",
        answer: "Kiến trúc mã nguồn được viết theo chuẩn Clean Code dạng module, rất thuận lợi để mở rộng thêm các tính năng mới khi quy mô công ty phát triển.",
      },
    ],
    relatedSlugs: ["management-software", "custom-software", "crm-system", "ai-integration"],
    thumbnail: "https://ftwfwhxfbrqnrwmjrmrq.supabase.co/storage/v1/object/public/nguyen-agency-media/services/1794467754197-dbd3c83d-21bb-4353-9692-d55a568fa981.png",
    coverImage: "https://ftwfwhxfbrqnrwmjrmrq.supabase.co/storage/v1/object/public/nguyen-agency-media/services/1794467754197-dbd3c83d-21bb-4353-9692-d55a568fa981.png",
  },

  // -------------------------------------------------------------
  // 10. Poster Design
  // -------------------------------------------------------------
  {
    id: "srv-10",
    order: 10,
    title: "Poster Design",
    titleVn: "Thiết Kế Poster Quảng Cáo",
    slug: "poster-design",
    group: "MEDIA",
    categoryName: "Branding & Visual",
    shortDesc:
      "Thiết kế poster cho khai trương, sự kiện, tuyển sinh, giới thiệu sản phẩm và chương trình ưu đãi, tập trung vào tiêu đề, hình ảnh và thông tin quan trọng.",
    seoTitle: "Thiết Kế Poster Quảng Cáo & Sự Kiện | Nguyên Agency",
    metaDescription:
      "Dịch vụ thiết kế poster khai trương, sự kiện, giới thiệu sản phẩm và chương trình ưu đãi với bố cục thị giác ấn tượng tại Nguyên Agency.",
    primaryKeyword: "thiết kế poster quảng cáo",
    proposedItems: [
      "Poster ấn phẩm số đăng tải online hoặc poster khổ in ấn",
      "Bố cục theo chuẩn kích thước khổ giấy (A4, A3, A2, A0, standee)",
      "File bàn giao đầy đủ cho nhà in hoặc truyền thông mạng xã hội",
    ],
    intro:
      "Poster là công cụ truyền thông thị giác truyền thống nhưng chưa bao giờ giảm đi sức mạnh trong việc thu hút sự chú ý tại các điểm bán, hội nghị, sự kiện và không gian công cộng. Một tấm poster xuất sắc phải tạo được tác động thị giác mạnh mẽ ngay từ xa, dẫn dắt ánh nhìn vào tiêu đề chính và cung cấp thông tin thời gian, địa điểm, thể lệ rõ ràng, không gây rối mắt. Rất nhiều sự kiện tại Quảng Ngãi và các địa phương gặp tình trạng poster thiết kế dàn trải, màu sắc u tối hoặc chữ quá nhỏ khiến người qua đường không thể nắm bắt thông tin. Dịch vụ thiết kế poster của Nguyên Agency mang đến những tác phẩm thị giác ấn tượng, bố cục chặt chẽ và truyền tải thông điệp một cách sắc sảo.",
    clientProblems: [
      "Poster quá nhiều chữ, bố cục lộn xộn khiến người xem bỏ qua thông điệp chính.",
      "Hình ảnh chụp bị mờ nhạt, vỡ nét khi in ra kích thước lớn như khổ A1, A0.",
      "Màu sắc khi in ra thực tế bị sai lệch, xỉn màu so với màn hình máy tính.",
      "Thiết kế thiếu tính sáng tạo, không tạo được cảm xúc hào hứng cho sự kiện.",
    ],
    solution:
      "Nguyên Agency bắt đầu thiết kế poster từ việc chắt lọc tiêu đề thông điệp cốt lõi và xác định điểm nhấn thị giác lớn nhất (Key Visual). Chúng tôi ứng dụng các thủ pháp nghệ thuật đồ họa: độ tương phản cao, xử lý màu sắc có chiều sâu và sắp xếp cấp bậc văn bản rõ ràng để người xem có thể đọc được thông tin quan trọng chỉ trong 3 giây. Mọi file in ấn đều được xử lý kỹ thuật chuẩn xác theo hệ màu CMYK và độ phân giải cao nhất.",
    process: [
      { step: "01", name: "Nắm bắt sự kiện", desc: "Tìm hiểu thông điệp, thời gian, địa điểm và đối tượng tham gia." },
      { step: "02", name: "Chắt lọc nội dung", desc: "Tối giản câu chữ, xác định tiêu đề lớn và thông tin phụ trợ." },
      { step: "03", name: "Sáng tạo Key Visual", desc: "Xử lý hình ảnh chủ đạo và phong cách nghệ thuật ấn tượng." },
      { step: "04", name: "Bố cục hoàn thiện", desc: "Sắp xếp thông tin nhà tài trợ, thời gian, hotline và mã QR liên hệ." },
      { step: "05", name: "Hiệu đính & phản hồi", desc: "Kiểm tra lỗi chính tả, ngày giờ và tiếp thu chỉnh sửa." },
      { step: "06", name: "Xuất file in ấn", desc: "Xuất file in ấn chất lượng cao và file nén đăng online." },
    ],
    deliverables: [
      "File PDF chất lượng cao có bù xén lề sẵn sàng cho nhà in công nghiệp",
      "File ảnh JPG/PNG sắc nét dùng để đăng tải truyền thông trên mạng xã hội",
      "File thiết kế gốc theo phạm vi hợp đồng thỏa thuận",
    ],
    targetAudience: [
      "Doanh nghiệp tổ chức lễ khai trương, hội nghị khách hàng, kỷ niệm thành lập",
      "Cơ sở giáo dục, trung tâm đào tạo, sự kiện âm nhạc, văn hóa",
      "Nhà hàng, quán ăn, showroom tổ chức chương trình ưu đãi tri ân",
    ],
    faqs: [
      {
        question: "Tôi có thể yêu cầu thiết kế poster theo khổ đứng hay khổ ngang?",
        answer: "Hoàn toàn được. Chúng tôi thiết kế linh hoạt theo khổ đứng (Poster truyền thống, Standee) hoặc khổ ngang (Backdrop sân khấu, Banner màn hình LED) theo nhu cầu của bạn.",
      },
      {
        question: "File poster có in được kích thước lớn trên bạt hiflex hoặc decal không?",
        answer: "File được xuất chuẩn in ấn chuyên nghiệp, đảm bảo độ sắc nét khi in ấn trên các chất liệu bạt hiflex, decal PP, fomex hay giấy ảnh.",
      },
      {
        question: "Nếu có sự thay đổi về thời gian hoặc địa điểm sự kiện thì có được sửa không?",
        answer: "Chúng tôi luôn hỗ trợ cập nhật lại các thông số thời gian, địa điểm kịp thời trước khi bạn tiến hành in ấn chính thức.",
      },
      {
        question: "Thời gian thiết kế một tấm poster là bao lâu?",
        answer: "Thông thường từ 1 đến 2 ngày làm việc sau khi tiếp nhận đầy đủ thông tin sự kiện.",
      },
    ],
    relatedSlugs: ["graphic-design", "banner-design", "advertising-creative", "video-production"],
    thumbnail: "https://ftwfwhxfbrqnrwmjrmrq.supabase.co/storage/v1/object/public/nguyen-agency-media/services/1794467813811-51c949af-1aa3-4e50-b33a-51d11e88f134.png",
    coverImage: "https://ftwfwhxfbrqnrwmjrmrq.supabase.co/storage/v1/object/public/nguyen-agency-media/services/1794467813811-51c949af-1aa3-4e50-b33a-51d11e88f134.png",
  },

  // -------------------------------------------------------------
  // 11. Mobile Application
  // -------------------------------------------------------------
  {
    id: "srv-11",
    order: 11,
    title: "Mobile Application",
    titleVn: "Thiết Kế Ứng Dụng Di Động",
    slug: "mobile-application",
    group: "TECH",
    categoryName: "Web & Software",
    shortDesc:
      "Thiết kế và phát triển ứng dụng trên điện thoại phục vụ khách hàng hoặc vận hành nội bộ, chú trọng thao tác thuận tiện và trải nghiệm trên màn hình nhỏ.",
    seoTitle: "Thiết Kế Ứng Dụng Di Động iOS & Android | Nguyên Agency",
    metaDescription:
      "Phát triển ứng dụng di động cho khách hàng và vận hành nội bộ, tối ưu trải nghiệm chạm vuốt và hiệu năng ổn định tại Nguyên Agency.",
    primaryKeyword: "thiết kế ứng dụng di động",
    proposedItems: [
      "Giao diện ứng dụng di động tối ưu trải nghiệm người dùng",
      "Tính năng phát triển theo yêu cầu cụ thể của doanh nghiệp",
      "Quy trình kiểm thử chất lượng và tương thích thiết bị",
      "Tài liệu hướng dẫn vận hành và hỗ trợ đưa lên kho ứng dụng",
    ],
    intro:
      "Chiếc điện thoại thông minh hiện là vật bất ly thân của hầu hết người tiêu dùng. Sở hữu một ứng dụng di động (Mobile App) mang thương hiệu riêng mang lại lợi thế cạnh tranh vượt trội: khả năng gửi thông báo đẩy (Push Notification) miễn phí trực tiếp đến màn hình khách hàng, chương trình tích điểm khách hàng thân thiết và trải nghiệm thao tác mượt mà không cần mở trình duyệt. Đối với doanh nghiệp, app nội bộ giúp nhân viên hiện trường, shipper hay kỹ thuật viên cập nhật tiến độ công việc ngay tại điểm phục vụ. Dịch vụ phát triển ứng dụng di động của Nguyên Agency chú trọng vào hiệu năng ổn định, giao diện thân thiện và chi phí phát triển hợp lý.",
    clientProblems: [
      "Khó khăn trong việc giữ chân khách hàng cũ quay lại mua sắm thường xuyên.",
      "Gửi tin nhắn SMS quảng cáo chi phí cao nhưng tỷ lệ người xem ngày càng giảm.",
      "Quy trình giao việc cho nhân viên ngoài hiện trường chưa được số hóa tức thời.",
      "Chi phí xây dựng ứng dụng di động tại các công ty lớn quá đắt đỏ và phức tạp.",
    ],
    solution:
      "Nguyên Agency ứng dụng các công nghệ đa nền tảng hiện đại (React Native, Flutter) giúp doanh nghiệp sở hữu ứng dụng chạy mượt mà trên cả hai hệ điều hành iOS (App Store) và Android (Google Play) với một ngân sách tiết kiệm và thời gian nhanh hơn. Chúng tôi thiết kế giao diện theo thói quen ngón tay cái, tối giản số bước thao tác, tối ưu dung lượng tải nhẹ và đảm bảo tính năng đồng bộ dữ liệu thời gian thực với hệ thống máy chủ trung tâm.",
    process: [
      { step: "01", name: "Khảo sát tính năng", desc: "Xác định tập tính năng cốt lõi cho phiên bản ứng dụng (MVP)." },
      { step: "02", name: "Thiết kế UI/UX App", desc: "Thiết kế giao diện từng màn hình và sơ đồ luồng chạm vuốt." },
      { step: "03", name: "Lập trình ứng dụng", desc: "Viết mã nguồn client di động và hệ thống API kết nối backend." },
      { step: "04", name: "Kiểm thử thiết bị", desc: "Test ứng dụng trên nhiều dòng máy iPhone, Samsung, Xiaomi..." },
      { step: "05", name: "Hỗ trợ phát hành", desc: "Chuẩn bị hồ sơ và hỗ trợ đưa ứng dụng lên App Store / Google Play." },
      { step: "06", name: "Bảo hành & nâng cấp", desc: "Theo dõi phản hồi người dùng, sửa lỗi và cập nhật định kỳ." },
    ],
    deliverables: [
      "Bản cài đặt ứng dụng cho hai nền tảng iOS và Android",
      "Toàn bộ mã nguồn phát triển và tài liệu kiến trúc kỹ thuật",
      "Cổng quản trị nội dung và quản lý người dùng ứng dụng",
      "Hỗ trợ quy trình chuẩn bị đưa lên App Store và CH Play",
    ],
    targetAudience: [
      "Doanh nghiệp bán lẻ, chuỗi nhà hàng, spa cần app tích điểm và chăm sóc khách hàng",
      "Công ty dịch vụ vận tải, giao hàng, bảo trì cần app quản lý đội ngũ hiện trường",
      "Các dự án giáo dục, mạng xã hội nội bộ hoặc dịch vụ cộng đồng",
    ],
    faqs: [
      {
        question: "Ứng dụng có chạy được trên cả iPhone và điện thoại Android không?",
        answer: "Có. Chúng tôi phát triển ứng dụng đa nền tảng tương thích tốt trên cả hệ điều hành iOS và Android.",
      },
      {
        question: "Tôi có thể gửi thông báo (Push Notification) cho người dùng không?",
        answer: "Có. Tính năng thông báo đẩy cho phép bạn gửi tin tức khuyến mãi, cập nhật trạng thái đơn hàng trực tiếp đến màn hình khóa của khách hàng miễn phí.",
      },
      {
        question: "Quy trình đưa app lên App Store và Google Play có phức tạp không?",
        answer: "Nguyên Agency sẽ hướng dẫn và đồng hành hỗ trợ doanh nghiệp chuẩn bị tài khoản nhà phát triển và đáp ứng các tiêu chuẩn duyệt app của Apple và Google.",
      },
      {
        question: "Thời gian phát triển một ứng dụng di động mất bao lâu?",
        answer: "Tùy thuộc vào độ phức tạp, phiên bản tiêu chuẩn thường hoàn thiện từ 4 đến 8 tuần làm việc.",
      },
    ],
    relatedSlugs: ["web-application", "e-commerce-website", "crm-system", "ui-ux-design"],
    thumbnail: "https://ftwfwhxfbrqnrwmjrmrq.supabase.co/storage/v1/object/public/nguyen-agency-media/services/1794468208862-80e4e7a6-5a30-4b9c-8b12-5a9ec469eb17.png",
    coverImage: "https://ftwfwhxfbrqnrwmjrmrq.supabase.co/storage/v1/object/public/nguyen-agency-media/services/1794468208862-80e4e7a6-5a30-4b9c-8b12-5a9ec469eb17.png",
  },

  // -------------------------------------------------------------
  // 12. Menu Design
  // -------------------------------------------------------------
  {
    id: "srv-12",
    order: 12,
    title: "Menu Design",
    titleVn: "Thiết Kế Menu Nhà Hàng Quán Cafe",
    slug: "menu-design",
    group: "MEDIA",
    categoryName: "Branding & Visual",
    shortDesc:
      "Thiết kế menu cho nhà hàng, quán cà phê và cơ sở F&B, giúp khách dễ xem món, mức giá và lựa chọn sản phẩm phù hợp.",
    seoTitle: "Thiết Kế Menu Nhà Hàng Quán Cafe Đẹp | Nguyên Agency",
    metaDescription:
      "Dịch vụ thiết kế menu in và menu số cho nhà hàng, quán cafe, spa và cơ sở F&B với bố cục khoa học, kích thích gọi món tại Nguyên Agency.",
    primaryKeyword: "thiết kế menu nhà hàng quán cafe",
    proposedItems: [
      "Menu bản in ấn (dạng cuốn, dạng tờ gấp, dạng bảng ép lá) hoặc menu số",
      "Bố cục danh mục món ăn, thức uống khoa học và giá cả rõ ràng",
      "File xuất chất lượng cao phục vụ in ấn hoặc quét mã QR gọi món",
    ],
    intro:
      "Trong ngành ẩm thực và đồ uống (F&B), thực đơn (Menu) không chỉ đơn thuần là bảng báo giá món ăn mà là nhân viên bán hàng thầm lặng có ảnh hưởng trực tiếp đến doanh thu và trải nghiệm của thực khách. Một cuốn menu được thiết kế chuyên nghiệp, hình ảnh chân thực, phân cấp danh mục món hợp lý và làm nổi bật các món 'Signature' (món đặc trưng) sẽ kích thích cảm giác thèm ăn và thúc đẩy khách hàng chi tiêu nhiều hơn. Rất nhiều cơ sở kinh doanh F&B tại Quảng Ngãi và các tỉnh thành thường gặp tình trạng menu rối rắm, font chữ khó đọc trong không gian ánh sáng mờ hoặc không có file chuẩn để làm menu điện tử quét mã QR. Dịch vụ thiết kế menu của Nguyên Agency mang đến giải pháp bố cục khoa học, sang trọng và chuẩn xác.",
    clientProblems: [
      "Khách hàng mất nhiều thời gian tìm món do bố cục menu thiếu phân cấp khoa học.",
      "Hình ảnh món ăn chụp thiếu sáng, không tạo được cảm giác ngon miệng và hấp dẫn.",
      "Chất lượng file in kém dẫn đến màu sắc món ăn bị xỉn màu khi in trên chất liệu thực tế.",
      "Không có phiên bản menu số để thực khách quét mã QR xem trên điện thoại bàn.",
    ],
    solution:
      "Nguyên Agency thiết kế thực đơn dựa trên nguyên lý tâm lý học thị giác trong ngành F&B (Golden Triangle Menu Engineering): khéo léo định hướng ánh nhìn của thực khách vào những món ăn có tỷ suất lợi nhuận cao nhất hoặc món đặc sản của quán. Chúng tôi xử lý hình ảnh món ăn sắc nét, lựa chọn font chữ thanh thoát dễ đọc dưới mọi điều kiện ánh sáng và sắp xếp giá tiền tinh tế. Khách hàng nhận được cả file in ấn độ phân giải cao và file tối ưu hóa cho menu quét mã QR trực tuyến.",
    process: [
      { step: "01", name: "Rà soát danh mục", desc: "Tổng hợp danh sách món ăn, nhóm danh mục, định lượng và mức giá." },
      { step: "02", name: "Định hướng phong cách", desc: "Lựa chọn phong cách thiết kế phù hợp không gian quán (vintage, hiện đại, tối giản)." },
      { step: "03", name: "Xử lý hình ảnh món", desc: "Cắt lọc, cân chỉnh màu sắc hình ảnh món ăn ngon mắt và chân thực." },
      { step: "04", name: "Bố cục thực đơn", desc: "Sắp xếp cấp bậc danh mục, mô tả thành phần và giá tiền rõ ràng." },
      { step: "05", name: "Hiệu đính chi tiết", desc: "Kiểm tra kỹ lưỡng tên món, mức giá và chính tả trước khi xuất file." },
      { step: "06", name: "Xuất file thành phẩm", desc: "Bàn giao file chuẩn in ấn xưởng và file menu QR xem trên điện thoại." },
    ],
    deliverables: [
      "File PDF chuẩn in ấn chất lượng cao có bù tràn lề và hệ màu CMYK",
      "File hình ảnh hoặc link trang web menu số phục vụ quét mã QR tại bàn",
      "File thiết kế gốc theo phạm vi hợp đồng thỏa thuận",
    ],
    targetAudience: [
      "Nhà hàng, quán cafe, trà sữa, quán ăn gia đình, quán nhậu",
      "Các cơ sở làm đẹp, Spa, Nails, dịch vụ chăm sóc sức khỏe có bảng giá liệu trình",
      "Khách sạn, homestay, resort có dịch vụ ẩm thực tại phòng",
    ],
    faqs: [
      {
        question: "Tôi có thể in menu dạng cuốn hay dạng bảng cứng cầm tay?",
        answer: "Chúng tôi thiết kế linh hoạt theo mọi hình thức đóng cuốn: menu gấp 3, menu dạng bảng mica, menu bìa bồi da hay menu dạng cuốn nhiều trang.",
      },
      {
        question: "Nếu sau này quán điều chỉnh giá hoặc thêm món mới thì làm thế nào?",
        answer: "Nguyên Agency lưu trữ file thiết kế và luôn hỗ trợ bạn cập nhật nhanh các món mới hoặc thay đổi giá tiền với chi phí hỗ trợ hợp lý.",
      },
      {
        question: "Quán có được hỗ trợ làm mã QR để khách quét xem menu không?",
        answer: "Có. Chúng tôi hỗ trợ tạo mã QR đẹp mắt kết nối trực tiếp đến bản menu số để bạn in đặt tại từng bàn ăn.",
      },
      {
        question: "Thời gian hoàn thành một mẫu thiết kế menu là bao lâu?",
        answer: "Thông thường từ 2 đến 4 ngày làm việc đối với menu bảng đơn và từ 4 đến 7 ngày đối với menu cuốn nhiều trang.",
      },
    ],
    relatedSlugs: ["graphic-design", "branding-identity", "logo-design", "poster-design"],
    thumbnail: "https://ftwfwhxfbrqnrwmjrmrq.supabase.co/storage/v1/object/public/nguyen-agency-media/services/1794467704664-dc092ebb-c75f-421e-88af-42549e2b3a1f.png",
    coverImage: "https://ftwfwhxfbrqnrwmjrmrq.supabase.co/storage/v1/object/public/nguyen-agency-media/services/1794467704664-dc092ebb-c75f-421e-88af-42549e2b3a1f.png",
  },

  // -------------------------------------------------------------
  // 13. CRM System
  // -------------------------------------------------------------
  {
    id: "srv-13",
    order: 13,
    title: "CRM System",
    titleVn: "Phần Mềm Quản Lý Khách Hàng CRM",
    slug: "crm-system",
    group: "TECH",
    categoryName: "Web & Software",
    shortDesc:
      "Xây dựng hệ thống lưu trữ thông tin khách hàng, theo dõi cơ hội bán hàng, lịch sử tương tác và công việc chăm sóc theo quy trình doanh nghiệp.",
    seoTitle: "Phần Mềm Quản Lý Khách Hàng CRM | Nguyên Agency",
    metaDescription:
      "Xây dựng hệ thống CRM quản lý hồ sơ khách hàng, theo dõi pipeline bán hàng, lịch sử tương tác và báo cáo hiệu suất tại Nguyên Agency.",
    primaryKeyword: "phần mềm quản lý khách hàng CRM",
    proposedItems: [
      "Quản lý tập trung hồ sơ khách hàng và thông tin liên hệ",
      "Quy trình theo dõi cơ hội bán hàng theo phễu (Pipeline Sales)",
      "Phân quyền nhân viên và lưu vết lịch sử tương tác chăm sóc",
      "Báo cáo thống kê doanh số và tỷ lệ chuyển đổi trực quan",
    ],
    intro:
      "Dữ liệu khách hàng là tài sản quý giá nhất của mọi tổ chức kinh doanh. Tuy nhiên, ở nhiều doanh nghiệp, danh sách khách hàng vẫn nằm rải rác trong sổ tay nhân viên kinh doanh, các file Excel cá nhân hoặc các cuộc trò chuyện Zalo không được kiểm soát. Khi nhân sự nghỉ việc, doanh nghiệp đối mặt nguy cơ mất trắng dữ liệu và lịch sử giao dịch với khách hàng. Một hệ thống quản lý quan hệ khách hàng (CRM) chuyên nghiệp giúp tập trung toàn bộ dữ liệu vào một nơi duy nhất, tự động hóa quy trình phân bổ lead, nhắc nhở lịch hẹn và đánh giá chính xác hiệu suất của từng nhân viên kinh doanh. Dịch vụ xây dựng CRM của Nguyên Agency mang đến giải pháp phần mềm may đo theo đúng quy trình bán hàng của bạn.",
    clientProblems: [
      "Dữ liệu khách hàng phân tán, dễ bị thất thoát khi nhân viên kinh doanh đổi việc.",
      "Quên lịch chăm sóc lại khách hàng tiềm năng, dẫn đến việc mất cơ hội chốt đơn.",
      "Không nắm được doanh số dự kiến trong tương lai do thiếu biểu đồ phễu bán hàng.",
      "Khó khăn trong việc đánh giá nhân viên nào làm việc hiệu quả, tỷ lệ chốt đơn ra sao.",
    ],
    solution:
      "Nguyên Agency xây dựng hệ thống CRM tập trung vào sự đơn giản và tiện dụng để nhân viên sẵn sàng sử dụng hàng ngày mà không cảm thấy phiền toái. Hệ thống cho phép nhập liệu nhanh, quản lý danh sách liên hệ theo thẻ phân loại, kéo thả cơ hội bán hàng trên bảng Kanban trực quan và lưu trữ toàn bộ lịch sử cuộc gọi, tin nhắn hay hợp đồng đã ký. Ban giám đốc được cung cấp bảng dashboard thống kê theo thời gian thực về số lượng khách mới, doanh số và tỷ lệ chuyển đổi của từng phòng ban.",
    process: [
      { step: "01", name: "Khảo sát phễu bán hàng", desc: "Tìm hiểu quy trình từ tiếp cận, tư vấn, báo giá đến chốt hợp đồng." },
      { step: "02", name: "Thiết kế trường dữ liệu", desc: "Quy chuẩn các thông tin cần thu thập và quản lý cho từng khách hàng." },
      { step: "03", name: "Lập trình hệ thống CRM", desc: "Phát triển tính năng phễu Pipeline, lịch sử chăm sóc và báo cáo." },
      { step: "04", name: "Cấu hình phân quyền", desc: "Thiết lập quyền xem dữ liệu của nhân viên, trưởng nhóm và giám đốc." },
      { step: "05", name: "Đào tạo & nhập thử", desc: "Đưa dữ liệu mẫu vào thử nghiệm và hướng dẫn đội ngũ thao tác." },
      { step: "06", name: "Bàn giao & hỗ trợ", desc: "Bàn giao hệ thống, cấp tài khoản và đồng hành hỗ trợ vận hành." },
    ],
    deliverables: [
      "Hệ thống phần mềm CRM hoạt động trực tuyến trên máy tính và điện thoại",
      "Toàn bộ mã nguồn và cơ sở dữ liệu riêng biệt không chia sẻ chung máy chủ",
      "Tài liệu hướng dẫn sử dụng cho nhân viên kinh doanh và người quản lý",
      "Chính sách bảo hành và hỗ trợ kỹ thuật xử lý sự cố",
    ],
    targetAudience: [
      "Doanh nghiệp dịch vụ B2B, xây dựng, bất động sản, tài chính, bảo hiểm",
      "Các đơn vị có đội ngũ bán hàng từ 5 đến 50 nhân viên cần quản lý tập trung",
      "Doanh nghiệp muốn số hóa toàn bộ khâu chăm sóc khách hàng và bán lại (Upsell)",
    ],
    faqs: [
      {
        question: "Nhân viên kinh doanh có thể xem trộm danh sách khách của nhau không?",
        answer: "Hệ thống có tính năng phân quyền chặt chẽ: nhân viên chỉ xem được khách hàng do mình phụ trách, chỉ có trưởng phòng hoặc giám đốc mới có quyền xem toàn bộ dữ liệu.",
      },
      {
        question: "CRM có nhập được danh sách khách cũ từ file Excel vào không?",
        answer: "Có. Chúng tôi hỗ trợ công cụ Import/Export dữ liệu từ file Excel vào hệ thống chỉ với một vài thao tác đơn giản.",
      },
      {
        question: "Tôi có phải trả phí duy trì hàng tháng cho từng tài khoản nhân viên không?",
        answer: "Không. Đây là phần mềm may đo sở hữu độc lập, doanh nghiệp không bị giới hạn số lượng tài khoản nhân sự sử dụng.",
      },
      {
        question: "Hệ thống có thông báo nhắc nhở lịch hẹn với khách hàng không?",
        answer: "Có. CRM có tính năng nhắc nhở công việc và có thể tích hợp thông báo về Email hoặc ứng dụng Telegram của nhân viên.",
      },
    ],
    relatedSlugs: ["management-software", "custom-software", "web-application", "ai-integration"],
    thumbnail: "https://ftwfwhxfbrqnrwmjrmrq.supabase.co/storage/v1/object/public/nguyen-agency-media/services/1794468349964-3576a0e2-23c8-4b65-9ce0-c5b77b2e7a6d.png",
    coverImage: "https://ftwfwhxfbrqnrwmjrmrq.supabase.co/storage/v1/object/public/nguyen-agency-media/services/1794468349964-3576a0e2-23c8-4b65-9ce0-c5b77b2e7a6d.png",
  },

  // -------------------------------------------------------------
  // 14. Social Media Design
  // -------------------------------------------------------------
  {
    id: "srv-14",
    order: 14,
    title: "Social Media Design",
    titleVn: "Thiết Kế Hình Ảnh Mạng Xã Hội",
    slug: "social-media-design",
    group: "MEDIA",
    categoryName: "Branding & Visual",
    shortDesc:
      "Thiết kế bộ hình ảnh nhất quán cho Facebook, TikTok và các kênh truyền thông, giúp nội dung thương hiệu dễ nhận diện trong từng bài đăng.",
    seoTitle: "Thiết Kế Hình Ảnh Mạng Xã Hội Đa Kênh | Nguyên Agency",
    metaDescription:
      "Thiết kế mẫu bài đăng, ảnh bìa và template chiến dịch cho Facebook, TikTok đồng bộ nhận diện thương hiệu tại Nguyên Agency.",
    primaryKeyword: "thiết kế hình ảnh mạng xã hội",
    proposedItems: [
      "Mẫu khung bài đăng (Post Template) đồng bộ phong cách",
      "Bộ ảnh đại diện (Avatar) và ảnh bìa (Cover) chuẩn kích thước",
      "Bộ template hình ảnh theo chủ đề chiến dịch định kỳ",
      "Bộ kích thước chuẩn cho các định dạng bài đơn, album, story",
    ],
    intro:
      "Mạng xã hội như Facebook, TikTok hay Zalo là mặt tiền số nơi khách hàng tiếp xúc hàng ngày với thương hiệu của bạn. Một Fanpage với hình ảnh chắp vá, màu sắc lộn xộn và không theo một quy chuẩn nào sẽ làm giảm đi đáng kể giá trị cảm nhận về sản phẩm, dịch vụ. Ngược lại, một trang mạng xã hội có hệ thống nhận diện đồng bộ, màu sắc sang trọng và hình ảnh được trau chuốt kỹ lưỡng sẽ lập tức tạo dựng được niềm tin và sự chuyên nghiệp trong mắt người tiêu dùng. Dịch vụ thiết kế hình ảnh mạng xã hội của Nguyên Agency giúp bạn xây dựng bộ nhận diện Fanpage chuẩn mực, nhất quán và thu hút tương tác tự nhiên.",
    clientProblems: [
      "Trang mạng xã hội thiếu tính nhận diện, bài đăng rời rạc không mang bản sắc riêng.",
      "Hình ảnh đăng lên bị vỡ nét, chữ bị cắt góc do sai kích thước hiển thị của nền tảng.",
      "Tốn quá nhiều thời gian mỗi ngày để suy nghĩ cách làm hình ảnh cho từng bài đăng.",
      "Tỷ lệ tương tác và theo dõi trang thấp do hình ảnh chưa đủ bắt mắt.",
    ],
    solution:
      "Nguyên Agency xây dựng bộ quy chuẩn hình ảnh mạng xã hội (Social Media Template Kit) hoàn chỉnh cho doanh nghiệp bạn. Chúng tôi thiết kế hệ thống khung mẫu (Template) cho từng dạng bài: bài chia sẻ kiến thức, bài giới thiệu sản phẩm, bài thông báo ưu đãi và bài phản hồi của khách hàng. Mọi thiết kế đều được tính toán chuẩn xác theo kích thước hiển thị mới nhất của Facebook và TikTok, giúp Fanpage của bạn luôn chỉn chu, đồng bộ và nổi bật trên bảng tin của người dùng.",
    process: [
      { step: "01", name: "Khảo sát kênh mạng xã hội", desc: "Tìm hiểu định hướng nội dung và tông màu chủ đạo của thương hiệu." },
      { step: "02", name: "Định hình phong cách", desc: "Xây dựng ngôn ngữ thị giác: font chữ, khung viền, vị trí đặt logo." },
      { step: "03", name: "Thiết kế bộ Cover & Avatar", desc: "Tạo hình ảnh đại diện và ảnh bìa chuyên nghiệp chuẩn tỉ lệ." },
      { step: "04", name: "Thiết kế hệ thống Template", desc: "Thiết kế các mẫu khung bài đăng theo từng chủ đề nội dung." },
      { step: "05", name: "Đóng gói & hướng dẫn", desc: "Bàn giao bộ ảnh hoàn chỉnh và hướng dẫn đội ngũ tự chèn nội dung." },
      { step: "06", name: "Hỗ trợ định kỳ", desc: "Cung cấp các mẫu thiết kế bổ sung theo mùa lễ tết hoặc sự kiện." },
    ],
    deliverables: [
      "Bộ ảnh đại diện và ảnh bìa chuẩn kích thước cho Facebook, Zalo, TikTok",
      "Bộ khung mẫu bài đăng (dạng bài đơn 1:1, dạng album, dạng story 9:16)",
      "File mẫu dễ dàng thay thế hình ảnh và câu chữ cho đội ngũ nội bộ",
      "Hướng dẫn quy cách xuất ảnh sắc nét không bị giảm chất lượng trên Facebook",
    ],
    targetAudience: [
      "Các nhãn hàng, thương hiệu đang vận hành Fanpage Facebook và kênh TikTok",
      "Cơ sở kinh doanh bán lẻ, thẩm mỹ, thời trang cần làm mới diện mạo trang cá nhân/fanpage",
      "Doanh nghiệp chuẩn bị triển khai chiến dịch truyền thông đa kênh",
    ],
    faqs: [
      {
        question: "Hình ảnh có bị vỡ nét khi tải lên Facebook không?",
        answer: "Chúng tôi xuất file theo chuẩn tỷ lệ pixel và thông số nén tối ưu của Facebook, đảm bảo hình ảnh hiển thị sắc nét nhất trên cả máy tính và điện thoại.",
      },
      {
        question: "Tôi có thể tự chỉnh sửa chữ trên các mẫu template được không?",
        answer: "Có. Chúng tôi có thể cung cấp các mẫu khung hoặc file làm sẵn trên phần mềm chuyên dụng/Canva để nhân sự của bạn thuận tiện thay đổi nội dung bài đăng.",
      },
      {
        question: "Gói dịch vụ gồm bao nhiêu mẫu thiết kế?",
        answer: "Số lượng mẫu tùy thuộc vào gói dịch vụ bạn lựa chọn, từ bộ cơ bản (Avatar, Cover, 3-5 mẫu post) đến bộ toàn diện cho chiến dịch dài hạn.",
      },
      {
        question: "Thời gian hoàn thiện bộ thiết kế mạng xã hội là bao lâu?",
        answer: "Thông thường từ 3 đến 5 ngày làm việc để hoàn thiện trọn bộ nhận diện kênh.",
      },
    ],
    relatedSlugs: ["graphic-design", "banner-design", "content-creation", "advertising-creative"],
    thumbnail: "https://ftwfwhxfbrqnrwmjrmrq.supabase.co/storage/v1/object/public/nguyen-agency-media/services/1794468278981-2ca3eac1-8d72-4e96-af72-f32bd655c67b.png",
    coverImage: "https://ftwfwhxfbrqnrwmjrmrq.supabase.co/storage/v1/object/public/nguyen-agency-media/services/1794468278981-2ca3eac1-8d72-4e96-af72-f32bd655c67b.png",
  },

  // -------------------------------------------------------------
  // 15. Management Software
  // -------------------------------------------------------------
  {
    id: "srv-15",
    order: 15,
    title: "Management Software",
    titleVn: "Phần Mềm Quản Lý Doanh Nghiệp",
    slug: "management-software",
    group: "TECH",
    categoryName: "Web & Software",
    shortDesc:
      "Phát triển phần mềm quản lý công việc, nhân sự, đơn hàng hoặc hoạt động nội bộ theo nhu cầu, giảm thao tác thủ công và hỗ trợ theo dõi dữ liệu.",
    seoTitle: "Phần Mềm Quản Lý Doanh Nghiệp Tùy Chỉnh | Nguyên Agency",
    metaDescription:
      "Phát triển phần mềm quản lý công việc, nhân sự, đơn hàng và quy trình vận hành nội bộ theo yêu cầu doanh nghiệp tại Nguyên Agency.",
    primaryKeyword: "phần mềm quản lý doanh nghiệp",
    proposedItems: [
      "Các module chức năng may đo theo đúng quy trình nghiệp vụ",
      "Hệ thống quản lý tài khoản nhân viên và chấm công, giao việc",
      "Phân quyền bảo mật dữ liệu giữa các phòng ban nội bộ",
      "Báo cáo thống kê hiệu suất hoạt động và dữ liệu trực quan",
    ],
    intro:
      "Mỗi doanh nghiệp đều có cách thức tổ chức và văn hóa vận hành riêng biệt mà các phần mềm đóng gói sẵn trên thị trường khó lòng đáp ứng trọn vẹn. Rất nhiều nhà quản lý phải đau đầu khi mua những phần mềm cồng kềnh với chi phí đắt đỏ nhưng nhân viên chỉ sử dụng được 10% tính năng, trong khi các khâu nghiệp vụ cốt lõi vẫn phải ghi chép sổ sách thủ công. Một phần mềm quản lý nội bộ được thiết kế 'may đo' chuẩn xác theo quy trình riêng sẽ giúp tự động hóa các thao tác lặp lại, kiểm soát tiến độ công việc minh bạch và tiết kiệm hàng trăm giờ lao động mỗi tháng. Dịch vụ phát triển phần mềm quản lý của Nguyên Agency mang lại giải pháp công nghệ sát thực tế, dễ dùng và hiệu quả bền vững.",
    clientProblems: [
      "Công việc bị trễ hạn do việc bàn giao thông tin giữa các phòng ban bị tắc nghẽn.",
      "Không kiểm soát được tiến độ xử lý đơn hàng hay nhiệm vụ của từng nhân viên.",
      "Phần mềm đóng gói trên thị trường quá phức tạp, nhân viên ngại thao tác.",
      "Mất nhiều thời gian tổng hợp số liệu báo cáo thủ công mỗi cuối tuần, cuối tháng.",
    ],
    solution:
      "Nguyên Agency bắt đầu từ việc ngồi lại cùng các nhà quản lý để vẽ lại luồng công việc thực tế, loại bỏ các khâu thừa thãi và chỉ lập trình những module thực sự mang lại giá trị. Chúng tôi xây dựng phần mềm với giao diện gọn gàng, tính năng phân quyền rõ ràng cho từng phòng ban (kinh doanh, kỹ thuật, kế toán, kho). Hệ thống tự động cảnh báo khi có công việc sắp đến hạn, tạo báo cáo tổng hợp chỉ bằng một cú nhấp chuột và đảm bảo toàn quyền kiểm soát dữ liệu thuộc về doanh nghiệp bạn.",
    process: [
      { step: "01", name: "Khảo sát luồng việc", desc: "Nghiên cứu quy trình phối hợp công việc giữa các bộ phận hiện tại." },
      { step: "02", name: "Lập sơ đồ tính năng", desc: "Xác định rõ các module cần thiết (nhân sự, giao việc, duyệt đơn...)." },
      { step: "03", name: "Thiết kế giao diện", desc: "Thiết kế màn hình làm việc đơn giản, dễ nhìn và dễ thao tác." },
      { step: "04", name: "Lập trình & tích hợp", desc: "Lập trình hệ thống xử lý logic nghiệp vụ và bảo mật thông tin." },
      { step: "05", name: "Chạy thử nghiệm nội bộ", desc: "Áp dụng thử trên một nhóm nhỏ nhân sự để thu thập phản hồi." },
      { step: "06", name: "Đào tạo & bàn giao", desc: "Tổ chức hướng dẫn sử dụng cho toàn thể công ty và bàn giao hệ thống." },
    ],
    deliverables: [
      "Phần mềm quản lý vận hành trực tuyến bảo mật trên máy chủ riêng",
      "Toàn bộ mã nguồn phát triển và cấu trúc cơ sở dữ liệu",
      "Tài liệu quy trình vận hành và video hướng dẫn sử dụng cho nhân sự",
      "Cam kết bảo hành kỹ thuật và hỗ trợ bảo trì hệ thống định kỳ",
    ],
    targetAudience: [
      "Doanh nghiệp vừa và nhỏ có từ 10 đến 100 nhân sự đang vận hành thủ công",
      "Công ty thi công công trình, xưởng sản xuất, đơn vị cung ứng dịch vụ",
      "Các đơn vị có quy trình nghiệp vụ đặc thù không tìm thấy phần mềm phù hợp",
    ],
    faqs: [
      {
        question: "Phần mềm có khó sử dụng đối với nhân viên không rành công nghệ không?",
        answer: "Chúng tôi chú trọng thiết kế giao diện cực kỳ tối giản, loại bỏ thuật ngữ phức tạp để bất kỳ nhân sự nào cũng có thể làm quen chỉ sau 30 phút hướng dẫn.",
      },
      {
        question: "Doanh nghiệp có toàn quyền sở hữu phần mềm sau khi hoàn thành không?",
        answer: "Có. Chúng tôi chuyển giao 100% mã nguồn và dữ liệu, doanh nghiệp sở hữu trọn đời mà không phải trả phí thuê bao định kỳ.",
      },
      {
        question: "Phần mềm có xuất được báo cáo ra file Excel hoặc PDF không?",
        answer: "Có. Mọi danh sách, biểu mẫu và báo cáo thống kê đều có thể xuất ra file Excel hoặc in ấn PDF thuận tiện.",
      },
      {
        question: "Thời gian phát triển một phần mềm quản lý nội bộ là bao lâu?",
        answer: "Tùy thuộc vào số lượng module chức năng, thời gian thông thường từ 3 đến 6 tuần làm việc.",
      },
    ],
    relatedSlugs: ["custom-software", "web-application", "crm-system", "ai-integration"],
    thumbnail: "https://ftwfwhxfbrqnrwmjrmrq.supabase.co/storage/v1/object/public/nguyen-agency-media/services/1794468388419-6a7f1265-2cdf-4962-b548-b2347f579ce5.png",
    coverImage: "https://ftwfwhxfbrqnrwmjrmrq.supabase.co/storage/v1/object/public/nguyen-agency-media/services/1794468388419-6a7f1265-2cdf-4962-b548-b2347f579ce5.png",
  },

  // -------------------------------------------------------------
  // 16. Advertising Creative
  // -------------------------------------------------------------
  {
    id: "srv-16",
    order: 16,
    title: "Advertising Creative",
    titleVn: "Sáng Tạo Nội Dung Quảng Cáo",
    slug: "advertising-creative",
    group: "MEDIA",
    categoryName: "Branding & Visual",
    shortDesc:
      "Xây dựng ý tưởng và bộ nội dung quảng cáo theo mục tiêu chiến dịch, từ thông điệp, hình ảnh đến các phiên bản sáng tạo để thử nghiệm.",
    seoTitle: "Sáng Tạo Nội Dung Quảng Cáo Hiệu Quả | Nguyên Agency",
    metaDescription:
      "Xây dựng ý tưởng concept, thông điệp truyền thông, key visual và các biến thể nội dung quảng cáo tối ưu chuyển đổi tại Nguyên Agency.",
    primaryKeyword: "sáng tạo nội dung quảng cáo",
    proposedItems: [
      "Ý tưởng concept quảng cáo bám sát mục tiêu chiến dịch",
      "Nội dung thông điệp truyền thông (Ad Copy & Slogan)",
      "Hình ảnh chủ đạo của chiến dịch (Key Visual)",
      "Các biến thể nội dung phục vụ thử nghiệm hiệu quả (A/B Testing)",
    ],
    intro:
      "Một chiến dịch quảng cáo thành công không chỉ phụ thuộc vào kỹ thuật nhắm mục tiêu (Targeting) mà yếu tố quyết định 70% hiệu quả chính là nội dung sáng tạo (Creative). Nếu thông điệp nhàm chán và hình ảnh nhạt nhòa, người xem sẽ lập tức bỏ qua và chi phí quảng cáo của bạn sẽ đội lên rất cao. Sáng tạo nội dung quảng cáo chuyên nghiệp đòi hỏi sự thấu hiểu sâu sắc tâm lý khách hàng: họ đang đau đáu điều gì, rào cản mua hàng nằm ở đâu và thông điệp nào sẽ khơi gợi hành động nhanh nhất. Dịch vụ Advertising Creative của Nguyên Agency mang đến những ý tưởng bứt phá, kết hợp nhuần nhuyễn giữa câu từ sắc bén và hình ảnh thị giác mạnh mẽ, giúp chiến dịch của bạn đạt hiệu suất chuyển đổi cao.",
    clientProblems: [
      "Chạy quảng cáo nhiều nhưng chi phí mỗi đơn hàng quá cao do hình ảnh không đủ cuốn hút.",
      "Ý tưởng bài viết quảng cáo lặp đi lặp lại, thiếu tính mới mẻ và khác biệt.",
      "Không biết cách triển khai thử nghiệm nhiều góc nhìn thông điệp (A/B Test) khác nhau.",
      "Thông điệp quảng cáo không đánh trúng vào nỗi đau thực tế của khách hàng mục tiêu.",
    ],
    solution:
      "Nguyên Agency phân tích sâu chân dung khách hàng và các đối thủ trực tiếp để tìm ra những 'góc tiếp cận độc đáo' (Unique Selling Points). Chúng tôi phát triển các bộ concept sáng tạo hoàn chỉnh: từ tiêu đề giật gân khơi gợi tò mò, nội dung thuyết phục logic đến hình ảnh chủ đạo (Key Visual) ấn tượng. Để đảm bảo tối ưu chi phí cho nhà quảng cáo, chúng tôi luôn tạo ra các biến thể khác nhau về hình ảnh và câu chữ để bạn dễ dàng thử nghiệm và tìm ra mẫu quảng cáo chiến thắng (Winning Creative).",
    process: [
      { step: "01", name: "Nghiên cứu góc nhìn", desc: "Khảo sát nỗi đau khách hàng và các điểm mạnh khác biệt của sản phẩm." },
      { step: "02", name: "Lên Concept ý tưởng", desc: "Xây dựng 2-3 hướng tiếp cận sáng tạo cho chiến dịch quảng cáo." },
      { step: "03", name: "Sáng tác Ad Copy", desc: "Viết thông điệp, tiêu đề và lời kêu gọi hành động cho từng hướng." },
      { step: "04", name: "Thiết kế Key Visual", desc: "Thiết kế hình ảnh trung tâm truyền tải mạnh mẽ ý tưởng cốt lõi." },
      { step: "05", name: "Nhân bản biến thể", desc: "Tạo các phiên bản kích thước và màu sắc phục vụ kiểm thử A/B." },
      { step: "06", name: "Bàn giao gói Creative", desc: "Bàn giao tài nguyên hoàn chỉnh sẵn sàng cho đội ngũ chạy Ads." },
    ],
    deliverables: [
      "Bản kế hoạch concept nội dung quảng cáo chi tiết",
      "Bộ bài viết quảng cáo (Ad Copy) hoàn chỉnh kèm các biến thể tiêu đề",
      "Bộ hình ảnh Key Visual và banner quảng cáo chuẩn kích thước",
      "Khuyến nghị về cách triển khai thử nghiệm A/B Testing hiệu quả",
    ],
    targetAudience: [
      "Các chủ shop, doanh nghiệp đang chi ngân sách chạy quảng cáo hàng tháng",
      "Thương hiệu chuẩn bị tung ra chiến dịch khuyến mãi lớn trong năm",
      "Đội ngũ marketing nội bộ cần ý tưởng mới lạ để làm mới các mẫu Ads cũ",
    ],
    faqs: [
      {
        question: "Dịch vụ có bao gồm việc tự cài đặt và chạy quảng cáo không?",
        answer: "Gói này tập trung vào khâu sáng tạo tài nguyên nội dung và hình ảnh (Creative). Nếu bạn cần trọn gói cài đặt và quản lý ngân sách, chúng tôi có dịch vụ Digital Marketing hỗ trợ.",
      },
      {
        question: "Tôi có nhận được nhiều phiên bản để chạy thử nghiệm không?",
        answer: "Có. Chúng tôi cung cấp các biến thể tiêu đề và góc hình ảnh khác nhau để bạn kiểm tra mẫu nào mang lại chi phí tin nhắn/đơn hàng rẻ nhất.",
      },
      {
        question: "Nội dung có đảm bảo không vi phạm chính sách của Facebook/TikTok không?",
        answer: "Đội ngũ sáng tạo nắm vững chính sách quảng cáo của các nền tảng, đảm bảo câu từ và hình ảnh an toàn, tránh bị từ chối phê duyệt.",
      },
      {
        question: "Thời gian hoàn thành một gói Advertising Creative là bao lâu?",
        answer: "Thông thường từ 3 đến 5 ngày làm việc để hoàn thiện trọn bộ ý tưởng và hình ảnh.",
      },
    ],
    relatedSlugs: ["digital-marketing", "banner-design", "video-production", "content-creation"],
    thumbnail: "https://ftwfwhxfbrqnrwmjrmrq.supabase.co/storage/v1/object/public/nguyen-agency-media/services/1794468430203-ec5b5ca7-636d-4ee9-8793-8b683a9409c7.png",
    coverImage: "https://ftwfwhxfbrqnrwmjrmrq.supabase.co/storage/v1/object/public/nguyen-agency-media/services/1794468430203-ec5b5ca7-636d-4ee9-8793-8b683a9409c7.png",
  },

  // -------------------------------------------------------------
  // 17. Custom Software
  // -------------------------------------------------------------
  {
    id: "srv-17",
    order: 17,
    title: "Custom Software",
    titleVn: "Lập Trình Phần Mềm Theo Yêu Cầu",
    slug: "custom-software",
    group: "TECH",
    categoryName: "Web & Software",
    shortDesc:
      "Thiết kế phần mềm theo quy trình đặc thù của doanh nghiệp, kết nối dữ liệu và tự động hóa những công việc lặp lại khi phù hợp.",
    seoTitle: "Lập Trình Phần Mềm Theo Yêu Cầu Doanh Nghiệp | Nguyên Agency",
    metaDescription:
      "Dịch vụ lập trình phần mềm may đo theo quy trình đặc thù, kết nối API và tự động hóa vận hành doanh nghiệp tại Nguyên Agency.",
    primaryKeyword: "lập trình phần mềm theo yêu cầu",
    proposedItems: [
      "Khảo sát và phân tích yêu cầu nghiệp vụ chuyên sâu",
      "Lập trình chức năng tùy chỉnh theo quy trình riêng biệt",
      "Kiểm thử bảo mật, hiệu năng và tính ổn định hệ thống",
      "Bàn giao mã nguồn và tài liệu kỹ thuật chi tiết",
    ],
    intro:
      "Mỗi lĩnh vực kinh doanh độc thù như sản xuất, xây lắp, nông nghiệp công nghệ cao hay phân phối chuỗi đều sở hữu những phương thức tính toán, quy tắc định mức và bài toán điều hành không giống ai. Sử dụng các phần mềm thương mại có sẵn thường buộc doanh nghiệp phải gò ép quy trình của mình theo máy móc, dẫn đến nhiều bất cập và sai sót. Lập trình phần mềm theo yêu cầu (Custom Software Development) mang lại sự tự do và chính xác tuyệt đối: hệ thống được thiết kế xoay quanh chính bạn, giải quyết triệt để từng nút thắt vận hành và kết nối liền mạch với các hệ thống sẵn có. Dịch vụ lập trình phần mềm của Nguyên Agency cam kết mang lại sản phẩm chuẩn xác, bền bỉ và chuyển giao toàn quyền sở hữu.",
    clientProblems: [
      "Quy trình nghiệp vụ quá đặc thù, không có phần mềm thương mại nào đáp ứng được.",
      "Dữ liệu giữa các phần mềm kế toán, bán hàng, kho bãi không kết nối được với nhau.",
      "Nhân viên mất hàng giờ mỗi ngày để nhập liệu thủ công lặp đi lặp lại giữa các file.",
      "Bị ràng buộc bởi chi phí nâng cấp hoặc phí duy trì đắt đỏ của các nhà cung cấp cũ.",
    ],
    solution:
      "Nguyên Agency làm việc chặt chẽ cùng đội ngũ nghiệp vụ của bạn để phân tích cặn kẽ từng công thức tính toán và luồng di chuyển của thông tin. Chúng tôi xây dựng phần mềm với công nghệ hiện đại, có tính mở cao (API-First), cho phép dễ dàng kết nối dữ liệu giữa các hệ sinh thái phần mềm khác nhau. Từng tính năng đều được tối ưu hóa giao diện nhằm giảm thiểu thao tác nhập liệu của nhân viên, đi kèm các chốt kiểm soát tự động ngăn chặn sai sót số liệu ngay từ đầu vào.",
    process: [
      { step: "01", name: "Khảo sát chuyên sâu", desc: "Lập hồ sơ phân tích chi tiết quy trình nghiệp vụ và các bài toán khó." },
      { step: "02", name: "Đặc tả kỹ thuật", desc: "Thống nhất tài liệu yêu cầu phần mềm (SRS) và kiến trúc dữ liệu." },
      { step: "03", name: "Thiết kế mẫu thử", desc: "Mô phỏng giao diện các chức năng để người dùng trải nghiệm trước." },
      { step: "04", name: "Lập trình từng phần", desc: "Triển khai code theo phương pháp Agile/Scrum, bàn giao thử từng giai đoạn." },
      { step: "05", name: "Kiểm thử toàn diện", desc: "Kiểm tra tính đúng đắn của dữ liệu, tải nặng và an toàn thông tin." },
      { step: "06", name: "Bàn giao & bảo hành", desc: "Triển khai thực tế, đào tạo người dùng và bàn giao trọn gói mã nguồn." },
    ],
    deliverables: [
      "Hệ thống phần mềm tùy chỉnh hoàn thiện theo đúng biên bản nghiệm thu",
      "Toàn bộ mã nguồn phát triển và cơ sở dữ liệu thuộc quyền sở hữu 100% của bạn",
      "Tài liệu hướng dẫn kỹ thuật và hướng dẫn sử dụng cho người vận hành",
      "Chính sách bảo hành kỹ thuật 12 tháng và hỗ trợ mở rộng sau này",
    ],
    targetAudience: [
      "Doanh nghiệp sản xuất, chế biến có bài toán quản lý định mức nguyên vật liệu",
      "Công ty vận tải, logistics, kho vận có luồng điều phối đặc thù",
      "Doanh nghiệp có nhu cầu kết nối dữ liệu tự động giữa nhiều hệ thống phần mềm",
    ],
    faqs: [
      {
        question: "Doanh nghiệp có được sở hữu mã nguồn của phần mềm không?",
        answer: "Có. Nguyên Agency bàn giao 100% mã nguồn (Source Code) và cơ sở dữ liệu, doanh nghiệp toàn quyền làm chủ tài sản công nghệ của mình.",
      },
      {
        question: "Phần mềm có kết nối được với máy in hóa đơn, máy quét mã vạch hay cân điện tử không?",
        answer: "Có. Chúng tôi có thể lập trình kết nối phần mềm với các thiết bị ngoại vi qua cổng mạng hoặc kết nối trực tiếp theo yêu cầu.",
      },
      {
        question: "Nếu sau này quy trình nghiệp vụ thay đổi thì có sửa được không?",
        answer: "Phần mềm được thiết kế theo cấu trúc module linh hoạt, cho phép lập trình viên dễ dàng bổ sung hoặc chỉnh sửa chức năng theo sự thay đổi của doanh nghiệp.",
      },
      {
        question: "Thời gian lập trình một phần mềm theo yêu cầu mất bao lâu?",
        answer: "Thời gian phụ thuộc vào quy mô dự án, thông thường từ 4 đến 10 tuần làm việc cho một hệ thống hoàn chỉnh.",
      },
    ],
    relatedSlugs: ["management-software", "web-application", "crm-system", "ai-integration"],
    thumbnail: "https://ftwfwhxfbrqnrwmjrmrq.supabase.co/storage/v1/object/public/nguyen-agency-media/services/1794468735477-baae31a8-0d06-474c-b3be-ac6b8e6e6d6f.png",
    coverImage: "https://ftwfwhxfbrqnrwmjrmrq.supabase.co/storage/v1/object/public/nguyen-agency-media/services/1794468735477-baae31a8-0d06-474c-b3be-ac6b8e6e6d6f.png",
  },

  // -------------------------------------------------------------
  // 18. Video Production
  // -------------------------------------------------------------
  {
    id: "srv-18",
    order: 18,
    title: "Video Production",
    titleVn: "Sản Xuất Video Quảng Cáo",
    slug: "video-production",
    group: "MEDIA",
    categoryName: "CGI & Motion",
    shortDesc:
      "Lên ý tưởng, xây dựng kịch bản và sản xuất video giới thiệu thương hiệu, sản phẩm hoặc hoạt động doanh nghiệp theo kênh truyền thông mục tiêu.",
    seoTitle: "Sản Xuất Video Quảng Cáo Doanh Nghiệp & TVC | Nguyên Agency",
    metaDescription:
      "Dịch vụ sản xuất video quảng cáo, TVC doanh nghiệp và video giới thiệu sản phẩm từ kịch bản, quay phim đến hậu kỳ tại Nguyên Agency.",
    primaryKeyword: "sản xuất video quảng cáo",
    proposedItems: [
      "Kịch bản phân cảnh chi tiết và lời bình (Voiceover)",
      "Video quay dựng hoàn chỉnh chuẩn độ phân giải 4K/Full HD",
      "Phụ đề và hiệu ứng âm thanh, đồ họa chuyển động đi kèm",
      "Các phiên bản xuất tối ưu theo tỷ lệ khung hình ngang và dọc",
    ],
    intro:
      "Video hiện là định dạng nội dung có sức mạnh truyền tải cảm xúc và thu hút tương tác lớn nhất trên môi trường số. Một đoạn video giới thiệu công ty được sản xuất chỉn chu, hình ảnh sắc nét cùng lời bình truyền cảm sẽ giúp đối tác và khách hàng hình dung rõ nét về quy mô, nhà xưởng và năng lực thực tế của doanh nghiệp. Ngược lại, những video tự quay bằng điện thoại rung lắc, âm thanh rè và thiếu kịch bản sẽ làm giảm đi giá trị sản phẩm. Dịch vụ sản xuất video quảng cáo của Nguyên Agency mang đến giải pháp trọn gói từ khâu lên ý tưởng sáng tạo, tổ chức ghi hình chuyên nghiệp đến hậu kỳ kỹ xảo điện ảnh, giúp nâng tầm hình ảnh thương hiệu trong mắt công chúng.",
    clientProblems: [
      "Chưa có video chuyên nghiệp để giới thiệu năng lực công ty khi đi gặp đối tác, chào thầu.",
      "Khách hàng ở xa không thể đến tham quan nhà máy, cơ sở kinh doanh thực tế.",
      "Video tự quay thiếu kịch bản bài bản, âm thanh tạp âm và hình ảnh tối mờ.",
      "Cần video ngắn bắt mắt để chạy quảng cáo chuyển đổi trên Facebook, TikTok.",
    ],
    solution:
      "Nguyên Agency cung cấp dịch vụ sản xuất video với quy trình khép kín: từ biên tập kịch bản phân cảnh mạch lạc, chuẩn bị thiết bị máy quay điện ảnh 4K, hệ thống ánh sáng và mic thu âm chuyên dụng. Trong khâu hậu kỳ, chúng tôi xử lý cân chỉnh màu sắc ấn tượng, lồng ghép âm nhạc độc quyền, giọng đọc lồng tiếng truyền cảm và chèn các hiệu ứng đồ họa chuyển động (Motion Graphics) minh họa thông số, mang lại sản phẩm video cuốn hút và giàu sức thuyết phục.",
    process: [
      { step: "01", name: "Trao đổi mục tiêu", desc: "Xác định mục đích video (quảng cáo, giới thiệu công ty, hướng dẫn...)." },
      { step: "02", name: "Xây dựng kịch bản", desc: "Lên kịch bản chi tiết gồm lời bình, góc máy và thời lượng dự kiến." },
      { step: "03", name: "Tổ chức ghi hình", desc: "Ekip thực hiện quay phim thực tế tại nhà xưởng, văn phòng hoặc studio." },
      { step: "04", name: "Dựng nháp (Rough Cut)", desc: "Cắt ghép khung hình, chọn nhạc nền và gửi bản xem thử đầu tiên." },
      { step: "05", name: "Hậu kỳ hoàn thiện", desc: "Chỉnh màu sắc, hòa âm, thu âm lời bình và chèn hiệu ứng đồ họa." },
      { step: "06", name: "Xuất file & bàn giao", desc: "Bàn giao video hoàn chỉnh ở các độ phân giải và tỷ lệ khung hình cần thiết." },
    ],
    deliverables: [
      "Video hoàn chỉnh độ phân giải 4K / Full HD sắc nét",
      "Các phiên bản khung hình: 16:9 (Youtube, Website) và 9:16 (TikTok, Reels, Story)",
      "File thuyết minh âm thanh riêng biệt và file phụ đề (.srt)",
      "Bản quyền âm nhạc sử dụng hợp pháp trên các nền tảng mạng xã hội",
    ],
    targetAudience: [
      "Doanh nghiệp sản xuất, chế biến, xây dựng cần video hồ sơ năng lực (Corporate Video)",
      "Cơ sở kinh doanh, nhà hàng, khách sạn cần video trải nghiệm không gian dịch vụ",
      "Nhãn hàng chuẩn bị chiến dịch quảng cáo ra mắt sản phẩm mới",
    ],
    faqs: [
      {
        question: "Ekip có đến quay trực tiếp tại cơ sở của tôi ở Quảng Ngãi được không?",
        answer: "Có. Ekip của Nguyên Agency trực tiếp khảo sát và ghi hình tại TP. Quảng Ngãi cũng như các huyện lân cận và các tỉnh miền Trung.",
      },
      {
        question: "Tôi có được chọn giọng đọc lồng tiếng (Voiceover) nam hay nữ không?",
        answer: "Có. Chúng tôi cung cấp danh sách giọng đọc mẫu (giọng miền Bắc, miền Nam, miền Trung, tiếng Anh) để bạn lựa chọn chất giọng phù hợp nhất.",
      },
      {
        question: "Thời lượng một video giới thiệu doanh nghiệp nên dài bao lâu?",
        answer: "Thời lượng tối ưu cho video hồ sơ năng lực là từ 2 đến 4 phút; đối với video chạy quảng cáo mạng xã hội nên từ 30 đến 60 giây.",
      },
      {
        question: "Thời gian hoàn thành một video sản xuất là bao lâu?",
        answer: "Thông thường từ 5 đến 10 ngày làm việc từ khi bấm máy ghi hình đến bản hoàn thiện cuối cùng.",
      },
    ],
    relatedSlugs: ["ai-video-production", "advertising-creative", "media-quang-ngai", "content-creation"],
    thumbnail: "https://ftwfwhxfbrqnrwmjrmrq.supabase.co/storage/v1/object/public/nguyen-agency-media/services/1794468491083-63710140-cba9-44c2-8988-b8b597d71746.png",
    coverImage: "https://ftwfwhxfbrqnrwmjrmrq.supabase.co/storage/v1/object/public/nguyen-agency-media/services/1794468491083-63710140-cba9-44c2-8988-b8b597d71746.png",
  },

  // -------------------------------------------------------------
  // 19. AI Integration
  // -------------------------------------------------------------
  {
    id: "srv-19",
    order: 19,
    title: "AI Integration",
    titleVn: "Tích Hợp AI Cho Doanh Nghiệp",
    slug: "ai-integration",
    group: "TECH",
    categoryName: "AI & Innovation",
    shortDesc:
      "Tư vấn và tích hợp các tính năng AI như trợ lý hỏi đáp, xử lý tài liệu, hỗ trợ nội dung và tự động hóa vào hệ thống hiện có khi khả thi.",
    seoTitle: "Tích Hợp AI Cho Doanh Nghiệp & Tự Động Hóa | Nguyên Agency",
    metaDescription:
      "Tư vấn và tích hợp trợ lý AI, xử lý văn bản, trích xuất dữ liệu và tự động hóa quy trình nghiệp vụ vào hệ thống doanh nghiệp tại Nguyên Agency.",
    primaryKeyword: "tích hợp AI cho doanh nghiệp",
    proposedItems: [
      "Khảo sát và tư vấn các kịch bản ứng dụng AI phù hợp thực tế",
      "Tích hợp mô hình AI (trợ lý hỏi đáp, phân loại dữ liệu, trích xuất tài liệu)",
      "Kiểm thử tính chính xác và an toàn dữ liệu nội bộ",
      "Hướng dẫn vận hành và quản lý chi phí tài nguyên AI",
    ],
    intro:
      "Trí tuệ nhân tạo (AI) đang chuyển từ giai đoạn lý thuyết sang công cụ ứng dụng thiết thực giúp doanh nghiệp tạo ra bước nhảy vọt về năng suất. Tuy nhiên, rất nhiều công ty còn bỡ ngỡ không biết bắt đầu từ đâu, hoặc lo ngại về chi phí và tính bảo mật của dữ liệu nội bộ khi sử dụng AI. Việc tích hợp AI đúng chỗ — như trợ lý tự động phản hồi các câu hỏi lặp đi lặp lại của khách hàng, trích xuất dữ liệu từ hóa đơn chứng từ hay tóm tắt nội dung tài liệu — có thể giúp doanh nghiệp tiết kiệm 60-80% thời gian xử lý thủ công. Dịch vụ AI Integration của Nguyên Agency mang đến giải pháp tích hợp AI thực tế, tập trung vào hiệu quả giải quyết công việc và bảo vệ tuyệt đối an toàn dữ liệu của bạn.",
    clientProblems: [
      "Nhân viên tốn nhiều giờ mỗi ngày để trả lời những câu hỏi giống hệt nhau của khách hàng.",
      "Xử lý tài liệu, nhập liệu hóa đơn, chứng từ thủ công chậm chạp và dễ nhầm số liệu.",
      "Muốn ứng dụng AI nhưng lo lắng việc rò rỉ dữ liệu mật của công ty ra bên ngoài.",
      "Không biết cách kết nối các mô hình AI hiện đại (Gemini, Claude, GPT) vào phần mềm sẵn có.",
    ],
    solution:
      "Nguyên Agency đánh giá cụ thể các khâu làm việc tại doanh nghiệp bạn để tìm ra những điểm tích hợp AI mang lại giá trị cao nhất. Chúng tôi xây dựng giải pháp trợ lý thông minh ứng dụng công nghệ RAG (Retrieval-Augmented Generation): AI được 'huấn luyện' dựa trên chính tài liệu quy trình, báo giá, tài liệu kỹ thuật nội bộ của công ty bạn, đảm bảo câu trả lời luôn chuẩn xác 100% dữ liệu thực và không bị 'ảo tưởng'. Dữ liệu được bảo mật trên máy chủ riêng biệt, không dùng để huấn luyện mô hình chung công cộng.",
    process: [
      { step: "01", name: "Đánh giá khả thi", desc: "Khảo sát dữ liệu hiện có và xác định bài toán cần AI giải quyết." },
      { step: "02", name: "Chuẩn hóa tri thức", desc: "Thu thập, làm sạch và đóng gói tài liệu nội bộ vào cơ sở dữ liệu Vector." },
      { step: "03", name: "Lập trình kết nối", desc: "Kết nối mô hình AI vào phần mềm, website hoặc bot Telegram qua API." },
      { step: "04", name: "Kiểm định độ chuẩn", desc: "Thử nghiệm hàng trăm câu hỏi đối soát để đảm bảo câu trả lời chính xác." },
      { step: "05", name: "Tối ưu chi phí", desc: "Cân chỉnh luồng gọi AI để tiết kiệm tối đa chi phí token tài nguyên." },
      { step: "06", name: "Bàn giao & hướng dẫn", desc: "Chuyển giao tài liệu quản trị và hướng dẫn đội ngũ cập nhật tài liệu mới." },
    ],
    deliverables: [
      "Hệ thống tính năng AI tích hợp hoàn chỉnh vào phần mềm hoặc kênh giao tiếp",
      "Cơ sở dữ liệu tri thức nội bộ riêng biệt bảo mật cao",
      "Bảng theo dõi số lượng câu hỏi và chi phí sử dụng tài nguyên AI",
      "Tài liệu hướng dẫn quản trị và cập nhật tri thức mới cho trợ lý AI",
    ],
    targetAudience: [
      "Doanh nghiệp dịch vụ có lượng câu hỏi tư vấn khách hàng lớn mỗi ngày",
      "Công ty cần xử lý, tóm tắt và trích xuất dữ liệu từ lượng lớn hồ sơ, văn bản",
      "Các đơn vị muốn tiên phong tự động hóa quy trình hỗ trợ nội bộ cho nhân viên",
    ],
    faqs: [
      {
        question: "Dữ liệu kinh doanh của công ty tôi có bị lộ ra ngoài không?",
        answer: "Tuyệt đối không. Chúng tôi sử dụng các cổng API doanh nghiệp bảo mật, cam kết dữ liệu của bạn không bị chia sẻ hay dùng để huấn luyện mô hình công cộng.",
      },
      {
        question: "AI có trả lời sai lệch thông tin báo giá của công ty không?",
        answer: "Nhờ công nghệ RAG, AI chỉ truy xuất và đối chiếu câu trả lời dựa trên chính tài liệu bạn cung cấp, nếu không có dữ liệu AI sẽ báo chuyển tiếp cho nhân viên phụ trách.",
      },
      {
        question: "Chi phí duy trì AI hàng tháng có đắt không?",
        answer: "Chi phí được tính dựa trên số lượng truy vấn thực tế của bạn, thông thường chỉ từ vài trăm nghìn đồng mỗi tháng đối với quy mô doanh nghiệp vừa và nhỏ.",
      },
      {
        question: "Có thể tích hợp trợ lý AI vào nhóm Telegram hay Zalo không?",
        answer: "Có. Chúng tôi có thể kết nối trợ lý AI trực tiếp vào Website, nhóm Telegram nội bộ hoặc trang Zalo của doanh nghiệp thuận tiện.",
      },
    ],
    relatedSlugs: ["custom-software", "web-application", "crm-system", "ai-video-production"],
    thumbnail: "https://ftwfwhxfbrqnrwmjrmrq.supabase.co/storage/v1/object/public/nguyen-agency-media/services/1794468786926-8a517459-9883-4792-920d-03af47dc935f.png",
    coverImage: "https://ftwfwhxfbrqnrwmjrmrq.supabase.co/storage/v1/object/public/nguyen-agency-media/services/1794468786926-8a517459-9883-4792-920d-03af47dc935f.png",
  },

  // -------------------------------------------------------------
  // 20. AI Video Production
  // -------------------------------------------------------------
  {
    id: "srv-20",
    order: 20,
    title: "AI Video Production",
    titleVn: "Sản Xuất Video Bằng AI",
    slug: "ai-video-production",
    group: "MEDIA",
    categoryName: "CGI & Motion",
    shortDesc:
      "Ứng dụng công cụ AI trong quá trình tạo hình ảnh, cảnh quay minh họa và video quảng bá, kết hợp biên tập để phù hợp thông điệp thương hiệu.",
    seoTitle: "Sản Xuất Video Bằng AI Sáng Tạo | Nguyên Agency",
    metaDescription:
      "Ứng dụng công nghệ AI tạo hình ảnh, cảnh quay minh họa và video quảng bá sáng tạo với thời gian và chi phí tối ưu tại Nguyên Agency.",
    primaryKeyword: "sản xuất video bằng AI",
    proposedItems: [
      "Kịch bản video tối ưu cho việc tạo sinh hình ảnh và âm thanh bằng AI",
      "Tập hợp hình ảnh và cảnh quay minh họa dựng bằng công cụ AI hiện đại",
      "Video hoàn chỉnh được biên tập kỹ lưỡng theo thông điệp thương hiệu",
      "File xuất chất lượng cao phục vụ truyền thông mạng xã hội",
    ],
    intro:
      "Sản xuất video theo phương pháp truyền thống thường đòi hỏi chi phí lớn cho thuê phim trường, diễn viên, bối cảnh và ekip quay phim đông đảo — điều mà nhiều doanh nghiệp vừa và nhỏ khó có thể duy trì thường xuyên. Sự bùng nổ của công nghệ Trí tuệ Nhân tạo thế hệ mới (Generative AI) mở ra cơ hội đột phá: tạo ra những cảnh quay mãn nhãn, bối cảnh tương lai và người mẫu ảo chân thực với chi phí và thời gian chỉ bằng một phần nhỏ. Dịch vụ sản xuất video bằng AI của Nguyên Agency kết hợp giữa sức mạnh tạo sinh của công nghệ AI và tư duy thẩm mỹ điện ảnh của đội ngũ đạo diễn, mang đến những thước phim quảng bá độc đáo, sáng tạo và tiết kiệm tối đa ngân sách.",
    clientProblems: [
      "Chi phí quay dựng video truyền thống quá cao so với ngân sách marketing định kỳ.",
      "Cần các cảnh quay kỳ ảo, bối cảnh phức tạp mà trường quay thực tế không thể thực hiện.",
      "Thời gian sản xuất video truyền thống quá lâu, không kịp bắt trend mạng xã hội.",
      "Video AI tự làm bằng các công cụ miễn phí bị giật hình, méo mó và thiếu tính chuyên nghiệp.",
    ],
    solution:
      "Nguyên Agency làm chủ các công cụ tạo sinh hình ảnh và chuyển động AI tiên tiến nhất hiện nay (Midjourney, Runway Gen-3, Luma Dream Machine...). Chúng tôi xây dựng kịch bản chặt chẽ, tạo sinh các khung hình có độ phân giải cao và tính nhất quán nhân vật. Video được đưa qua bàn dựng chuyên nghiệp của các Editor để cắt nhịp, ghép nhạc nền bản quyền, lồng tiếng thuyết minh AI đa ngôn ngữ tự nhiên và chèn hiệu ứng đồ họa, đảm bảo sản phẩm cuối cùng chỉn chu và chạm cảm xúc người xem.",
    process: [
      { step: "01", name: "Lên kịch bản ý niệm", desc: "Xây dựng câu chuyện và mô tả chi tiết các cảnh quay cần tạo bằng AI." },
      { step: "02", name: "Tạo sinh nhân vật & cảnh", desc: "Dùng các mô hình AI tạo ra các bức ảnh bối cảnh và nhân vật đồng nhất." },
      { step: "03", name: "Chuyển động hóa hình ảnh", desc: "Ứng dụng AI biến các hình ảnh tĩnh thành các chuyển động mượt mà." },
      { step: "04", name: "Biên tập hậu kỳ", desc: "Ghép nối các phân cảnh, đồng bộ tiết tấu âm nhạc và hiệu ứng âm thanh." },
      { step: "05", name: "Lồng tiếng AI tự nhiên", desc: "Tạo giọng đọc thuyết minh AI truyền cảm theo đúng ngôn ngữ mong muốn." },
      { step: "06", name: "Xuất file & nghiệm thu", desc: "Xuất video chuẩn sắc nét bàn giao cho khách hàng triển khai." },
    ],
    deliverables: [
      "Video quảng cáo AI hoàn chỉnh độ phân giải sắc nét",
      "Các định dạng video tối ưu cho TikTok (9:16) và Website/Youtube (16:9)",
      "File thuyết minh âm thanh lồng tiếng AI chất lượng phòng thu",
      "Bản quyền âm nhạc và hình ảnh sử dụng hợp pháp trên mạng xã hội",
    ],
    targetAudience: [
      "Doanh nghiệp muốn sản xuất video quảng cáo sản phẩm với chi phí tiết kiệm",
      "Thương hiệu công nghệ, thời trang, bất động sản cần các ý tưởng thị giác mới lạ",
      "Các kênh truyền thông cần sản xuất nội dung video ngắn định kỳ số lượng lớn",
    ],
    faqs: [
      {
        question: "Video tạo bằng AI trông có bị giả tạo hay méo mó không?",
        answer: "Chúng tôi kết hợp các công cụ AI cao cấp có trả phí và khâu lọc khung hình tỉ mỉ của Editor chuyên nghiệp, đảm bảo hình ảnh mượt mà và tự nhiên nhất.",
      },
      {
        question: "Tôi có thể yêu cầu tạo nhân vật nói tiếng Anh hoặc ngôn ngữ khác không?",
        answer: "Có. Công nghệ lồng tiếng AI cho phép tạo giọng đọc bằng hàng chục ngôn ngữ khác nhau với ngữ điệu chuẩn bản xứ.",
      },
      {
        question: "Chi phí sản xuất video AI có rẻ hơn video truyền thống không?",
        answer: "Chi phí thường tiết kiệm từ 50% đến 70% so với việc thuê trường quay, diễn viên và ekip quay phim thực tế.",
      },
      {
        question: "Thời gian hoàn thành một video AI là bao lâu?",
        answer: "Thông thường từ 3 đến 5 ngày làm việc cho một video quảng cáo ngắn hoàn chỉnh.",
      },
    ],
    relatedSlugs: ["video-production", "advertising-creative", "ai-integration", "content-creation"],
    thumbnail: "https://ftwfwhxfbrqnrwmjrmrq.supabase.co/storage/v1/object/public/nguyen-agency-media/services/1794468834152-fe55c1e5-04f7-4140-864b-c3e1034287a9.png",
    coverImage: "https://ftwfwhxfbrqnrwmjrmrq.supabase.co/storage/v1/object/public/nguyen-agency-media/services/1794468834152-fe55c1e5-04f7-4140-864b-c3e1034287a9.png",
  },

  // -------------------------------------------------------------
  // 21. Website Maintenance
  // -------------------------------------------------------------
  {
    id: "srv-21",
    order: 21,
    title: "Website Maintenance",
    titleVn: "Dịch Vụ Bảo Trì Website",
    slug: "website-maintenance",
    group: "TECH",
    categoryName: "Web & Software",
    shortDesc:
      "Hỗ trợ cập nhật nội dung, kiểm tra lỗi, sao lưu và cải thiện hiệu suất website theo kế hoạch, giúp giảm rủi ro gián đoạn hoạt động.",
    seoTitle: "Dịch Vụ Bảo Trì Website Chuyên Nghiệp | Nguyên Agency",
    metaDescription:
      "Dịch vụ bảo trì website định kỳ: cập nhật nội dung, kiểm tra lỗi, sao lưu dữ liệu, bảo mật và tối ưu tốc độ tải trang tại Nguyên Agency.",
    primaryKeyword: "dịch vụ bảo trì website",
    proposedItems: [
      "Danh sách công việc bảo trì định kỳ (sao lưu, vá lỗi, cập nhật)",
      "Nhật ký xử lý sự cố và báo cáo hiệu suất hoạt động",
      "Hỗ trợ cập nhật nội dung và hình ảnh bài viết theo yêu cầu",
    ],
    intro:
      "Một website sau khi bàn giao giống như một cỗ xe cần được bảo dưỡng định kỳ để vận hành bền bỉ. Môi trường Internet liên tục thay đổi với các lỗ hổng bảo mật mới, các phiên bản cập nhật của mã nguồn và thuật toán tìm kiếm của Google. Nếu website bị bỏ quên không bảo trì, doanh nghiệp có thể đối mặt với nguy cơ bị chèn mã độc, website bị chậm chạp, lỗi hiển thị hoặc nghiêm trọng hơn là sập web trong những dịp chạy quảng cáo quan trọng. Dịch vụ bảo trì website của Nguyên Agency đóng vai trò như một phòng kỹ thuật số thuê ngoài chuyên nghiệp, giúp website của bạn luôn hoạt động 24/7 ổn định, an toàn và tải nhanh.",
    clientProblems: [
      "Website thường xuyên bị chậm, thỉnh thoảng báo lỗi kết nối máy chủ.",
      "Không có nhân sự kỹ thuật chuyên trách để sao lưu dữ liệu phòng ngừa sự cố.",
      "Website bị chèn các đường link rác, mã độc quảng cáo làm ảnh hưởng uy tín.",
      "Không có thời gian hoặc không biết cách chỉnh sửa hình ảnh để cập nhật bài viết mới.",
    ],
    solution:
      "Nguyên Agency thiết lập lịch trình bảo trì định kỳ chặt chẽ cho website của bạn: giám sát thời gian hoạt động (Uptime) 24/7, sao lưu dữ liệu hàng tuần lên đám mây an toàn, quét mã độc và cập nhật các bản vá bảo mật. Đồng thời, đội ngũ kỹ thuật viên hỗ trợ bạn cập nhật nội dung, tối ưu kích thước hình ảnh và căn chỉnh bố cục mỗi khi bạn có sản phẩm hay thông báo mới, giúp website luôn tươi mới trong mắt khách hàng và Google.",
    process: [
      { step: "01", name: "Kiểm tra toàn diện", desc: "Rà soát mã nguồn, tốc độ tải trang, dung lượng lưu trữ và lỗ hổng bảo mật." },
      { step: "02", name: "Thiết lập sao lưu", desc: "Cài đặt cơ chế tự động backup dữ liệu định kỳ lưu trữ độc lập." },
      { step: "03", name: "Cài đặt giám sát", desc: "Kích hoạt hệ thống theo dõi Uptime tự động cảnh báo sự cố 24/7." },
      { step: "04", name: "Bảo trì định kỳ", desc: "Vá lỗi mã nguồn, dọn rác cơ sở dữ liệu và tối ưu tốc độ máy chủ." },
      { step: "05", name: "Hỗ trợ nội dung", desc: "Tiếp nhận và cập nhật bài viết, hình ảnh theo yêu cầu hàng tháng." },
      { step: "06", name: "Gửi báo cáo", desc: "Gửi báo cáo công việc và tình trạng sức khỏe website cho doanh nghiệp." },
    ],
    deliverables: [
      "Bản sao lưu dữ liệu website định kỳ lưu trữ trên đám mây an toàn",
      "Báo cáo nhật ký bảo trì và chỉ số hoạt động định kỳ hàng tháng",
      "Website luôn hoạt động ổn định và chứng chỉ SSL luôn được gia hạn kịp thời",
      "Kênh tiếp nhận hỗ trợ kỹ thuật nhanh chóng qua Zalo / Hotline / Telegram",
    ],
    targetAudience: [
      "Doanh nghiệp không có đội ngũ kỹ thuật viên lập trình riêng",
      "Các website bán hàng, website doanh nghiệp có lượng truy cập thường xuyên",
      "Doanh nghiệp muốn an tâm về mặt kỹ thuật để tập trung vào kinh doanh cốt lõi",
    ],
    faqs: [
      {
        question: "Nếu website gặp sự cố sập mạng thì bao lâu được xử lý?",
        answer: "Hệ thống giám sát sẽ tự động cảnh báo và đội ngũ kỹ thuật của Nguyên Agency cam kết phản hồi, bắt tay vào xử lý sự cố trong vòng 2 giờ.",
      },
      {
        question: "Dữ liệu website được sao lưu (backup) bao lâu một lần?",
        answer: "Thông thường dữ liệu được sao lưu tự động hàng tuần hoặc hàng ngày tùy thuộc vào gói bảo trì bạn lựa chọn.",
      },
      {
        question: "Tôi có thể gửi bài viết và hình ảnh nhờ Nguyên Agency đăng hộ không?",
        answer: "Có. Gói dịch vụ bảo trì bao gồm số lượng bài viết và hình ảnh hỗ trợ cập nhật định kỳ mỗi tháng theo thỏa thuận.",
      },
      {
        question: "Dịch vụ có hỗ trợ website làm từ đơn vị khác không?",
        answer: "Có. Chúng tôi tiếp nhận khảo sát và bảo trì các website được xây dựng bằng Next.js, Node.js, PHP, WordPress... sau khi kiểm tra mã nguồn.",
      },
    ],
    relatedSlugs: ["business-website", "corporate-website", "e-commerce-website", "web-application"],
    thumbnail: "https://ftwfwhxfbrqnrwmjrmrq.supabase.co/storage/v1/object/public/nguyen-agency-media/services/1794468889544-e92cdb77-d6bf-44be-831e-c219d82fe5fa.png",
    coverImage: "https://ftwfwhxfbrqnrwmjrmrq.supabase.co/storage/v1/object/public/nguyen-agency-media/services/1794468889544-e92cdb77-d6bf-44be-831e-c219d82fe5fa.png",
  },

  // -------------------------------------------------------------
  // 22. Digital Marketing
  // -------------------------------------------------------------
  {
    id: "srv-22",
    order: 22,
    title: "Digital Marketing",
    titleVn: "Dịch Vụ Digital Marketing Quảng Ngãi",
    slug: "digital-marketing",
    group: "MEDIA",
    categoryName: "Branding & Visual",
    shortDesc:
      "Xây dựng kế hoạch marketing số theo khách hàng mục tiêu, lựa chọn kênh truyền thông, triển khai nội dung và theo dõi hiệu quả chiến dịch.",
    seoTitle: "Dịch Vụ Digital Marketing Quảng Ngãi | Nguyên Agency",
    metaDescription:
      "Dịch vụ Digital Marketing tại Quảng Ngãi của Nguyên Agency, hỗ trợ xây dựng kế hoạch nội dung, lựa chọn kênh truyền thông và đo lường chiến dịch.",
    primaryKeyword: "dịch vụ digital marketing Quảng Ngãi",
    proposedItems: [
      "Kế hoạch lựa chọn kênh truyền thông phù hợp đối tượng mục tiêu",
      "Sản xuất nội dung bài viết và hình ảnh quảng bá đa kênh",
      "Thiết lập công cụ đo lường và theo dõi lượt chuyển đổi",
      "Báo cáo hiệu quả chiến dịch và đề xuất tối ưu định kỳ",
    ],
    intro:
      "Làm tiếp thị số (Digital Marketing) trong thời điểm hiện tại không chỉ đơn thuần là việc bỏ tiền chạy quảng cáo Facebook hay đăng vài bài viết lên mạng xã hội. Để đạt được hiệu quả kinh doanh thực tế, doanh nghiệp cần một chiến lược bài bản: thấu hiểu hành vi khách hàng địa phương tại Quảng Ngãi cũng như toàn quốc, xây dựng thông điệp chạm đúng nhu cầu, lựa chọn kênh truyền thông phù hợp và thiết lập hệ thống đo lường minh bạch. Rất nhiều chủ doanh nghiệp gặp tình trạng chi tiêu ngân sách quảng cáo liên tục nhưng không rõ tiền đi về đâu và đơn hàng không thấy tăng. Dịch vụ Digital Marketing của Nguyên Agency mang lại phương pháp tiếp cận thực chiến, tối ưu chi phí và bám sát mục tiêu tăng trưởng doanh số của bạn.",
    clientProblems: [
      "Tự chạy quảng cáo tốn kém nhưng chi phí mỗi tin nhắn/số điện thoại quá cao.",
      "Nội dung trên các kênh mạng xã hội nghèo nàn, không giữ chân được khách hàng.",
      "Không biết cách đo lường kênh nào đang mang lại khách hàng thực tế và kênh nào đang lãng phí tiền.",
      "Thiếu một kế hoạch marketing tổng thể đồng bộ giữa các kênh Facebook, Google, Zalo và Website.",
    ],
    solution:
      "Nguyên Agency đồng hành cùng doanh nghiệp xây dựng lộ trình tiếp thị số thực chiến. Chúng tôi giúp bạn phân tích chân dung khách hàng, xác định ngân sách hợp lý và lựa chọn kênh tiếp cận phù hợp nhất (Facebook/TikTok cho bán lẻ; Google Search/SEO cho dịch vụ và B2B). Đội ngũ sáng tạo sản xuất nội dung hình ảnh sắc nét, viết bài thuyết phục và thiết lập các mã đo lường chuyển đổi chuẩn xác. Báo cáo số liệu được gửi định kỳ, phân tích rõ ràng hiệu quả trên từng đồng ngân sách đầu tư.",
    process: [
      { step: "01", name: "Khảo sát thị trường", desc: "Nghiên cứu đối tượng khách hàng mục tiêu và các đối thủ cạnh tranh." },
      { step: "02", name: "Lập kế hoạch kênh", desc: "Lựa chọn kênh tiếp cận (Facebook, Google, TikTok, SEO) và phân bổ ngân sách." },
      { step: "03", name: "Sản xuất nội dung", desc: "Viết bài, thiết kế hình ảnh và video quảng cáo theo thông điệp chiến dịch." },
      { step: "04", name: "Thiết lập đo lường", desc: "Cài đặt mã theo dõi chuyển đổi Pixel, GA4 và cấu hình chiến dịch." },
      { step: "05", name: "Theo dõi & tối ưu", desc: "Kiểm tra số liệu hàng ngày, tắt các mẫu kém hiệu quả và tăng ngân sách mẫu tốt." },
      { step: "06", name: "Báo cáo & tư vấn", desc: "Gửi báo cáo định kỳ và đề xuất giải pháp tăng trưởng cho giai đoạn tiếp theo." },
    ],
    deliverables: [
      "Bản kế hoạch Digital Marketing chi tiết theo từng giai đoạn",
      "Bộ nội dung bài viết và hình ảnh quảng cáo đa kênh",
      "Hệ thống đo lường chuyển đổi được thiết lập hoàn chỉnh",
      "Báo cáo hiệu quả chiến dịch định kỳ minh bạch các chỉ số",
    ],
    targetAudience: [
      "Doanh nghiệp, cơ sở kinh doanh tại Quảng Ngãi muốn gia tăng nhận diện và đơn hàng",
      "Các đơn vị chuẩn bị ra mắt dịch vụ mới cần tạo độ phủ nhanh chóng",
      "Doanh nghiệp muốn có phòng marketing thuê ngoài bài bản mà không cần tuyển dụng cồng kềnh",
    ],
    faqs: [
      {
        question: "Doanh nghiệp tại Quảng Ngãi nên tập trung vào kênh marketing nào trước?",
        answer: "Với các dịch vụ ăn uống, làm đẹp, bán lẻ thì Facebook và TikTok mang lại khách nhanh nhất; với dịch vụ kỹ thuật, xây dựng, B2B thì Google Search (SEO & Google Ads) là kênh bền vững nhất.",
      },
      {
        question: "Nguyên Agency có minh bạch về chi phí quảng cáo không?",
        answer: "Chúng tôi hoàn toàn minh bạch: chi phí trả cho nền tảng (Facebook, Google) được thanh toán trực tiếp qua thẻ của bạn hoặc có hóa đơn đối soát rõ ràng kèm phí dịch vụ quản trị.",
      },
      {
        question: "Sau bao lâu thì chiến dịch bắt đầu có kết quả?",
        answer: "Đối với các chiến dịch quảng cáo trả phí (Paid Ads), tin nhắn và khách hàng tiềm năng thường phát sinh ngay từ những ngày đầu tiên triển khai.",
      },
      {
        question: "Tôi có thể bắt đầu với ngân sách nhỏ để thử nghiệm không?",
        answer: "Có. Chúng tôi hỗ trợ thiết lập chiến dịch thử nghiệm với mức ngân sách vừa phải để đánh giá phản ứng thị trường trước khi mở rộng.",
      },
    ],
    relatedSlugs: ["advertising-creative", "content-creation", "landing-page", "business-website"],
    thumbnail: "https://ftwfwhxfbrqnrwmjrmrq.supabase.co/storage/v1/object/public/nguyen-agency-media/services/1794469038128-4c9792eb-22be-466e-94e5-777540b2da76.png",
    coverImage: "https://ftwfwhxfbrqnrwmjrmrq.supabase.co/storage/v1/object/public/nguyen-agency-media/services/1794469038128-4c9792eb-22be-466e-94e5-777540b2da76.png",
  },

  // -------------------------------------------------------------
  // 23. UI/UX Design
  // -------------------------------------------------------------
  {
    id: "srv-23",
    order: 23,
    title: "UI/UX Design",
    titleVn: "Thiết Kế Giao Diện UI UX",
    slug: "ui-ux-design",
    group: "TECH",
    categoryName: "Web & Software",
    shortDesc:
      "Thiết kế giao diện website và ứng dụng dựa trên luồng sử dụng, giúp người dùng tìm thông tin, thao tác và hoàn thành công việc dễ dàng hơn.",
    seoTitle: "Thiết Kế Giao Diện UI UX Chuyên Nghiệp | Nguyên Agency",
    metaDescription:
      "Dịch vụ thiết kế giao diện UI/UX cho website và ứng dụng di động dựa trên nghiên cứu trải nghiệm người dùng thực tế tại Nguyên Agency.",
    primaryKeyword: "thiết kế giao diện UI UX",
    proposedItems: [
      "Nghiên cứu luồng người dùng (User Flow) khoa học",
      "Bản vẽ khung xương bố cục (Wireframe) chi tiết",
      "Bản mẫu tương tác thử nghiệm trực quan (Interactive Prototype)",
      "Bộ giao diện thiết kế hoàn chỉnh kèm hệ thống Design System",
    ],
    intro:
      "Giao diện đẹp mắt (UI) giúp thu hút người dùng từ cái nhìn đầu tiên, nhưng trải nghiệm mượt mà và dễ hiểu (UX) mới là yếu tố quyết định họ có ở lại sử dụng và quay trở lại hay không. Một sản phẩm phần mềm hay website dù sở hữu nhiều tính năng cao cấp đến đâu nhưng nếu bố trí nút bấm khó tìm, luồng thao tác rối rắm sẽ khiến người dùng nhanh chóng nản lòng và từ bỏ. Dịch vụ thiết kế giao diện UI/UX của Nguyên Agency đặt người dùng làm trung tâm: nghiên cứu hành vi thao tác thực tế để tạo nên những giao diện tinh tế, dễ thao tác và tối ưu hóa tỷ lệ chuyển đổi cho sản phẩm số của bạn.",
    clientProblems: [
      "Website hoặc ứng dụng có giao diện cũ kỹ, khó sử dụng khiến khách hàng phàn nàn.",
      "Tỷ lệ hoàn thành đơn hàng hoặc đăng ký thấp do các bước thao tác quá rườm rà.",
      "Lập trình viên và chủ dự án mất nhiều thời gian tranh cãi vì thiếu bản thiết kế mẫu trực quan.",
      "Giao diện không đồng bộ giữa các màn hình, thiếu tính chuẩn mực của một sản phẩm chuyên nghiệp.",
    ],
    solution:
      "Nguyên Agency tiếp cận thiết kế UI/UX theo tiêu chuẩn quốc tế: bắt đầu từ việc thấu hiểu mục tiêu của người dùng và bài toán kinh doanh của bạn. Chúng tôi phác thảo sơ đồ luồng thao tác (User Flow), dựng khung sườn Wireframe để thống nhất cấu trúc, sau đó hoàn thiện giao diện đồ họa sắc nét trên Figma. Đặc biệt, chúng tôi tạo ra bản mẫu tương tác sống động (Clickable Prototype) cho phép bạn bấm thử như một ứng dụng thật trước khi chuyển sang giai đoạn lập trình, giúp tiết kiệm tối đa thời gian và chi phí chỉnh sửa.",
    process: [
      { step: "01", name: "Nghiên cứu người dùng", desc: "Tìm hiểu chân dung người dùng, thói quen thao tác và bối cảnh sử dụng." },
      { step: "02", name: "Xây dựng User Flow", desc: "Thiết lập sơ đồ các bước để người dùng hoàn thành nhiệm vụ nhanh nhất." },
      { step: "03", name: "Dựng Wireframe", desc: "Vẽ bố cục khung xương đen trắng để chốt cấu trúc thông tin." },
      { step: "04", name: "Thiết kế UI sắc nét", desc: "Phối màu sắc, typography, icon và các thành phần giao diện trên Figma." },
      { step: "05", name: "Làm bản Prototype", desc: "Nối các màn hình tạo tương tác bấm thử thực tế để kiểm tra trải nghiệm." },
      { step: "06", name: "Đóng gói bàn giao", desc: "Bàn giao file Figma kèm Design System chuẩn cho đội ngũ lập trình." },
    ],
    deliverables: [
      "File thiết kế hoàn chỉnh trên nền tảng Figma tổ chức khoa học",
      "Bản mẫu tương tác thử nghiệm (Clickable Prototype) xem thử trực tiếp",
      "Bộ thư viện thành phần giao diện (Design System: màu sắc, font, button, icon)",
      "Tài liệu ghi chú hướng dẫn chi tiết cho đội ngũ lập trình viên",
    ],
    targetAudience: [
      "Doanh nghiệp, startup đang chuẩn bị phát triển ứng dụng di động hoặc Web App",
      "Chủ website muốn tái thiết kế lại toàn bộ giao diện để cải thiện tỷ lệ chuyển đổi",
      "Các nhóm phát triển phần mềm cần thuê ngoài khâu thiết kế giao diện chuyên nghiệp",
    ],
    faqs: [
      {
        question: "Tôi có thể bấm thử giao diện trước khi lập trình không?",
        answer: "Có. Chúng tôi cung cấp link Prototype trên Figma cho phép bạn và đối tác trực tiếp bấm thử các nút và chuyển trang trên điện thoại/máy tính như app thật.",
      },
      {
        question: "Lập trình viên của tôi có dễ dàng sử dụng file thiết kế này không?",
        answer: "File Figma được tổ chức theo chuẩn Auto-layout, quy định mã màu và khoảng cách rõ ràng giúp lập trình viên lấy thông số và mã code CSS cực kỳ thuận tiện.",
      },
      {
        question: "Thiết kế có bao gồm cả phiên bản di động và máy tính không?",
        answer: "Có. Chúng tôi thiết kế giao diện đáp ứng cho cả màn hình Desktop và Mobile theo phạm vi thỏa thuận dự án.",
      },
      {
        question: "Thời gian hoàn thành một dự án thiết kế UI/UX là bao lâu?",
        answer: "Thông thường từ 2 đến 4 tuần tùy thuộc vào số lượng màn hình và độ phức tạp của luồng tính năng.",
      },
    ],
    relatedSlugs: ["web-application", "mobile-application", "business-website", "custom-software"],
    thumbnail: "https://ftwfwhxfbrqnrwmjrmrq.supabase.co/storage/v1/object/public/nguyen-agency-media/services/1794469433590-a229e5fe-0664-46dc-ae26-68cf52a4e924.png",
    coverImage: "https://ftwfwhxfbrqnrwmjrmrq.supabase.co/storage/v1/object/public/nguyen-agency-media/services/1794469433590-a229e5fe-0664-46dc-ae26-68cf52a4e924.png",
  },

  // -------------------------------------------------------------
  // 24. Content Creation
  // -------------------------------------------------------------
  {
    id: "srv-24",
    order: 24,
    title: "Content Creation",
    titleVn: "Dịch Vụ Sáng Tạo Nội Dung",
    slug: "content-creation",
    group: "MEDIA",
    categoryName: "Branding & Visual",
    shortDesc:
      "Lên kế hoạch và sản xuất nội dung bài viết, hình ảnh hoặc kịch bản video phù hợp với khách hàng mục tiêu và giọng điệu thương hiệu.",
    seoTitle: "Dịch Vụ Sáng Tạo Nội Dung Đa Nền Tảng | Nguyên Agency",
    metaDescription:
      "Lên kế hoạch và sản xuất nội dung bài viết chuẩn SEO, kịch bản video và thông điệp truyền thông đúng giọng điệu thương hiệu tại Nguyên Agency.",
    primaryKeyword: "dịch vụ sáng tạo nội dung",
    proposedItems: [
      "Kế hoạch lịch nội dung định kỳ (Content Calendar)",
      "Bài viết chuẩn SEO cho website và bài đăng mạng xã hội",
      "Kịch bản nội dung cho video ngắn (TikTok, Reels, Shorts)",
      "Tài liệu bàn giao nội dung hoàn chỉnh theo tiến độ cam kết",
    ],
    intro:
      "Người ta thường nói: 'Nội dung là vua' (Content is King). Trong một thế giới tràn ngập thông tin, người đọc không còn kiên nhẫn với những bài viết sáo rỗng, giật tít vô bổ hay văn phong thô cứng. Một chiến lược nội dung bài bản cần xuất phát từ sự thấu cảm nỗi đau của khách hàng, cung cấp những giải pháp thực sự có giá trị và thể hiện đúng tính cách của thương hiệu. Nội dung chất lượng cao không chỉ giúp website của bạn leo lên thứ hạng cao trên Google mà còn xây dựng niềm tin vững chắc, biến người đọc vãng lai thành khách hàng trung thành. Dịch vụ sáng tạo nội dung của Nguyên Agency mang đến giải pháp câu chữ giàu cảm xúc, chuẩn SEO và thúc đẩy hành động thực tế.",
    clientProblems: [
      "Không có thời gian hoặc không biết viết gì để duy trì bài đăng đều đặn trên web và fanpage.",
      "Bài viết khô khan, thiếu cảm xúc, không thu hút được lượt đọc và tương tác.",
      "Viết nhiều bài nhưng website không lên Top Google do thiếu kỹ thuật tối ưu SEO On-page.",
      "Nội dung giữa các kênh bị rời rạc, không nhất quán về giọng điệu thương hiệu.",
    ],
    solution:
      "Nguyên Agency bắt đầu bằng việc lập kế hoạch lịch nội dung (Content Calendar) rõ ràng theo tháng: phân bổ hợp lý giữa các nhóm bài chia sẻ kiến thức hữu ích, bài giới thiệu câu chuyện thương hiệu và bài viết bán hàng chuyển đổi. Đội ngũ Copywriter của chúng tôi nghiên cứu kỹ lưỡng từ khóa tìm kiếm của người dùng, áp dụng kỹ thuật viết cuốn hút và lồng ghép khéo léo lời kêu gọi hành động. Mỗi bài viết đều được chau chuốt kỹ càng về văn phong, chính tả và tối ưu đầy đủ các tiêu chuẩn SEO kỹ thuật.",
    process: [
      { step: "01", name: "Định hình giọng điệu", desc: "Xác định giọng điệu (Tone of Voice) phù hợp phong cách thương hiệu." },
      { step: "02", name: "Lập lịch nội dung", desc: "Lên danh sách đề tài bài viết theo tuần/tháng với các góc nhìn đa dạng." },
      { step: "03", name: "Nghiên cứu từ khóa", desc: "Tìm kiếm các cụm từ khóa có nhu cầu tra cứu thực tế trên Google." },
      { step: "04", name: "Biên tập nội dung", desc: "Viết bài chi tiết, trau chuốt câu từ và lồng ghép thông điệp thương hiệu." },
      { step: "05", name: "Tối ưu hóa SEO", desc: "Kiểm tra thẻ tiêu đề, mô tả, heading và mật độ từ khóa tự nhiên." },
      { step: "06", name: "Bàn giao & đăng tải", desc: "Bàn giao tài liệu bài viết hoàn chỉnh kèm gợi ý hình ảnh phù hợp." },
    ],
    deliverables: [
      "Bảng lịch kế hoạch nội dung chi tiết theo tuần/tháng",
      "Tập hợp các bài viết chuẩn SEO hoàn chỉnh cho website (1000 - 1500 từ)",
      "Bộ bài viết súc tích kèm tiêu đề cuốn hút cho mạng xã hội",
      "Kịch bản nội dung cho video ngắn (TikTok, Reels, Shorts) nếu có trong gói",
    ],
    targetAudience: [
      "Doanh nghiệp muốn xây dựng blog website chuyên sâu để kéo lưu lượng tìm kiếm tự nhiên",
      "Chủ shop, nhãn hàng cần duy trì bài đăng Fanpage đều đặn mà không có nhân sự viết",
      "Các đơn vị chuẩn bị thực hiện chiến dịch truyền thông giáo dục thị trường",
    ],
    faqs: [
      {
        question: "Bài viết có đảm bảo không sao chép (Unique 100%) không?",
        answer: "Toàn bộ bài viết do Nguyên Agency biên tập là nội dung mới 100%, được kiểm tra nghiêm ngặt qua các công cụ chống đạo văn trước khi bàn giao.",
      },
      {
        question: "Bài viết website có được tối ưu chuẩn SEO không?",
        answer: "Có. Bài viết được tối ưu đầy đủ thẻ tiêu đề (Title), thẻ mô tả (Meta Description), phân bổ heading H2, H3 logic và mật độ từ khóa tự nhiên.",
      },
      {
        question: "Tôi có thể duyệt và yêu cầu chỉnh sửa bài viết trước khi đăng không?",
        answer: "Chúng tôi luôn gửi bản thảo để bạn đọc duyệt trước và tiếp thu chỉnh sửa câu từ theo mong muốn của bạn.",
      },
      {
        question: "Nguyên Agency có nhận dịch vụ viết bài trọn gói theo tháng không?",
        answer: "Có. Chúng tôi cung cấp các gói quản trị nội dung định kỳ theo tháng (10, 20 hoặc 30 bài/tháng) giúp bạn an tâm duy trì kênh truyền thông.",
      },
    ],
    relatedSlugs: ["digital-marketing", "social-media-design", "advertising-creative", "business-website"],
    thumbnail: "https://ftwfwhxfbrqnrwmjrmrq.supabase.co/storage/v1/object/public/nguyen-agency-media/services/1794468998443-4c9792eb-22be-466e-94e5-777540b2da76.png",
    coverImage: "https://ftwfwhxfbrqnrwmjrmrq.supabase.co/storage/v1/object/public/nguyen-agency-media/services/1794468998443-4c9792eb-22be-466e-94e5-777540b2da76.png",
  },
];

export function getServiceBySlug(slug: string): ServiceDetailData | undefined {
  const normalized = slug.toLowerCase().trim();
  return OFFICIAL_24_SERVICES.find(
    (s) => s.slug === normalized || s.aliases?.includes(normalized)
  );
}

