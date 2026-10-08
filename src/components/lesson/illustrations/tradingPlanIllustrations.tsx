import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";

import { Bubble } from "./Bubble";
import { Person } from "./Person";

/*
 * Fun illustrations of the course "Trading with a plan" (content/courses/trading-with-a-plan).
 * Same rules as in ../Illustration.tsx, which shows them: a 640×360 drawing, colors from the design
 * tokens, the dark theme, texts from messages (Lesson.illustration.<name>) and short animations.
 */

// Market structure: a shopper walks down the stairs of lower highs and lows, sure it is a bargain.
function StairsDown() {
  const t = useTranslations("Lesson.illustration.stairsDown");
  const steps = [0, 1, 2, 3, 4];
  return (
    <>
      <rect width="640" height="360" className="fill-muted" />
      {steps.map((step) => (
        <rect
          key={step}
          x={40 + step * 115}
          y={110 + step * 45}
          width="115"
          height={250 - step * 45}
          className="fill-card stroke-border"
          strokeWidth="2"
        />
      ))}
      <g className="motion-safe:group-data-playing/anim:animate-bob">
        <Person x={330} ground={200} />
        {/* Shopping bag with a SALE tag */}
        <rect
          x="368"
          y="150"
          width="44"
          height="42"
          rx="4"
          className="fill-warning"
        />
        <path
          d="M378 150 q12 -18 24 0"
          className="fill-none stroke-warning"
          strokeWidth="3"
        />
        <text
          x="390"
          y="177"
          textAnchor="middle"
          className="fill-background text-[11px] font-bold"
        >
          {t("tag")}
        </text>
      </g>

      <Bubble x={380} y={40} width={220} text={t("bubble")} tail="left" />
    </>
  );
}

// Support and resistance: the old ceiling became the floor the ball now bounces on.
function CeilingFloor() {
  const t = useTranslations("Lesson.illustration.ceilingFloor");
  return (
    <>
      <rect width="640" height="360" className="fill-muted" />
      {/* Ground floor and the slab between the floors */}
      <rect x="0" y="320" width="640" height="40" className="fill-card" />
      <rect x="0" y="190" width="640" height="18" className="fill-card" />
      <path
        d="M300 190 l12 9 l-8 9 M330 190 l-6 10 l10 8"
        className="fill-none stroke-border"
        strokeWidth="3"
      />
      <text
        x="600"
        y="234"
        textAnchor="end"
        className="fill-muted-foreground text-sm font-semibold"
      >
        {t("slab")}
      </text>

      {/* The ball bouncing on the slab */}
      <g className="motion-safe:group-data-playing/anim:animate-bounce-ball">
        <circle cx="320" cy="166" r="24" className="fill-bull" />
        <path
          d="M300 158 q20 -14 40 0"
          className="fill-none stroke-background opacity-40"
          strokeWidth="3"
        />
      </g>
      <Bubble
        x={360}
        y={70}
        width={250}
        text={t("ball")}
        tail="left"
        delay={600}
      />

      {/* A surprised person downstairs, looking up */}
      <Person x={110} ground={320} mood="surprised" />
      <Bubble
        x={170}
        y={246}
        width={230}
        text={t("bubble")}
        tail="left"
        delay={1400}
      />
    </>
  );
}

