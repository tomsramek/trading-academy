import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { LOGIN_ENABLED } from "@/lib/features";

import { Container } from "./Container";
import { LogoMark } from "./LogoMark";

const LINK =
  "rounded-sm underline-offset-4 hover:text-foreground hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none";

const HEADING = "text-xs font-semibold tracking-wide text-foreground uppercase";

const AUTHOR_URL = "https://tomsramek.com";

// The site, its main pages and the legal pages, then a thin line with the copyright and the author.
export function Footer() {
  const t = useTranslations("Footer");

  return (
    <footer className="border-t border-border text-sm text-muted-foreground">
      <Container className="grid grid-cols-2 gap-x-6 gap-y-8 py-10 md:grid-cols-[2fr_1fr_1fr]">
        <div className="col-span-2 flex flex-col gap-3 md:col-span-1">
          <p className="flex items-center gap-2 font-semibold text-foreground">
            <LogoMark className="size-6" />
            Trading Academy
          </p>
          <p className="max-w-sm">{t("tagline")}</p>
          {/* The risk warning is in the footer of every page, including all course content. */}
          <p className="max-w-sm text-xs">{t("disclaimer")}</p>
        </div>

        <nav aria-labelledby="footer-academy" className="flex flex-col gap-3">
          <h2 id="footer-academy" className={HEADING}>
            {t("academy")}
          </h2>
          <ul className="flex flex-col gap-2">
            <li>
              <Link href="/courses" className={LINK}>
                {t("courses")}
              </Link>
            </li>
            <li>
              <Link href="/glossary" className={LINK}>
                {t("glossary")}
              </Link>
            </li>
            <li>
              <Link href="/support" className={LINK}>
                {t("support")}
              </Link>
            </li>
            {LOGIN_ENABLED && (
              <li>
                <Link href="/sign-in" className={LINK}>
                  {t("signIn")}
                </Link>
              </li>
            )}
          </ul>
        </nav>

        <nav aria-labelledby="footer-legal" className="flex flex-col gap-3">
          <h2 id="footer-legal" className={HEADING}>
            {t("legal")}
          </h2>
          <ul className="flex flex-col gap-2">
            <li>
              <Link href="/risk-warning" className={LINK}>
                {t("riskWarning")}
              </Link>
            </li>
            <li>
              <Link href="/terms" className={LINK}>
                {t("terms")}
              </Link>
            </li>
            <li>
              <Link href="/privacy" className={LINK}>
                {t("privacy")}
              </Link>
            </li>
          </ul>
        </nav>
      </Container>

      <div className="border-t border-border">
        <Container className="flex flex-wrap gap-x-2 gap-y-1 py-4 text-xs">
          <span>{t("copyright", { year: new Date().getFullYear() })}</span>
          <span aria-hidden="true">·</span>
          <span>
            {t.rich("madeBy", {
              author: (chunks) => (
                // Underlined: a link inside a sentence must stand out without relying on colour.
                <a
                  href={AUTHOR_URL}
                  rel="author"
                  className={`${LINK} underline decoration-muted-foreground/50`}
                >
                  {chunks}
                </a>
              ),
            })}
          </span>
        </Container>
      </div>
    </footer>
  );
}
