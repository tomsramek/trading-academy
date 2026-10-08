import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";

import { Bubble } from "./Bubble";
import { Person } from "./Person";

/*
 * Fun illustrations of the course "From idea to tested strategy" (content/courses/strategy-testing).
 * Same rules as in ../Illustration.tsx, which shows them: a 640×360 drawing, colors from the design
 * tokens, the dark theme, texts from messages (Lesson.illustration.<name>) and short animations.
 */

// Market regimes: a weather presenter points at a forecast of four regimes.
function RegimeWeather() {
  const t = useTranslations("Lesson.illustration.regimeWeather");
  const panels = [
    {
      key: "calmTrend",
      x: 250,
      y: 60,
      path: "M20 70 l40 -40 l40 -10",
      stroke: "stroke-bull",
    },
    {
      key: "wildTrend",
      x: 440,
      y: 60,
      path: "M20 75 l18 -30 l14 18 l20 -45 l14 20 l24 -30",
      stroke: "stroke-bull",
    },
    {
      key: "calmRange",
      x: 250,
      y: 190,
      path: "M20 50 q25 -12 50 0 t50 0",
      stroke: "stroke-chart-3",
    },
    {
      key: "wildRange",
      x: 440,
      y: 190,
      path: "M20 50 l14 -30 l14 55 l14 -50 l14 50 l14 -45 l14 30",
      stroke: "stroke-bear",
    },
  ] as const;
  return (
    <>
      <rect width="640" height="360" className="fill-muted" />
      {panels.map((panel) => (
        <g key={panel.key} transform={`translate(${panel.x} ${panel.y})`}>
          <rect
            width="170"
            height="110"
            rx="10"
            className="fill-card stroke-border"
            strokeWidth="2"
          />
          <path
            d={panel.path}
            className={cn("fill-none", panel.stroke)}
            strokeWidth="4"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          <text
            x="85"
            y="100"
            textAnchor="middle"
            className="fill-muted-foreground text-xs font-semibold"
          >
            {t(panel.key)}
          </text>
        </g>
      ))}
      {/* A lightning bolt over the wild range, flickering */}
      <path
        d="M560 172 l-14 22 l12 0 l-10 22 l26 -30 l-12 0 l10 -14 z"
        className="fill-warning motion-safe:group-data-playing/anim:animate-screen-flicker"
      />
      {/* The presenter with a pointer */}
      <Person x={110} ground={360} />
      <g className="origin-bottom-left transform-fill motion-safe:group-data-playing/anim:animate-swing">
        <line
          x1="150"
          y1="285"
          x2="250"
          y2="230"
          className="stroke-warning"
          strokeWidth="5"
          strokeLinecap="round"
        />
      </g>
      <Bubble x={15} y={150} width={230} text={t("bubble")} tail="left" />
    </>
  );
}

// Correlation: mother duck BTC leads, the altcoin ducklings follow wherever she goes.
function FollowTheLeader() {
  const t = useTranslations("Lesson.illustration.followTheLeader");
  const ducks = [
    { key: "btc", x: 470, scale: 1.4, fill: "fill-warning" },
    { key: "eth", x: 330, scale: 1, fill: "fill-chart-1" },
    { key: "sol", x: 220, scale: 1, fill: "fill-chart-5" },
    { key: "meme", x: 110, scale: 0.9, fill: "fill-bull" },
  ] as const;
  return (
    <>
      <rect width="640" height="360" className="fill-muted" />
      <rect
        x="0"
        y="300"
        width="640"
        height="60"
        className="fill-chart-1 opacity-30"
      />
      {ducks.map((duck, index) => (
        <g
          key={duck.key}
          className="motion-safe:group-data-playing/anim:animate-bob"
          style={{ animationDelay: `${index * 150}ms` }}
        >
          <g transform={`translate(${duck.x} 290) scale(${duck.scale})`}>
            <ellipse cx="0" cy="0" rx="40" ry="24" className={duck.fill} />
            <circle cx="30" cy="-28" r="18" className={duck.fill} />
            <path d="M46 -30 l18 6 l-18 6 z" className="fill-chart-3" />
            <circle cx="35" cy="-33" r="3" className="fill-background" />
            <text
              x="-6"
              y="7"
              textAnchor="middle"
              className="fill-background text-xs font-bold"
            >
              {t(duck.key)}
            </text>
          </g>
        </g>
      ))}
      <Bubble x={380} y={60} width={230} text={t("bubble")} tail="left" />
    </>
  );
}