// Multiple timeframes: far away a calm trend, under the magnifying glass pure chaos.
function ZoomLenses() {
  const t = useTranslations("Lesson.illustration.zoomLenses");
  return (
    <>
      <rect width="640" height="360" className="fill-muted" />
      {/* Weekly board: one smooth line */}
      <rect
        x="40"
        y="50"
        width="250"
        height="160"
        rx="10"
        className="fill-card stroke-border"
        strokeWidth="2"
      />
      <path
        d="M60 185 q60 -10 100 -50 t110 -60"
        className="fill-none stroke-bull"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <text
        x="60"
        y="76"
        className="fill-muted-foreground text-sm font-semibold"
      >
        {t("week")}
      </text>

      {/* Hourly board: a nervous zigzag */}
      <rect
        x="350"
        y="50"
        width="250"
        height="160"
        rx="10"
        className="fill-card stroke-border"
        strokeWidth="2"
      />
      <path
        d="M365 120 l15 -30 l12 50 l14 -40 l10 60 l16 -70 l12 45 l14 -20 l10 40 l14 -55 l12 25 l16 -15 l12 30 l14 -35"
        className="fill-none stroke-bear"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <text
        x="370"
        y="76"
        className="fill-muted-foreground text-sm font-semibold"
      >
        {t("hour")}
      </text>
      {/* Magnifying glass sweeping over the hourly chart */}
      <g className="motion-safe:group-data-playing/anim:animate-sweep">
        <circle
          cx="420"
          cy="135"
          r="40"
          className="fill-none stroke-foreground"
          strokeWidth="6"
        />
        <line
          x1="448"
          y1="164"
          x2="478"
          y2="196"
          className="stroke-foreground"
          strokeWidth="10"
          strokeLinecap="round"
        />
      </g>

      <Person x={560} ground={360} mood="worried" />
      <Bubble
        x={160}
        y={262}
        width={340}
        text={t("bubble")}
        tail="right"
        delay={1200}
      />
    </>
  );
}

// Moving average: the dog (price) zigzags all over, the owner (average) walks calmly on.
function DogWalk() {
  const t = useTranslations("Lesson.illustration.dogWalk");
  return (
    <>
      <rect width="640" height="360" className="fill-muted" />
      <rect x="0" y="320" width="640" height="40" className="fill-card" />
      {/* The paths: a nervous zigzag and a calm line */}
      <path
        d="M40 300 l30 -40 l25 50 l30 -60 l25 45 l30 -30 l25 35"
        className="fill-none stroke-bear opacity-50"
        strokeWidth="3"
        strokeDasharray="6 6"
      />
      <path
        d="M40 300 q120 -10 230 -12"
        className="fill-none stroke-chart-1 opacity-70"
        strokeWidth="4"
      />

      {/* The dog, wagging around on the leash */}
      <g className="origin-bottom transform-fill motion-safe:group-data-playing/anim:animate-wiggle">
        <ellipse cx="250" cy="290" rx="38" ry="20" className="fill-warning" />
        <circle cx="288" cy="268" r="17" className="fill-warning" />
        {/* Snout with a nose and a floppy ear: a dog, not a cat */}
        <ellipse cx="305" cy="274" rx="12" ry="8" className="fill-warning" />
        <circle cx="315" cy="272" r="4" className="fill-background" />
        <ellipse
          cx="279"
          cy="270"
          rx="7"
          ry="14"
          transform="rotate(20 279 270)"
          className="fill-chart-3 opacity-80"
        />
        <circle cx="292" cy="262" r="3" className="fill-background" />
        <path
          d="M212 284 q-20 -20 -8 -34"
          className="fill-none stroke-warning"
          strokeWidth="6"
          strokeLinecap="round"
        />
        {[228, 270].map((x) => (
          <rect
            key={x}
            x={x}
            y="300"
            width="9"
            height="22"
            rx="4"
            className="fill-warning"
          />
        ))}
      </g>
      <text
        x="250"
        y="345"
        textAnchor="middle"
        className="fill-bear text-sm font-bold"
      >
        {t("price")}
      </text>

      {/* Leash and the owner */}
      <path
        d="M298 274 q60 -30 112 -60"
        className="fill-none stroke-muted-foreground"
        strokeWidth="3"
      />
      <Person x={450} ground={320} />
      <text
        x="450"
        y="345"
        textAnchor="middle"
        className="fill-chart-1 text-sm font-bold"
      >
        {t("average")}
      </text>
      <Bubble x={330} y={40} width={270} text={t("bubble")} tail="right" />
    </>
  );
}

