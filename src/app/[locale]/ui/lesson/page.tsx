import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Container } from "@/components/layout/Container";

import Sample from "./sample.mdx";

// Development-only preview of a lesson with every MDX element and component.
// Not translated and not available in production.
export const metadata: Metadata = {
  title: "Lesson preview",
  robots: { index: false, follow: false },
};

export default function UiLessonPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return (
    <Container className="py-12">
      <article className="mx-auto prose prose-lg prose-academy">
        <h1>Reading a candlestick chart</h1>
        <Sample />
      </article>
    </Container>
  );
}
