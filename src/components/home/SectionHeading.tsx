import { cn } from "@/lib/utils";

// Shared heading block for the landing page sections; `centered` for sections laid out in the middle.
export function SectionHeading({
  title,
  description,
  centered = false,
}: {
  title: string;
  description?: string;
  centered?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex max-w-3xl flex-col gap-4",
        centered && "mx-auto items-center text-center",
      )}
    >
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