// RSI: the speedometer is deep in the red, and the car keeps accelerating anyway.
function Speedometer() {
  const t = useTranslations("Lesson.illustration.speedometer");
  return (
    <>
      <rect width="640" height="360" className="fill-muted" />
      {/* The gauge: green, neutral and red arcs */}
      <path
        d="M120 260 A150 150 0 0 1 165 154"
        className="fill-none stroke-bull"
        strokeWidth="26"
      />
      <path
        d="M170 149 A150 150 0 0 1 370 149"
        className="fill-none stroke-muted-foreground opacity-40"
        strokeWidth="26"
      />
      <path
        d="M375 154 A150 150 0 0 1 420 260"
        className="fill-none stroke-bear"
        strokeWidth="26"
      />
      <text x="150" y="128" className="fill-muted-foreground text-sm font-bold">
        30
      </text>
      <text x="372" y="128" className="fill-muted-foreground text-sm font-bold">
        70
      </text>
      <text
        x="270"
        y="300"
        textAnchor="middle"
        className="fill-foreground text-2xl font-bold"
      >
        {t("value")}
      </text>
      {/* The needle points into the red and trembles there */}
      <g transform="rotate(74 270 260)">
        <g className="origin-bottom transform-fill motion-safe:group-data-playing/anim:animate-swing">
          <path d="M266 260 l4 -130 l4 130 z" className="fill-foreground" />
        </g>
      </g>
      <circle cx="270" cy="260" r="12" className="fill-foreground" />

      <Bubble
        x={340}
        y={40}
        width={270}
        text={t("bubble")}
        tail="left"
        delay={1000}
      />
    </>
  );
}

// Volume: a packed stand cheering together versus one lonely fan.
function CrowdRoar() {
  const t = useTranslations("Lesson.illustration.crowdRoar");
  const crowd = [
    [60, 250],
    [110, 250],
    [160, 250],
    [210, 250],
    [85, 300],
    [135, 300],
    [185, 300],
    [235, 300],
  ] as const;
  return (
    <>
      <rect width="640" height="360" className="fill-muted" />
      {/* Two stands */}
      <rect x="30" y="220" width="250" height="140" className="fill-card" />
      <rect x="360" y="220" width="250" height="140" className="fill-card" />

      <g className="motion-safe:group-data-playing/anim:animate-bob">
        {crowd.map(([x, y]) => (
          <g key={`${x}-${y}`}>
            <path
              d={`M${x - 20} ${y + 40} q0 -32 20 -32 q20 0 20 32 z`}
              className="fill-foreground"
            />
            <circle cx={x} cy={y - 4} r="14" className="fill-foreground" />
            <path
              d={`M${x - 18} ${y + 6} l-8 -26 M${x + 18} ${y + 6} l8 -26`}
              className="stroke-foreground"
              strokeWidth="6"
              strokeLinecap="round"
            />
          </g>
        ))}
      </g>
      <text
        x="155"
        y="210"
        textAnchor="middle"
        className="fill-bull text-sm font-bold"
      >
        {t("big")}
      </text>

      {/* The lonely fan */}
      <g className="motion-safe:group-data-playing/anim:animate-bob">
        <path
          d="M465 340 q0 -32 20 -32 q20 0 20 32 z"
          className="fill-foreground"
        />
        <circle cx="485" cy="296" r="14" className="fill-foreground" />
        <path
          d="M467 306 l-8 -26"
          className="stroke-foreground"
          strokeWidth="6"
          strokeLinecap="round"
        />
      </g>
      <text
        x="485"
        y="210"
        textAnchor="middle"
        className="fill-muted-foreground text-sm font-bold"
      >
        {t("small")}
      </text>

      <Bubble x={40} y={60} width={220} text={t("crowd")} tail="left" />
      <Bubble
        x={400}
        y={110}
        width={180}
        text={t("lonely")}
        tail="left"
        delay={1400}
      />
    </>
  );
}

