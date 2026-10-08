import { cn } from "@/lib/utils";

// Professor Wick (cs: Profesor Knot) – the academy's mascot: the candlestick with a graduation cap
// from the logo, with a face. Decorative; the text around it carries the message.
type ProfessorWickProps = {
  // standing: a green candle, smiling. fallen: a red candle lying on the ground, cap knocked off.
  pose: "standing" | "fallen";
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
      {pose === "standing" ? <Standing /> : <Fallen />}
    </svg>
  );
}

function Cap() {
  return (
    <g className="fill-foreground stroke-foreground" strokeLinejoin="round">
      <polygon points="-40,0 0,-18 40,0 0,18" strokeWidth="3" />
      <line x1="32" y1="4" x2="32" y2="26" strokeWidth="3" />
      <circle cx="32" cy="29" r="4" className="stroke-none" />
    </g>
  );
}

function Standing() {
  return (
    <g>
      <line
        x1="120"
        y1="150"
        x2="120"
        y2="186"
        className="stroke-bull"
        strokeWidth="6"
      />
      <rect
        x="96"
        y="70"
        width="48"
        height="84"
        rx="10"
        className="fill-bull"
      />
      <circle cx="110" cy="100" r="4.5" className="fill-background" />
      <circle cx="130" cy="100" r="4.5" className="fill-background" />
      <path
        d="M108 116 q12 12 24 0"
        className="fill-none stroke-background"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <g transform="translate(120 58)">
        <Cap />
      </g>
    </g>
  );
}

function Fallen() {
  return (
    <g>
      {/* The candle tipped over to the left, resting on its lower wick – wicks at both ends, as on a chart. */}
      <g transform="translate(48 -4) rotate(-62 120 182)">
        <line
          x1="120"
          y1="40"
          x2="120"
          y2="70"
          className="stroke-bear"
          strokeWidth="6"
        />
        <line
          x1="120"
          y1="154"
          x2="120"
          y2="182"
          className="stroke-bear"
          strokeWidth="6"
        />
        <rect
          x="96"
          y="70"
          width="48"
          height="84"
          rx="10"
          className="fill-bear"
        />
        {/* Dizzy eyes and a surprised mouth */}
        <path
          d="M102 92 l8 8 m0 -8 l-8 8 M126 92 l8 8 m0 -8 l-8 8"
          className="stroke-background"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <ellipse cx="118" cy="122" rx="6" ry="8" className="fill-background" />
      </g>
      {/* Stars circling the head */}
      <g className="fill-warning motion-safe:animate-bob">
        <path d="M36 72 l3 7 7 1 -5 5 1 7 -6 -3 -6 3 1 -7 -5 -5 7 -1z" />
        <path d="M74 60 l2 5 5 1 -4 3 1 5 -4 -2 -4 2 1 -5 -4 -3 5 -1z" />
      </g>
      {/* The cap landed a bit further */}
      <g transform="translate(204 172) rotate(-14)">
        <Cap />
      </g>
    </g>
  );
}
