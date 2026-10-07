import type { ReactNode } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { LocaleSwitcher } from "@/components/i18n/LocaleSwitcher";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

// Development-only catalogue of the shadcn/ui components as used in Trading Academy.
// Not translated and not available in production.
export const metadata: Metadata = {
  title: "UI components",
  robots: { index: false, follow: false },
};

const BUTTON_VARIANTS = [
  "default",
  "secondary",
  "outline",
  "ghost",
  "destructive",
  "link",
] as const;
const BUTTON_SIZES = ["xs", "sm", "default", "lg"] as const;
const BADGE_VARIANTS = [
  "default",
  "secondary",
  "outline",
  "destructive",
] as const;

export default function UiPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return (
    <Container className="flex flex-col gap-12 py-12">
      <h1 className="text-3xl font-semibold tracking-tight">UI components</h1>
      <Link href="/ui/lesson" className="text-link underline">
        Lesson preview – every MDX element and component
      </Link>

      <Section title="Button – variants">
        {BUTTON_VARIANTS.map((variant) => (
          <Button key={variant} variant={variant}>
            {variant}
          </Button>
        ))}
      </Section>

      <Section title="Button – sizes and states">
        {BUTTON_SIZES.map((size) => (
          <Button key={size} size={size}>
            Size {size}
          </Button>
        ))}
        <Button disabled>Disabled</Button>
        <Link href="/" className={cn(buttonVariants({ variant: "outline" }))}>
          Link styled as a button
        </Link>
      </Section>

      <Section title="Badge">
        {BADGE_VARIANTS.map((variant) => (
          <Badge key={variant} variant={variant}>
            {variant}
          </Badge>
        ))}
        <Badge variant="outline" className="border-bull/30 text-bull">
          bull
        </Badge>
        <Badge variant="outline" className="border-bear/30 text-bear">
          bear
        </Badge>
      </Section>

      <Section title="Card">
        <Card className="w-80">
          <CardHeader>
            <CardTitle>Crypto basics</CardTitle>
            <CardDescription>
              Blockchain, wallets and your first trade.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            12 lessons · 2 hours
          </CardContent>
          <CardFooter>
            <Button size="sm">Start course</Button>
          </CardFooter>
        </Card>
        <Card className="w-80 glass">
          <CardHeader>
            <CardTitle>Glass card</CardTitle>
            <CardDescription>
              Card with the frosted glass utility.
            </CardDescription>
          </CardHeader>
        </Card>
      </Section>

      <Section title="Dropdown menu and toggle group">
        {/* No course on this page, so there are no slugs to translate. */}
        <LocaleSwitcher courseSlugs={[]} />
        <ThemeToggle />
      </Section>
    </Container>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-sm font-medium tracking-wide text-muted-foreground uppercase">
        {title}
      </h2>
      <div className="flex flex-wrap items-start gap-3">{children}</div>
    </section>
  );
}
