import { useTranslations } from "next-intl";

import {
  ProfessorWickFigure,
  type Pose,
} from "@/components/brand/ProfessorWickFigure";
import { cn } from "@/lib/utils";

import { Bubble } from "./Bubble";
import { Person } from "./Person";

/*
 * Fun illustrations of the course "Exchange and chart step by step" (content/courses/exchange-and-chart).
 * Same rules as in ../Illustration.tsx, which shows them: a 640×360 drawing, colors from the design
 * tokens, the dark theme, texts from messages (Lesson.illustration.<name>) and short animations.
 * The screens are simplified drawings "like most exchanges", not any particular exchange.
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

// A few candles for the mock charts.
const MINI_CANDLES = [
  { x: 0, o: 60, c: 40, h: 34, l: 66 },
  { x: 16, o: 40, c: 48, h: 36, l: 54 },
  { x: 32, o: 48, c: 30, h: 24, l: 52 },
  { x: 48, o: 30, c: 22, h: 16, l: 36 },
  { x: 64, o: 22, c: 34, h: 18, l: 40 },
  { x: 80, o: 34, c: 14, h: 8, l: 38 },
] as const;

const CANDLE_COLORS = {
  up: { fill: "fill-bull", stroke: "stroke-bull" },
  down: { fill: "fill-bear", stroke: "stroke-bear" },
} as const;

function MiniCandles({ x, y, scale }: { x: number; y: number; scale: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      {MINI_CANDLES.map((candle) => {
        // y grows downwards, so a close above the open has a smaller y.
        const { fill, stroke } =
          CANDLE_COLORS[candle.c < candle.o ? "up" : "down"];
        return (
          <g key={candle.x}>
            <line
              x1={candle.x + 5}
              y1={candle.h}
              x2={candle.x + 5}
              y2={candle.l}
              className={stroke}
              strokeWidth="2"
            />
            <rect
              x={candle.x}
              y={Math.min(candle.o, candle.c)}
              width="10"
              height={Math.abs(candle.o - candle.c)}
              className={fill}
            />
          </g>
        );
      })}
    </g>
  );
}

// 1 Choosing an exchange: Professor Wick checks the licence on two exchange buildings.
function LicenseCheck() {
  const t = useTranslations("Lesson.illustration.licenseCheck");
  const buildings = [
    { key: "licensed", x: 260, stamp: "fill-bull", label: "stampOk" },
    { key: "closed", x: 450, stamp: "fill-bear", label: "stampNo" },
  ] as const;
  return (
    <>
      <rect width="640" height="360" className="fill-muted" />
      <rect x="0" y="320" width="640" height="40" className="fill-card" />
      {buildings.map((building, index) => (
        <g key={building.key}>
          <path
            d={`M${building.x - 10} 150 l80 -40 l80 40 z`}
            className="fill-muted-foreground"
          />
          <rect
            x={building.x}
            y="150"
            width="140"
            height="170"
            className="fill-card stroke-border"
            strokeWidth="2"
          />
          {[0, 1, 2].map((column) => (
            <rect
              key={column}
              x={building.x + 18 + column * 40}
              y="170"
              width="22"
              height="90"
              className="fill-muted-foreground opacity-50"
            />
          ))}
          <text
            x={building.x + 70}
            y="300"
            textAnchor="middle"
            className="fill-foreground text-sm font-bold"
          >
            {t(building.key)}
          </text>
          <g
            className="origin-center transform-fill motion-safe:group-data-playing/anim:animate-bubble-pop"
            style={{ animationDelay: `${500 + index * 400}ms` }}
          >
            <rect
              x={building.x + 6}
              y="200"
              width="128"
              height="36"
              rx="6"
              className={building.stamp}
              transform={`rotate(-8 ${building.x + 70} 218)`}
            />
            <text
              x={building.x + 70}
              y="224"
              textAnchor="middle"
              className="fill-background text-xs font-bold"
              transform={`rotate(-8 ${building.x + 70} 218)`}
            >
              {t(building.label)}
            </text>
          </g>
        </g>
      ))}
      <g className="motion-safe:group-data-playing/anim:animate-bob">
        <Wick x={20} y={150} scale={0.85} />
      </g>
      <Bubble
        x={30}
        y={30}
        width={330}
        text={t("bubble")}
        tail="left"
        delay={1400}
      />
    </>
  );
}

// 2 Sign-up: a selfie with an ID card – the app insists on a neutral face.
function IdSelfie() {
  const t = useTranslations("Lesson.illustration.idSelfie");
  return (
    <>
      <rect width="640" height="360" className="fill-muted" />
      <Person x={220} ground={360} mood="worried" />
      {/* The ID card */}
      <rect
        x="270"
        y="250"
        width="110"
        height="70"
        rx="8"
        className="fill-chart-1"
      />
      <circle cx="300" cy="282" r="14" className="fill-background" />
      <rect
        x="322"
        y="270"
        width="46"
        height="6"
        rx="3"
        className="fill-background"
      />
      <rect
        x="322"
        y="284"
        width="36"
        height="6"
        rx="3"
        className="fill-background"
      />
      {/* The phone */}
      <g className="origin-center transform-fill motion-safe:group-data-playing/anim:animate-wiggle">
        <rect
          x="430"
          y="140"
          width="110"
          height="190"
          rx="16"
          className="fill-foreground"
        />
        <rect
          x="442"
          y="160"
          width="86"
          height="140"
          rx="6"
          className="fill-background"
        />
        <circle
          cx="485"
          cy="215"
          r="34"
          className="fill-none stroke-bull"
          strokeWidth="4"
          strokeDasharray="10 6"
        />
        <text
          x="485"
          y="285"
          textAnchor="middle"
          className="fill-foreground text-xs font-bold"
        >
          {t("phone")}
        </text>
      </g>
      <Bubble
        x={40}
        y={40}
        width={360}
        text={t("bubble")}
        tail="left"
        delay={1100}
      />
    </>
  );
}

