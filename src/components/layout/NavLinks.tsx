import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { NAV_ITEMS } from "./navigation";

export function NavLinks({
  onNavigate,
  vertical = false,
}: {
  onNavigate?: () => void;
  vertical?: boolean;
}) {
  const t = useTranslations("Header");

  return (
    <ul
      className={vertical ? "flex flex-col gap-1" : "flex items-center gap-1"}
    >
      {NAV_ITEMS.map((item) => (
        <li key={item.key}>
          {item.available ? (
            <Link
              href={item.href}
              onClick={onNavigate}
              className="block rounded-md px-3 py-2 text-sm font-medium text-muted hover:bg-surface hover:text-foreground"
            >
              {t(`nav.${item.key}`)}
            </Link>
          ) : (
            <span
              aria-disabled="true"
              className="flex cursor-not-allowed items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted"
            >
              {t(`nav.${item.key}`)}
              <span className="rounded-full border border-border px-1.5 py-0.5 text-[10px] tracking-wide uppercase">
                {t("soon")}
              </span>
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}
