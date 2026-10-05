import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { LocaleSwitcher } from "@/components/i18n/LocaleSwitcher";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Container } from "./Container";
import { MobileMenu } from "./MobileMenu";
import { NavLinks } from "./NavLinks";

export function Header() {
  const t = useTranslations("Header");

  return (
    // Sticky glass header: stays at the top while scrolling, content shows through blurred.
    <header className="sticky top-0 z-30 border-b border-border glass">
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
          <LocaleSwitcher />
          <ThemeToggle />
        </div>

        {/* Mobile */}
        <MobileMenu />
      </Container>
    </header>
  );
}
