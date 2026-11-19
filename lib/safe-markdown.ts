// Pure rule for rendering vault markdown: images load only from relative (same-origin) sources, so text written by a
// model or pasted from elsewhere cannot make every viewer's browser fetch a remote URL. No server code; tests import it.

/** True for a relative image source; false for any scheme, protocol-relative "//", backslashes, or nothing. */
export function isSafeImageSrc(src: string | null | undefined): boolean {
  if (typeof src !== "string") return false;
  // Browsers drop tabs, newlines and control characters inside URLs and read "\" as "/", so judge the cleaned form.
  const s = src.replace(/[\u0000- \u007f]/g, "");
  if (!s || s.includes("\\") || s.startsWith("//")) return false;
  return !/^[a-z][a-z0-9+.-]*:/i.test(s);
}

/**
 * True for a link a viewer may follow: http, https or mailto, or a relative link (path, "./", "../", "?query", "#anchor").
 * javascript:, data:, vbscript:, file: and every other scheme, protocol-relative "//", and backslashes are refused and
 * shown as plain text.
 */
export function isSafeHref(href: string | null | undefined): boolean {
  if (typeof href !== "string") return false;
  const s = href.replace(/[\u0000- \u007f]/g, "");
  if (!s || s.includes("\\") || s.startsWith("//")) return false;
  const scheme = /^([a-z][a-z0-9+.-]*):/i.exec(s);
  return !scheme || ["http", "https", "mailto"].includes(scheme[1].toLowerCase());
}

/** True for an http or https link, which opens in a new tab without an opener or referrer (mailto opens the mail app as is). */
export function isExternalHref(href: string): boolean {
  return /^https?:/i.test(href.replace(/[\u0000- \u007f]/g, ""));
}