// Why indicators mislead: a fortune teller reads golden crosses in a flickering crystal ball.
function CrystalBall() {
  const t = useTranslations("Lesson.illustration.crystalBall");
  return (
    <>
      <rect width="640" height="360" className="fill-muted" />
      {/* Table with a sign */}
      <rect
        x="140"
        y="280"
        width="360"
        height="80"
        rx="8"
        className="fill-card"
      />
      <text
        x="320"
        y="330"
        textAnchor="middle"
        className="fill-warning text-sm font-bold"
      >
        {t("sign")}
      </text>

      {/* The fortune teller behind the table, with a pointed hat */}
      <Person x={320} ground={280} />
      <path d="M290 152 l30 -70 l30 70 z" className="fill-primary" />
      <circle cx="320" cy="82" r="6" className="fill-warning" />

      {/* Crystal ball with a chart inside, flickering */}
      <g className="motion-safe:group-data-playing/anim:animate-screen-flicker">
        <circle
          cx="420"
          cy="246"
          r="42"
          className="fill-chart-5 stroke-chart-5 opacity-30"
          strokeWidth="3"
        />
        <path
          d="M392 258 l14 -12 l12 8 l14 -22 l12 6"
          className="fill-none stroke-warning"
          strokeWidth="3"
        />
        <path
          d="M392 240 q30 20 56 4"
          className="fill-none stroke-chart-1"
          strokeWidth="3"
        />
      </g>
      <rect
        x="395"
        y="282"
        width="50"
        height="10"
        rx="4"
        className="fill-border"
      />

      <Bubble
        x={60}
        y={50}
        width={230}
        text={t("bubble")}
        tail="right"
        delay={1000}
      />
    </>
  );
}

// Order types: a remote control with too many buttons and a puzzled owner.
function OrderRemote() {
  const t = useTranslations("Lesson.illustration.orderRemote");
  const buttons = [
    ["market", 110, "fill-bull"],
    ["limit", 160, "fill-primary"],
    ["stop", 210, "fill-bear"],
    ["oco", 260, "fill-warning"],
  ] as const;
  return (
    <>
      <rect width="640" height="360" className="fill-muted" />
      <rect
        x="200"
        y="50"
        width="150"
        height="290"
        rx="30"
        className="fill-card stroke-border"
        strokeWidth="3"
      />
      <circle cx="275" cy="80" r="10" className="fill-bear" />
      {buttons.map(([key, y, fill], index) => (
        <g
          key={key}
          className={cn(
            index === 2 && "motion-safe:group-data-playing/anim:animate-press",
          )}
        >
          <rect
            x="225"
            y={y}
            width="100"
            height="36"
            rx="18"
            className={fill}
          />
          <text
            x="275"
            y={y + 24}
            textAnchor="middle"
            className="fill-background text-sm font-bold"
          >
            {t(key)}
          </text>
        </g>
      ))}
      <Person x={500} ground={360} mood="worried" />
      <Bubble x={370} y={60} width={250} text={t("bubble")} tail="right" />
    </>
  );
}

// What a trade costs: little bugs called fee, spread and slippage nibble at the wallet.
function FeeTermites() {
  const t = useTranslations("Lesson.illustration.feeTermites");
  const bugs = [
    ["fee", 200, 282],
    ["spread", 330, 286],
    ["slippage", 450, 280],
  ] as const;
  return (
    <>
      <rect width="640" height="360" className="fill-muted" />
      {/* The wallet with coins */}
      <rect
        x="170"
        y="140"
        width="300"
        height="130"
        rx="16"
        className="fill-chart-3"
      />
      <rect
        x="400"
        y="180"
        width="70"
        height="50"
        rx="10"
        className="fill-warning"
      />
      <circle cx="430" cy="205" r="8" className="fill-background" />
      {[230, 270, 310].map((x) => (
        <ellipse
          key={x}
          cx={x}
          cy="140"
          rx="20"
          ry="8"
          className="fill-warning"
        />
      ))}
      {/* Bite marks along the bottom edge */}
      <path
        d="M200 270 q10 -14 20 0 q10 -14 20 0 M330 270 q10 -14 20 0"
        className="fill-muted"
      />

      {bugs.map(([key, x, y]) => (
        <g
          key={key}
          className="origin-center transform-fill motion-safe:group-data-playing/anim:animate-wiggle"
        >
          <ellipse cx={x} cy={y} rx="26" ry="14" className="fill-foreground" />
          <circle cx={x + 26} cy={y - 4} r="10" className="fill-foreground" />
          <path
            d={`M${x - 16} ${y + 12} l-6 12 M${x} ${y + 14} l0 12 M${x + 14} ${y + 12} l6 12`}
            className="stroke-foreground"
            strokeWidth="3"
          />
          <text
            x={x}
            y={y + 46}
            textAnchor="middle"
            className="fill-bear text-sm font-bold"
          >
            {t(key)}
          </text>
        </g>
      ))}
      <Bubble x={190} y={40} width={260} text={t("bubble")} tail="left" />
    </>
  );
}