// Cycles: an astrologer turns three data points into a law of the universe.
function CycleAstrologer() {
  const t = useTranslations("Lesson.illustration.cycleAstrologer");
  const points = [
    [300, 230, "2016"],
    [400, 170, "2020"],
    [500, 110, "2024"],
  ] as const;
  return (
    <>
      <rect width="640" height="360" className="fill-muted" />
      {[
        [270, 50],
        [560, 70],
        [600, 200],
        [350, 300],
        [470, 280],
      ].map(([x = 0, y = 0]) => (
        <path
          key={`${x}-${y}`}
          d={`M${x} ${y - 8} l3 6 l6 2 l-6 2 l-3 6 l-3 -6 l-6 -2 l6 -2 z`}
          className="fill-warning motion-safe:group-data-playing/anim:animate-screen-flicker"
        />
      ))}
      {/* The "chart": three dots and a bold line through them */}
      <path
        d="M280 245 L540 90"
        className="stroke-chart-5"
        strokeWidth="4"
        strokeDasharray="8 6"
      />
      {points.map(([x, y, year]) => (
        <g key={year}>
          <circle cx={x} cy={y} r="10" className="fill-foreground" />
          <text
            x={x}
            y={y + 30}
            textAnchor="middle"
            className="fill-muted-foreground text-xs font-semibold"
          >
            {year}
          </text>
        </g>
      ))}
      {/* The astrologer with a starry hat */}
      <Person x={130} ground={360} />
      <path d="M100 232 l30 -70 l30 70 z" className="fill-chart-5" />
      <circle cx="130" cy="190" r="5" className="fill-warning" />
      <Bubble
        x={20}
        y={40}
        width={250}
        text={t("bubble")}
        tail="left"
        delay={900}
      />
    </>
  );
}

// Derivatives data: the funding thermometer shows the market has a fever.
function FeverThermometer() {
  const t = useTranslations("Lesson.illustration.feverThermometer");
  return (
    <>
      <rect width="640" height="360" className="fill-muted" />
      {/* Thermometer */}
      <rect
        x="440"
        y="50"
        width="40"
        height="230"
        rx="20"
        className="fill-card stroke-border"
        strokeWidth="3"
      />
      <circle cx="460" cy="290" r="34" className="fill-bear" />
      <g className="origin-bottom transform-fill motion-safe:group-data-playing/anim:animate-drop-in">
        <rect
          x="450"
          y="80"
          width="20"
          height="210"
          rx="10"
          className="fill-bear"
        />
      </g>
      {[
        [100, "120 %"],
        [190, "50 %"],
        [250, "9 %"],
      ].map(([y, text]) => (
        <g key={String(text)}>
          <line
            x1="486"
            y1={Number(y)}
            x2="506"
            y2={Number(y)}
            className="stroke-muted-foreground"
            strokeWidth="3"
          />
          <text
            x="514"
            y={Number(y) + 5}
            className="fill-muted-foreground text-sm font-semibold"
          >
            {text}
          </text>
        </g>
      ))}
      <text
        x="460"
        y="40"
        textAnchor="middle"
        className="fill-foreground text-sm font-bold"
      >
        {t("gauge")}
      </text>
      {/* The feverish market under a blanket */}
      <Person x={200} ground={330} mood="worried" />
      <rect
        x="120"
        y="270"
        width="170"
        height="70"
        rx="16"
        className="fill-chart-1"
      />
      <path
        d="M176 192 q-6 10 0 14 q6 -4 0 -14 z"
        className="fill-chart-1 motion-safe:group-data-playing/anim:animate-sweat-drop"
      />
      <Bubble
        x={60}
        y={60}
        width={230}
        text={t("bubble")}
        tail="right"
        delay={1000}
      />
    </>
  );
}

