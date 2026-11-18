import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { isSafeImageSrc } from "@/lib/safe-markdown";

/** Vault markdown: GFM, no raw HTML, and remote images shown as their alt text instead of loading. */
export function SafeMarkdown({ children }: { children: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        img: ({ src, alt }) => (typeof src === "string" && isSafeImageSrc(src)
          // eslint-disable-next-line @next/next/no-img-element
          ? <img src={src} alt={alt ?? ""} />
          : <span className="rounded border border-dashed border-border px-1 text-xs text-muted-foreground">{alt ? `Image: ${alt}` : "Image not loaded"}</span>),
      }}
    >
      {children}
    </ReactMarkdown>
  );
}
