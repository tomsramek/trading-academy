import { notFound } from "next/navigation";

// Any unknown URL inside a locale (/cs/neco, /something) ends here and shows [locale]/not-found.tsx
// inside the site layout, in the right language – instead of the bare Next.js 404 page.
export default function CatchAllPage() {
  notFound();
}
