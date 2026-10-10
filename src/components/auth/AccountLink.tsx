"use client";

import { UserRoundIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

// "Sign in" or "My account" in the header. Asked for in the browser, so the pages stay static.
export function AccountLink({
  onNavigate,
  className,
}: {
  onNavigate?: () => void;
  className?: string;
}) {
  const t = useTranslations("Auth.header");
  const { data, isPending } = authClient.useSession();

  if (isPending) {
    // The same size as the link, so nothing jumps when the session arrives.
    return (
      <span
        role="status"
        aria-label={t("loading")}
        className={cn("h-8 w-24 animate-pulse rounded-md bg-muted", className)}
      />
    );
  }

  return (
    <Link
      href={data ? "/account" : "/sign-in"}
      onClick={onNavigate}
      className={cn(
        "inline-flex h-8 items-center gap-1.5 rounded-md px-2.5 text-sm font-medium hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
        className,
      )}
    >
      <UserRoundIcon aria-hidden="true" className="size-4" />
      {data ? t("account") : t("signIn")}
    </Link>
  );
}
