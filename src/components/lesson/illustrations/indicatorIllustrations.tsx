import { useTranslations } from "next-intl";

import {
  ProfessorWickFigure,
  type Pose,
} from "@/components/brand/ProfessorWickFigure";
import { cn } from "@/lib/utils";

import { Bubble } from "./Bubble";

/*
 * Fun illustrations of the course "Indicators step by step" (content/courses/indicators).
 * Same rules as in ../Illustration.tsx, which shows them: a 640×360 drawing, colors from the design
 * tokens, the dark theme, texts from messages (Lesson.illustration.<name>) and short animations.
 */

// Professor Wick (240×200 drawing) placed at x, y with a scale.
function Wick({
  x,
  y,
  scale,
  pose = "standing",
}: {
  x: number;
  y: number;
  scale: number;
  pose?: Pose;
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <ProfessorWickFigure pose={pose} />
    </g>
  );
}

// The background and, unless `card` is null, a card for a chart.
function Scene({
  card = [20, 70, 600, 270],
}: {
  card?: [number, number, number, number] | null;
}) {
  return (
    <>
      <rect width="640" height="360" className="fill-muted" />
      {card && (
        <rect
          x={card[0]}
          y={card[1]}
          width={card[2]}
          height={card[3]}
          rx="10"
          className="fill-card stroke-border"
          strokeWidth="2"
        />
      )}
    </>
  );
}

// Candles as [open, close, high, low] in SVG y (smaller = higher), 24 units apart.
type CandleRow = readonly [number, number, number, number];

const RISING: readonly CandleRow[] = [
  [230, 210, 200, 240],
  [210, 220, 198, 228],
  [220, 196, 188, 226],
  [196, 182, 170, 204],
  [182, 192, 174, 200],
  [192, 164, 156, 196],
  [164, 150, 140, 172],
  [150, 160, 142, 168],
  [160, 134, 126, 166],
  [134, 120, 110, 140],
];

const RISE_AND_FALL: readonly CandleRow[] = [
  [240, 222, 212, 248],
  [222, 200, 192, 228],
  [200, 182, 172, 206],
  [182, 166, 156, 190],
  [166, 160, 148, 176],
  [160, 176, 152, 184],
  [176, 198, 170, 206],
  [198, 214, 190, 222],
  [214, 232, 206, 240],
  [232, 246, 226, 254],
];

const CANDLE_CLASSES = {
  up: { fill: "fill-bull", stroke: "stroke-bull" },
  down: { fill: "fill-bear", stroke: "stroke-bear" },
} as const;

function Candles({
  rows,
  x,
  step = 24,
  width = 12,
  className,
}: {
  rows: readonly CandleRow[];
  x: number;
  step?: number;
  width?: number;
  className?: string;
}) {
  return (
    <g className={className}>
      {rows.map(([open, close, high, low], index) => {
        const { fill, stroke } = CANDLE_CLASSES[close < open ? "up" : "down"];
        const center = x + index * step;
        return (
          <g key={center}>
            <line
              x1={center}
              y1={high}
              x2={center}
              y2={low}
              className={stroke}
              strokeWidth="2"
            />
            <rect
              x={center - width / 2}
              y={Math.min(open, close)}
              width={width}
              height={Math.max(Math.abs(open - close), 2)}
              className={fill}
            />
          </g>
        );
      })}
    </g>
  );
}

// A line that draws itself, as if the indicator were being computed.
function GrowingLine({
  d,
  className,
  delay = 0,
  width = 5,
  dashed = false,
}: {
  d: string;
  className: string;
  delay?: number;
  width?: number;
  dashed?: boolean;
}) {
  return (
    <path
      d={d}
      className={cn(
        "fill-none motion-safe:group-data-playing/anim:animate-drop-in",
        className,
      )}
      strokeWidth={width}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray={dashed ? "10 8" : undefined}
      style={{ animationDelay: `${delay}ms` }}
    />
  );
}

function Label({
  x,
  y,
  text,
  className = "fill-foreground",
  anchor = "middle",
}: {
  x: number;
  y: number;
  text: string;
  className?: string;
  anchor?: "start" | "middle" | "end";
}) {
  return (
    <text
      x={x}
      y={y}
      textAnchor={anchor}
      className={cn("text-sm font-bold", className)}
    >
      {text}
    </text>
  );
}

