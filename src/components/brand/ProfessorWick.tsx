import { cn } from "@/lib/utils";

import { ProfessorWickFigure, type Pose } from "./ProfessorWickFigure";

// Professor Wick (cs: Profesor Knot) – the academy's mascot: the candlestick with a graduation cap
// from the logo, with a face. Decorative; the text around it carries the message.
type ProfessorWickProps = {
  // standing: a green candle, smiling. fallen: a red candle tipped over, cap knocked off.
  // celebrating: a green candle tossing its cap in the air, with confetti.
  pose: Pose;
  className?: string;
};

export function ProfessorWick({ pose, className }: ProfessorWickProps) {
  return (
    <svg
      viewBox="0 0 250 200"
      aria-hidden="true"
      className={cn("w-full max-w-60", className)}
    >
      <line
        x1="10"
        y1="186"
        x2="240"
        y2="186"
        className="stroke-border"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <ProfessorWickFigure pose={pose} />
    </svg>
  );
}
