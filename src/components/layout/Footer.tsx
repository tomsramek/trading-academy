import { useTranslations } from "next-intl";
import { Container } from "./Container";

export function Footer() {
  const t = useTranslations("Footer");

  return (
    <footer className="border-t border-border">
      <Container className="flex flex-col gap-2 py-6 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>{t("copyright", { year: new Date().getFullYear() })}</p>
        <p>{t("disclaimer")}</p>
      </Container>
    </footer>
  );
}
