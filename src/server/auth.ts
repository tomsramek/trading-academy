import "server-only";

import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { magicLink } from "better-auth/plugins";
import { hasLocale } from "next-intl";
import { z } from "zod";

import { routing } from "@/i18n/routing";

import { db } from "./db";
import * as schema from "./db/schema";
import { MAGIC_LINK_MINUTES, renderMagicLinkEmail } from "./email/render";
import { sendEmail } from "./email/send";

/*
 * Login with Better Auth (https://better-auth.com): a magic link by e-mail or Google.
 * Users and sessions live in our PostgreSQL (tables in ./db/schema). No passwords.
 */

const envSchema = z.object({
  // The site's address – the sign-in links point here. http://localhost:3000 in development.
  BETTER_AUTH_URL: z.url(),
  // Signs the session cookies: `openssl rand -base64 32`.
  BETTER_AUTH_SECRET: z.string().min(32),
  // Google sign-in (Google Cloud Console → OAuth client). Without them only the magic link works.
  GOOGLE_CLIENT_ID: z
    .string()
    .endsWith(".apps.googleusercontent.com")
    .optional(),
  GOOGLE_CLIENT_SECRET: z.string().min(10).optional(),
});

function createAuth() {
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    throw new Error(
      `Login is not configured – see .env.example:\n${z.prettifyError(result.error)}`,
    );
  }
  const env = result.data;

  return betterAuth({
    appName: "Trading Academy",
    baseURL: env.BETTER_AUTH_URL,
    secret: env.BETTER_AUTH_SECRET,
    socialProviders:
      env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET
        ? {
            google: {
              clientId: env.GOOGLE_CLIENT_ID,
              clientSecret: env.GOOGLE_CLIENT_SECRET,
            },
          }
        : {},
    user: {
      // "Delete account" on the account page – the user, sessions and accounts go (cascade).
      // Better Auth asks for a sign-in from the last day first (session.freshAge).
      deleteUser: { enabled: true },
    },
    account: {
      accountLinking: {
        // Google confirms the e-mail address, so signing in with Google joins the account that
        // a magic link created for the same address – one person, one account.
        trustedProviders: ["google"],
      },
    },
    database: drizzleAdapter(db(), {
      provider: "pg",
      schema,
      // Tables are named users, sessions, accounts, verifications.
      usePlural: true,
    }),
    plugins: [
      magicLink({
        expiresIn: MAGIC_LINK_MINUTES * 60,
        // Only a hash of the link's token is stored – a copy of the database signs nobody in.
        storeToken: "hashed",
        // The page language travels with the request, so the e-mail is in the same language.
        sendMagicLink: async ({ email, url, metadata }) => {
          const locale =
            typeof metadata?.locale === "string" &&
            hasLocale(routing.locales, metadata.locale)
              ? metadata.locale
              : routing.defaultLocale;
          await sendEmail({
            to: email,
            ...(await renderMagicLinkEmail(locale, url)),
          });
        },
      }),
      // Lets server actions set the session cookie. Must stay the last plugin.
      nextCookies(),
    ],
  });
}

export type Auth = ReturnType<typeof createAuth>;

// Created on first use, not on import: the build and pages without login need no secrets.
let instance: Auth | undefined;

export function auth(): Auth {
  instance ??= createAuth();
  return instance;
}
