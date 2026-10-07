import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";

import { Container } from "./Container";

const LINK =
  "rounded-sm underline-offset-4 hover:text-foreground hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none";

export function Footer() {
  const t = useTranslations("Footer");

  return (
    <footer className="border-t border-border">
      <Container className="flex flex-col gap-3 py-6 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
        <p>{t("copyright", { year: new Date().getFullYear() })}</p>
        {/* The risk warning is in the footer of every page, including all course content. */}
        <p>{t("disclaimer")}</p>
        <nav aria-label={t("legal")}>
          <ul className="flex flex-wrap gap-x-4 gap-y-1">
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
          </ul>
        </nav>
      </Container>
    </footer>
  );
}
