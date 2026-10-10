import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";

import { DeleteAccount } from "@/components/auth/DeleteAccount";
import { SignOutButton } from "@/components/auth/SignOutButton";
import { Container } from "@/components/layout/Container";
import { redirect } from "@/i18n/navigation";
import { LOGIN_ENABLED } from "@/lib/features";
import { getSession } from "@/server/session";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Auth.account");
  return { title: t("metaTitle"), robots: { index: false, follow: false } };
}

// Only for signed-in users: everyone else is sent to the sign-in page.
export default async function AccountPage() {
  if (!LOGIN_ENABLED) {
    notFound();
  }
  const locale = await getLocale();
  const session = await getSession();
  if (!session) {
    redirect({ href: "/sign-in", locale });
    return null;
  }
  const t = await getTranslations("Auth.account");
  const since = new Intl.DateTimeFormat(locale, { dateStyle: "long" }).format(
    session.user.createdAt,
  );

  return (
    <Container className="flex max-w-xl flex-col gap-6 py-12 sm:py-16">
      <h1 className="text-3xl font-semibold tracking-tight">{t("title")}</h1>
      <div className="flex flex-col gap-2 rounded-xl border border-border p-5 sm:p-6">
        <p className="font-medium">
          {t("signedInAs", { email: session.user.email })}
        </p>
        <p className="text-sm text-muted-foreground">
          {t("since", { date: since })}
        </p>
        <p className="text-sm text-muted-foreground">{t("progressSoon")}</p>
      </div>
      <SignOutButton />
      <DeleteAccount />
    </Container>
  );
}
