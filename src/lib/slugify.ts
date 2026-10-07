// "Co je blockchain?" → "co-je-blockchain": lowercase ASCII words joined by dashes, for URLs and #anchors.
export function slugify(text: string): string {
  return (
    text
      // "č" → "c" + combining caron; the combining marks are then removed.
      .normalize("NFD")
      .replace(/\p{Mark}/gu, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
  );
}
