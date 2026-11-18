import { test } from "node:test";
import assert from "node:assert/strict";
import { isSafeImageSrc } from "../lib/safe-markdown.ts";

test("only relative image sources may load", () => {
  for (const ok of ["/logo.png", "img/a.png", "./a.png", "../a.png", "a.png?x=1"]) assert.equal(isSafeImageSrc(ok), true, ok);
  for (const bad of [
    "https://evil.example/x.png", "http://x/y.png", "//evil.example/x.png", "/\\evil.example/x.png", "\\\\evil.example\\x.png",
    "/\t/evil.example/x.png", " //evil.example", "data:image/png;base64,AAAA", "javascript:alert(1)", "HTTPS://evil.example", "", undefined, null,
  ]) assert.equal(isSafeImageSrc(bad as string), false, String(bad));
});