// 1 What an indicator is: Professor Wick cooks candles in a pot and a smooth line comes out.
function CandleRecipe() {
  const t = useTranslations("Lesson.illustration.candleRecipe");
  return (
    <>
      <Scene card={null} />
      <Candles
        rows={RISING.slice(0, 5)}
        x={150}
        step={30}
        className="motion-safe:group-data-playing/anim:animate-drop-in"
      />
      <path
        d="M150 250 h190 l-20 80 h-150 z"
        className="fill-muted-foreground"
      />
      <rect
        x="138"
        y="240"
        width="214"
        height="16"
        rx="8"
        className="fill-foreground"
      />
      {[0, 1, 2].map((index) => (
        <circle
          key={index}
          cx={200 + index * 40}
          cy="232"
          r="7"
          className="fill-foreground/40 motion-safe:group-data-playing/anim:animate-bob"
          style={{ animationDelay: `${index * 200}ms` }}
        />
      ))}
      <path
        d="M352 280 C400 280 410 220 450 200 S520 150 600 130"
        className="fill-none stroke-chart-1 motion-safe:group-data-playing/anim:animate-drop-in"
        strokeWidth="8"
        strokeLinecap="round"
        style={{ animationDelay: "800ms" }}
      />
      <Label x={540} y={180} text={t("line")} className="fill-chart-1" />
      <Wick x={6} y={150} scale={0.75} />
      <Bubble
        x={300}
        y={20}
        width={300}
        text={t("bubble")}
        tail="left"
        delay={1400}
      />
    </>
  );
}

const VOLUME_BARS = [20, 45, 30, 60, 38] as const;

// 2 Three families: three doors – trend, oscillator, volume.
function ThreeFamilies() {
  const t = useTranslations("Lesson.illustration.threeFamilies");
  const doors = [
    {
      key: "trend",
      x: 70,
      icon: "M20 70 q30 -50 60 -30 t60 -40",
      stroke: "stroke-chart-1",
    },
    {
      key: "oscillator",
      x: 250,
      icon: "M20 50 q15 -40 30 0 t30 0 t30 0 t30 0",
      stroke: "stroke-chart-5",
    },
    { key: "volume", x: 430, icon: "", stroke: "stroke-bull" },
  ] as const;
  return (
    <>
      <Scene card={null} />
      <rect x="0" y="320" width="640" height="40" className="fill-card" />
      {doors.map((door, index) => (
        <g
          key={door.key}
          className="motion-safe:group-data-playing/anim:animate-drop-in"
          style={{ animationDelay: `${index * 250}ms` }}
        >
          <rect
            x={door.x}
            y="110"
            width="140"
            height="210"
            rx="8"
            className="fill-card stroke-border"
            strokeWidth="3"
          />
          <circle cx={door.x + 120} cy="220" r="6" className="fill-warning" />
          <g transform={`translate(${door.x} 140)`}>
            {door.icon ? (
              <path
                d={door.icon}
                className={cn("fill-none", door.stroke)}
                strokeWidth="5"
                strokeLinecap="round"
              />
            ) : (
              VOLUME_BARS.map((height, bar) => (
                <rect
                  key={bar}
                  x={22 + bar * 20}
                  y={70 - height}
                  width="14"
                  height={height}
                  className={bar % 2 ? "fill-bear" : "fill-bull"}
                />
              ))
            )}
          </g>
          <Label x={door.x + 70} y={300} text={t(door.key)} />
        </g>
      ))}
      <Bubble
        x={170}
        y={22}
        width={300}
        text={t("bubble")}
        tail="left"
        delay={1100}
      />
    </>
  );
}

// 3 The settings window: Professor Wick turns a big period knob.
function PeriodKnob() {
  const t = useTranslations("Lesson.illustration.periodKnob");
  return (
    <>
      <Scene />
      <circle
        cx="360"
        cy="215"
        r="90"
        className="fill-muted stroke-border"
        strokeWidth="4"
      />
      {[7, 25, 99].map((value, index) => {
        const angle = (-130 + index * 130) * (Math.PI / 180);
        return (
          <Label
            key={value}
            x={360 + Math.sin(angle) * 120}
            y={215 - Math.cos(angle) * 120 + 5}
            text={String(value)}
          />
        );
      })}
      <g
        className="origin-center transform-fill motion-safe:group-data-playing/anim:animate-swing"
        style={{ transformOrigin: "360px 215px" }}
      >
        <circle
          cx="360"
          cy="215"
          r="58"
          className="fill-card stroke-foreground"
          strokeWidth="4"
        />
        <line
          x1="360"
          y1="215"
          x2="360"
          y2="168"
          className="stroke-warning"
          strokeWidth="8"
          strokeLinecap="round"
        />
      </g>
      <Label
        x={360}
        y={330}
        text={t("period")}
        className="fill-muted-foreground"
      />
      <Wick x={460} y={150} scale={0.75} />
      <Bubble
        x={40}
        y={14}
        width={260}
        text={t("bubble")}
        tail="right"
        delay={1200}
      />
    </>
  );
}

