import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Container } from "./Container";
import { MobileMenu } from "./MobileMenu";
import { NavLinks } from "./NavLinks";

export function Header() {
  const t = useTranslations("Header");

  return (
    <header className="relative border-b border-border">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link
          href="/"
          className="rounded-md text-lg font-semibold tracking-tight"
        >
          Trading Academy
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-4 md:flex">
          <nav aria-label={t("navLabel")}>
            <NavLinks />
          </nav>
          <ThemeToggle />
        </div>

        {/* Mobile */}
        <MobileMenu />
      </Container>
    </header>
  );
}
