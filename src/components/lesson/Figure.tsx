import Image, { type StaticImageData } from "next/image";

type FigureProps = {
  // Imported image file, e.g. `import chart from "./chart.png"` at the top of the lesson.
  src: StaticImageData;
  // Describes what the image shows – read by screen readers, so it is required.
  alt: string;
  caption?: string;
};

// Image in a lesson, optimized by next/image (right size per screen, modern formats, lazy loading).
export function Figure({ src, alt, caption }: FigureProps) {
  return (
    <figure>
      <Image
        src={src}
        alt={alt}
        placeholder="blur"
        sizes="(min-width: 768px) 46rem, 100vw"
        className="rounded-lg border border-border"
      />
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}
