import { Fragment } from "react";
import { useTranslations } from "next-intl";
import {
  BoxIcon,
  NetworkIcon,
  SignatureIcon,
  UserCheckIcon,
} from "lucide-react";

import { DiagramArrow, flowListVariants } from "./DiagramArrow";

const STEPS = [
  { key: "sign", Icon: SignatureIcon },
  { key: "broadcast", Icon: NetworkIcon },
  { key: "confirm", Icon: BoxIcon },
  { key: "receive", Icon: UserCheckIcon },
] as const;

// The way of a crypto transaction from the sender to the receiver: <TransactionFlow />
export function TransactionFlow() {
  const t = useTranslations("Lesson.diagram.transaction");

  return (
    <figure className="not-prose @container my-8">
      <ol className={flowListVariants({ row: "5xl" })}>
        {STEPS.map(({ key, Icon }, index) => (
          <Fragment key={key}>
            {index > 0 && (
              <li
                aria-hidden="true"
                className="flex items-center justify-center"
              >
                <DiagramArrow row="5xl" />
              </li>
            )}
            <li className="flex flex-1 flex-col gap-2 rounded-lg border border-border bg-card p-4 text-sm">
              <span className="flex items-center gap-2 font-semibold">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Icon className="size-4" aria-hidden="true" />
                </span>
                {index + 1}. {t(`${key}.title`)}
              </span>
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