// 3 Security: five switches flip on one after another.
function SecurityToggles() {
  const t = useTranslations("Lesson.illustration.securityToggles");
  const items = [
    "twoFa",
    "antiPhishing",
    "whitelist",
    "devices",
    "email",
  ] as const;
  return (
    <>
      <rect width="640" height="360" className="fill-muted" />
      <rect
        x="240"
        y="30"
        width="360"
        height="300"
        rx="12"
        className="fill-card stroke-border"
        strokeWidth="2"
      />
      {items.map((item, index) => (
        <g key={item}>
          <text
            x="264"
            y={82 + index * 56}
            className="fill-foreground text-base font-semibold"
          >
            {t(item)}
          </text>
          <rect
            x="520"
            y={62 + index * 56}
            width="56"
            height="28"
            rx="14"
            className="fill-bull"
          />
          <circle
            cx="562"
            cy={76 + index * 56}
            r="11"
            className="fill-background motion-safe:group-data-playing/anim:animate-drop-in"
            style={{ animationDelay: `${200 + index * 250}ms` }}
          />
        </g>
      ))}
      <Wick x={10} y={150} scale={0.85} />
      <Bubble
        x={20}
        y={30}
        width={210}
        text={t("bubble")}
        tail="left"
        delay={1700}
      />
    </>
  );
}

// 4 Deposits: a wide free pipe and a narrow pipe with a toll booth.
function DepositPipes() {
  const t = useTranslations("Lesson.illustration.depositPipes");
  return (
    <>
      <rect width="640" height="360" className="fill-muted" />
      {/* Wide pipe */}
      <rect
        x="40"
        y="110"
        width="560"
        height="60"
        rx="30"
        className="fill-chart-1 opacity-60"
      />
      <text x="70" y="98" className="fill-foreground text-sm font-bold">
        {t("sepa")}
      </text>
      {/* Narrow pipe with a toll */}
      <rect
        x="40"
        y="250"
        width="560"
        height="26"
        rx="13"
        className="fill-chart-5 opacity-60"
      />
      <text x="70" y="238" className="fill-foreground text-sm font-bold">
        {t("card")}
      </text>
      <rect
        x="380"
        y="214"
        width="70"
        height="90"
        rx="6"
        className="fill-warning"
      />
      <text
        x="415"
        y="264"
        textAnchor="middle"
        className="fill-background text-sm font-bold"
      >
        {t("toll")}
      </text>
      {/* Coins flowing */}
      {[0, 1, 2].map((index) => (
        <g
          key={index}
          className="motion-safe:group-data-playing/anim:animate-sweep"
          style={{ animationDelay: `${index * 250}ms` }}
        >
          <circle
            cx={120 + index * 70}
            cy="140"
            r="16"
            className="fill-warning"
          />
          <circle
            cx={120 + index * 70}
            cy="263"
            r="9"
            className="fill-warning"
          />
        </g>
      ))}
      <Bubble
        x={300}
        y={20}
        width={300}
        text={t("bubble")}
        tail="left"
        delay={1300}
      />
    </>
  );
}

