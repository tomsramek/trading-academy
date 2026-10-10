import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";

import { SignInForm } from "@/components/auth/SignInForm";
import { Container } from "@/components/layout/Container";
import { getPathname, Link, redirect } from "@/i18n/navigation";
import { LOGIN_ENABLED } from "@/lib/features";
import { getSession } from "@/server/session";

const LEGAL_LINK =
  "underline underline-offset-2 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Auth.signIn");
  return {
    title: t("metaTitle"),
    // A form, not content – keep it out of search results.
    robots: { index: false, follow: false },
  };
}

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  if (!LOGIN_ENABLED) {
    notFound();
  }
  const locale = await getLocale();
  if (await getSession()) {
    redirect({ href: "/account", locale });
  }
  const t = await getTranslations("Auth.signIn");
  const { error } = await searchParams;
  const signInPath = getPathname({ href: "/sign-in", locale });

  return (
    <Container className="flex max-w-md flex-col gap-6 py-12 sm:py-16">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">{t("title")}</h1>
        <p className="text-muted-foreground">{t("intro")}</p>
      </header>
      <div className="rounded-xl border border-border p-5 sm:p-6">
        <SignInForm
          callbackURL={getPathname({ href: "/account", locale })}
          errorCallbackURL={`${signInPath}?error=link`}
          initialError={
            error === "google" ? "google" : error ? "link" : undefined
          }
        />
      </div>
      <p className="text-xs text-muted-foreground">
        {t.rich("terms", {
          terms: (chunks) => (
            <Link href="/terms" className={LEGAL_LINK}>
              {chunks}
            </Link>
          ),
          privacy: (chunks) => (
            <Link href="/privacy" className={LEGAL_LINK}>
              {chunks}
            </Link>
          ),
        })}
      </p>
    </Container>
  );
}