// 4 SMA: a window frame slides over the candles, every candle in it weighs the same.
function SlidingWindow() {
  const t = useTranslations("Lesson.illustration.slidingWindow");
  return (
    <>
      <Scene />
      <Candles rows={RISING} x={90} step={44} width={18} />
      <g className="motion-safe:group-data-playing/anim:animate-sweep">
        <rect
          x="64"
          y="96"
          width="186"
          height="170"
          rx="8"
          className="fill-primary/10 stroke-primary"
          strokeWidth="4"
          strokeDasharray="12 6"
        />
        {[0, 1, 2, 3].map((index) => (
          <Label
            key={index}
            x={90 + index * 44}
            y={290}
            text="1×"
            className="fill-primary"
          />
        ))}
      </g>
      <GrowingLine
        d="M90 230 C200 215 300 195 400 170 S500 140 490 135"
        className="stroke-chart-1"
        delay={600}
      />
      <Bubble
        x={300}
        y={14}
        width={300}
        text={t("bubble")}
        tail="left"
        delay={1200}
      />
    </>
  );
}

// 5 EMA vs WMA vs SMA: three lines race after the price; EMA reaches the turn first.
function AverageRace() {
  const t = useTranslations("Lesson.illustration.averageRace");
  const lines = [
    {
      key: "ema",
      d: "M60 260 C200 250 300 150 420 130",
      stroke: "stroke-chart-3",
      fill: "fill-chart-3",
      y: 120,
    },
    {
      key: "wma",
      d: "M60 265 C210 258 310 175 420 160",
      stroke: "stroke-chart-5",
      fill: "fill-chart-5",
      y: 158,
    },
    {
      key: "sma",
      d: "M60 270 C220 266 330 210 420 200",
      stroke: "stroke-chart-1",
      fill: "fill-chart-1",
      y: 200,
    },
  ] as const;
  return (
    <>
      <Scene />
      <path
        d="M60 270 L200 260 L300 130 L420 110"
        className="fill-none stroke-foreground/40"
        strokeWidth="3"
        strokeDasharray="6 6"
      />
      {lines.map((line, index) => (
        <g key={line.key}>
          <GrowingLine d={line.d} className={line.stroke} delay={index * 300} />
          <Label
            x={440}
            y={line.y + 6}
            text={t(line.key)}
            anchor="start"
            className={line.fill}
          />
        </g>
      ))}
      <Wick x={500} y={150} scale={0.6} pose="celebrating" />
      <Bubble
        x={40}
        y={14}
        width={280}
        text={t("bubble")}
        tail="left"
        delay={1300}
      />
    </>
  );
}

// 6 Bollinger Bands: a rubber tube around the candles that widens when the market gets wild.
function BollingerTube() {
  const t = useTranslations("Lesson.illustration.bollingerTube");
  return (
    <>
      <Scene />
      <path
        d="M50 180 C150 175 220 172 280 170 C360 120 450 100 590 90 L590 300 C450 290 360 270 280 220 C220 214 150 212 50 210 Z"
        className="fill-chart-5/15 stroke-chart-5 motion-safe:group-data-playing/anim:animate-drop-in"
        strokeWidth="4"
      />
      <GrowingLine
        d="M50 195 C150 194 220 193 280 195 S450 190 590 195"
        className="stroke-chart-5"
        width={3}
        dashed
        delay={400}
      />
      <Candles
        rows={RISE_AND_FALL.map(
          ([o, c, h, l]) => [o - 25, c - 25, h - 25, l - 25] as const,
        ).slice(0, 4)}
        x={80}
        step={50}
      />
      <Candles
        rows={[
          [230, 140, 120, 260],
          [150, 250, 130, 280],
          [250, 150, 110, 270],
        ]}
        x={330}
        step={70}
        width={20}
      />
      <Label
        x={130}
        y={250}
        text={t("calm")}
        className="fill-muted-foreground"
      />
      <Label
        x={470}
        y={330}
        text={t("wild")}
        className="fill-muted-foreground"
      />
      <Bubble
        x={40}
        y={14}
        width={300}
        text={t("bubble")}
        tail="right"
        delay={1200}
      />
    </>
  );
}