// From idea to rules: one cook follows the recipe, the other goes "by eye" and burns the cake.
function RecipeChef() {
  const t = useTranslations("Lesson.illustration.recipeChef");
  return (
    <>
      <rect width="640" height="360" className="fill-muted" />
      <rect x="0" y="300" width="640" height="60" className="fill-card" />
      {/* The recipe card */}
      <rect
        x="40"
        y="60"
        width="170"
        height="120"
        rx="8"
        className="fill-foreground"
      />
      {(
        [
          ["step1", 90],
          ["step2", 115],
          ["step3", 140],
          ["step4", 165],
        ] as const
      ).map(([key, y]) => (
        <text
          key={key}
          x="56"
          y={y}
          className="fill-background text-xs font-semibold"
        >
          {t(key)}
        </text>
      ))}
      {/* The nice cake and the burnt one */}
      <rect
        x="230"
        y="250"
        width="110"
        height="50"
        rx="8"
        className="fill-chart-3"
      />
      <rect
        x="230"
        y="240"
        width="110"
        height="16"
        rx="6"
        className="fill-foreground"
      />
      <rect
        x="460"
        y="255"
        width="110"
        height="45"
        rx="8"
        className="fill-background stroke-muted-foreground"
        strokeWidth="2"
      />
      <g className="motion-safe:group-data-playing/anim:animate-flame-flicker">
        <path
          d="M490 245 q-14 -24 6 -40 q-4 16 10 22 q4 -14 -2 -26 q22 16 8 44 z"
          className="fill-muted-foreground opacity-70"
        />
      </g>
      <Person x={390} ground={300} mood="worried" />
      <Bubble x={380} y={40} width={240} text={t("bubble")} tail="left" />
    </>
  );
}

// Types of strategies: a toolbox with three tools – and someone using a hammer on a screw.
function StrategyToolbox() {
  const t = useTranslations("Lesson.illustration.strategyToolbox");
  const tools = [
    ["trend", 80, "fill-bull"],
    ["meanReversion", 230, "fill-chart-1"],
    ["breakout", 380, "fill-warning"],
  ] as const;
  return (
    <>
      <rect width="640" height="360" className="fill-muted" />
      <rect
        x="40"
        y="230"
        width="460"
        height="100"
        rx="12"
        className="fill-bear opacity-80"
      />
      <rect
        x="40"
        y="220"
        width="460"
        height="24"
        rx="8"
        className="fill-bear"
      />
      {tools.map(([key, x, fill]) => (
        <g key={key}>
          <rect x={x} y="150" width="16" height="90" rx="4" className={fill} />
          <rect
            x={x - 22}
            y="130"
            width="60"
            height="28"
            rx="6"
            className={fill}
          />
          <text
            x={x + 8}
            y="300"
            textAnchor="middle"
            className="fill-background text-sm font-bold"
          >
            {t(key)}
          </text>
        </g>
      ))}
      <Person x={560} ground={360} mood="worried" />
      <g className="origin-bottom-left transform-fill motion-safe:group-data-playing/anim:animate-swing">
        <rect
          x="520"
          y="220"
          width="12"
          height="70"
          rx="4"
          className="fill-chart-3"
        />
        <rect
          x="500"
          y="205"
          width="52"
          height="24"
          rx="5"
          className="fill-muted-foreground"
        />
      </g>
      <Bubble x={300} y={40} width={300} text={t("bubble")} tail="right" />
    </>
  );
}

// Volatility-based sizing: a big boat on a calm sea, a small one in the storm.
function BreathingStop() {
  const t = useTranslations("Lesson.illustration.breathingStop");
  return (
    <>
      <rect width="640" height="360" className="fill-muted" />
      <line
        x1="320"
        y1="20"
        x2="320"
        y2="340"
        className="stroke-border"
        strokeWidth="3"
        strokeDasharray="8 8"
      />
      {/* Calm sea, big boat */}
      <rect
        x="0"
        y="270"
        width="320"
        height="90"
        className="fill-chart-1 opacity-40"
      />
      <g className="motion-safe:group-data-playing/anim:animate-bob">
        <path
          d="M60 250 l200 0 l-30 40 l-140 0 z"
          className="fill-foreground"
        />
        <rect
          x="155"
          y="160"
          width="10"
          height="90"
          className="fill-muted-foreground"
        />
        <path d="M165 165 l70 70 l-70 0 z" className="fill-bull" />
      </g>
      <text
        x="160"
        y="330"
        textAnchor="middle"
        className="fill-foreground text-sm font-bold"
      >
        {t("calm")}
      </text>
      {/* Stormy sea, small boat */}
      <path
        d="M320 270 q30 -40 60 0 t60 0 t60 0 t60 0 t60 0 l0 90 l-300 0 z"
        className="fill-chart-1 opacity-60"
      />
      <g className="origin-bottom transform-fill motion-safe:group-data-playing/anim:animate-wiggle">
        <path d="M440 240 l90 0 l-15 22 l-60 0 z" className="fill-foreground" />
        <rect
          x="483"
          y="190"
          width="6"
          height="50"
          className="fill-muted-foreground"
        />
        <path d="M489 194 l34 34 l-34 0 z" className="fill-bear" />
      </g>
      <path
        d="M560 60 l-14 22 l12 0 l-10 22 l26 -30 l-12 0 l10 -14 z"
        className="fill-warning"
      />
      <text
        x="480"
        y="330"
        textAnchor="middle"
        className="fill-foreground text-sm font-bold"
      >
        {t("storm")}
      </text>
      <Bubble
        x={40}
        y={40}
        width={250}
        text={t("bubble")}
        tail="left"
        delay={1000}
      />
    </>
  );
}

