import { cn } from "@/lib/utils";

export type Pose = "standing" | "fallen" | "celebrating" | "coffee";

// The figure alone (a 240×200 drawing without the ground line), for placing Professor Wick inside
// another SVG drawing, e.g. a lesson illustration: <g transform="translate(x y) scale(s)">.
export function ProfessorWickFigure({ pose }: { pose: Pose }) {
  return (
    <>
      {pose === "standing" && <Standing />}
      {pose === "fallen" && <Fallen />}
      {pose === "celebrating" && <Celebrating />}
      {pose === "coffee" && <Coffee />}
    </>
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

const CONFETTI = [
  { x: 40, y: 40, fill: "fill-warning" },
  { x: 70, y: 90, fill: "fill-chart-1" },
  { x: 180, y: 30, fill: "fill-chart-5" },
  { x: 205, y: 95, fill: "fill-bull" },
  { x: 150, y: 14, fill: "fill-bear" },
] as const;

function Celebrating() {
  return (
    <g>
      {CONFETTI.map(({ x, y, fill }, index) => (
        <rect
          key={x}
          x={x}
          y={y}
          width="10"
          height="10"
          rx="2"
          className={cn(fill, "motion-safe:animate-confetti")}
          style={{ animationDelay: `${index * 150}ms` }}
        />
      ))}
      <line
        x1="125"
        y1="150"
        x2="125"
        y2="186"
        className="stroke-bull"
        strokeWidth="6"
      />
      <line
        x1="125"
        y1="74"
        x2="125"
        y2="96"
        className="stroke-bull"
        strokeWidth="6"
      />
      <rect
        x="101"
        y="96"
        width="48"
        height="58"
        rx="10"
        className="fill-bull"
      />
      {/* Happy closed eyes and a big smile */}
      <path
        d="M110 116 q5 -6 10 0 M130 116 q5 -6 10 0"
        className="fill-none stroke-background"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <path d="M112 130 q13 14 26 0 z" className="fill-background" />
      {/* The cap flies up */}
      <g className="motion-safe:animate-bob">
        <g transform="translate(125 40) rotate(-10)">
          <Cap />
        </g>
      </g>
    </g>
  );
}

// After a night over the charts: heavy eyelids, a content smile and a steaming mug with tiny candles.
function Coffee() {
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
      {/* Half-closed eyes with bags under them */}
      <g className="fill-none stroke-background" strokeLinecap="round">
        <path d="M104 99 h12 M124 99 h12" strokeWidth="4" />
        <path d="M106 101 q4 4 8 0 M126 101 q4 4 8 0" strokeWidth="3" />
        <path
          d="M105 108 q5 3 10 0 M125 108 q5 3 10 0"
          strokeWidth="2.5"
          className="opacity-40"
        />
      </g>
      <path
        d="M112 122 q8 7 16 0"
        className="fill-none stroke-background"
        strokeWidth="4"
        strokeLinecap="round"
      />
      {/* The arm and the mug */}
      <path
        d="M143 122 q12 6 17 -2"
        className="fill-none stroke-bull"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <rect
        x="156"
        y="104"
        width="30"
        height="34"
        rx="5"
        className="fill-primary"
      />
      <path
        d="M186 112 q11 0 11 9 q0 9 -11 9"
        className="fill-none stroke-primary"
        strokeWidth="5"
      />
      <g className="fill-primary-foreground stroke-primary-foreground">
        <path
          d="M164 122 v10 M171 116 v12 M178 111 v12"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <rect x="162" y="124" width="4" height="5" className="stroke-none" />
        <rect x="169" y="118" width="4" height="7" className="stroke-none" />
        <rect x="176" y="113" width="4" height="7" className="stroke-none" />
      </g>
      <g
        className="fill-none stroke-muted-foreground motion-safe:animate-bob"
        strokeWidth="3"
        strokeLinecap="round"
      >
        <path d="M164 98 q-5 -7 0 -14 q5 -7 0 -14" />
        <path d="M176 96 q-5 -7 0 -14 q5 -7 0 -14" />
      </g>
      {/* The cap sits a little askew */}
      <g transform="translate(118 58) rotate(-8)">
        <Cap />
      </g>
    </g>
  );
}
