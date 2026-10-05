// Shared heading block for the landing page sections.
export function SectionHeading({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="flex max-w-3xl flex-col gap-4">
      <h2 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
        {title}
      </h2>
      {description && (
        <p className="text-xl text-pretty text-muted-foreground sm:text-2xl">
          {description}
        </p>
      )}
    </div>
  );
}
