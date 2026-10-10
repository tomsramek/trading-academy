"use client";

import { useSearchParams } from "next/navigation";

import type { CourseSummary } from "@/lib/content/course-summary";
import { levelParam } from "@/lib/content/levels";

import { CourseCatalog } from "./CourseCatalog";

// Reads ?level=… in the browser. The page itself is static (built once), so the server never sees
// the query – the server renders all courses and this component narrows them after loading.
// Must be wrapped in <Suspense>; its fallback is the full, server-rendered catalog.
export function CourseCatalogFromUrl({
  courses,
}: {
  courses: CourseSummary[];
}) {
  const searchParams = useSearchParams();
  // An unknown value (?level=expert) shows all courses instead of an error.
  const level = levelParam.safeParse(searchParams.get("level")).data;

  return <CourseCatalog courses={courses} level={level} />;
}
