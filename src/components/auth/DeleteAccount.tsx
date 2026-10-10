"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { useRouter } from "@/i18n/navigation";
import { authClient } from "@/lib/auth-client";

// Errors Better Auth returns when the last sign-in is older than a day (session.freshAge).
const NOT_FRESH = new Set(["SESSION_EXPIRED", "SESSION_NOT_FRESH"]);

type Step = "idle" | "confirm" | "deleting" | "fresh" | "error";

// Deletes the account after a confirmation. An old session must sign in again first.
export function DeleteAccount() {
  const t = useTranslations("Auth.account");
  const router = useRouter();
  const [step, setStep] = useState<Step>("idle");

  async function remove() {
    setStep("deleting");
    const { error } = await authClient.deleteUser();
    if (error) {
      setStep(error.code && NOT_FRESH.has(error.code) ? "fresh" : "error");
      return;
    }
    router.push("/");
    router.refresh();
  }

  async function signInAgain() {
    await authClient.signOut();
    router.push("/sign-in");
    router.refresh();
  }

  return (
    <section
      aria-labelledby="delete-account"
      className="flex flex-col gap-3 rounded-xl border border-bear/40 p-5 sm:p-6"
    >
      <h2 id="delete-account" className="font-semibold">
        {t("deleteTitle")}
      </h2>
      <p className="text-sm text-muted-foreground">{t("deleteIntro")}</p>

      <div aria-live="polite" className="text-sm">
        {step === "confirm" && (
          <p className="font-medium">{t("deleteConfirm")}</p>
        )}
        {step === "fresh" && <p>{t("deleteFresh")}</p>}
        {step === "error" && <p className="text-bear">{t("deleteError")}</p>}
      </div>

      <div className="flex flex-wrap gap-2">
        {step === "idle" || step === "error" ? (
          <Button variant="destructive" onClick={() => setStep("confirm")}>
            {t("delete")}
          </Button>
        ) : step === "fresh" ? (
          <Button variant="outline" onClick={signInAgain}>
            {t("signInAgain")}
          </Button>
        ) : (
          <>
            <Button
              variant="destructive"
              onClick={remove}
              disabled={step === "deleting"}
            >
              {step === "deleting" ? t("deleting") : t("deleteYes")}
            </Button>
            <Button
              variant="ghost"
              onClick={() => setStep("idle")}
              disabled={step === "deleting"}
            >
              {t("deleteCancel")}
            </Button>
          </>
        )}
      </div>
    </section>
  );
}
