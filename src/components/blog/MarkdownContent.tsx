import React from "react";
import Link from "next/link";
import Image from "next/image";

interface MarkdownContentProps {
  content: string;
}

/**
 * Parses inline markdown: **bold**, *italic*, `code`, [link](url)
 */
function renderInline(text: string): React.ReactNode[] {
  const elements: React.ReactNode[] = [];
  // Tokenize regex for links, bold, italic, code
  const regex = /(\[.*?\]\(.*?\)|\*\*.*?\*\*|\*.*?\*|`.*?`)/g;
  const parts = text.split(regex);

  parts.forEach((part, index) => {
    if (!part) return;

    // Link: [text](href)
    const linkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/);
    if (linkMatch) {
      const [, linkText, href] = linkMatch;
      const isInternal = href.startsWith("/") || href.includes("shop.mcaris.com.tr");
      if (isInternal) {
        elements.push(
          <Link
            key={index}
            href={href}
            className="text-sky-700 font-semibold underline underline-offset-3 hover:text-sky-950 transition-colors"
          >
            {renderInline(linkText)}
          </Link>
        );
      } else {
        elements.push(
          <a
            key={index}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sky-700 font-semibold underline underline-offset-3 hover:text-sky-950 transition-colors"
          >
            {renderInline(linkText)}
          </a>
        );
      }
      return;
    }

    // Bold: **text**
    if (part.startsWith("**") && part.endsWith("**") && part.length >= 4) {
      elements.push(
        <strong key={index} className="font-bold text-neutral-950">
          {renderInline(part.slice(2, -2))}
        </strong>
      );
      return;
    }

    // Italic: *text*
    if (part.startsWith("*") && part.endsWith("*") && part.length >= 2) {
      elements.push(
        <em key={index} className="italic text-neutral-800">
          {renderInline(part.slice(1, -1))}
        </em>
      );
      return;
    }

    // Inline Code: `text`
    if (part.startsWith("`") && part.endsWith("`") && part.length >= 2) {
      elements.push(
        <code key={index} className="px-1.5 py-0.5 rounded bg-neutral-100 text-xs font-mono text-neutral-800">
          {part.slice(1, -1)}
        </code>
      );
      return;
    }

    // Plain text
    elements.push(part);
  });

  return elements;
}