// 5 The trading screen: a simplified exchange screen with numbered parts.
function ScreenTour() {
  const t = useTranslations("Lesson.illustration.screenTour");
  const callouts = [
    { n: "1", x: 40, y: 34 },
    { n: "2", x: 40, y: 92 },
    { n: "3", x: 420, y: 70 },
    { n: "4", x: 420, y: 192 },
    { n: "5", x: 530, y: 70 },
    { n: "6", x: 40, y: 290 },
  ] as const;
  return (
    <>
      <rect width="640" height="360" className="fill-muted" />
      <rect
        x="20"
        y="16"
        width="600"
        height="328"
        rx="10"
        className="fill-card stroke-border"
        strokeWidth="2"
      />
      {/* 1 Header with the pair */}
      <rect
        x="20"
        y="16"
        width="600"
        height="40"
        rx="10"
        className="fill-background"
      />
      <text x="70" y="42" className="fill-foreground text-sm font-bold">
        {t("pair")}
      </text>
      <text x="170" y="42" className="fill-bull text-sm font-bold">
        {t("price")}
      </text>
      {/* 2 Chart */}
      <rect
        x="30"
        y="66"
        width="370"
        height="200"
        rx="6"
        className="fill-background"
      />
      <MiniCandles x={90} y={100} scale={2.4} />
      {/* 3 Order book and 4 trades */}
      <rect
        x="410"
        y="66"
        width="100"
        height="116"
        rx="6"
        className="fill-background"
      />
      {[0, 1, 2].map((row) => (
        <rect
          key={`ask${row}`}
          x="420"
          y={84 + row * 12}
          width={40 + row * 14}
          height="6"
          className="fill-bear opacity-70"
        />
      ))}
      {[0, 1, 2].map((row) => (
        <rect
          key={`bid${row}`}
          x="420"
          y={134 + row * 12}
          width={70 - row * 14}
          height="6"
          className="fill-bull opacity-70"
        />
      ))}
      <rect
        x="410"
        y="188"
        width="100"
        height="78"
        rx="6"
        className="fill-background"
      />
      {[0, 1, 2, 3].map((row) => (
        <rect
          key={`trade${row}`}
          x="420"
          y={204 + row * 14}
          width="70"
          height="6"
          className="fill-muted-foreground opacity-50"
        />
      ))}
      {/* 5 Order panel */}
      <rect
        x="520"
        y="66"
        width="90"
        height="200"
        rx="6"
        className="fill-background"
      />
      <rect
        x="530"
        y="96"
        width="70"
        height="20"
        rx="4"
        className="fill-muted"
      />
      <rect
        x="530"
        y="124"
        width="70"
        height="20"
        rx="4"
        className="fill-muted"
      />
      <rect
        x="530"
        y="222"
        width="70"
        height="28"
        rx="6"
        className="fill-bull"
      />
      {/* 6 Orders */}
      <rect
        x="30"
        y="276"
        width="580"
        height="58"
        rx="6"
        className="fill-background"
      />
      {callouts.map((callout, index) => (
        <g
          key={callout.n}
          className="origin-center transform-fill motion-safe:group-data-playing/anim:animate-bubble-pop"
          style={{ animationDelay: `${200 + index * 200}ms` }}
        >
          <circle
            cx={callout.x}
            cy={callout.y}
            r="13"
            className="fill-warning"
          />
          <text
            x={callout.x}
            y={callout.y + 5}
            textAnchor="middle"
            className="fill-background text-sm font-bold"
          >
            {callout.n}
          </text>
        </g>
      ))}
    </>
  );
}

