import { useTranslations } from "next-intl";
import { AccountLink } from "@/components/auth/AccountLink";
import { Link } from "@/i18n/navigation";
import { LocaleSwitcher } from "@/components/i18n/LocaleSwitcher";
import type { CourseSlugs } from "@/lib/content/localized-slugs";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { LOGIN_ENABLED } from "@/lib/features";
import { Container } from "./Container";
import { LogoMark } from "./LogoMark";
import { MobileMenu } from "./MobileMenu";
import { NavLinks } from "./NavLinks";

export function Header({ courseSlugs }: { courseSlugs: CourseSlugs }) {
  const t = useTranslations("Header");

  return (
    // Sticky glass header: stays at the top while scrolling, content shows through blurred.
    <header className="sticky top-0 z-30 border-b border-border glass">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link
          href="/"
          className="flex items-center gap-2.5 rounded-md text-lg font-semibold tracking-tight"
        >
          <LogoMark />
          Trading Academy
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-4 md:flex">
          <nav aria-label={t("navLabel")}>
            <NavLinks />
          </nav>
          <LocaleSwitcher courseSlugs={courseSlugs} />
          <ThemeToggle />
          {LOGIN_ENABLED && <AccountLink />}
        </div>

        {/* Mobile */}
        <MobileMenu courseSlugs={courseSlugs} />
      </Container>
    </header>
  );
}
