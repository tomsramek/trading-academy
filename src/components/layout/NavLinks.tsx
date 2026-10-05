import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
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
    <ul className={cn("flex gap-1", vertical ? "flex-col" : "items-center")}>
      {NAV_ITEMS.map((item) => (
        <li key={item.key}>
          {item.available ? (
            <Link
              href={item.href}
              onClick={onNavigate}
              className="block rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            >
              {t(`nav.${item.key}`)}
            </Link>
          ) : (
            <span
              aria-disabled="true"
              className="flex cursor-not-allowed items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground"
            >
              {t(`nav.${item.key}`)}
              <Badge
                variant="outline"
                className="text-[10px] tracking-wide text-muted-foreground uppercase"
              >
                {t("soon")}
              </Badge>
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}
