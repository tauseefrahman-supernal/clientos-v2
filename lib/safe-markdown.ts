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