// 7 VWAP: a balance where one big trade outweighs many small ones.
function VwapBalance() {
  const t = useTranslations("Lesson.illustration.vwapBalance");
  return (
    <>
      <Scene card={null} />
      <rect
        x="306"
        y="150"
        width="28"
        height="170"
        className="fill-muted-foreground"
      />
      <rect
        x="250"
        y="310"
        width="140"
        height="20"
        rx="6"
        className="fill-muted-foreground"
      />
      <g
        className="origin-center transform-fill motion-safe:group-data-playing/anim:animate-swing"
        style={{ transformOrigin: "320px 150px" }}
      >
        <g transform="rotate(8 320 150)">
          <line
            x1="140"
            y1="150"
            x2="500"
            y2="150"
            className="stroke-foreground"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <path
            d="M100 200 h120 l-20 30 h-80 z"
            className="fill-card stroke-border"
            strokeWidth="3"
          />
          <path
            d="M420 200 h120 l-20 30 h-80 z"
            className="fill-card stroke-border"
            strokeWidth="3"
          />
          <line
            x1="160"
            y1="150"
            x2="160"
            y2="200"
            className="stroke-foreground"
            strokeWidth="3"
          />
          <line
            x1="480"
            y1="150"
            x2="480"
            y2="200"
            className="stroke-foreground"
            strokeWidth="3"
          />
          {[0, 1, 2, 3, 4].map((coin) => (
            <circle
              key={coin}
              cx={130 + coin * 15}
              cy={192}
              r="7"
              className="fill-warning"
            />
          ))}
          <circle cx="480" cy="168" r="30" className="fill-warning" />
          <Label x={480} y={174} text="BTC" className="fill-card" />
        </g>
      </g>
      <Label
        x={160}
        y={270}
        text={t("small")}
        className="fill-muted-foreground"
      />
      <Label
        x={490}
        y={290}
        text={t("big")}
        className="fill-muted-foreground"
      />
      <Bubble
        x={170}
        y={22}
        width={300}
        text={t("bubble")}
        tail="left"
        delay={1100}
      />
    </>
  );
}

// 8 Parabolic SAR: dots hop under the candles, then jump over them when the trend turns.
function SarHop() {
  const t = useTranslations("Lesson.illustration.sarHop");
  const below = [262, 252, 238, 222, 208];
  const above = [140, 150, 168, 186, 206];
  return (
    <>
      <Scene />
      <Candles rows={RISE_AND_FALL} x={70} step={52} width={20} />
      {below.map((y, index) => (
        <circle
          key={`below-${index}`}
          cx={70 + index * 52}
          cy={y + 8}
          r="7"
          className="fill-bull motion-safe:group-data-playing/anim:animate-drop-in"
          style={{ animationDelay: `${index * 150}ms` }}
        />
      ))}
      {above.map((y, index) => (
        <circle
          key={`above-${index}`}
          cx={70 + (index + 5) * 52}
          cy={y}
          r="7"
          className="fill-bear motion-safe:group-data-playing/anim:animate-drop-in"
          style={{ animationDelay: `${900 + index * 150}ms` }}
        />
      ))}
      <path
        d="M300 200 q20 -80 52 -60"
        className="fill-none stroke-warning"
        strokeWidth="3"
        strokeDasharray="6 5"
      />
      <Label x={340} y={118} text={t("flip")} className="fill-warning" />
      <Bubble
        x={360}
        y={14}
        width={240}
        text={t("bubble")}
        tail="left"
        delay={1800}
      />
    </>
  );
}

// 9 Supertrend: a stair-step handrail under the rising candles; Professor Wick holds on.
function SupertrendRail() {
  const t = useTranslations("Lesson.illustration.supertrendRail");
  return (
    <>
      <Scene />
      <Candles rows={RISING} x={70} step={44} width={18} />
      <GrowingLine
        d="M50 262 H160 V232 H250 V214 H330 V184 H420 V160 H500"
        className="stroke-bull"
        width={7}
        delay={300}
      />
      <Wick x={462} y={150} scale={0.6} pose="celebrating" />
      <Bubble
        x={40}
        y={14}
        width={300}
        text={t("bubble")}
        tail="right"
        delay={1200}
      />
    </>
  );
}

