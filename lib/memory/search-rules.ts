// Pure helpers for retrieval; lib/memory/search.ts imports these.

/** Half-life of 60 days. Negative ages count as 0. */
export function recencyWeight(ageDays: number): number {
  return 0.5 ** (Math.max(0, ageDays) / 60);
}

/**
 * A window of at most `chars` characters centred on the first case-insensitive
 * match of `around`, aligned to line boundaries (outward when that still fits,
 * otherwise inward while the match stays inside). No match or empty `around`:
 * the first `chars` characters.
 */
export function callWindow(body: string, around: string, chars = 3000): string {
  if (body.length <= chars) return body;
  const needle = around.toLowerCase();
  const idx = needle ? body.toLowerCase().indexOf(needle) : -1;
  if (idx < 0) return body.slice(0, chars);

  const mEnd = Math.min(body.length, idx + needle.length);
  let start = Math.round(idx + needle.length / 2 - chars / 2);
  start = Math.max(0, Math.min(start, body.length - chars));
  let end = start + chars;

  // snap start to a line start
  const outS = body.lastIndexOf("\n", start - 1) + 1; // 0 when none
  if (start > 0 && start !== outS) {
    if (end - outS <= chars) start = outS;
    else {
      const inS = body.indexOf("\n", start) + 1;
      if (inS > 0 && inS <= idx) start = inS;
    }
  }
  // snap end to a line end
  if (end < body.length) {
    const nl = body.indexOf("\n", end);
    const outE = nl === -1 ? body.length : nl;
    if (outE - start <= chars) end = outE;
    else {
      const inE = body.lastIndexOf("\n", end - 1);
      if (inE >= mEnd && inE > start) end = inE;
    }
  }
  return body.slice(start, Math.max(end, mEnd));
}