// Leverage: a wobbly tower of blocks with 100× on top, and one more block on the way.
function JengaLeverage() {
  const t = useTranslations("Lesson.illustration.jengaLeverage");
  const blocks = [0, 1, 2, 3, 4, 5, 6];
  return (
    <>
      <rect width="640" height="360" className="fill-muted" />
      <rect x="0" y="320" width="640" height="40" className="fill-card" />
      <g className="origin-bottom transform-fill motion-safe:group-data-playing/anim:animate-swing">
        {blocks.map((block) => (
          <rect
            key={block}
            x={150 + (block % 2) * 12}
            y={290 - block * 32}
            width="120"
            height="28"
            rx="4"
            className="fill-chart-3 stroke-background"
            strokeWidth="2"
          />
        ))}
        <rect
          x="170"
          y="40"
          width="90"
          height="34"
          rx="6"
          className="fill-bear"
        />
        <text
          x="215"
          y="64"
          textAnchor="middle"
          className="fill-background text-lg font-bold"
        >
          {t("tag")}
        </text>
      </g>
      {/* One more block in the trader's hand */}
      <Person x={450} ground={320} />
      <line
        x1="415"
        y1="262"
        x2="380"
        y2="246"
        className="stroke-foreground"
        strokeWidth="12"
        strokeLinecap="round"
      />
      <rect
        x="330"
        y="230"
        width="70"
        height="24"
        rx="4"
        className="fill-chart-3"
      />
      <Bubble x={330} y={60} width={260} text={t("bubble")} tail="right" />
    </>
  );
}

// Position size: of the whole cake (the account) only one small slice is at stake.
function CakeSlice() {
  const t = useTranslations("Lesson.illustration.cakeSlice");
  return (
    <>
      <rect width="640" height="360" className="fill-muted" />
      {/* The whole cake from the side: sponge layers, cream and cherries */}
      <ellipse cx="220" cy="300" rx="170" ry="24" className="fill-card" />
      <rect
        x="80"
        y="170"
        width="280"
        height="120"
        rx="10"
        className="fill-chart-3"
      />
      <rect
        x="80"
        y="210"
        width="280"
        height="14"
        className="fill-foreground"
      />
      <rect
        x="80"
        y="250"
        width="280"
        height="14"
        className="fill-foreground"
      />
      <path
        d="M80 180 q0 -20 20 -20 h240 q20 0 20 20 q-17 18 -35 0 q-17 18 -35 0 q-17 18 -35 0 q-17 18 -35 0 q-17 18 -35 0 q-17 18 -35 0 q-17 18 -35 0 q-17 18 -35 0 z"
        className="fill-foreground"
      />
      {[120, 180, 240, 300].map((x) => (
        <circle key={x} cx={x} cy="150" r="10" className="fill-bear" />
      ))}

      {/* The one slice, on its own plate */}
      <ellipse cx="480" cy="300" rx="70" ry="14" className="fill-card" />
      <g className="motion-safe:group-data-playing/anim:animate-drop-in">
        <rect
          x="455"
          y="200"
          width="50"
          height="94"
          rx="4"
          className="fill-chart-3"
        />
        <rect
          x="455"
          y="226"
          width="50"
          height="10"
          className="fill-foreground"
        />
        <rect
          x="455"
          y="256"
          width="50"
          height="10"
          className="fill-foreground"
        />
        <rect
          x="455"
          y="190"
          width="50"
          height="16"
          rx="6"
          className="fill-foreground"
        />
        <circle cx="480" cy="182" r="9" className="fill-bear" />
        <text
          x="480"
          y="288"
          textAnchor="middle"
          className="fill-background text-base font-bold"
        >
          {t("tag")}
        </text>
      </g>
      <text
        x="220"
        y="345"
        textAnchor="middle"
        className="fill-muted-foreground text-sm font-semibold"
      >
        {t("account")}
      </text>
      <Bubble x={340} y={50} width={270} text={t("bubble")} tail="right" />
    </>
  );
}