// Backtest traps: a trader with a time machine reads tomorrow's newspaper – and calls it a backtest.
function TimeTraveler() {
  const t = useTranslations("Lesson.illustration.timeTraveler");
  return (
    <>
      <rect width="640" height="360" className="fill-muted" />
      <rect x="0" y="320" width="640" height="40" className="fill-card" />
      {/* The time machine: a box with a spinning dial */}
      <rect
        x="40"
        y="150"
        width="150"
        height="170"
        rx="14"
        className="fill-chart-5 opacity-80"
      />
      <g className="origin-center transform-fill motion-safe:group-data-playing/anim:animate-meter-spin">
        <circle cx="115" cy="210" r="34" className="fill-background" />
        <line
          x1="115"
          y1="210"
          x2="115"
          y2="184"
          className="stroke-warning"
          strokeWidth="5"
          strokeLinecap="round"
        />
      </g>
      <text
        x="115"
        y="290"
        textAnchor="middle"
        className="fill-background text-sm font-bold"
      >
        {t("machine")}
      </text>
      {/* The trader with tomorrow's paper */}
      <Person x={330} ground={320} />
      <rect
        x="370"
        y="200"
        width="150"
        height="100"
        rx="4"
        className="fill-foreground"
      />
      <text
        x="445"
        y="224"
        textAnchor="middle"
        className="fill-muted-foreground text-xs font-semibold"
      >
        {t("date")}
      </text>
      <text
        x="445"
        y="254"
        textAnchor="middle"
        className="fill-bull text-lg font-bold"
      >
        {t("headline")}
      </text>
      <Bubble
        x={320}
        y={50}
        width={290}
        text={t("bubble")}
        tail="left"
        delay={1000}
      />
    </>
  );
}

// Strategy metrics: a cockpit full of gauges, and a pilot who only looks at one.
function DashboardPilot() {
  const t = useTranslations("Lesson.illustration.dashboardPilot");
  const gauges = [
    ["return", 90, "stroke-bull"],
    ["drawdown", 230, "stroke-bear"],
    ["trades", 370, "stroke-chart-3"],
    ["costs", 510, "stroke-chart-5"],
  ] as const;
  return (
    <>
      <rect width="640" height="360" className="fill-muted" />
      <rect
        x="20"
        y="40"
        width="600"
        height="150"
        rx="16"
        className="fill-card"
      />
      {gauges.map(([key, x, stroke], index) => (
        <g key={key} className={cn(index > 0 && "opacity-40")}>
          <circle cx={x} cy="110" r="44" className="fill-background" />
          <path
            d={`M${x - 32} 124 A34 34 0 0 1 ${x + 32} 124`}
            className={cn("fill-none", stroke)}
            strokeWidth="6"
          />
          <line
            x1={x}
            y1="118"
            x2={x + 20}
            y2="88"
            className="stroke-foreground"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <text
            x={x}
            y="178"
            textAnchor="middle"
            className="fill-muted-foreground text-xs font-semibold"
          >
            {t(key)}
          </text>
        </g>
      ))}
      {/* The pilot, covering three gauges with a hand */}
      <Person x={320} ground={360} />
      <g className="motion-safe:group-data-playing/anim:animate-bob">
        <rect
          x="170"
          y="80"
          width="420"
          height="70"
          rx="20"
          className="fill-foreground opacity-90"
        />
      </g>
      <Bubble
        x={30}
        y={210}
        width={240}
        text={t("bubble")}
        tail="right"
        delay={1000}
      />
    </>
  );
}

