#!/usr/bin/env node
/**
 * Automated SEO + GEO + AEO Technical Audit Script for Nguyen Agency
 * Usage: node scripts/seo-audit.mjs [--url https://nguyenagency.online] [--max 80]
 */
import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const urlArgIdx = args.indexOf("--url");
const maxArgIdx = args.indexOf("--max");
const BASE_URL = (urlArgIdx !== -1 && args[urlArgIdx + 1] ? args[urlArgIdx + 1] : "https://nguyenagency.online").replace(/\/+$/, "");
const MAX_PAGES = maxArgIdx !== -1 && args[maxArgIdx + 1] ? Number(args[maxArgIdx + 1]) : 80;

const issues = [];
const addIssue = (severity, category, url, message) => {
  issues.push({ severity, category, url, message });
};

async function fetchText(url) {
  const res = await fetch(url, {
    redirect: "manual",
    headers: { "User-Agent": "NguyenAgency-SEO-Audit/1.0" },
  });
  const text = await res.text();
  return { status: res.status, headers: Object.fromEntries(res.headers.entries()), text };
}

function extractTag(html, regex) {
  const m = html.match(regex);
  return m ? m[1].trim() : null;
}

function extractAll(html, regex) {
  return [...html.matchAll(regex)].map((m) => m[1]);
}

