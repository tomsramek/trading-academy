import { useTranslations } from "next-intl";

const LICENSE_URLS: Record<string, string> = {
  "CC BY-NC-SA 4.0": "https://creativecommons.org/licenses/by-nc-sa/4.0/",
};

type ChartSourceProps = {
  // Where the data comes from; without it the chart is marked as illustrative.
  source?: string;
  license?: string;
  // Shown before the source, e.g. "BTC/USDT · 1D".
  prefix?: string;
};

// Source and licence line under a lesson chart. Real data always shows where it comes from.
export function ChartSource({ source, license, prefix }: ChartSourceProps) {
  const t = useTranslations("Lesson.chart");
  const licenseUrl = license ? LICENSE_URLS[license] : undefined;

  return (
    <span className="text-xs">
      {prefix && <>{prefix} · </>}
      {source ? (
        <>
          {t("source", { source })}
          {license && (
            <>
              {" · "}
              {licenseUrl ? (
                <a
                  href={licenseUrl}
                  target="_blank"
                  rel="noopener noreferrer license"
                  className="underline underline-offset-2 hover:text-foreground"
                >
                  {license}
                </a>
              ) : (
                license
              )}
            </>
          )}
        </>
      ) : (
        t("illustrative")
      )}
    </span>
  );
}