// 6 Quick buy or spot: a shiny shop with a markup next to a plain market stall.
function QuickBuyMarkup() {
  const t = useTranslations("Lesson.illustration.quickBuyMarkup");
  const shops = [
    { key: "quick", x: 60, roof: "fill-chart-5", price: "quickPrice" },
    { key: "spot", x: 340, roof: "fill-muted-foreground", price: "spotPrice" },
  ] as const;
  return (
    <>
      <rect width="640" height="360" className="fill-muted" />
      <rect x="0" y="320" width="640" height="40" className="fill-card" />
      {shops.map((shop) => (
        <g key={shop.key}>
          <path
            d={`M${shop.x - 10} 150 l130 -40 l130 40 z`}
            className={shop.roof}
          />
          <rect
            x={shop.x}
            y="150"
            width="240"
            height="170"
            className="fill-card stroke-border"
            strokeWidth="2"
          />
          <text
            x={shop.x + 120}
            y="180"
            textAnchor="middle"
            className="fill-foreground text-sm font-bold"
          >
            {t(shop.key)}
          </text>
          <circle cx={shop.x + 120} cy="240" r="30" className="fill-warning" />
          <text
            x={shop.x + 120}
            y="246"
            textAnchor="middle"
            className="fill-background text-sm font-bold"
          >
            {t("coin")}
          </text>
          <rect
            x={shop.x + 70}
            y="282"
            width="100"
            height="28"
            rx="6"
            className="fill-foreground"
          />
          <text
            x={shop.x + 120}
            y="301"
            textAnchor="middle"
            className="fill-background text-sm font-bold"
          >
            {t(shop.price)}
          </text>
        </g>
      ))}
      {/* Sparkles around the shiny shop */}
      {[
        [70, 120],
        [290, 130],
        [180, 96],
      ].map(([x = 0, y = 0], index) => (
        <path
          key={x}
          d={`M${x} ${y - 10} l3 7 7 3 -7 3 -3 7 -3 -7 -7 -3 7 -3z`}
          className="fill-warning motion-safe:group-data-playing/anim:animate-bob"
          style={{ animationDelay: `${index * 150}ms` }}
        />
      ))}
      <Bubble
        x={330}
        y={20}
        width={280}
        text={t("bubble")}
        tail="left"
        delay={1100}
      />
    </>
  );
}

// 7 Orders in practice: an order form with Price, Amount and Total – one zero too many is circled.
function OrderForm() {
  const t = useTranslations("Lesson.illustration.orderForm");
  const fields = [
    { key: "priceLabel", value: "priceValue", y: 110 },
    { key: "amountLabel", value: "amountValue", y: 170 },
    { key: "totalLabel", value: "totalValue", y: 230 },
  ] as const;
  return (
    <>
      <rect width="640" height="360" className="fill-muted" />
      <rect
        x="250"
        y="40"
        width="340"
        height="290"
        rx="12"
        className="fill-card stroke-border"
        strokeWidth="2"
      />
      <rect
        x="270"
        y="56"
        width="140"
        height="32"
        rx="8"
        className="fill-bull"
      />
      <text
        x="340"
        y="78"
        textAnchor="middle"
        className="fill-background text-sm font-bold"
      >
        {t("buy")}
      </text>
      <rect
        x="420"
        y="56"
        width="150"
        height="32"
        rx="8"
        className="fill-muted"
      />
      <text
        x="495"
        y="78"
        textAnchor="middle"
        className="fill-muted-foreground text-sm font-bold"
      >
        {t("sell")}
      </text>
      {fields.map((field) => (
        <g key={field.key}>
          <text
            x="270"
            y={field.y - 6}
            className="fill-muted-foreground text-xs font-bold"
          >
            {t(field.key)}
          </text>
          <rect
            x="270"
            y={field.y}
            width="300"
            height="36"
            rx="6"
            className="fill-background stroke-border"
            strokeWidth="2"
          />
          <text
            x="284"
            y={field.y + 24}
            className="fill-foreground text-base font-semibold"
          >
            {t(field.value)}
          </text>
        </g>
      ))}
      <rect
        x="270"
        y="282"
        width="300"
        height="34"
        rx="8"
        className="fill-bull"
      />
      <text
        x="420"
        y="304"
        textAnchor="middle"
        className="fill-background text-sm font-bold"
      >
        {t("confirm")}
      </text>
      <Wick x={10} y={150} scale={0.85} />
      <Bubble
        x={20}
        y={30}
        width={240}
        text={t("bubble")}
        tail="left"
        delay={1100}
      />
    </>
  );
}

