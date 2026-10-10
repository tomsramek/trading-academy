/*
 * The e-mail with a sign-in link. Pure: the texts come in already translated, so it can be tested
 * without Next.js; render it with renderMagicLinkEmail() in ./render.
 */

export type MagicLinkTexts = {
  subject: string;
  heading: string;
  intro: string;
  button: string;
  // "The link works for {minutes} minutes …" – already filled in.
  expiry: string;
  ignore: string;
  noReply: string;
};

// The few characters that could break out of HTML text or an attribute.
function escapeHtml(text: string): string {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

/**
 * HTML with inline styles (mail clients ignore stylesheets) and the same message as plain text.
 * Light colours on purpose: many mail clients do not support dark mode styles.
 */
export function magicLinkEmail(
  texts: MagicLinkTexts,
  url: string,
  lang: string,
) {
  const link = escapeHtml(url);
  const html = `<!doctype html>
<html lang="${escapeHtml(lang)}">
<body style="margin:0;padding:24px;background:#f4f4f5;font-family:system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;color:#18181b">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;margin:0 auto;background:#ffffff;border-radius:12px">
    <tr><td style="padding:32px">
      <p style="margin:0 0 24px;font-size:14px;font-weight:600;color:#52525b">Trading Academy</p>
      <h1 style="margin:0 0 16px;font-size:22px">${escapeHtml(texts.heading)}</h1>
      <p style="margin:0 0 24px;font-size:16px;line-height:1.5">${escapeHtml(texts.intro)}</p>
      <p style="margin:0 0 24px"><a href="${link}" style="display:inline-block;padding:12px 20px;background:#2563eb;color:#ffffff;text-decoration:none;border-radius:8px;font-weight:600">${escapeHtml(texts.button)}</a></p>
      <p style="margin:0 0 8px;font-size:14px;line-height:1.5;color:#52525b">${escapeHtml(texts.expiry)}</p>
      <p style="margin:0 0 24px;font-size:14px;line-height:1.5;color:#52525b">${escapeHtml(texts.ignore)}</p>
      <p style="margin:0;font-size:12px;color:#71717a;word-break:break-all">${link}</p>
    </td></tr>
  </table>
  <p style="max-width:480px;margin:16px auto 0;font-size:12px;color:#71717a;text-align:center">${escapeHtml(texts.noReply)}</p>
</body>
</html>`;
  const text = [
    texts.heading,
    "",
    texts.intro,
    "",
    url,
    "",
    texts.expiry,
    texts.ignore,
    "",
    "—",
    texts.noReply,
  ].join("\n");
  return { subject: texts.subject, html, text };
}