// Expected value: a coin flip that loses more often but wins twice as much.
function CoinFlip() {
  const t = useTranslations("Lesson.illustration.coinFlip");
  return (
    <>
      <rect width="640" height="360" className="fill-muted" />
      {/* Two price tags: what each side pays */}
      <rect
        x="60"
        y="230"
        width="150"
        height="70"
        rx="12"
        className="fill-card"
      />
      <text
        x="135"
        y="262"
        textAnchor="middle"
        className="fill-bull text-lg font-bold"
      >
        {t("win")}
      </text>
      <text
        x="135"
        y="286"
        textAnchor="middle"
        className="fill-muted-foreground text-sm"
      >
        {t("winOdds")}
      </text>
      <rect
        x="430"
        y="230"
        width="150"
        height="70"
        rx="12"
        className="fill-card"
      />
      <text
        x="505"
        y="262"
        textAnchor="middle"
        className="fill-bear text-lg font-bold"
      >
        {t("loss")}
      </text>
      <text
        x="505"
        y="286"
        textAnchor="middle"
        className="fill-muted-foreground text-sm"
      >
        {t("lossOdds")}
      </text>

      {/* The spinning coin */}
      <g className="origin-center transform-fill motion-safe:group-data-playing/anim:animate-meter-spin">
        <circle cx="320" cy="180" r="60" className="fill-warning" />
        <circle
          cx="320"
          cy="180"
          r="46"
          className="fill-none stroke-chart-3"
          strokeWidth="5"
        />
        <text
          x="320"
          y="194"
          textAnchor="middle"
          className="fill-background text-4xl font-bold"
        >
          R
        </text>
      </g>
      <Bubble
        x={170}
        y={40}
        width={300}
        text={t("bubble")}
        tail="left"
        delay={2600}
      />
    </>
  );
}

// Trading plan: the pilot ticks the checklist, the trader keeps the plan "in his head".
function PilotChecklist() {
  const t = useTranslations("Lesson.illustration.pilotChecklist");
  return (
    <>
      <rect width="640" height="360" className="fill-muted" />
      <rect x="0" y="330" width="640" height="30" className="fill-card" />
      {/* The pilot with a cap and a clipboard */}
      <Person x={150} ground={330} />
      <path d="M118 210 q32 -26 64 0 z" className="fill-primary" />
      <rect
        x="112"
        y="204"
        width="76"
        height="8"
        rx="3"
        className="fill-primary"
      />
      <rect
        x="190"
        y="230"
        width="90"
        height="100"
        rx="8"
        className="fill-card stroke-border"
        strokeWidth="2"
      />
      {[250, 275, 300].map((y) => (
        <g key={y}>
          <rect
            x="202"
            y={y - 10}
            width="14"
            height="14"
            rx="3"
            className="fill-none stroke-muted-foreground"
            strokeWidth="2"
          />
          <line
            x1="224"
            y1={y - 3}
            x2="268"
            y2={y - 3}
            className="stroke-muted-foreground"
            strokeWidth="3"
          />
        </g>
      ))}
      <g className="origin-center transform-fill motion-safe:group-data-playing/anim:animate-scribble">
        {[250, 275, 300].map((y) => (
          <path
            key={y}
            d={`M203 ${y - 4} l5 5 l9 -11`}
            className="fill-none stroke-bull"
            strokeWidth="3"
            strokeLinecap="round"
          />
        ))}
      </g>

      {/* The trader, sure he needs no list */}
      <Person x={490} ground={330} />
      <path
        d="M462 172 q28 -40 56 0"
        className="fill-none stroke-warning"
        strokeWidth="4"
        strokeDasharray="4 6"
      />
      <Bubble
        x={340}
        y={50}
        width={270}
        text={t("bubble")}
        tail="right"
        delay={1200}
      />
    </>
  );
}

