import { useTranslations } from "next-intl";
import { ShieldAlertIcon } from "lucide-react";

import { Link } from "@/i18n/navigation";

// Short risk warning at the start of every course, linking to the full risk warning page.
export function RiskNotice() {
  const t = useTranslations("RiskNotice");

  return (
    <div
      role="note"
      className="flex gap-3 rounded-lg border-l-4 border-destructive bg-destructive/10 p-4"
    >
      <ShieldAlertIcon
        aria-hidden="true"
        className="mt-0.5 size-5 shrink-0 text-destructive"
      />
      <div className="flex flex-col gap-1">
        <p className="font-semibold">{t("title")}</p>
        <p className="text-muted-foreground">
          {t("body")}{" "}
          <Link
            href="/risk-warning"
            className="rounded-sm font-medium text-foreground underline underline-offset-4 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            {t("link")}
          </Link>
        </p>
      </div>
    </div>
  );
}