// 10 RSI: a thermometer at 78 – Professor Wick sweats, but hot does not mean sell.
function RsiThermometer() {
  const t = useTranslations("Lesson.illustration.rsiThermometer");
  return (
    <>
      <Scene card={null} />
      <rect
        x="250"
        y="40"
        width="50"
        height="250"
        rx="25"
        className="fill-card stroke-border"
        strokeWidth="3"
      />
      <circle cx="275" cy="300" r="40" className="fill-bear" />
      <rect
        x="262"
        y="95"
        width="26"
        height="200"
        rx="13"
        className="fill-bear motion-safe:group-data-playing/anim:animate-peek"
      />
      {[
        { value: "70", y: 105, className: "fill-bear" },
        { value: "50", y: 165, className: "fill-muted-foreground" },
        { value: "30", y: 225, className: "fill-bull" },
      ].map((mark) => (
        <g key={mark.value}>
          <line
            x1="300"
            y1={mark.y}
            x2="320"
            y2={mark.y}
            className="stroke-foreground"
            strokeWidth="3"
          />
          <Label
            x={328}
            y={mark.y + 5}
            text={mark.value}
            anchor="start"
            className={mark.className}
          />
        </g>
      ))}
      <Wick x={400} y={150} scale={0.75} />
      <circle
        cx="470"
        cy="170"
        r="6"
        className="fill-chart-1 motion-safe:group-data-playing/anim:animate-sweat-drop"
      />
      <Bubble
        x={30}
        y={20}
        width={200}
        text={t("bubble")}
        tail="right"
        delay={1000}
      />
    </>
  );
}

// 11 Stochastic RSI: RSI after a double espresso – the line jumps up and down.
function DoubleEspresso() {
  const t = useTranslations("Lesson.illustration.doubleEspresso");
  return (
    <>
      <Scene />
      <line
        x1="40"
        y1="130"
        x2="600"
        y2="130"
        className="stroke-muted-foreground"
        strokeDasharray="6 6"
      />
      <line
        x1="40"
        y1="270"
        x2="600"
        y2="270"
        className="stroke-muted-foreground"
        strokeDasharray="6 6"
      />
      <GrowingLine
        d="M40 260 L80 110 L120 280 L160 120 L200 270 L240 100 L280 250 L320 115 L360 285 L400 130"
        className="stroke-chart-1"
        width={4}
      />
      {[470, 540].map((x, index) => (
        <g
          key={x}
          className="motion-safe:group-data-playing/anim:animate-wiggle"
          style={{ animationDelay: `${index * 120}ms` }}
        >
          <path
            d={`M${x - 30} 210 h60 l-8 60 h-44 z`}
            className="fill-foreground"
          />
          <path
            d={`M${x + 30} 225 q20 0 20 15 t-20 15`}
            className="fill-none stroke-foreground"
            strokeWidth="5"
          />
          <path
            d={`M${x - 10} 195 q-8 -14 0 -26 M${x + 8} 195 q-8 -14 0 -26`}
            className="fill-none stroke-muted-foreground"
            strokeWidth="3"
          />
          <Label x={x} y={250} text="RSI" className="fill-card" />
        </g>
      ))}
      <Bubble
        x={300}
        y={14}
        width={300}
        text={t("bubble")}
        tail="right"
        delay={1100}
      />
    </>
  );
}

// 12 KDJ and Stochastic: a lift in a shaft – where between the floor and the ceiling is the close?
function RangeElevator() {
  const t = useTranslations("Lesson.illustration.rangeElevator");
  return (
    <>
      <Scene card={null} />
      <rect
        x="240"
        y="40"
        width="160"
        height="290"
        className="fill-card stroke-border"
        strokeWidth="3"
      />
      <line
        x1="230"
        y1="60"
        x2="410"
        y2="60"
        className="stroke-bull"
        strokeWidth="5"
      />
      <line
        x1="230"
        y1="310"
        x2="410"
        y2="310"
        className="stroke-bear"
        strokeWidth="5"
      />
      <Label
        x={420}
        y={66}
        text={t("high")}
        anchor="start"
        className="fill-bull"
      />
      <Label
        x={420}
        y={316}
        text={t("low")}
        anchor="start"
        className="fill-bear"
      />
      <g className="motion-safe:group-data-playing/anim:animate-bob">
        <rect
          x="270"
          y="100"
          width="100"
          height="90"
          rx="6"
          className="fill-muted stroke-foreground"
          strokeWidth="3"
        />
        <Label x={320} y={152} text={t("close")} />
      </g>
      <Label x={540} y={140} text="80 %" className="fill-warning" />
      <Wick x={10} y={150} scale={0.7} />
      <Bubble
        x={430}
        y={200}
        width={190}
        text={t("bubble")}
        tail="left"
        delay={1000}
      />
    </>
  );
}

