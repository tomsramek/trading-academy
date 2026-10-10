import { cva, type VariantProps } from "class-variance-authority";
import { CoffeeIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { DONATE_URL } from "@/lib/site";
import { cn } from "@/lib/utils";

const donateLinkVariants = cva(
  "items-center gap-1.5 rounded-md text-sm font-medium focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
  {
    variants: {
      variant: {
        // Header: a small yellow button in the top right corner, icon only until there is room for the word.
        header:
          "inline-flex h-8 bg-donate px-2.5 font-semibold text-donate-foreground hover:bg-donate/85 lg:px-3",
        // Mobile menu: a row like the other menu items.
        menu: "flex px-3 py-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground",
      },
    },
    defaultVariants: { variant: "header" },
  },
);

type DonateLinkProps = VariantProps<typeof donateLinkVariants> & {
  onNavigate?: () => void;
  className?: string;
};

// "Support the academy" – straight to the donation page, in a new tab. The footer links to our page that
// explains the donations.
export function DonateLink({
  variant,
  onNavigate,
  className,
}: DonateLinkProps) {
  const t = useTranslations("Header");

  return (
    <a
      href={DONATE_URL}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onNavigate}
      className={cn(donateLinkVariants({ variant }), className)}
    >
      <CoffeeIcon
        aria-hidden="true"
        className={cn("size-4", variant === "menu" && "text-warning")}
      />
      {variant === "menu" ? (
        t("supportLong")
      ) : (
        <span className="sr-only lg:not-sr-only">{t("support")}</span>
      )}
      <span className="sr-only"> ({t("opensInNewTab")})</span>
    </a>
  );
}