// Trading journal: a detective examines old journal entries with a magnifying glass.
function DetectiveDiary() {
  const t = useTranslations("Lesson.illustration.detectiveDiary");
  return (
    <>
      <rect width="640" height="360" className="fill-muted" />
      {/* Open journal */}
      <rect
        x="250"
        y="190"
        width="300"
        height="140"
        rx="10"
        className="fill-foreground"
      />
      <line
        x1="400"
        y1="190"
        x2="400"
        y2="330"
        className="stroke-muted-foreground"
        strokeWidth="3"
      />
      {[220, 245, 270, 295].map((y) => (
        <g key={y}>
          <line
            x1="270"
            y1={y}
            x2="385"
            y2={y}
            className="stroke-muted-foreground"
            strokeWidth="3"
          />
          <line
            x1="415"
            y1={y}
            x2="530"
            y2={y}
            className="stroke-muted-foreground"
            strokeWidth="3"
          />
        </g>
      ))}
      <text
        x="465"
        y="322"
        textAnchor="middle"
        className="fill-bear text-lg font-bold"
      >
        {t("entry")}
      </text>

      {/* Detective with a hat */}
      <Person x={140} ground={340} />
      <path d="M92 214 q48 -24 96 0 z" className="fill-chart-3" />
      <rect
        x="104"
        y="196"
        width="72"
        height="22"
        rx="8"
        className="fill-chart-3"
      />

      {/* Magnifying glass sweeping over the page */}
      <g className="motion-safe:group-data-playing/anim:animate-scan">
        <circle
          cx="330"
          cy="240"
          r="38"
          className="fill-background stroke-warning opacity-20"
          strokeWidth="6"
        />
        <line
          x1="302"
          y1="268"
          x2="270"
          y2="300"
          className="stroke-warning"
          strokeWidth="10"
          strokeLinecap="round"
        />
      </g>
      <Bubble
        x={200}
        y={50}
        width={330}
        text={t("bubble")}
        tail="left"
        delay={1200}
      />
    </>
  );
}

// FOMO: a sweaty trader runs after the train that has already left the station.
function FomoTrain() {
  const t = useTranslations("Lesson.illustration.fomoTrain");
  return (
    <>
      <rect width="640" height="360" className="fill-muted" />
      <rect x="0" y="300" width="640" height="60" className="fill-card" />
      {/* Departure board */}
      <rect
        x="40"
        y="40"
        width="200"
        height="56"
        rx="8"
        className="fill-card stroke-border"
        strokeWidth="2"
      />
      <text
        x="140"
        y="74"
        textAnchor="middle"
        className="fill-warning text-sm font-bold"
      >
        {t("board")}
      </text>

      {/* The train at the edge of the picture, already leaving */}
      <rect
        x="430"
        y="190"
        width="230"
        height="100"
        rx="14"
        className="fill-bull"
      />
      {[455, 515, 575].map((x) => (
        <rect
          key={x}
          x={x}
          y="210"
          width="40"
          height="30"
          rx="4"
          className="fill-background"
        />
      ))}
      <text
        x="540"
        y="276"
        textAnchor="middle"
        className="fill-background text-sm font-bold"
      >
        {t("train")}
      </text>
      {[460, 610].map((x) => (
        <circle key={x} cx={x} cy="296" r="12" className="fill-foreground" />
      ))}

      {/* The runner, arm stretched out, sweating */}
      <g className="motion-safe:group-data-playing/anim:animate-bob">
        <Person x={250} ground={300} mood="worried" />
        <line
          x1="285"
          y1="240"
          x2="340"
          y2="210"
          className="stroke-foreground"
          strokeWidth="12"
          strokeLinecap="round"
        />
      </g>
      <path
        d="M226 160 q-6 10 0 14 q6 -4 0 -14 z"
        className="fill-chart-1 motion-safe:group-data-playing/anim:animate-sweat-drop"
      />
      <Bubble
        x={60}
        y={120}
        width={200}
        text={t("bubble")}
        tail="right"
        delay={600}
      />
    </>
  );
}