// 13 Williams %R: Professor Wick hangs upside down – the same idea as the stochastic, flipped.
function UpsideDown() {
  const t = useTranslations("Lesson.illustration.upsideDown");
  return (
    <>
      <Scene card={null} />
      <rect
        x="140"
        y="30"
        width="360"
        height="16"
        rx="8"
        className="fill-muted-foreground"
      />
      <g
        className="origin-center transform-fill motion-safe:group-data-playing/anim:animate-swing"
        style={{ transformOrigin: "320px 46px" }}
      >
        <line
          x1="320"
          y1="46"
          x2="320"
          y2="80"
          className="stroke-foreground"
          strokeWidth="4"
        />
        <g transform="rotate(180 320 160)">
          <Wick x={230} y={140} scale={0.75} />
        </g>
      </g>
      <Label x={560} y={80} text="0" className="fill-bull" />
      <Label x={560} y={320} text="−100" className="fill-bear" />
      <line
        x1="560"
        y1="92"
        x2="560"
        y2="300"
        className="stroke-muted-foreground"
        strokeWidth="3"
      />
      <Bubble
        x={20}
        y={280}
        width={280}
        text={t("bubble")}
        tail="right"
        delay={1100}
      />
    </>
  );
}

// 14 CCI: a rubber band stretched away from the average – how far from normal is the price?
function RubberBand() {
  const t = useTranslations("Lesson.illustration.rubberBand");
  return (
    <>
      <Scene />
      <line
        x1="40"
        y1="220"
        x2="600"
        y2="220"
        className="stroke-chart-1"
        strokeWidth="4"
        strokeDasharray="12 8"
      />
      <Label
        x={70}
        y={250}
        text={t("average")}
        anchor="start"
        className="fill-chart-1"
      />
      <path
        d="M200 220 Q330 220 420 110"
        className="fill-none stroke-warning motion-safe:group-data-playing/anim:animate-drop-in"
        strokeWidth="6"
      />
      <path
        d="M420 110 Q470 220 560 220"
        className="fill-none stroke-warning"
        strokeWidth="6"
      />
      <circle cx="420" cy="110" r="14" className="fill-bull" />
      <Label x={420} y={90} text="+180" className="fill-bull" />
      <Wick x={60} y={70} scale={0.55} />
      <Bubble
        x={360}
        y={260}
        width={240}
        text={t("bubble")}
        tail="left"
        delay={1100}
      />
    </>
  );
}

// 15 MACD: a fast and a slow train; the gap between them is the histogram.
function TwoTrains() {
  const t = useTranslations("Lesson.illustration.twoTrains");
  const trains = [
    { key: "fast", x: 300, y: 130, className: "fill-chart-1" },
    { key: "slow", x: 120, y: 210, className: "fill-chart-3" },
  ] as const;
  return (
    <>
      <Scene card={null} />
      {[175, 255].map((y) => (
        <line
          key={y}
          x1="0"
          y1={y}
          x2="640"
          y2={y}
          className="stroke-muted-foreground"
          strokeWidth="4"
        />
      ))}
      {trains.map((train, index) => (
        <g
          key={train.key}
          className="motion-safe:group-data-playing/anim:animate-drive-in"
          style={{ animationDelay: `${index * 300}ms` }}
        >
          <rect
            x={train.x}
            y={train.y}
            width="170"
            height="40"
            rx="10"
            className={train.className}
          />
          <circle
            cx={train.x + 35}
            cy={train.y + 44}
            r="9"
            className="fill-foreground"
          />
          <circle
            cx={train.x + 135}
            cy={train.y + 44}
            r="9"
            className="fill-foreground"
          />
          <Label
            x={train.x + 85}
            y={train.y + 26}
            text={t(train.key)}
            className="fill-card"
          />
        </g>
      ))}
      {[0, 1, 2, 3, 4, 5].map((bar) => (
        <rect
          key={bar}
          x={330 + bar * 26}
          y={330 - (bar + 1) * 8}
          width="18"
          height={(bar + 1) * 8}
          className="fill-bull/70 motion-safe:group-data-playing/anim:animate-drop-in"
          style={{ animationDelay: `${900 + bar * 100}ms` }}
        />
      ))}
      <Label
        x={270}
        y={320}
        text={t("gap")}
        anchor="end"
        className="fill-bull"
      />
      <Bubble
        x={40}
        y={30}
        width={240}
        text={t("bubble")}
        tail="right"
        delay={1400}
      />
    </>
  );
}

