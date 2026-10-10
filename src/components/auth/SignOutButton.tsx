"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { useRouter } from "@/i18n/navigation";
import { authClient } from "@/lib/auth-client";

// Ends the session on the server (the row in `sessions` is deleted) and goes to the home page.
export function SignOutButton() {
  const t = useTranslations("Auth.account");
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [failed, setFailed] = useState(false);

  async function signOut() {
    setPending(true);
    setFailed(false);
    const { error } = await authClient.signOut();
    if (error) {
      setPending(false);
      setFailed(true);
      return;
    }
    router.push("/");
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-2">
      <Button
        variant="outline"
        className="w-fit"
        onClick={signOut}
        disabled={pending}
      >
        {pending ? t("signingOut") : t("signOut")}
      </Button>
      <p aria-live="polite" className="text-sm text-bear">
        {failed && t("signOutError")}
      </p>
    </div>
  );
}
