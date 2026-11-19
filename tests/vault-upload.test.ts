import { test } from "node:test";
import assert from "node:assert/strict";
import { failureReason, PDF_NOT_SET_UP, pdfConversionReady, pdfOutcome, refusalLine, sizeRefusal, toMarkdown, uploadHeader, uploadKind, uploadTitle } from "../lib/vault-upload.ts";

test("uploadKind accepts markdown, text, csv, json, html and pdf by extension or mime", () => {
  assert.equal(uploadKind("notes.md", ""), "markdown");
  assert.equal(uploadKind("notes.markdown", ""), "markdown");
  assert.equal(uploadKind("Granola export.txt", "text/plain"), "text");
  assert.equal(uploadKind("pipeline.csv", ""), "csv");
  assert.equal(uploadKind("data.json", ""), "json");
  assert.equal(uploadKind("page.html", ""), "html");
  assert.equal(uploadKind("page.htm", ""), "html");
  assert.equal(uploadKind("Acme RFP.PDF", ""), "pdf");
  // by mime when the name has no telling extension
  assert.equal(uploadKind("download", "application/pdf"), "pdf");
  assert.equal(uploadKind("download", "text/markdown"), "markdown");
  assert.equal(uploadKind("download", "text/csv"), "csv");
  assert.equal(uploadKind("download", "application/json"), "json");
  assert.equal(uploadKind("download", "text/html"), "html");
  assert.equal(uploadKind("download", "text/plain"), "text");
});

