import { useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkDirective from "remark-directive";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import "highlight.js/styles/github.css";
import React, { type ComponentPropsWithoutRef } from "react";
import type { Plugin } from "unified";
import type { Root } from "mdast";
import { visit } from "unist-util-visit";

const docModules = import.meta.glob("../docs/**/*.md", {
  query: "?raw",
  import: "default",
});

function buildKey(slug: string) {
  return `../docs/${slug}.md`;
}

// ── Admonition plugin ──────────────────────────────────────
const remarkAdmonitions: Plugin<[], Root> = () => (tree) => {
  visit(tree, (node) => {
    if (
      node.type !== "containerDirective" &&
      node.type !== "leafDirective" &&
      node.type !== "textDirective"
    ) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const d = node as any;
    const type: string = d.name;
    const hast = d.data ?? (d.data = {});
    hast.hName = "div";
    hast.hProperties = { className: `admonition admonition-${type}` };
    const labelMap: Record<string, string> = {
      note: "NOTE", tip: "TIP", caution: "CAUTION",
      warning: "WARNING", info: "INFO", danger: "DANGER",
    };
    d.children.unshift({
      type: "paragraph",
      data: { hName: "div", hProperties: { className: "admonition__title" } },
      children: [{ type: "text", value: d.attributes?.label || labelMap[type] || type.toUpperCase() }],
    });
  });
};

// ── TOC ────────────────────────────────────────────────────
interface Heading { level: number; text: string; id: string }
function extractHeadings(md: string): Heading[] {
  return md.split("\n").flatMap((line) => {
    const m = line.match(/^(#{2,3})\s+(.+)/);
    if (!m) return [];
    const text = m[2].replace(/[*_`]/g, "");
    const id = text.toLowerCase().replace(/[^\w一-鿿]+/g, "-").replace(/^-|-$/g, "");
    return [{ level: m[1].length, text, id }];
  });
}

// ── CodeBlock ──────────────────────────────────────────────
function extractText(node: React.ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractText).join("");
  if (React.isValidElement(node))
    return extractText((node.props as { children?: React.ReactNode }).children);
  return "";
}

function CodeBlock({ children, ...props }: ComponentPropsWithoutRef<"pre">) {
  const [copied, setCopied] = useState(false);
  function handleCopy() {
    navigator.clipboard.writeText(extractText(children)).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }
  return (
    <div className="code-block">
      <button className="code-block__copy" onClick={handleCopy}>
        {copied ? "✓ 已複製" : "複製"}
      </button>
      <pre {...props}>{children}</pre>
    </div>
  );
}

// ── Image path fix ─────────────────────────────────────────
function DocImage({ src, alt, ...props }: ComponentPropsWithoutRef<"img">) {
  const fixed = src?.replace(/^.*static\/img\//, `${import.meta.env.BASE_URL}img/`) ?? src;
  return <img src={fixed} alt={alt ?? ""} {...props} />;
}

// ── DocPage ────────────────────────────────────────────────
export default function DocPage() {
  const { "*": slug = "" } = useParams();
  const decoded = decodeURIComponent(slug);
  const [content, setContent] = useState<string | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    setContent(null);
    setError(false);
    const loader = docModules[buildKey(decoded)];
    if (!loader) { setError(true); return; }
    loader().then((raw) => setContent(raw as string)).catch(() => setError(true));
  }, [decoded]);

  const headings = useMemo(() => content ? extractHeadings(content) : [], [content]);

  return (
    <div className="doc-layout">
      <article className="doc-content">
        {error && (
          <div className="doc-error">
            <p>找不到文件：<code>{decoded}</code></p>
            <Link to="/">← 回首頁</Link>
          </div>
        )}
        {!error && content === null && <p className="doc-loading">載入中…</p>}
        {content && (
          <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkDirective, remarkAdmonitions]}
            rehypePlugins={[rehypeRaw, rehypeHighlight, rehypeSlug]}
            components={{ pre: CodeBlock, img: DocImage }}
          >
            {content}
          </ReactMarkdown>
        )}
      </article>

      {headings.length > 0 && (
        <nav className="toc">
          <p className="toc__title">本頁目錄</p>
          {headings.map((h) => (
            <a
              key={`${h.id}-${h.level}`}
              href={`#${h.id}`}
              className={`toc__item toc__item--h${h.level}`}
            >
              {h.text}
            </a>
          ))}
        </nav>
      )}
    </div>
  );
}
