import { useTranslations } from "next-intl";

/*
 * Fun illustrations of the home page. Same rules as the lesson illustrations (../Illustration.tsx):
 * a 640×360 drawing, design tokens, the dark theme, texts from messages and short animations.
 */

// A rollercoaster on a candlestick chart – fine, as long as you wear the seatbelt called a plan.
// Drawn without a background, for <Illustration frameless> in the hero.
function ChartCoaster() {
  const t = useTranslations("Lesson.illustration.chartCoaster");
  const track =
    "M20 300 L110 230 L170 270 L260 150 L320 200 L410 90 L470 140 L620 60";
  return (
    <>
      {/* No background: shown frameless in the hero, on top of the page and its glow. */}
      {/* Supports under the track */}
      {[
        [110, 230],
        [170, 270],
        [260, 150],
        [320, 200],
        [410, 90],
        [470, 140],
      ].map(([x = 0, y = 0]) => (
        <line
          key={x}
          x1={x}
          y1={y}
          x2={x}
          y2="360"
          className="stroke-border"
          strokeWidth="6"
        />
      ))}
      <path
        d={track}
        className="fill-none stroke-bull"
        strokeWidth="10"
        strokeLinejoin="round"
      />

      {/* The cart with a passenger, arms up, the seatbelt called PLAN */}
      <g className="motion-safe:group-data-playing/anim:animate-bob">
        {/* Placed on the track segment from (170, 270) to (260, 150): rotated along its slope and moved
            off it by the wheel height, so the wheels sit on the rail. */}
        <g transform="translate(191 192) rotate(-53.13)">
          <rect
            x="-55"
            y="-30"
            width="110"
            height="44"
            rx="12"
            className="fill-primary"
          />
          <circle cx="-33" cy="20" r="10" className="fill-foreground" />
          <circle cx="33" cy="20" r="10" className="fill-foreground" />
          <circle cx="0" cy="-66" r="24" className="fill-foreground" />
          <path
            d="M-10 -70 q3 -4 6 0 M4 -70 q3 -4 6 0"
            className="fill-none stroke-background"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path d="M-11 -58 q11 12 22 0" className="fill-background" />
          <path
            d="M-20 -40 l-22 -40 M20 -40 l22 -40"
            className="stroke-foreground"
            strokeWidth="9"
            strokeLinecap="round"
          />
          <rect
            x="-33"
            y="-42"
            width="66"
            height="20"
            rx="6"
            className="fill-warning"
          />
          <text
            x="0"
            y="-27"
            textAnchor="middle"
            className="fill-background text-xs font-bold"
          >
            {t("belt")}
          </text>
        </g>
      </g>

      <g
        className="origin-center transform-fill motion-safe:group-data-playing/anim:animate-bubble-pop"
        style={{ animationDelay: "900ms" }}
      >
        <rect
          x="40"
          y="40"
          width="270"
          height="48"
          rx="24"
          className="fill-card stroke-border"
          strokeWidth="2"
        />
        <path d="M260 86 l14 24 l6 -24 z" className="fill-card" />
        <text
          x="175"
          y="71"
          textAnchor="middle"
          className="fill-foreground text-lg font-semibold"
        >
          {t("bubble")}
        </text>
      </g>
    </>
  );
}

// The internet guru shouts promises through a megaphone; next to him someone quietly reads lesson 1.
// Drawn without a background, for <Illustration frameless> in the hero.
function GuruMegaphone() {
  const t = useTranslations("Lesson.illustration.guruMegaphone");
  return (
    <>
      {/* No background: shown frameless in the hero. Only a line for the ground. */}
      <line
        x1="40"
        y1="320"
        x2="600"
        y2="320"
        className="stroke-border"
        strokeWidth="4"
        strokeLinecap="round"
      />

      {/* The guru: sunglasses, a gold chain and a megaphone */}
      <g className="origin-bottom transform-fill motion-safe:group-data-playing/anim:animate-wiggle">
        <path
          d="M110 320 q0 -75 50 -75 q50 0 50 75 z"
          className="fill-foreground"
        />
        <circle cx="160" cy="210" r="30" className="fill-foreground" />
        <rect
          x="138"
          y="200"
          width="44"
          height="12"
          rx="5"
          className="fill-background"
        />
        <path
          d="M150 226 q10 6 20 0"
          className="fill-none stroke-background"
          strokeWidth="3"
        />
        <path
          d="M130 256 q30 30 60 0"
          className="fill-none stroke-warning"
          strokeWidth="5"
        />
        <path d="M200 228 l60 -30 l0 50 z" className="fill-warning" />
        <path
          d="M272 200 q12 23 0 46 M286 192 q18 31 0 62"
          className="fill-none stroke-warning"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </g>

      {/* Someone quietly reading the first lesson */}
      <path
        d="M440 320 q0 -75 50 -75 q50 0 50 75 z"
        className="fill-foreground"
      />
      <circle cx="490" cy="210" r="30" className="fill-foreground" />
      <circle cx="480" cy="206" r="3.5" className="fill-background" />
      <circle cx="500" cy="206" r="3.5" className="fill-background" />
      <path
        d="M481 222 q9 7 18 0"
        className="fill-none stroke-background"
        strokeWidth="3"
      />
      <rect
        x="420"
        y="250"
        width="140"
        height="60"
        rx="6"
        className="fill-primary"
      />
      <line
        x1="490"
        y1="250"
        x2="490"
        y2="310"
        className="stroke-background"
        strokeWidth="3"
      />
      <text
        x="455"
        y="285"
        textAnchor="middle"
        className="fill-background text-xs font-bold"
      >
        {t("book")}
      </text>
      <text
        x="525"
        y="285"
        textAnchor="middle"
        className="fill-background text-xs font-bold"
      >
        {t("bookRisk")}
      </text>

      <g
        className="origin-center transform-fill motion-safe:group-data-playing/anim:animate-bubble-pop"
        style={{ animationDelay: "500ms" }}
      >
        <rect
          x="40"
          y="50"
          width="300"
          height="56"
          rx="28"
          className="fill-bear stroke-border"
          strokeWidth="2"
        />
        <path d="M150 104 l12 26 l14 -26 z" className="fill-bear" />
        <text
          x="190"
          y="86"
          textAnchor="middle"
          className="fill-background text-xl font-bold"
        >
          {t("bubble")}
        </text>
      </g>
    </>
  );
}

export const HOME_ILLUSTRATIONS = {
  chartCoaster: ChartCoaster,
  guruMegaphone: GuruMegaphone,
} as const;