test("uploadKind refuses office files, images, programs and empty names", () => {
  assert.equal(uploadKind("Proposal.docx", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"), null);
  assert.equal(uploadKind("Proposal.docx", ""), null);
  assert.equal(uploadKind("logo.png", "image/png"), null);
  assert.equal(uploadKind("setup.exe", "application/octet-stream"), null);
  assert.equal(uploadKind("", "text/plain"), null);
  assert.equal(uploadKind("   ", "application/pdf"), null);
});

test("toMarkdown turns a csv with quoted commas into a table with a header row", () => {
  const csv = 'Name,Role,Note\n"Voss, Elena",CEO,"said ""yes"""\nOtto,CTO,\n';
  const md = toMarkdown("csv", "people.csv", csv);
  const lines = md.trim().split("\n");
  assert.equal(lines[0], "| Name | Role | Note |");
  assert.equal(lines[1], "| --- | --- | --- |");
  assert.equal(lines[2], '| Voss, Elena | CEO | said "yes" |');
  assert.equal(lines[3], "| Otto | CTO |  |");
  assert.equal(lines.length, 4);
});

test("toMarkdown keeps 200 csv rows and says how many more there are", () => {
  const rows = Array.from({ length: 250 }, (_, i) => `${i},row ${i}`);
  const md = toMarkdown("csv", "big.csv", `id,label\n${rows.join("\n")}`);
  assert.match(md, /\| 199 \| row 199 \|/);
  assert.doesNotMatch(md, /\| 200 \| row 200 \|/);
  assert.match(md.trim(), /… 50 more rows$/);
});

test("toMarkdown escapes pipes and flattens newlines inside csv cells", () => {
  const md = toMarkdown("csv", "x.csv", 'a,b\n"one|two","line\nbreak"');
  assert.match(md, /\| one\\\|two \| line break \|/);
});

test("toMarkdown fences json", () => {
  const md = toMarkdown("json", "data.json", '{"a":1,"b":[1,2]}');
  assert.match(md, /^```json\n/);
  assert.match(md, /\n```\s*$/);
  assert.match(md, /"a": 1/);
  // invalid json is still fenced, as is
  assert.match(toMarkdown("json", "bad.json", "{oops"), /```json\n\{oops\n```/);
});

test("toMarkdown strips html tags and scripts", () => {
  const html = "<html><head><style>p{color:red}</style><script>alert('x')</script></head><body><h1>Scope</h1><p>Fish &amp; chips</p><ul><li>One</li><li>Two</li></ul></body></html>";
  const md = toMarkdown("html", "page.html", html);
  assert.doesNotMatch(md, /<|alert|color:red/);
  assert.match(md, /Scope/);
  assert.match(md, /Fish & chips/);
  assert.match(md, /One\n+Two/);
});

test("toMarkdown keeps text and markdown as they are", () => {
  assert.equal(toMarkdown("markdown", "a.md", "# Title\n\n- one\n"), "# Title\n\n- one\n");
  assert.equal(toMarkdown("text", "a.txt", "plain notes"), "plain notes");
});

test("uploadTitle is the file name without its extension, tidied", () => {
  assert.equal(uploadTitle("Acme RFP v2.pdf"), "Acme RFP v2");
  assert.equal(uploadTitle("call_notes__2026-11-18.md"), "call notes 2026-11-18");
  assert.equal(uploadTitle("  spaced   out .txt "), "spaced out");
  assert.equal(uploadTitle(".pdf"), "Document");
  assert.equal(uploadTitle("no-extension"), "no-extension");
});

test("sizeRefusal matches Stella's attachment limits", () => {
  assert.equal(sizeRefusal("pdf", 6_000_000), null);
  assert.match(sizeRefusal("pdf", 6_000_001) ?? "", /6 MB/);
  assert.equal(sizeRefusal("csv", 300_000), null);
  assert.match(sizeRefusal("markdown", 300_001) ?? "", /300 KB/);
  assert.match(sizeRefusal("text", 0) ?? "", /empty/);
});

test("uploadHeader says who uploaded what and when", () => {
  assert.equal(uploadHeader("Tauseef", new Date("2026-11-18T10:00:00Z"), "Acme RFP.pdf"), "Uploaded by Tauseef on 2026-11-18 from Acme RFP.pdf.");
});

test("pdfOutcome refuses refusals, cut-off and empty conversions", () => {
  assert.deepEqual(pdfOutcome("end_turn", "# RFP\n\nBody"), { markdown: "# RFP\n\nBody" });
  assert.match((pdfOutcome("max_tokens", "# partial") as { reason: string }).reason, /too long to convert; split the PDF/);
  assert.ok("reason" in pdfOutcome("refusal", "anything"));
  assert.ok("reason" in pdfOutcome("end_turn", "   "));
});

test("failureReason gives plain reasons, never raw error text", () => {
  assert.equal(failureReason("pdf", "convert"), "the PDF could not be converted right now; try again");
  assert.equal(failureReason("csv", "read"), "could not be read");
  assert.equal(failureReason("pdf", "read"), "could not be read");
  assert.equal(failureReason("text", "save"), "it could not be saved to the vault");
});

test("pdfConversionReady needs an Anthropic key in the environment", () => {
  assert.equal(pdfConversionReady({}), false);
  assert.equal(pdfConversionReady({ ANTHROPIC_API_KEY: "  " }), false);
  assert.equal(pdfConversionReady({ ANTHROPIC_API_KEY: "sk-test" }), true);
  assert.equal(PDF_NOT_SET_UP, "PDF conversion is not set up");
});

test("refusalLine ends with exactly one full stop", () => {
  assert.equal(refusalLine("a.pdf", "too long to convert; split the PDF"), "Not uploaded: a.pdf: too long to convert; split the PDF.");
  assert.equal(refusalLine("a.pdf", "You do not have access to this project."), "Not uploaded: a.pdf: You do not have access to this project.");
});

test("csv width only counts the rows shown, so huge files do not overflow", () => {
  const big = `h\n${"x\n".repeat(150_000)}`;
  const md = toMarkdown("csv", "big.csv", big);
  assert.match(md, /^\| h \|\n\| --- \|/);
  assert.match(md.trim(), /… 149800 more rows$/);
});

test("out-of-range numeric html entities are dropped", () => {
  assert.equal(toMarkdown("html", "x.html", "<p>a&#99999999;b &#x41;</p>"), "ab A");
});

test("uploadHeader strips control characters and newlines from the file name", () => {
  assert.equal(uploadHeader("T", new Date("2026-11-18T00:00:00Z"), "evil\nname\u0007.md"), "Uploaded by T on 2026-11-18 from evil name.md.");
});