export function MarkdownContent({ content }: MarkdownContentProps) {
  if (!content) return null;

  const lines = content.split("\n");
  const nodes: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    // 1. Empty lines
    if (!trimmed) {
      i++;
      continue;
    }

    // 2. Horizontal rule
    if (/^(\*\*\*|---|___)$/.test(trimmed)) {
      nodes.push(<hr key={`hr-${i}`} className="my-8 border-neutral-200/80" />);
      i++;
      continue;
    }

    // 3. Headings
    if (trimmed.startsWith("### ")) {
      const text = trimmed.replace(/^###\s+/, "");
      const id = text.toLowerCase().replace(/[^a-z0-9ğüşıöç]+/g, "-");
      nodes.push(
        <h3 key={`h3-${i}`} id={id} className="text-lg sm:text-xl font-bold text-neutral-950 mt-8 mb-3 scroll-mt-20">
          {renderInline(text)}
        </h3>
      );
      i++;
      continue;
    }
    if (trimmed.startsWith("## ")) {
      const text = trimmed.replace(/^##\s+/, "");
      const id = text.toLowerCase().replace(/[^a-z0-9ğüşıöç]+/g, "-");
      nodes.push(
        <h2 key={`h2-${i}`} id={id} className="text-xl sm:text-2xl font-extrabold text-neutral-950 mt-10 mb-4 pb-2 border-b border-neutral-100 scroll-mt-20">
          {renderInline(text)}
        </h2>
      );
      i++;
      continue;
    }
    if (trimmed.startsWith("# ")) {
      const text = trimmed.replace(/^#\s+/, "");
      nodes.push(
        <h1 key={`h1-${i}`} className="text-2xl sm:text-3xl font-extrabold text-neutral-950 mt-8 mb-4">
          {renderInline(text)}
        </h1>
      );
      i++;
      continue;
    }

    // 4. Image: ![alt](src)
    const imgMatch = trimmed.match(/^!\[(.*?)\]\((.*?)\)$/);
    if (imgMatch) {
      const [, alt, src] = imgMatch;
      nodes.push(
        <figure key={`img-${i}`} className="my-8 rounded-2xl overflow-hidden border border-neutral-200 bg-neutral-50 shadow-2xs">
          <div className="relative aspect-[16/9] w-full">
            <Image
              src={src}
              alt={alt || "MCARIS Medikal Ekipman"}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 800px"
            />
          </div>
          {alt && (
            <figcaption className="text-center py-2.5 px-4 text-xs font-medium text-neutral-500 bg-neutral-50/80 border-t border-neutral-100">
              {alt}
            </figcaption>
          )}
        </figure>
      );
      i++;
      continue;
    }

    // 5. Blockquote / Alert
    if (trimmed.startsWith("> ")) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith("> ")) {
        quoteLines.push(lines[i].trim().replace(/^>\s+/, ""));
        i++;
      }
      const quoteText = quoteLines.join(" ");
      const isImportant = quoteText.includes("[!IMPORTANT]") || quoteText.includes("Önemli:");
      const isWarning = quoteText.includes("[!WARNING]") || quoteText.includes("Dikkat:");
      const cleanQuoteText = quoteText
        .replace(/\[!IMPORTANT\]|\[!WARNING\]|\[!NOTE\]|\[!TIP\]/g, "")
        .trim();

      nodes.push(
        <blockquote
          key={`quote-${i}`}
          className={`my-6 pl-5 py-3.5 pr-4 rounded-r-xl border-l-4 text-sm leading-relaxed ${
            isImportant || isWarning
              ? "bg-amber-50/70 border-amber-500 text-amber-950 font-medium"
              : "bg-sky-50/60 border-sky-600 text-slate-800"
          }`}
        >
          {renderInline(cleanQuoteText)}
        </blockquote>
      );
      continue;
    }

    // 6. Tables: lines starting and ending with |
    if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith("|") && lines[i].trim().endsWith("|")) {
        tableLines.push(lines[i].trim());
        i++;
      }

      if (tableLines.length >= 2) {
        const headerRow = tableLines[0]
          .split("|")
          .slice(1, -1)
          .map((c) => c.trim());

        // Skip separator row (tableLines[1])
        const bodyRows = tableLines.slice(2).map((row) =>
          row
            .split("|")
            .slice(1, -1)
            .map((c) => c.trim())
        );

        nodes.push(
          <div key={`table-${i}`} className="my-8 overflow-x-auto rounded-xl border border-neutral-200 bg-white shadow-2xs">
            <table className="w-full border-collapse text-left text-xs sm:text-sm">
              <thead className="bg-neutral-100/90 text-neutral-900 border-b border-neutral-200">
                <tr>
                  {headerRow.map((th, thIdx) => (
                    <th key={thIdx} className="px-4 py-3 font-bold">
                      {renderInline(th)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200/80">
                {bodyRows.map((row, rowIdx) => (
                  <tr key={rowIdx} className="hover:bg-neutral-50/75 transition-colors">
                    {row.map((td, tdIdx) => (
                      <td key={tdIdx} className="px-4 py-3 text-neutral-700 leading-normal">
                        {renderInline(td)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        continue;
      }
    }

    // 7. Unordered List (- or *)
    if (/^[-*]\s+/.test(trimmed)) {
      const listItems: string[] = [];
      while (i < lines.length && /^[-*]\s+/.test(lines[i].trim())) {
        listItems.push(lines[i].trim().replace(/^[-*]\s+/, ""));
        i++;
      }
      nodes.push(
        <ul key={`ul-${i}`} className="my-4 space-y-2 list-disc pl-5 text-sm sm:text-base text-neutral-800 leading-relaxed marker:text-neutral-400">
          {listItems.map((item, itemIdx) => (
            <li key={itemIdx}>{renderInline(item)}</li>
          ))}
        </ul>
      );
      continue;
    }

    // 8. Ordered List (1. 2. 3.)
    if (/^\d+\.\s+/.test(trimmed)) {
      const listItems: string[] = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i].trim())) {
        listItems.push(lines[i].trim().replace(/^\d+\.\s+/, ""));
        i++;
      }
      nodes.push(
        <ol key={`ol-${i}`} className="my-4 space-y-2 list-decimal pl-5 text-sm sm:text-base text-neutral-800 leading-relaxed marker:text-neutral-500 font-medium">
          {listItems.map((item, itemIdx) => (
            <li key={itemIdx} className="font-normal text-neutral-800">
              {renderInline(item)}
            </li>
          ))}
        </ol>
      );
      continue;
    }

    // 9. Regular Paragraph
    const paragraphLines: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() &&
      !lines[i].trim().startsWith("#") &&
      !lines[i].trim().startsWith(">") &&
      !lines[i].trim().startsWith("|") &&
      !/^[-*]\s+/.test(lines[i].trim()) &&
      !/^\d+\.\s+/.test(lines[i].trim()) &&
      !/^!\[(.*?)\]\((.*?)\)$/.test(lines[i].trim()) &&
      !/^(\*\*\*|---|___)$/.test(lines[i].trim())
    ) {
      paragraphLines.push(lines[i].trim());
      i++;
    }

    if (paragraphLines.length > 0) {
      nodes.push(
        <p key={`p-${i}`} className="text-sm sm:text-base text-neutral-700 leading-relaxed my-3.5">
          {renderInline(paragraphLines.join(" "))}
        </p>
      );
    }
  }

  return <div className="markdown-content">{nodes}</div>;
}
