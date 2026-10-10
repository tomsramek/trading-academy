import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Geist, Geist_Mono } from "next/font/google";
import { hasLocale, NextIntlClientProvider, useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { routing } from "@/i18n/routing";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { getCourseSlugs } from "@/server/content";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "latin-ext"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "latin-ext"],
});

// Pre-render every page for every locale at build time.
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  const t = await getTranslations({ locale, namespace: "Metadata" });

  return {
    metadataBase: new URL(SITE_URL),
    // Subpages set only their own title: "Courses" → "Courses – Trading Academy".
    title: { default: t("title"), template: `%s – ${SITE_NAME}` },
    description: t("description"),
    // Preview when the link is shared, for pages without their own (indexable pages set it through
    // pageMetadata with their own title and address).
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      title: t("title"),
      description: t("description"),
      locale: locale === "cs" ? "cs_CZ" : "en_US",
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  const courseSlugs = await getCourseSlugs();

  return (
    // suppressHydrationWarning: next-themes sets the class on <html> before React loads.
    // data-scroll-behavior: page navigation jumps to the top instantly; smooth scrolling (globals.css)
    // stays for links within the page, like the lesson's table of contents.
    <html
      lang={locale}
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <NextIntlClientProvider>
          <ThemeProvider>
            <SkipLink />
            <Header courseSlugs={courseSlugs} />
            <main id="content" className="flex flex-1 flex-col">
              {children}
            </main>
            <Footer />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

// Hidden until focused with the keyboard – lets keyboard and screen reader users jump past the header.
function SkipLink() {
  const t = useTranslations("Layout");
  return (
    <a
      href="#content"
      className="sr-only rounded-md bg-primary px-4 py-2 text-primary-foreground focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50"
    >
      {t("skipToContent")}
    </a>
  );
}
