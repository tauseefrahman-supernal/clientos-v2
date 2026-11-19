import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { isExternalHref, isSafeHref, isSafeImageSrc } from "@/lib/safe-markdown";

/**
 * Every markdown render in the app goes through here: GFM, no raw HTML, remote images shown as their alt text instead
 * of loading, and links only for http, https, mailto and relative hrefs (anything else is plain text). http and https links
 * open in a new tab with rel="noopener noreferrer".
 */
export function SafeMarkdown({ children }: { children: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        img: ({ src, alt }) => (typeof src === "string" && isSafeImageSrc(src)
          // eslint-disable-next-line @next/next/no-img-element
          ? <img src={src} alt={alt ?? ""} />
          : <span className="rounded border border-dashed border-border px-1 text-xs text-muted-foreground">{alt ? `Image: ${alt}` : "Image not loaded"}</span>),
        a: ({ href, children: text }) => {
          if (typeof href !== "string" || !isSafeHref(href)) return <span>{text}</span>;
          // http(s) opens in a new tab without an opener or referrer; mailto and relative links open as usual.
          return isExternalHref(href)
            ? <a href={href} target="_blank" rel="noopener noreferrer">{text}</a>
            : <a href={href}>{text}</a>;
        },
      }}
    >
      {children}
    </ReactMarkdown>
  );
}