// 16 Volume: a crowd of bars behind the candles – a move with a crowd behind it.
function VolumeCrowd() {
  const t = useTranslations("Lesson.illustration.volumeCrowd");
  const heights = [24, 30, 22, 36, 30, 44, 70, 96, 120, 84];
  return (
    <>
      <Scene />
      <Candles rows={RISING} x={70} step={52} width={20} />
      {heights.map((height, index) => (
        <rect
          key={index}
          x={60 + index * 52}
          y={330 - height}
          width="22"
          height={height}
          className="fill-bull/50 motion-safe:group-data-playing/anim:animate-peek"
          style={{ animationDelay: `${index * 80}ms` }}
        />
      ))}
      <Bubble
        x={40}
        y={14}
        width={300}
        text={t("bubble")}
        tail="right"
        delay={1100}
      />
    </>
  );
}

// 17 OBV: a piggy bank – up days put volume in, down days take it out.
function PiggyBank() {
  const t = useTranslations("Lesson.illustration.piggyBank");
  return (
    <>
      <Scene card={null} />
      <ellipse cx="320" cy="230" rx="130" ry="90" className="fill-chart-4/70" />
      <circle cx="430" cy="200" r="34" className="fill-chart-4/70" />
      <circle cx="440" cy="190" r="5" className="fill-foreground" />
      <rect
        x="290"
        y="140"
        width="60"
        height="10"
        rx="5"
        className="fill-foreground"
      />
      {[0, 1, 2].map((coin) => (
        <g
          key={coin}
          className="motion-safe:group-data-playing/anim:animate-coin-insert"
          style={{ animationDelay: `${coin * 400}ms` }}
        >
          <circle
            cx="320"
            cy={60 - coin * 10}
            r="18"
            className="fill-warning"
          />
          <Label x={320} y={66 - coin * 10} text="+" className="fill-card" />
        </g>
      ))}
      <g
        className="motion-safe:group-data-playing/anim:animate-drop-in"
        style={{ animationDelay: "1300ms" }}
      >
        <circle cx="200" cy="330" r="18" className="fill-muted-foreground" />
        <Label x={200} y={336} text="−" className="fill-card" />
      </g>
      <Label x={110} y={120} text={t("up")} className="fill-bull" />
      <Label x={110} y={300} text={t("down")} className="fill-bear" />
      <Bubble
        x={420}
        y={40}
        width={200}
        text={t("bubble")}
        tail="left"
        delay={1500}
      />
    </>
  );
}

// 18 MFI: RSI with a wallet – money flows in and out through two pipes.
function MoneyPipes() {
  const t = useTranslations("Lesson.illustration.moneyPipes");
  return (
    <>
      <Scene card={null} />
      <rect
        x="250"
        y="120"
        width="140"
        height="160"
        rx="16"
        className="fill-card stroke-border"
        strokeWidth="3"
      />
      <Label x={320} y={210} text="MFI" />
      <rect x="40" y="150" width="210" height="30" className="fill-bull/60" />
      <rect x="390" y="220" width="210" height="30" className="fill-bear/60" />
      {[0, 1, 2].map((coin) => (
        <circle
          key={`in-${coin}`}
          cx={70 + coin * 60}
          cy="165"
          r="10"
          className="fill-warning motion-safe:group-data-playing/anim:animate-sweep"
          style={{ animationDelay: `${coin * 200}ms` }}
        />
      ))}
      <circle
        cx="420"
        cy="235"
        r="10"
        className="fill-warning motion-safe:group-data-playing/anim:animate-sweep"
      />
      <Label x={145} y={140} text={t("in")} className="fill-bull" />
      <Label x={495} y={280} text={t("out")} className="fill-bear" />
      <Bubble
        x={170}
        y={20}
        width={300}
        text={t("bubble")}
        tail="left"
        delay={1200}
      />
    </>
  );
}

