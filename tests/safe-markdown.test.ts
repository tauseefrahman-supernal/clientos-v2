import { test } from "node:test";
import assert from "node:assert/strict";
import { isExternalHref, isSafeHref, isSafeImageSrc } from "../lib/safe-markdown.ts";

test("only relative image sources may load", () => {
  for (const ok of ["/logo.png", "img/a.png", "./a.png", "../a.png", "a.png?x=1"]) assert.equal(isSafeImageSrc(ok), true, ok);
  for (const bad of [
    "https://evil.example/x.png", "http://x/y.png", "//evil.example/x.png", "/\\evil.example/x.png", "\\\\evil.example\\x.png",
    "/\t/evil.example/x.png", " //evil.example", "data:image/png;base64,AAAA", "javascript:alert(1)", "HTTPS://evil.example", "", undefined, null,
  ]) assert.equal(isSafeImageSrc(bad as string), false, String(bad));
});

test("links render only for http, https, mailto and relative hrefs", () => {
  for (const ok of ["https://example.com/a", "http://x.test", "HTTPS://Example.com", "mailto:a@b.test", "/projects/rx", "./a", "../b", "a/b", "?q=1", "#section"])
    assert.equal(isSafeHref(ok), true, ok);
  for (const bad of [
    "javascript:alert(1)", "JaVaScRiPt:alert(1)", "java\tscript:alert(1)", " javascript:alert(1)", "java\nscript:x", "vbscript:x",
    "data:text/html,<script>alert(1)</script>", "file:///etc/passwd", "ftp://x", "tel:123", "//evil.example", "/\\evil.example", "\\\\evil", "", undefined, null,
  ]) assert.equal(isSafeHref(bad as string), false, String(bad));
});

test("only http, https and mailto links count as external (new tab, noopener noreferrer)", () => {
  for (const ext of ["https://example.com", "http://x", "mailto:a@b.test"]) assert.equal(isExternalHref(ext), true, ext);
  for (const rel of ["/a", "#x", "?q", "a/b"]) assert.equal(isExternalHref(rel), false, rel);
});