// 8 Maker and taker: one puts goods on the counter, the other takes them away.
function MakerTaker() {
  const t = useTranslations("Lesson.illustration.makerTaker");
  return (
    <>
      <rect width="640" height="360" className="fill-muted" />
      <rect x="0" y="320" width="640" height="40" className="fill-card" />
      {/* The counter = the order book */}
      <rect x="220" y="220" width="200" height="100" className="fill-chart-3" />
      <text
        x="320"
        y="300"
        textAnchor="middle"
        className="fill-background text-sm font-bold"
      >
        {t("counter")}
      </text>
      {[250, 300, 350].map((x, index) => (
        <circle
          key={x}
          cx={x + 20}
          cy="206"
          r="14"
          className="fill-warning motion-safe:group-data-playing/anim:animate-drop-in"
          style={{ animationDelay: `${index * 200}ms` }}
        />
      ))}
      <Person x={120} ground={320} mood="happy" />
      <Person x={520} ground={320} mood="happy" />
      {(
        [
          { key: "maker", x: 120, fee: "makerFee" },
          { key: "taker", x: 520, fee: "takerFee" },
        ] as const
      ).map((side) => (
        <g key={side.key}>
          <rect
            x={side.x - 60}
            y="110"
            width="120"
            height="44"
            rx="8"
            className="fill-card stroke-border"
            strokeWidth="2"
          />
          <text
            x={side.x}
            y="130"
            textAnchor="middle"
            className="fill-foreground text-sm font-bold"
          >
            {t(side.key)}
          </text>
          <text
            x={side.x}
            y="147"
            textAnchor="middle"
            className="fill-muted-foreground text-xs font-bold"
          >
            {t(side.fee)}
          </text>
        </g>
      ))}
      <Bubble
        x={170}
        y={30}
        width={300}
        text={t("bubble")}
        tail="right"
        delay={1200}
      />
    </>
  );
}

// 9 Timeframes: a nervous one-minute chart next to a calm daily one.
function TimeframeZoom() {
  const t = useTranslations("Lesson.illustration.timeframeZoom");
  return (
    <>
      <rect width="640" height="360" className="fill-muted" />
      {(
        [
          { key: "minute", x: 40 },
          { key: "day", x: 340 },
        ] as const
      ).map((panel) => (
        <g key={panel.key}>
          <rect
            x={panel.x}
            y="60"
            width="260"
            height="210"
            rx="10"
            className="fill-card stroke-border"
            strokeWidth="2"
          />
          <text
            x={panel.x + 130}
            y="296"
            textAnchor="middle"
            className="fill-foreground text-sm font-bold"
          >
            {t(panel.key)}
          </text>
        </g>
      ))}
      {/* Jittery minute chart */}
      <g className="origin-center transform-fill motion-safe:group-data-playing/anim:animate-wiggle">
        <path
          d="M60 170 l12 -30 l10 40 l12 -50 l10 60 l12 -40 l10 30 l12 -45 l10 50 l12 -35 l10 25 l12 -40 l10 45 l12 -30 l10 20 l12 -25 l10 30"
          className="fill-none stroke-bear"
          strokeWidth="4"
          strokeLinejoin="round"
        />
      </g>
      {/* Calm daily chart */}
      <path
        d="M360 230 q60 -10 90 -50 t140 -80"
        className="fill-none stroke-bull"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <Bubble
        x={150}
        y={14}
        width={340}
        text={t("bubble")}
        tail="left"
        delay={1100}
      />
    </>
  );
}