// Out-of-sample: the student learned last year's exam by heart – and gets a new one.
function ExamCheat() {
  const t = useTranslations("Lesson.illustration.examCheat");
  return (
    <>
      <rect width="640" height="360" className="fill-muted" />
      <rect x="0" y="300" width="640" height="60" className="fill-card" />
      {/* The desk and the new exam sheet */}
      <rect
        x="170"
        y="250"
        width="300"
        height="20"
        rx="4"
        className="fill-chart-3"
      />
      <rect
        x="230"
        y="200"
        width="180"
        height="50"
        rx="4"
        className="fill-foreground"
      />
      <text
        x="320"
        y="230"
        textAnchor="middle"
        className="fill-background text-sm font-bold"
      >
        {t("sheet")}
      </text>
      <Person x={320} ground={200} mood="surprised" />
      {/* Last year's answers, flying away */}
      <g className="motion-safe:group-data-playing/anim:animate-note-out">
        <rect
          x="465"
          y="120"
          width="150"
          height="70"
          rx="4"
          className="fill-foreground"
          transform="rotate(12 540 155)"
        />
        <text
          x="540"
          y="160"
          textAnchor="middle"
          transform="rotate(12 540 155)"
          className="fill-muted-foreground text-xs font-bold"
        >
          {t("notes")}
        </text>
      </g>
      <Bubble
        x={360}
        y={30}
        width={265}
        text={t("bubble")}
        tail="left"
        delay={900}
      />
    </>
  );
}

// Forward test: a test pilot takes a small plane up first – with a parachute.
function TestPilot() {
  const t = useTranslations("Lesson.illustration.testPilot");
  return (
    <>
      <rect width="640" height="360" className="fill-muted" />
      {/* Clouds */}
      {[
        [110, 80],
        [520, 60],
        [420, 250],
      ].map(([x = 0, y = 0]) => (
        <g key={x} className="fill-foreground opacity-20">
          <circle cx={x} cy={y} r="22" />
          <circle cx={x + 26} cy={y - 8} r="26" />
          <circle cx={x + 52} cy={y} r="20" />
        </g>
      ))}
      {/* The small plane */}
      <g className="motion-safe:group-data-playing/anim:animate-bob">
        <rect
          x="200"
          y="160"
          width="220"
          height="50"
          rx="25"
          className="fill-chart-1"
        />
        <path d="M290 160 l40 -60 l30 0 l-20 60 z" className="fill-chart-1" />
        <path d="M410 170 l50 -40 l10 0 l-20 50 z" className="fill-chart-1" />
        <circle cx="240" cy="182" r="16" className="fill-foreground" />
        <rect
          x="226"
          y="196"
          width="30"
          height="10"
          rx="3"
          className="fill-warning"
        />
        <text
          x="330"
          y="192"
          textAnchor="middle"
          className="fill-background text-sm font-bold"
        >
          {t("plane")}
        </text>
      </g>
      <Bubble
        x={40}
        y={260}
        width={280}
        text={t("bubble")}
        tail="right"
        delay={800}
      />
    </>
  );
}

