import "server-only";

import { z } from "zod";

/*
 * Outgoing e-mail through Forward Email's REST API (https://forwardemail.net/en/email-api).
 * The domain trading-academy.app is set up there with SPF, DKIM, DMARC and a Return-Path.
 */

const API_URL = "https://api.forwardemail.net/v1/emails";

// The alias registered at Forward Email; replies go nowhere, so the e-mails say so.
export const EMAIL_FROM = "Trading Academy <noreply@trading-academy.app>";

const envSchema = z.object({
  FORWARD_EMAIL_API_TOKEN: z.string().trim().min(10),
});

const responseSchema = z.object({ id: z.string() });

export type Email = {
  to: string;
  subject: string;
  html: string;
  // Plain-text version for mail clients without HTML – and a better spam score.
  text: string;
};

/** Sends one e-mail and returns its id at Forward Email. Throws when it was not accepted. */
export async function sendEmail(email: Email): Promise<{ id: string }> {
  const env = envSchema.safeParse(process.env);
  if (!env.success) {
    throw new Error(
      "FORWARD_EMAIL_API_TOKEN is missing – add it to .env.local (see .env.example)",
    );
  }
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      // The API token is the user name of basic auth, the password stays empty.
      Authorization: `Basic ${Buffer.from(`${env.data.FORWARD_EMAIL_API_TOKEN}:`).toString("base64")}`,
    },
    body: new URLSearchParams({ from: EMAIL_FROM, ...email }),
    signal: AbortSignal.timeout(10_000),
  });
  if (!response.ok) {
    // The response text is for the server log only – never shown to the user.
    throw new Error(
      `Forward Email refused the e-mail: ${response.status} ${await response.text()}`,
    );
  }
  return responseSchema.parse(await response.json());
}