// 10 The indicator menu: candles buried under a bowl of indicator spaghetti.
function IndicatorSoup() {
  const t = useTranslations("Lesson.illustration.indicatorSoup");
  const lines = [
    {
      d: "M40 220 q100 -80 200 -20 t200 -40 t160 30",
      stroke: "stroke-chart-1",
    },
    { d: "M40 180 q120 60 220 -10 t180 20 t160 -50", stroke: "stroke-chart-5" },
    {
      d: "M40 250 q90 -120 190 -40 t200 10 t170 -60",
      stroke: "stroke-warning",
    },
    { d: "M40 150 q140 40 230 30 t170 -50 t160 60", stroke: "stroke-bull" },
    { d: "M40 200 q80 30 160 -60 t200 70 t200 -30", stroke: "stroke-bear" },
  ] as const;
  return (
    <>
      <rect width="640" height="360" className="fill-muted" />
      <g transform="scale(0.72 1)">
        <rect
          x="20"
          y="80"
          width="600"
          height="250"
          rx="10"
          className="fill-card stroke-border"
          strokeWidth="2"
        />
        <MiniCandles x={220} y={140} scale={2} />
        {lines.map((line, index) => (
          <path
            key={line.d}
            d={line.d}
            className={cn(
              "fill-none motion-safe:group-data-playing/anim:animate-drop-in",
              line.stroke,
            )}
            strokeWidth="5"
            style={{ animationDelay: `${index * 200}ms` }}
          />
        ))}
      </g>
      <Wick x={452} y={196} scale={0.7} pose="fallen" />
      <Bubble
        x={30}
        y={20}
        width={300}
        text={t("bubble")}
        tail="right"
        delay={1400}
      />
    </>
  );
}

// 11 Drawing and alerts: a level line with an alarm clock ringing on it.
function AlarmLine() {
  const t = useTranslations("Lesson.illustration.alarmLine");
  return (
    <>
      <rect width="640" height="360" className="fill-muted" />
      <rect
        x="20"
        y="70"
        width="600"
        height="260"
        rx="10"
        className="fill-card stroke-border"
        strokeWidth="2"
      />
      <MiniCandles x={80} y={110} scale={3} />
      <line
        x1="40"
        y1="160"
        x2="600"
        y2="160"
        className="stroke-warning"
        strokeWidth="4"
        strokeDasharray="12 8"
      />
      <text
        x="600"
        y="150"
        textAnchor="end"
        className="fill-warning text-sm font-bold"
      >
        {t("level")}
      </text>
      {/* Alarm clock */}
      <g className="origin-center transform-fill motion-safe:group-data-playing/anim:animate-wiggle">
        <circle cx="470" cy="230" r="44" className="fill-bear" />
        <circle cx="470" cy="230" r="34" className="fill-background" />
        <line
          x1="470"
          y1="230"
          x2="470"
          y2="206"
          className="stroke-foreground"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <line
          x1="470"
          y1="230"
          x2="488"
          y2="238"
          className="stroke-foreground"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <circle cx="440" cy="190" r="12" className="fill-bear" />
        <circle cx="500" cy="190" r="12" className="fill-bear" />
      </g>
      <Bubble
        x={40}
        y={14}
        width={320}
        text={t("bubble")}
        tail="right"
        delay={1100}
      />
    </>
  );
}

// 12 The order book: the depth chart as two mountains, Professor Wick standing in the spread.
function DepthMountains() {
  const t = useTranslations("Lesson.illustration.depthMountains");
  return (
    <>
      <rect width="640" height="360" className="fill-muted" />
      <path
        d="M30 320 L30 120 L120 170 L200 230 L270 300 L290 320 z"
        className="fill-bull opacity-70"
      />
      <path
        d="M350 320 L370 300 L440 230 L520 170 L610 110 L610 320 z"
        className="fill-bear opacity-70"
      />
      <line
        x1="20"
        y1="320"
        x2="620"
        y2="320"
        className="stroke-border"
        strokeWidth="4"
      />
      <text
        x="120"
        y="300"
        textAnchor="middle"
        className="fill-background text-sm font-bold"
      >
        {t("buys")}
      </text>
      <text
        x="520"
        y="300"
        textAnchor="middle"
        className="fill-background text-sm font-bold"
      >
        {t("sells")}
      </text>
      <text
        x="320"
        y="344"
        textAnchor="middle"
        className="fill-foreground text-sm font-bold"
      >
        {t("spread")}
      </text>
      <g className="motion-safe:group-data-playing/anim:animate-bob">
        <Wick x={262} y={164} scale={0.6} />
      </g>
      <Bubble
        x={170}
        y={20}
        width={300}
        text={t("bubble")}
        tail="left"
        delay={1100}
      />
    </>
  );
}

