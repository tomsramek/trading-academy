import { getLocale, getTranslations } from "next-intl/server";

import { computeBadges, type Badge, type BadgeGroup } from "@/lib/badges";
import { sortCourses } from "@/lib/content/course-summary";
import { getCourses } from "@/server/content";
import { getBadgeRecords } from "@/server/progress";

import { BadgeMedal } from "./BadgeMedal";

const GROUPS: BadgeGroup[] = ["courses", "lessons", "quizzes", "days"];

// Every badge on the account page: earned in colour with the date, the rest with a hint.
export async function AccountBadges({ userId }: { userId: string }) {
  const [t, locale, records, courses] = await Promise.all([
    getTranslations("Badges"),
    getLocale(),
    getBadgeRecords(userId),
    getCourses(),
  ]);
  const badges = computeBadges(
    sortCourses(courses),
    records.lessons,
    records.quizzes,
    (course) => course.meta.title[locale],
  );
  const earned = badges.filter((badge) => badge.earnedAt).length;
  const day = new Intl.DateTimeFormat(locale, { dateStyle: "medium" });

  const hint = (badge: Badge) =>
    badge.id === "quiz-course-perfect"
      ? t("progressPercent", { percent: badge.progress.done })
      : t("progress", badge.progress);

  return (
    <section aria-labelledby="account-badges" className="flex flex-col gap-6">
      <div className="flex items-baseline justify-between gap-3">
        <h2 id="account-badges" className="text-xl font-semibold">
          {t("title")}
        </h2>
        <span className="text-sm text-muted-foreground">
          {t("count", { earned, total: badges.length })}
        </span>
      </div>
      {GROUPS.map((group) => (
        <div key={group} className="flex flex-col gap-3">
          <h3 className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            {t(`group.${group}`)}
          </h3>
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {badges
              .filter((badge) => badge.group === group)
              .map((badge) => (
                <li
                  key={badge.id}
                  className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-4 text-center"
                >
                  <BadgeMedal
                    icon={badge.icon}
                    tone={badge.tone}
                    earned={Boolean(badge.earnedAt)}
                  />
                  <span className="text-sm font-medium">
                    {t(`badge.${badge.key}.title`, badge.values)}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {t(`badge.${badge.key}.description`, badge.values)}
                  </span>
                  <span className="text-xs font-medium">
                    {badge.earnedAt ? (
                      <span className="text-bull">
                        {t("earned", { date: day.format(badge.earnedAt) })}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">
                        {hint(badge)}
                      </span>
                    )}
                  </span>
                </li>
              ))}
          </ul>
        </div>
      ))}
    </section>
  );
}
