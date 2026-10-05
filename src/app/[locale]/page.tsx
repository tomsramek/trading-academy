import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations("HomePage");

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 px-4 text-center">
      <p className="text-sm font-medium tracking-widest text-zinc-500 uppercase dark:text-zinc-400">
        {t("badge")}
      </p>
      <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">
        {t("title")}
      </h1>
      <p className="max-w-xl text-lg text-zinc-600 dark:text-zinc-400">
        {t("description")}
      </p>
    </main>
  );
}