// 13 Buttons to leave alone: big shiny buttons, Professor Wick keeps his hands off.
function DangerButtons() {
  const t = useTranslations("Lesson.illustration.dangerButtons");
  const buttons = [
    { key: "futures", x: 300, y: 70, fill: "fill-bear" },
    { key: "bonus", x: 470, y: 70, fill: "fill-warning" },
    { key: "copy", x: 300, y: 190, fill: "fill-chart-5" },
    { key: "earn", x: 470, y: 190, fill: "fill-chart-1" },
  ] as const;
  return (
    <>
      <rect width="640" height="360" className="fill-muted" />
      {buttons.map((button, index) => (
        <g
          key={button.key}
          className="origin-center transform-fill motion-safe:group-data-playing/anim:animate-press"
          style={{ animationDelay: `${index * 150}ms` }}
        >
          <rect
            x={button.x}
            y={button.y}
            width="150"
            height="90"
            rx="20"
            className={button.fill}
          />
          <text
            x={button.x + 75}
            y={button.y + 52}
            textAnchor="middle"
            className="fill-background text-base font-bold"
          >
            {t(button.key)}
          </text>
        </g>
      ))}
      <Wick x={10} y={150} scale={0.85} />
      <Bubble
        x={20}
        y={20}
        width={250}
        text={t("bubble")}
        tail="left"
        delay={1100}
      />
    </>
  );
}

// 14 Withdrawal: Professor Wick carries a coin from the exchange to the home safe.
function WithdrawJourney() {
  const t = useTranslations("Lesson.illustration.withdrawJourney");
  return (
    <>
      <rect width="640" height="360" className="fill-muted" />
      <rect x="0" y="320" width="640" height="40" className="fill-card" />
      {/* Exchange */}
      <path d="M30 170 l80 -40 l80 40 z" className="fill-muted-foreground" />
      <rect
        x="40"
        y="170"
        width="140"
        height="150"
        className="fill-card stroke-border"
        strokeWidth="2"
      />
      <text
        x="110"
        y="300"
        textAnchor="middle"
        className="fill-foreground text-sm font-bold"
      >
        {t("exchange")}
      </text>
      {/* Home safe */}
      <rect
        x="470"
        y="200"
        width="130"
        height="120"
        rx="10"
        className="fill-muted-foreground"
      />
      <circle
        cx="535"
        cy="260"
        r="26"
        className="fill-none stroke-background"
        strokeWidth="6"
      />
      <text
        x="535"
        y="190"
        textAnchor="middle"
        className="fill-foreground text-sm font-bold"
      >
        {t("wallet")}
      </text>
      {/* Professor Wick carrying a coin */}
      <g className="motion-safe:group-data-playing/anim:animate-sweep">
        <Wick x={190} y={160} scale={0.8} />
        <circle cx="318" cy="232" r="18" className="fill-warning" />
      </g>
      <Bubble
        x={200}
        y={20}
        width={300}
        text={t("bubble")}
        tail="left"
        delay={1300}
      />
    </>
  );
}

export const EXCHANGE_ILLUSTRATIONS = {
  licenseCheck: LicenseCheck,
  idSelfie: IdSelfie,
  securityToggles: SecurityToggles,
  depositPipes: DepositPipes,
  screenTour: ScreenTour,
  quickBuyMarkup: QuickBuyMarkup,
  orderForm: OrderForm,
  makerTaker: MakerTaker,
  timeframeZoom: TimeframeZoom,
  indicatorSoup: IndicatorSoup,
  alarmLine: AlarmLine,
  depthMountains: DepthMountains,
  dangerButtons: DangerButtons,
  withdrawJourney: WithdrawJourney,
} as const;
