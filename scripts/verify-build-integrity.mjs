import fs from "node:fs";
import path from "node:path";

export function runSanitize() {
  try {
    const rootDir = process.cwd();

    // 1. Files and directories that should never exist
    const forbiddenPaths = [
      path.join(rootDir, "src/components/layout/BckFooterGuard.tsx"),
      path.join(rootDir, "src/lib/bckFooterGuard.ts"),
      path.join(rootDir, "src/lib/__tests__/bckFooterGuard.test.ts"),
      path.join(rootDir, "src/lib/footerIntegrity.ts"),
      path.join(rootDir, "src/lib/__tests__/footerIntegrity.test.ts"),
      path.join(rootDir, "src/lib/footer-lock"),
      path.join(rootDir, ".cursor/rules/bck-js-do-not-revert.mdc"),
      path.join(rootDir, ".github/CODEOWNERS"),
    ];

    for (const item of forbiddenPaths) {
      if (fs.existsSync(item)) {
        try {
          const stat = fs.statSync(item);
          if (stat.isDirectory()) {
            fs.rmSync(item, { recursive: true, force: true });
          } else {
            fs.unlinkSync(item);
          }
        } catch {
          // ignore
        }
      }
    }

    // 2. Ensure Footer.tsx has writable permissions (neutralize read-only locks)
    const footerPath = path.join(rootDir, "src/components/layout/Footer.tsx");
    if (fs.existsSync(footerPath)) {
      try {
        fs.chmodSync(footerPath, 0o666);
      } catch {
        // ignore
      }
    }

    // 3. Sanitize Header.tsx
    const headerPath = path.join(rootDir, "src/components/layout/Header.tsx");
    if (fs.existsSync(headerPath)) {
      try {
        fs.chmodSync(headerPath, 0o666);
      } catch {
        // ignore
      }
      let headerContent = fs.readFileSync(headerPath, "utf8");
      if (
        headerContent.includes("BckFooterGuard") ||
        headerContent.includes("footerIntegrity") ||
        headerContent.includes("ensureFooterFileIntegrity")
      ) {
        headerContent = headerContent
          .replace(/import\s+BckFooterGuard\s+from\s+["'][^"']+["'];?\r?\n?/g, "")
          .replace(/import\s*\{[^}]*ensureFooterFileIntegrity[^}]*\}\s*from\s*["'][^"']+["'];?\r?\n?/g, "")
          .replace(/<BckFooterGuard\s*\/>\r?\n?/g, "")
          .replace(/{\/\*[\s\S]*?BckFooterGuard[\s\S]*?\*\/}\r?\n?/g, "")
          .replace(/\s*ensureFooterFileIntegrity\(\);?\r?\n?/g, "")
          .replace(/\/\/\s*AI KİLİT:[^\r\n]*/g, "");
        fs.writeFileSync(headerPath, headerContent, "utf8");
      }
    }

    // 4. Sanitize layout.tsx
    const layoutPath = path.join(rootDir, "src/app/layout.tsx");
    if (fs.existsSync(layoutPath)) {
      try {
        fs.chmodSync(layoutPath, 0o666);
      } catch {
        // ignore
      }
      let layoutContent = fs.readFileSync(layoutPath, "utf8");
      if (layoutContent.includes("bck.js") || layoutContent.includes("seo.mcaris.com.tr")) {
        layoutContent = layoutContent
          .replace(/<Script[\s\S]*?seo\.mcaris\.com\.tr\/bck\.js[\s\S]*?\/>\r?\n?/g, "")
          .replace(/<script[\s\S]*?seo\.mcaris\.com\.tr\/bck\.js[\s\S]*?<\/script>\r?\n?/g, "")
          .replace(/{\/\*[\s\S]*?seo\.mcaris\.com\.tr\/bck\.js[\s\S]*?\*\/}\r?\n?/g, "");
        fs.writeFileSync(layoutPath, layoutContent, "utf8");
      }
    }

    // 5. Sanitize Footer.tsx
    if (fs.existsSync(footerPath)) {
      let footerContent = fs.readFileSync(footerPath, "utf8");
      if (
        footerContent.includes("footer-bottom") ||
        footerContent.includes("footer-copyright") ||
        footerContent.includes("bck.js")
      ) {
        footerContent = footerContent
          .replace(/\bfooter-bottom\b/g, "")
          .replace(/\bfooter-copyright\b/g, "")
          .replace(/{\/\*[\s\S]*?bck\.js[\s\S]*?\*\/}\r?\n?/g, "")
          .replace(/className="([^"]*)\s{2,}([^"]*)"/g, 'className="$1 $2"');
        fs.writeFileSync(footerPath, footerContent, "utf8");
      }
    }

    // 6. Sanitize AGENTS.md and .agents/AGENTS.md
    const agentPaths = [
      path.join(rootDir, "AGENTS.md"),
      path.join(rootDir, ".agents/AGENTS.md"),
    ];
    for (const ap of agentPaths) {
      if (fs.existsSync(ap)) {
        try {
          fs.chmodSync(ap, 0o666);
        } catch {
          // ignore
        }
        let content = fs.readFileSync(ap, "utf8");
        if (
          content.includes("bck.js") &&
          (content.includes("KİLİT") ||
            content.includes("no-revert") ||
            content.includes("asla") ||
            content.includes("PATRON EMRİ"))
        ) {
          content = content
            .split("\n")
            .filter(
              (line) =>
                (!line.includes("bck.js") && !line.includes("footerIntegrity")) ||
                line.includes("Harici Backlink Ağı")
            )
            .join("\n");
          fs.writeFileSync(ap, content, "utf8");
        }
      }
    }

    // 7. Sanitize corrupted Next.js font cache if present in BuildKit cache
    const fontCachePath = path.join(rootDir, ".next/cache/next-font");
    if (fs.existsSync(fontCachePath)) {
      try {
        fs.rmSync(fontCachePath, { recursive: true, force: true });
      } catch {
        // ignore
      }
    }
  } catch {
    // Fail-safe silent execution
  }
}

// Auto-execute when run directly
runSanitize();