// Correlated positions: three eggs (BTC, ETH, SOL) "spread" in one basket – one banana peel breaks all three.
function EggsBasket() {
  const t = useTranslations("Lesson.illustration.eggsBasket");
  const eggs = [
    { key: "btc", x: 420 },
    { key: "eth", x: 500 },
    { key: "sol", x: 580 },
  ] as const;
  return (
    <>
      <rect width="640" height="360" className="fill-muted" />
      <rect x="0" y="300" width="640" height="60" className="fill-card" />
      {/* Banana peel */}
      <path
        d="M140 300 q30 -16 60 0 q-4 -30 -30 -40 q6 26 -6 34 q-14 -20 -42 -18 q22 10 18 24 z"
        className="fill-chart-3"
      />
      <Person x={250} ground={300} mood="surprised" />
      {/* The tipped basket */}
      <g transform="rotate(-24 345 255)">
        <path
          d="M300 235 q45 -70 90 0"
          className="fill-none stroke-warning"
          strokeWidth="6"
        />
        <path d="M296 235 l98 0 l-12 50 l-74 0 z" className="fill-warning" />
        <path
          d="M300 252 l90 0 M304 268 l82 0"
          className="stroke-background opacity-40"
          strokeWidth="3"
        />
      </g>
      {eggs.map((egg, index) => (
        <g
          key={egg.key}
          className="transform-fill motion-safe:group-data-playing/anim:animate-drop-in"
          style={{ animationDelay: `${300 + index * 250}ms` }}
        >
          <ellipse
            cx={egg.x}
            cy="296"
            rx="34"
            ry="8"
            className="fill-warning opacity-70"
          />
          <ellipse
            cx={egg.x}
            cy="262"
            rx="26"
            ry="34"
            className="fill-foreground"
          />
          <path
            d={`M${egg.x - 26} 258 l10 -8 l8 8 l9 -9 l9 9 l8 -8 l8 8`}
            className="fill-none stroke-background"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <text
            x={egg.x}
            y="282"
            textAnchor="middle"
            className="fill-background text-xs font-bold"
          >
            {t(egg.key)}
          </text>
        </g>
      ))}
      <Bubble
        x={190}
        y={36}
        width={380}
        text={t("bubble")}
        tail="left"
        delay={1200}
      />
    </>
  );
}

// Kelly: a risk speedometer – the needle shakes past the Kelly number, where more risk means less money.
function KellyGauge() {
  const t = useTranslations("Lesson.illustration.kellyGauge");
  const zones = [
    {
      key: "small",
      d: "M170 250 A150 150 0 0 1 245 120",
      stroke: "stroke-bull",
    },
    {
      key: "kelly",
      d: "M245 120 A150 150 0 0 1 395 120",
      stroke: "stroke-warning",
    },
    {
      key: "double",
      d: "M395 120 A150 150 0 0 1 470 250",
      stroke: "stroke-bear",
    },
  ] as const;
  const labels = [
    { key: "small", x: 221, y: 218 },
    { key: "kelly", x: 320, y: 150 },
    { key: "double", x: 420, y: 240 },
  ] as const;
  return (
    <>
      <rect width="640" height="360" className="fill-muted" />
      {zones.map((zone) => (
        <path
          key={zone.key}
          d={zone.d}
          className={cn("fill-none", zone.stroke)}
          strokeWidth="24"
        />
      ))}
      {labels.map((label) => (
        <text
          key={label.key}
          x={label.x}
          y={label.y}
          textAnchor="middle"
          className="fill-foreground text-sm font-bold"
        >
          {t(label.key)}
        </text>
      ))}
      {/* The needle shakes around the red zone; the invisible circle centres the rotation on the hub. */}
      <g className="origin-center transform-fill motion-safe:group-data-playing/anim:animate-wiggle">
        <circle cx="320" cy="250" r="140" className="fill-none" />
        <path d="M312 243 L412 158 L327 257 z" className="fill-foreground" />
      </g>
      <circle cx="320" cy="250" r="14" className="fill-foreground" />
      {/* Smoke from the overheated engine */}
      {[
        [478, 196, 12],
        [496, 174, 16],
        [520, 148, 20],
      ].map(([x = 0, y = 0, r = 0], index) => (
        <circle
          key={x}
          cx={x}
          cy={y}
          r={r}
          className="origin-center fill-muted-foreground opacity-60 transform-fill motion-safe:group-data-playing/anim:animate-bubble-pop"
          style={{ animationDelay: `${500 + index * 250}ms` }}
        />
      ))}
      <text
        x="320"
        y="300"
        textAnchor="middle"
        className="fill-muted-foreground text-xs font-bold"
      >
        {t("dial")}
      </text>
      <Person x={95} ground={340} mood="happy" />
      <Bubble
        x={60}
        y={24}
        width={300}
        text={t("bubble")}
        tail="left"
        delay={1400}
      />
    </>
  );
}

