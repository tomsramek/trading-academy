import { Fragment } from "react";
import { useTranslations } from "next-intl";
import { KeyRoundIcon, LockKeyholeIcon, QrCodeIcon } from "lucide-react";
import { cva } from "class-variance-authority";

import { DiagramArrow, flowListVariants } from "./DiagramArrow";

// Made-up, shortened example values.
const KEYS = [
  {
    key: "privateKey",
    Icon: LockKeyholeIcon,
    example: "5Kb8kL…x3Jf",
    tone: "secret",
  },
  {
    key: "publicKey",
    Icon: KeyRoundIcon,
    example: "02a1c9…7e4d",
    tone: "public",
  },
  { key: "address", Icon: QrCodeIcon, example: "bc1qxy…0wlh", tone: "public" },
] as const;

const boxVariants = cva(
  "flex flex-1 flex-col gap-2 rounded-lg border p-4 text-sm",
  {
    variants: {
      tone: {
        secret: "border-destructive/40 bg-destructive/10",
        public: "border-border bg-card",
      },
    },
  },
);

const iconVariants = cva("size-4 shrink-0", {
  variants: {
    tone: {
      secret: "text-destructive",
      public: "text-primary",
    },
  },
});

// Private key → public key → address, each step one-way only: <WalletKeys />
export function WalletKeys() {
  const t = useTranslations("Lesson.diagram.wallet");

  return (
    <figure className="not-prose @container my-8">
      <ol className={flowListVariants({ row: "3xl" })}>
        {KEYS.map(({ key, Icon, example, tone }, index) => (
          <Fragment key={key}>
            {index > 0 && (
              <li className="flex items-center justify-center">
                <DiagramArrow row="3xl" label={t("oneWay")} />
              </li>
            )}
            <li className={boxVariants({ tone })}>
              <span className="flex items-center gap-2 font-semibold">
                <Icon className={iconVariants({ tone })} aria-hidden="true" />
                {t(`${key}.title`)}
              </span>
              <code className="w-fit rounded-sm bg-muted px-1.5 py-0.5 font-mono text-xs">
                {example}
              </code>
              <span className="text-muted-foreground">{t(`${key}.text`)}</span>
            </li>
          </Fragment>
        ))}
      </ol>
      <figcaption className="mt-3 text-sm text-muted-foreground">
        {t("caption")}
      </figcaption>
    </figure>
  );
}