async function run() {
  console.log(`=== SEO + GEO + AEO Audit: ${BASE_URL} ===`);
  const summary = {
    baseUrl: BASE_URL,
    auditedAt: new Date().toISOString(),
    endpoints: {},
    pagesChecked: 0,
    brokenInternalLinks: [],
    counts: { Critical: 0, High: 0, Medium: 0, Low: 0 },
  };

  // 1. Check core discovery endpoints
  for (const ep of ["/robots.txt", "/llms.txt", "/llms-full.txt", "/sitemap.xml"]) {
    const target = `${BASE_URL}${ep}`;
    try {
      const res = await fetchText(target);
      summary.endpoints[ep] = { status: res.status, bytes: Buffer.byteLength(res.text, "utf8") };
      if (res.status !== 200) {
        addIssue("Critical", "Discovery", target, `Endpoint returned HTTP ${res.status}`);
      } else if (res.text.trim().length < 20) {
        addIssue("High", "Discovery", target, "Endpoint content is unexpectedly empty");
      }
      if (ep === "/robots.txt" && res.status === 200) {
        if (!/sitemap:/i.test(res.text)) {
          addIssue("High", "Robots", target, "robots.txt missing Sitemap directive");
        }
        if (!/OAI-SearchBot|PerplexityBot|Googlebot|Bingbot/i.test(res.text)) {
          addIssue("Medium", "GEO", target, "robots.txt does not explicitly list Search/AI search crawlers");
        }
      }
    } catch (err) {
      summary.endpoints[ep] = { status: "ERROR", error: String(err) };
      addIssue("Critical", "Discovery", target, `Fetch failed: ${err.message}`);
    }
  }

  // 2. Collect URLs from sitemap.xml
  let urlsToCheck = [`${BASE_URL}/`, `${BASE_URL}/services`, `${BASE_URL}/about`, `${BASE_URL}/portfolio`, `${BASE_URL}/blog`, `${BASE_URL}/contact`, `${BASE_URL}/faq`, `${BASE_URL}/pricing`, `${BASE_URL}/lab`];
  try {
    const smRes = await fetchText(`${BASE_URL}/sitemap.xml`);
    if (smRes.status === 200) {
      const locs = extractAll(smRes.text, /<loc>([^<]+)<\/loc>/gi).map((u) => {
        if (BASE_URL.includes("localhost") || BASE_URL.includes("127.0.0.1")) {
          return u.replace(/^https?:\/\/nguyenagency\.online/i, BASE_URL);
        }
        return u;
      });
      if (locs.length > 0) {
        urlsToCheck = [...new Set(locs)].slice(0, MAX_PAGES);
      }
    }
  } catch {
    // fallback to default list
  }

  const titleMap = new Map();
  const internalLinks = new Set();
  const pageResults = [];

  // 3. Audit each page in batches of 5
  for (let i = 0; i < urlsToCheck.length; i += 5) {
    const batch = urlsToCheck.slice(i, i + 5);
    const results = await Promise.all(
      batch.map(async (pageUrl) => {
        try {
          const { status, text } = await fetchText(pageUrl);
          if (status >= 400) {
            addIssue("Critical", "HTTP", pageUrl, `HTTP ${status}`);
            return { url: pageUrl, status };
          }
          if (status >= 300) {
            addIssue("High", "Redirect", pageUrl, `Sitemap/page URL redirects (${status})`);
            return { url: pageUrl, status };
          }

          const title = extractTag(text, /<title[^>]*>([\s\S]*?)<\/title>/i);
          const desc =
            extractTag(text, /<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i) ||
            extractTag(text, /<meta[^>]+content=["']([^"']*)["'][^>]+name=["']description["']/i);
          const canonical =
            extractTag(text, /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']*)["']/i) ||
            extractTag(text, /<link[^>]+href=["']([^"']*)["'][^>]+rel=["']canonical["']/i);
          const robotsMeta =
            extractTag(text, /<meta[^>]+name=["']robots["'][^>]+content=["']([^"']*)["']/i) || "";

          if (!title) {
            addIssue("Critical", "Metadata", pageUrl, "Missing <title>");
          } else {
            const list = titleMap.get(title) || [];
            list.push(pageUrl);
            titleMap.set(title, list);
          }

          if (!desc) {
            addIssue("High", "Metadata", pageUrl, "Missing meta description");
          } else if (desc.length < 50) {
            addIssue("Low", "Metadata", pageUrl, `Meta description short (${desc.length} chars)`);
          }

          if (!canonical) {
            addIssue("High", "Canonical", pageUrl, "Missing canonical link tag");
          } else if (canonical.includes("vercel.app")) {
            addIssue("Critical", "Canonical", pageUrl, `Stale vercel.app canonical: ${canonical}`);
          }

          if (/noindex/i.test(robotsMeta)) {
            addIssue("Critical", "Indexability", pageUrl, `Public/sitemap page has noindex (${robotsMeta})`);
          }

          const h1Matches = [...text.matchAll(/<h1\b[^>]*>/gi)];
          if (h1Matches.length === 0) {
            addIssue("Medium", "Heading", pageUrl, "Missing <h1>");
          } else if (h1Matches.length > 1) {
            addIssue("Low", "Heading", pageUrl, `Multiple <h1> tags (${h1Matches.length})`);
          }

          // Check JSON-LD validity
          const jsonLdBlocks = extractAll(text, /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi);
          if (jsonLdBlocks.length === 0) {
            addIssue("Medium", "Schema", pageUrl, "No JSON-LD structured data found");
          } else {
            for (const block of jsonLdBlocks) {
              try {
                JSON.parse(block);
              } catch (e) {
                addIssue("Critical", "Schema", pageUrl, `Invalid JSON-LD: ${e.message}`);
              }
            }
          }

          // Check images missing alt
          const imgTags = [...text.matchAll(/<img\b([^>]*)>/gi)];
          let missingAltCount = 0;
          for (const m of imgTags) {
            const attrs = m[1];
            if (!/\balt\s*=\s*["'][^"']*["']/i.test(attrs)) {
              missingAltCount++;
            }
          }
          if (missingAltCount > 0) {
            addIssue("Low", "Media", pageUrl, `${missingAltCount} <img> tag(s) missing alt attribute`);
          }

          // Collect internal links
          const hrefs = extractAll(text, /<a\b[^>]+href=["'](\/[^"'#?]+)["']/gi);
          for (const h of hrefs) {
            if (!h.startsWith("/_next") && !h.startsWith("/api/")) {
              internalLinks.add(`${BASE_URL}${h}`);
            }
          }

          return {
            url: pageUrl,
            status,
            title,
            hasDescription: Boolean(desc),
            canonical,
            h1Count: h1Matches.length,
            jsonLdCount: jsonLdBlocks.length,
          };
        } catch (err) {
          addIssue("Critical", "HTTP", pageUrl, `Fetch failed: ${err.message}`);
          return { url: pageUrl, status: "ERROR" };
        }
      })
    );
    pageResults.push(...results);
  }

  // 4. Duplicate titles check
  for (const [title, urls] of titleMap.entries()) {
    if (urls.length > 1) {
      addIssue("High", "Duplicate", urls.join(", "), `Duplicate <title> "${title}" across ${urls.length} pages`);
    }
  }

  // 5. Check discovered internal links not yet audited (up to 40)
  const auditedSet = new Set(urlsToCheck);
  const extraLinks = [...internalLinks].filter((u) => !auditedSet.has(u)).slice(0, 40);
  for (let i = 0; i < extraLinks.length; i += 5) {
    const batch = extraLinks.slice(i, i + 5);
    await Promise.all(
      batch.map(async (linkUrl) => {
        try {
          const res = await fetch(linkUrl, { method: "HEAD", redirect: "manual" });
          if (res.status >= 400) {
            summary.brokenInternalLinks.push({ url: linkUrl, status: res.status });
            addIssue("High", "BrokenLink", linkUrl, `Internal link returned HTTP ${res.status}`);
          }
        } catch (err) {
          summary.brokenInternalLinks.push({ url: linkUrl, status: "ERROR" });
          addIssue("High", "BrokenLink", linkUrl, `Internal link check failed: ${err.message}`);
        }
      })
    );
  }

  summary.pagesChecked = pageResults.length;
  for (const issue of issues) {
    summary.counts[issue.severity] = (summary.counts[issue.severity] || 0) + 1;
  }

  // Write reports
  const reportDir = path.resolve(process.cwd(), "reports");
  fs.mkdirSync(reportDir, { recursive: true });
  const jsonPath = path.join(reportDir, "seo-audit-report.json");
  const mdPath = path.join(reportDir, "seo-audit-report.md");

  fs.writeFileSync(jsonPath, JSON.stringify({ summary, issues, pages: pageResults }, null, 2), "utf8");

  const mdLines = [
    `# Báo Cáo Kiểm Tra SEO + GEO + AEO (${BASE_URL})`,
    `- Thời gian: ${summary.auditedAt}`,
    `- Số trang kiểm tra: ${summary.pagesChecked}`,
    `- Tổng lỗi: Critical=${summary.counts.Critical}, High=${summary.counts.High}, Medium=${summary.counts.Medium}, Low=${summary.counts.Low}`,
    "",
    "## 1. Endpoints cốt lõi",
    ...Object.entries(summary.endpoints).map(([k, v]) => `- \`${k}\`: HTTP ${v.status} (${v.bytes ?? 0} bytes)`),
    "",
    "## 2. Danh sách vấn đề phát hiện",
    ...(issues.length === 0
      ? ["- Không phát hiện lỗi."]
      : issues.map((i) => `- **[${i.severity}]** (${i.category}) \`${i.url}\`: ${i.message}`)),
  ];
  fs.writeFileSync(mdPath, mdLines.join("\n"), "utf8");

  console.log(`Checked ${summary.pagesChecked} pages. Endpoints:`, summary.endpoints);
  console.log(`Issues -> Critical: ${summary.counts.Critical}, High: ${summary.counts.High}, Medium: ${summary.counts.Medium}, Low: ${summary.counts.Low}`);
  console.log(`Reports saved to:\n- ${mdPath}\n- ${jsonPath}`);
}

run().catch((err) => {
  console.error("Audit fatal error:", err);
  process.exit(1);
});