// Confirmation bias: only the happy headline gets read, the bad news goes straight to the bin.
function HappyNews() {
  const t = useTranslations("Lesson.illustration.happyNews");
  return (
    <>
      <rect width="640" height="360" className="fill-muted" />
      <rect x="0" y="320" width="640" height="40" className="fill-card" />
      <Person x={200} ground={320} />
      {/* The newspaper with the only headline that counts */}
      <rect
        x="240"
        y="170"
        width="170"
        height="120"
        rx="4"
        className="fill-foreground"
      />
      <text
        x="325"
        y="200"
        textAnchor="middle"
        className="fill-bull text-base font-bold"
      >
        {t("headline")}
      </text>
      {[222, 242, 262].map((y) => (
        <line
          key={y}
          x1="256"
          y1={y}
          x2="394"
          y2={y}
          className="stroke-muted-foreground"
          strokeWidth="3"
        />
      ))}

      {/* The bin, where the bad news lands */}
      <path
        d="M470 240 l90 0 l-10 80 l-70 0 z"
        className="fill-muted-foreground opacity-60"
      />
      <g
        className="motion-safe:group-data-playing/anim:animate-drop-in"
        style={{ animationDelay: "400ms" }}
      >
        <rect
          x="482"
          y="200"
          width="66"
          height="50"
          rx="4"
          transform="rotate(-12 515 225)"
          className="fill-foreground"
        />
        <text
          x="515"
          y="230"
          textAnchor="middle"
          transform="rotate(-12 515 225)"
          className="fill-bear text-xs font-bold"
        >
          {t("bad")}
        </text>
      </g>
      <Bubble
        x={60}
        y={60}
        width={240}
        text={t("bubble")}
        tail="right"
        delay={1200}
      />
    </>
  );
}

// When not to trade: lying in a hammock, the laptop closed on the grass.
function HammockRest() {
  const t = useTranslations("Lesson.illustration.hammockRest");
  return (
    <>
      <rect width="640" height="360" className="fill-muted" />
      <rect
        x="0"
        y="310"
        width="640"
        height="50"
        className="fill-bull opacity-30"
      />
      <circle cx="560" cy="70" r="34" className="fill-warning" />
      {/* Two trees */}
      {[110, 470].map((x) => (
        <g key={x}>
          <rect
            x={x - 10}
            y="140"
            width="20"
            height="175"
            className="fill-muted-foreground"
          />
          <circle cx={x} cy="120" r="55" className="fill-bull" />
        </g>
      ))}

      {/* The hammock with the resting trader, gently swinging */}
      <g className="origin-top transform-fill motion-safe:group-data-playing/anim:animate-swing">
        <path
          d="M120 200 q170 110 340 0"
          className="fill-none stroke-warning"
          strokeWidth="8"
        />
        <ellipse
          cx="300"
          cy="248"
          rx="95"
          ry="22"
          className="fill-foreground"
        />
        <circle cx="200" cy="232" r="24" className="fill-foreground" />
        <path
          d="M190 228 q5 4 10 0 M206 228 q5 4 10 0"
          className="fill-none stroke-background"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M195 242 q8 6 16 0"
          className="fill-none stroke-background"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </g>

      {/* The laptop, closed, on the grass */}
      <rect
        x="290"
        y="300"
        width="90"
        height="12"
        rx="3"
        className="fill-border"
      />
      <rect
        x="296"
        y="292"
        width="78"
        height="10"
        rx="3"
        className="fill-muted-foreground"
      />
      <Bubble
        x={190}
        y={20}
        width={230}
        text={t("bubble")}
        tail="left"
        delay={1000}
      />
    </>
  );
}

export const TRADING_PLAN_ILLUSTRATIONS = {
  stairsDown: StairsDown,
  ceilingFloor: CeilingFloor,
  zoomLenses: ZoomLenses,
  dogWalk: DogWalk,
  speedometer: Speedometer,
  crowdRoar: CrowdRoar,
  crystalBall: CrystalBall,
  orderRemote: OrderRemote,
  feeTermites: FeeTermites,
  jengaLeverage: JengaLeverage,
  cakeSlice: CakeSlice,
  coinFlip: CoinFlip,
  pilotChecklist: PilotChecklist,
  detectiveDiary: DetectiveDiary,
  fomoTrain: FomoTrain,
  happyNews: HappyNews,
  hammockRest: HammockRest,
} as const;