// 19 A clean setup: one indicator from each family – Professor Wick sweeps the rest away.
function CleanDesk() {
  const t = useTranslations("Lesson.illustration.cleanDesk");
  return (
    <>
      <Scene card={[20, 70, 380, 270]} />
      <Candles rows={RISING.slice(0, 7)} x={60} step={44} width={18} />
      <GrowingLine
        d="M40 250 C140 240 240 200 380 140"
        className="stroke-chart-1"
      />
      <line
        x1="40"
        y1="300"
        x2="380"
        y2="300"
        className="stroke-border"
        strokeWidth="2"
      />
      <GrowingLine
        d="M40 320 q40 -20 80 -5 t80 -10 t80 5 t80 -15"
        className="stroke-chart-5"
        width={3}
        delay={300}
      />
      {["MACD", "KDJ", "CCI", "WR"].map((name, index) => (
        <g
          key={name}
          className="motion-safe:group-data-playing/anim:animate-drive-in"
          style={{ animationDelay: `${200 + index * 120}ms` }}
        >
          <rect
            x={430 + (index % 2) * 90}
            y={250 + Math.floor(index / 2) * 40}
            width="80"
            height="30"
            rx="6"
            className="fill-muted-foreground/40"
          />
          <Label
            x={470 + (index % 2) * 90}
            y={270 + Math.floor(index / 2) * 40}
            text={name}
            className="fill-muted-foreground"
          />
        </g>
      ))}
      <Wick x={470} y={60} scale={0.65} />
      <Bubble
        x={60}
        y={14}
        width={300}
        text={t("bubble")}
        tail="right"
        delay={1300}
      />
    </>
  );
}

// 20 Divergence: the price climbs, the indicator slides – two arrows going apart.
function DivergenceArrows() {
  const t = useTranslations("Lesson.illustration.divergenceArrows");
  return (
    <>
      <Scene />
      <GrowingLine
        d="M60 200 L200 140 L280 170 L420 100"
        className="stroke-bull"
        width={6}
      />
      <path d="M420 100 l-24 2 l10 18 z" className="fill-bull" />
      <Label
        x={440}
        y={100}
        text={t("price")}
        anchor="start"
        className="fill-bull"
      />
      <line
        x1="40"
        y1="230"
        x2="600"
        y2="230"
        className="stroke-border"
        strokeWidth="2"
      />
      <GrowingLine
        d="M60 260 L200 250 L280 290 L420 300"
        className="stroke-bear"
        width={6}
        delay={500}
      />
      <path d="M420 300 l-22 -10 l2 20 z" className="fill-bear" />
      <Label
        x={440}
        y={306}
        text={t("indicator")}
        anchor="start"
        className="fill-bear"
      />
      <Wick x={480} y={130} scale={0.55} pose="fallen" />
      <Bubble
        x={40}
        y={14}
        width={300}
        text={t("bubble")}
        tail="right"
        delay={1200}
      />
    </>
  );
}

// 21 When indicators disagree: a tug of war between two of them.
function TugOfWar() {
  const t = useTranslations("Lesson.illustration.tugOfWar");
  return (
    <>
      <Scene card={null} />
      <rect x="0" y="300" width="640" height="60" className="fill-card" />
      <g className="motion-safe:group-data-playing/anim:animate-wiggle">
        <line
          x1="120"
          y1="230"
          x2="520"
          y2="230"
          className="stroke-warning"
          strokeWidth="8"
        />
        <rect
          x="70"
          y="190"
          width="110"
          height="110"
          rx="12"
          className="fill-chart-1"
        />
        <Label x={125} y={252} text={t("left")} className="fill-card" />
        <rect
          x="460"
          y="190"
          width="110"
          height="110"
          rx="12"
          className="fill-chart-5"
        />
        <Label x={515} y={252} text={t("right")} className="fill-card" />
      </g>
      <line
        x1="320"
        y1="200"
        x2="320"
        y2="300"
        className="stroke-foreground"
        strokeWidth="3"
        strokeDasharray="6 6"
      />
      <Wick x={262} y={70} scale={0.5} />
      <Bubble
        x={180}
        y={14}
        width={280}
        text={t("bubble")}
        tail="left"
        delay={1100}
      />
    </>
  );
}

export const INDICATOR_ILLUSTRATIONS = {
  candleRecipe: CandleRecipe,
  threeFamilies: ThreeFamilies,
  periodKnob: PeriodKnob,
  slidingWindow: SlidingWindow,
  averageRace: AverageRace,
  bollingerTube: BollingerTube,
  vwapBalance: VwapBalance,
  sarHop: SarHop,
  supertrendRail: SupertrendRail,
  rsiThermometer: RsiThermometer,
  doubleEspresso: DoubleEspresso,
  rangeElevator: RangeElevator,
  upsideDown: UpsideDown,
  rubberBand: RubberBand,
  twoTrains: TwoTrains,
  volumeCrowd: VolumeCrowd,
  piggyBank: PiggyBank,
  moneyPipes: MoneyPipes,
  cleanDesk: CleanDesk,
  divergenceArrows: DivergenceArrows,
  tugOfWar: TugOfWar,
} as const;
