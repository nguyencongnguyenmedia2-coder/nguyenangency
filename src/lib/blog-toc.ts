export interface TocHeading {
  id: string;
  text: string;
  level: 2 | 3;
}

export function extractBlogHeadings(content: string): TocHeading[] {
  const lines = (content || "").split("\n");
  const headings: TocHeading[] = [];

  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    if (trimmed.startsWith("### ")) {
      const text = trimmed.replace(/^###\s+/, "");
      headings.push({
        id: `section-${idx}`,
        text,
        level: 3,
      });
    } else if (trimmed.startsWith("## ")) {
      const text = trimmed.replace(/^##\s+/, "");
      headings.push({
        id: `section-${idx}`,
        text,
        level: 2,
      });
    }
  });

  // If plain text article has no markdown headings, provide default editorial sections
  if (headings.length === 0) {
    return [
      { id: "article-overview", text: "Tổng quan & Bối cảnh", level: 2 },
      { id: "article-analysis", text: "Phân tích chuyên sâu", level: 2 },
      { id: "article-takeaways", text: "Giải pháp & Ứng dụng thực tế", level: 2 },
    ];
  }

  return headings;
}

