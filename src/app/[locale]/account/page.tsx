import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";

import { DeleteAccount } from "@/components/auth/DeleteAccount";
import { SignOutButton } from "@/components/auth/SignOutButton";
import { Container } from "@/components/layout/Container";
import { AccountProgress } from "@/components/progress/AccountProgress";
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
  const { user } = session;
  const since = new Intl.DateTimeFormat(locale, { dateStyle: "long" }).format(
    user.createdAt,
  );
  // The first letter of the name (from Google) or of the e-mail.
  const initial = (user.name.trim() || user.email).charAt(0).toUpperCase();

  return (
    <Container className="flex max-w-3xl flex-col gap-10 py-12 sm:py-16">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <span
            aria-hidden="true"
            className="flex size-14 shrink-0 items-center justify-center rounded-full bg-primary/15 text-2xl font-semibold text-primary"
          >
            {initial}
          </span>
          <div className="flex flex-col gap-0.5">
            <h1 className="text-3xl font-semibold tracking-tight">
              {t("title")}
            </h1>
            <p className="text-sm text-muted-foreground">
              {user.email} · {t("since", { date: since })}
            </p>
          </div>
        </div>
        <SignOutButton />
      </header>

      <AccountProgress userId={user.id} />

      <section
        aria-labelledby="account-settings"
        className="flex flex-col gap-4"
      >
        <h2 id="account-settings" className="text-xl font-semibold">
          {t("settingsTitle")}
        </h2>
        <DeleteAccount />
      </section>
    </Container>
  );
}
