import { test } from "node:test";
import assert from "node:assert/strict";
import { formatOf } from "../lib/formats.ts";

test("artifact formats are read from the link and the title", () => {
  const f = (url: string, title = "") => formatOf(url, title).label;
  assert.equal(f("https://docs.google.com/document/d/abc/edit"), "Google Doc");
  assert.equal(f("https://docs.google.com/spreadsheets/d/abc"), "Google Sheet");
  assert.equal(f("https://docs.google.com/presentation/d/abc"), "Google Slides");
  assert.equal(f("https://drive.google.com/drive/folders/abc"), "Drive folder");
  assert.equal(f("https://drive.google.com/file/d/abc/view", "Order form signed.pdf"), "PDF");
  assert.equal(f("https://drive.google.com/file/d/abc/view", "Proposal.pptx"), "PowerPoint");
  assert.equal(f("https://drive.google.com/file/d/abc/view", "Something"), "Drive file");
  assert.equal(f("https://claude.ai/artifact/LMYmZ"), "Claude artifact");
  assert.equal(f("https://www.loom.com/share/x"), "Loom video");
  assert.equal(f("https://heritage-looks.vercel.app"), "Web app or site");
  assert.equal(f("", "Kickoff deck"), "Not linked");
  assert.equal(f("", "Signed order form.pdf"), "PDF");
  assert.equal(f("not a url"), "Link");
});
