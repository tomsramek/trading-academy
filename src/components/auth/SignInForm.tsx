"use client";

import { useState } from "react";
import { MailCheckIcon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

type SignInFormProps = {
  // Where to land after signing in, and where to come back when a link or Google fails.
  callbackURL: string;
  errorCallbackURL: string;
  // An error passed back in the URL (?error=…) – an expired link or a failed Google sign-in.
  initialError?: "link" | "google";
};

const emailSchema = z.email();

type Status = "idle" | "sending" | "sent" | "error" | "tooMany";

// E-mail for a magic link, or Google. The e-mail stays in the field after a failed attempt.
export function SignInForm({
  callbackURL,
  errorCallbackURL,
  initialError,
}: SignInFormProps) {
  const t = useTranslations("Auth.signIn");
  const locale = useLocale();
  const [email, setEmail] = useState("");
  const [invalid, setInvalid] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [googlePending, setGooglePending] = useState(false);
  const [googleFailed, setGoogleFailed] = useState(false);

  async function sendLink(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!emailSchema.safeParse(email.trim()).success) {
      setInvalid(true);
      return;
    }
    setStatus("sending");
    const { error } = await authClient.signIn.magicLink({
      email: email.trim(),
      callbackURL,
      errorCallbackURL,
      // The e-mail is written in the language of this page.
      metadata: { locale },
    });
    setStatus(error ? (error.status === 429 ? "tooMany" : "error") : "sent");
  }

  async function continueWithGoogle() {
    setGooglePending(true);
    setGoogleFailed(false);
    // On success the browser leaves for Google; only a failure comes back here.
    const { error } = await authClient.signIn.social({
      provider: "google",
      callbackURL,
      errorCallbackURL: `${errorCallbackURL.split("?")[0]}?error=google`,
    });
    if (error) {
      setGooglePending(false);
      setGoogleFailed(true);
    }
  }

  if (status === "sent") {
    return (
      <div aria-live="polite" className="flex flex-col gap-4">
        <MailCheckIcon aria-hidden="true" className="size-8 text-bull" />
        <h2 className="text-xl font-semibold">{t("sentTitle")}</h2>
        <p className="text-muted-foreground">
          {t("sent", { email: email.trim() })}
        </p>
        <Button
          variant="outline"
          className="w-fit"
          onClick={() => setStatus("idle")}
        >
          {t("otherEmail")}
        </Button>
      </div>
    );
  }

  const linkMessage =
    initialError === "link" && status === "idle" ? t("linkError") : undefined;
  const googleMessage =
    googleFailed || (initialError === "google" && status === "idle")
      ? t("googleError")
      : undefined;
  const sendMessage =
    status === "error"
      ? t("error")
      : status === "tooMany"
        ? t("tooMany")
        : undefined;
  const message = sendMessage ?? linkMessage ?? googleMessage;

  return (
    <div className="flex flex-col gap-6">
      {/* Announced by screen readers when a new message appears. */}
      {/* Takes no space while empty – the gap below it is cancelled. */}
      <div aria-live="polite" className="empty:-mb-6">
        {message && (
          <p className="rounded-lg bg-bear/10 p-3 text-sm">{message}</p>
        )}
      </div>

      <form onSubmit={sendLink} noValidate className="flex flex-col gap-3">
        <label htmlFor="sign-in-email" className="text-sm font-medium">
          {t("email")}
        </label>
        <input
          id="sign-in-email"
          type="email"
          name="email"
          autoComplete="email"
          inputMode="email"
          placeholder={t("emailPlaceholder")}
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            setInvalid(false);
          }}
          aria-invalid={invalid || undefined}
          aria-describedby={invalid ? "sign-in-email-error" : undefined}
          className="h-10 rounded-md border border-input bg-background px-3 outline-none focus-visible:ring-2 focus-visible:ring-ring aria-invalid:border-bear"
        />
        {invalid && (
          <p id="sign-in-email-error" className="text-sm text-bear">
            {t("invalidEmail")}
          </p>
        )}
        <Button type="submit" size="lg" disabled={status === "sending"}>
          {status === "sending" ? t("sending") : t("send")}
        </Button>
      </form>

      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span className="h-px flex-1 bg-border" />
        {t("or")}
        <span className="h-px flex-1 bg-border" />
      </div>

      <Button
        variant="outline"
        size="lg"
        onClick={continueWithGoogle}
        disabled={googlePending}
      >
        {t("google")}
      </Button>
    </div>
  );
}