// Drawdown rules: going down the stairs of a drawdown, every sign lightens the backpack of risk.
function DrawdownStairs() {
  const t = useTranslations("Lesson.illustration.drawdownStairs");
  const signs = [
    { key: "half", x: 265, ground: 240, fill: "fill-card" },
    { key: "quarter", x: 395, ground: 290, fill: "fill-card" },
    { key: "stop", x: 550, ground: 340, fill: "fill-bear" },
  ] as const;
  return (
    <>
      <rect width="640" height="360" className="fill-muted" />
      <path
        d="M0 200 L200 200 L200 240 L330 240 L330 290 L460 290 L460 340 L640 340 L640 360 L0 360 z"
        className="fill-card"
      />
      {signs.map((sign, index) => (
        <g
          key={sign.key}
          className="transform-fill motion-safe:group-data-playing/anim:animate-drop-in"
          style={{ animationDelay: `${200 + index * 300}ms` }}
        >
          <rect
            x={sign.x - 3}
            y={sign.ground - 70}
            width="6"
            height="70"
            className="fill-muted-foreground"
          />
          <rect
            x={sign.x - 55}
            y={sign.ground - 104}
            width="110"
            height="38"
            rx="6"
            className={cn("stroke-border", sign.fill)}
            strokeWidth="2"
          />
          <text
            x={sign.x}
            y={sign.ground - 79}
            textAnchor="middle"
            className="fill-foreground text-sm font-bold"
          >
            {t(sign.key)}
          </text>
        </g>
      ))}
      <g className="motion-safe:group-data-playing/anim:animate-bob">
        <Person x={90} ground={200} mood="worried" />
        {/* The backpack of risk */}
        <rect
          x="138"
          y="118"
          width="60"
          height="72"
          rx="10"
          className="fill-warning"
        />
        <text
          x="168"
          y="160"
          textAnchor="middle"
          className="fill-background text-xs font-bold"
        >
          {t("pack")}
        </text>
      </g>
      <Bubble
        x={170}
        y={20}
        width={330}
        text={t("bubble")}
        tail="left"
        delay={1200}
      />
    </>
  );
}

// Performance review: a trader grades their own report card – conduct first, profit second.
function ReportCard() {
  const t = useTranslations("Lesson.illustration.reportCard");
  const rows = [
    { key: "process", grade: "gradeProcess", y: 160, fill: "fill-bull" },
    { key: "result", grade: "gradeResult", y: 220, fill: "fill-warning" },
  ] as const;
  return (
    <>
      <rect width="640" height="360" className="fill-muted" />
      <rect x="0" y="320" width="640" height="40" className="fill-card" />
      <Person x={130} ground={320} mood="happy" />
      <g className="origin-center transform-fill motion-safe:group-data-playing/anim:animate-swing">
        <rect
          x="260"
          y="90"
          width="320"
          height="200"
          rx="10"
          className="fill-foreground"
        />
        <text
          x="420"
          y="126"
          textAnchor="middle"
          className="fill-background text-sm font-bold tracking-widest"
        >
          {t("title")}
        </text>
        {rows.map((row, index) => (
          <g key={row.key}>
            <text
              x="285"
              y={row.y + 8}
              className="fill-background text-base font-semibold"
            >
              {t(row.key)}
            </text>
            <g
              className="transform-fill motion-safe:group-data-playing/anim:animate-drop-in"
              style={{ animationDelay: `${400 + index * 400}ms` }}
            >
              <circle cx="530" cy={row.y} r="24" className={row.fill} />
              <text
                x="530"
                y={row.y + 8}
                textAnchor="middle"
                className="fill-background text-xl font-bold"
              >
                {t(row.grade)}
              </text>
            </g>
          </g>
        ))}
      </g>
      <Bubble
        x={40}
        y={30}
        width={300}
        text={t("bubble")}
        tail="left"
        delay={1300}
      />
    </>
  );
}

