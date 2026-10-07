import Image, { type StaticImageData } from "next/image";

import { cn } from "@/lib/utils";

type FigureProps = {
  // Imported image file, e.g. `import chart from "./chart.png"` at the top of the lesson.
  // With only one image, make it fit the dark theme (preferred look of the academy).
  src: StaticImageData;
  // Optional version for the light theme; `src` is then shown only in the dark theme.
  lightSrc?: StaticImageData;
  // Describes what the image shows – read by screen readers, so it is required.
  alt: string;
  caption?: string;
};

const IMAGE_PROPS = {
  placeholder: "blur",
  sizes: "(min-width: 768px) 46rem, 100vw",
} as const;

// Image in a lesson, optimized by next/image (right size per screen, modern formats, lazy loading).
// With lightSrc, the browser may download both variants (it can fetch images before CSS hides one),
// so add a light version only when the dark one really does not work on a light background.
export function Figure({ src, lightSrc, alt, caption }: FigureProps) {
  return (
    <figure>
      {lightSrc && (
        <Image
          src={lightSrc}
          alt={alt}
          {...IMAGE_PROPS}
          className="rounded-lg border border-border dark:hidden"
        />
      )}
      <Image
        src={src}
        alt={alt}
        {...IMAGE_PROPS}
        className={cn(
          "rounded-lg border border-border",
          lightSrc && "hidden dark:block",
        )}
      />
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}