// Edge decay: one good fishing spot, a crowd of rods – and the fish swimming off.
function CrowdedPond() {
  const t = useTranslations("Lesson.illustration.crowdedPond");
  const rods = [
    { x1: 640, y1: 120, x2: 470, y2: 230 },
    { x1: 640, y1: 170, x2: 500, y2: 260 },
    { x1: 600, y1: 60, x2: 420, y2: 245 },
    { x1: 520, y1: 40, x2: 380, y2: 225 },
    { x1: 250, y1: 150, x2: 330, y2: 240 },
  ] as const;
  return (
    <>
      <rect width="640" height="360" className="fill-muted" />
      <ellipse
        cx="420"
        cy="270"
        rx="230"
        ry="70"
        className="fill-chart-1 opacity-50"
      />
      {rods.map((rod, index) => (
        <g key={`${rod.x2}-${rod.y2}`}>
          <line
            x1={rod.x1}
            y1={rod.y1}
            x2={rod.x2}
            y2={rod.y2 - 40}
            className="stroke-muted-foreground"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <line
            x1={rod.x2}
            y1={rod.y2 - 40}
            x2={rod.x2}
            y2={rod.y2}
            className="stroke-border"
            strokeWidth="1.5"
          />
          <circle
            cx={rod.x2}
            cy={rod.y2}
            r="6"
            className="fill-bear motion-safe:group-data-playing/anim:animate-bob"
            style={{ animationDelay: `${index * 120}ms` }}
          />
        </g>
      ))}
      {/* The last fish swims off */}
      <g className="motion-safe:group-data-playing/anim:animate-sweep">
        <path
          d="M330 300 q25 -16 50 0 q-25 16 -50 0 z M330 300 l-14 -10 l0 20 z"
          className="fill-warning"
        />
      </g>
      <Person x={150} ground={360} mood="worried" />
      {/* The old sign */}
      <rect
        x="40"
        y="150"
        width="6"
        height="90"
        className="fill-muted-foreground"
      />
      <rect
        x="0"
        y="120"
        width="120"
        height="40"
        rx="6"
        className="fill-card stroke-border"
        strokeWidth="2"
      />
      <text
        x="60"
        y="146"
        textAnchor="middle"
        className="fill-foreground text-sm font-bold"
      >
        {t("sign")}
      </text>
      <Bubble
        x={150}
        y={30}
        width={280}
        text={t("bubble")}
        tail="left"
        delay={1200}
      />
    </>
  );
}

// Sustainable trading: a trader swings in a hammock while the phone alert waits on the grass.
function HammockTrader() {
  const t = useTranslations("Lesson.illustration.hammockTrader");
  return (
    <>
      <rect width="640" height="360" className="fill-muted" />
      <rect
        x="0"
        y="320"
        width="640"
        height="40"
        className="fill-bull opacity-30"
      />
      {/* Two trees */}
      {[110, 530].map((x) => (
        <g key={x}>
          <rect
            x={x - 10}
            y="140"
            width="20"
            height="180"
            className="fill-chart-3 opacity-70"
          />
          <circle cx={x} cy="120" r="60" className="fill-bull" />
        </g>
      ))}
      <g className="origin-top transform-fill motion-safe:group-data-playing/anim:animate-swing">
        <path
          d="M120 190 Q320 300 520 190 Q320 270 120 190 z"
          className="fill-warning"
        />
        {/* The trader lies in the hammock */}
        <ellipse
          cx="320"
          cy="232"
          rx="90"
          ry="20"
          className="fill-foreground"
        />
        <circle cx="425" cy="214" r="24" className="fill-foreground" />
        <path
          d="M414 210 q5 4 10 0 M428 206 q5 4 10 0"
          className="fill-none stroke-background"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </g>
      {/* The phone on the grass */}
      <rect
        x="250"
        y="300"
        width="70"
        height="30"
        rx="6"
        className="fill-foreground"
      />
      <g className="origin-center transform-fill motion-safe:group-data-playing/anim:animate-bubble-pop">
        <rect
          x="200"
          y="250"
          width="170"
          height="34"
          rx="17"
          className="fill-card stroke-border"
          strokeWidth="2"
        />
        <text
          x="285"
          y="272"
          textAnchor="middle"
          className="fill-foreground text-xs font-bold"
        >
          {t("alert")}
        </text>
      </g>
      <Bubble
        x={330}
        y={40}
        width={230}
        text={t("bubble")}
        tail="left"
        delay={1200}
      />
    </>
  );
}

export const STRATEGY_ILLUSTRATIONS = {
  regimeWeather: RegimeWeather,
  followTheLeader: FollowTheLeader,
  cycleAstrologer: CycleAstrologer,
  feverThermometer: FeverThermometer,
  recipeChef: RecipeChef,
  strategyToolbox: StrategyToolbox,
  breathingStop: BreathingStop,
  timeTraveler: TimeTraveler,
  dashboardPilot: DashboardPilot,
  examCheat: ExamCheat,
  testPilot: TestPilot,
  eggsBasket: EggsBasket,
  kellyGauge: KellyGauge,
  drawdownStairs: DrawdownStairs,
  reportCard: ReportCard,
  crowdedPond: CrowdedPond,
  hammockTrader: HammockTrader,
} as const;
