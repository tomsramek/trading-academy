import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";

import { Bubble } from "./Bubble";
import { Person } from "./Person";

/*
 * Fun illustrations of the course "Solana in depth" (content/courses/solana-in-depth).
 * Same rules as in ../Illustration.tsx, which shows them: a 640×360 drawing, colors from the design
 * tokens, the dark theme, texts from messages (Lesson.illustration.<name>) and short animations.
 */

// Why Solana: a race car zooms past a snail – both carry blocks, one every 0.4 s, one every 10 minutes.
function SpeedRace() {
  const t = useTranslations("Lesson.illustration.speedRace");
  return (
    <>
      <rect width="640" height="360" className="fill-muted" />
      <rect x="0" y="150" width="640" height="80" className="fill-card" />
      <rect x="0" y="250" width="640" height="80" className="fill-card" />
      <line
        x1="0"
        y1="240"
        x2="640"
        y2="240"
        className="stroke-border"
        strokeWidth="3"
        strokeDasharray="16 12"
      />
      {/* The race car */}
      <g className="motion-safe:group-data-playing/anim:animate-drive-in">
        {[0, 18, 36].map((y) => (
          <line
            key={y}
            x1="290"
            y1={168 + y}
            x2="340"
            y2={168 + y}
            className="stroke-muted-foreground"
            strokeWidth="4"
            strokeLinecap="round"
          />
        ))}
        <path
          d="M360 210 l20 -34 l90 0 l30 20 l50 4 l0 10 z"
          className="fill-chart-5"
        />
        <circle cx="395" cy="212" r="14" className="fill-foreground" />
        <circle cx="505" cy="212" r="14" className="fill-foreground" />
        <text
          x="440"
          y="200"
          textAnchor="middle"
          className="fill-background text-sm font-bold"
        >
          {t("car")}
        </text>
      </g>
      {/* The snail */}
      <g className="motion-safe:group-data-playing/anim:animate-bob">
        <path
          d="M120 312 l90 0 q10 0 10 -10 l-100 0 z"
          className="fill-chart-3"
        />
        <circle cx="160" cy="282" r="26" className="fill-warning" />
        <path
          d="M160 282 m-12 0 a12 12 0 1 0 24 0 a6 6 0 1 0 -12 0"
          className="fill-none stroke-background"
          strokeWidth="3"
        />
        <line
          x1="212"
          y1="302"
          x2="222"
          y2="280"
          className="stroke-chart-3"
          strokeWidth="3"
        />
        <circle cx="222" cy="278" r="4" className="fill-foreground" />
      </g>
      <text x="320" y="296" className="fill-foreground text-sm font-bold">
        {t("snail")}
      </text>
      <Bubble
        x={60}
        y={40}
        width={330}
        text={t("bubble")}
        tail="right"
        delay={1300}
      />
    </>
  );
}

// Validators and Proof of History: a choir sings by a metronome; the soloist is known in advance.
function MetronomeChoir() {
  const t = useTranslations("Lesson.illustration.metronomeChoir");
  const singers = [
    { x: 330, solo: false },
    { x: 450, solo: true },
    { x: 570, solo: false },
  ] as const;
  return (
    <>
      <rect width="640" height="360" className="fill-muted" />
      {/* The metronome */}
      <path d="M60 330 l40 -190 l40 0 l40 190 z" className="fill-chart-3" />
      <g className="origin-bottom transform-fill motion-safe:group-data-playing/anim:animate-swing">
        <rect
          x="117"
          y="150"
          width="6"
          height="160"
          className="fill-foreground"
        />
        <rect
          x="108"
          y="190"
          width="24"
          height="16"
          rx="3"
          className="fill-warning"
        />
      </g>
      <text
        x="120"
        y="350"
        textAnchor="middle"
        className="fill-foreground text-xs font-bold"
      >
        {t("clock")}
      </text>
      {singers.map((singer) => (
        <g key={singer.x}>
          <Person
            x={singer.x}
            ground={340}
            mood={singer.solo ? "surprised" : "happy"}
          />
          {singer.solo && (
            <g className="motion-safe:group-data-playing/anim:animate-bob">
              <rect
                x={singer.x - 36}
                y="180"
                width="72"
                height="26"
                rx="13"
                className="fill-warning"
              />
              <text
                x={singer.x}
                y="198"
                textAnchor="middle"
                className="fill-background text-xs font-bold"
              >
                {t("solo")}
              </text>
            </g>
          )}
        </g>
      ))}
      {/* Notes */}
      {[
        [400, 150],
        [430, 125],
      ].map(([x = 0, y = 0], index) => (
        <path
          key={x}
          d={`M${x} ${y} l0 -26 l14 -4 l0 22 m-14 8 a6 5 0 1 1 -1 -1 m15 -7 a6 5 0 1 1 -1 -1`}
          className="fill-foreground stroke-foreground motion-safe:group-data-playing/anim:animate-note-out"
          strokeWidth="2"
          style={{ animationDelay: `${300 + index * 300}ms` }}
        />
      ))}
      <Bubble
        x={250}
        y={30}
        width={330}
        text={t("bubble")}
        tail="right"
        delay={1200}
      />
    </>
  );
}

// Outages: the race car stands in the pit with smoke; the crew restarts it together over a chat.
function PitStop() {
  const t = useTranslations("Lesson.illustration.pitStop");
  return (
    <>
      <rect width="640" height="360" className="fill-muted" />
      <rect x="0" y="300" width="640" height="60" className="fill-card" />
      <g className="origin-bottom transform-fill motion-safe:group-data-playing/anim:animate-wiggle">
        <path
          d="M300 300 l20 -34 l90 0 l30 20 l50 4 l0 10 z"
          className="fill-chart-5"
        />
        <circle cx="335" cy="302" r="14" className="fill-foreground" />
        <circle cx="445" cy="302" r="14" className="fill-foreground" />
      </g>
      {[
        [470, 250, 14],
        [490, 222, 18],
        [516, 190, 24],
      ].map(([x = 0, y = 0, r = 0], index) => (
        <circle
          key={x}
          cx={x}
          cy={y}
          r={r}
          className="origin-center fill-muted-foreground opacity-60 transform-fill motion-safe:group-data-playing/anim:animate-bubble-pop"
          style={{ animationDelay: `${300 + index * 250}ms` }}
        />
      ))}
      <Person x={130} ground={300} mood="worried" />
      {/* The restart sign */}
      <rect
        x="560"
        y="120"
        width="6"
        height="180"
        className="fill-muted-foreground"
      />
      <rect
        x="500"
        y="80"
        width="126"
        height="44"
        rx="6"
        className="fill-bear"
      />
      <text
        x="563"
        y="108"
        textAnchor="middle"
        className="fill-foreground text-sm font-bold"
      >
        {t("sign")}
      </text>
      <Bubble
        x={40}
        y={50}
        width={360}
        text={t("bubble")}
        tail="left"
        delay={1100}
      />
    </>
  );
}

// The SOL token: a bathtub fills from the inflation tap faster than the burn drain empties it.
function BathtubSupply() {
  const t = useTranslations("Lesson.illustration.bathtubSupply");
  return (
    <>
      <rect width="640" height="360" className="fill-muted" />
      {/* Tap and drops */}
      <path
        d="M150 70 l90 0 l0 30 l-20 0 l0 20 l-20 0 l0 -20 l-50 0 z"
        className="fill-muted-foreground"
      />
      {[0, 1, 2].map((index) => (
        <ellipse
          key={index}
          cx="210"
          cy={140 + index * 22}
          rx="6"
          ry="9"
          className="fill-chart-1 motion-safe:group-data-playing/anim:animate-sweat-drop"
          style={{ animationDelay: `${index * 300}ms` }}
        />
      ))}
      <text x="150" y="58" className="fill-foreground text-sm font-bold">
        {t("tap")}
      </text>
      {/* The tub */}
      <path
        d="M100 200 l440 0 l-30 110 l-380 0 z"
        className="fill-card stroke-border"
        strokeWidth="3"
      />
      <path
        d="M108 222 l424 0 l-24 84 l-376 0 z"
        className="fill-chart-1 opacity-60"
      />
      {/* The duck */}
      <g className="motion-safe:group-data-playing/anim:animate-bob">
        <ellipse cx="360" cy="212" rx="34" ry="18" className="fill-warning" />
        <circle cx="384" cy="190" r="14" className="fill-warning" />
        <path d="M396 188 l14 4 l-14 4 z" className="fill-chart-3" />
        <circle cx="388" cy="186" r="2.5" className="fill-background" />
        <text
          x="352"
          y="217"
          textAnchor="middle"
          className="fill-background text-xs font-bold"
        >
          {t("duck")}
        </text>
      </g>
      {/* The drain */}
      <circle cx="470" cy="322" r="10" className="fill-foreground" />
      <text x="490" y="340" className="fill-foreground text-sm font-bold">
        {t("drain")}
      </text>
      <Bubble
        x={300}
        y={60}
        width={300}
        text={t("bubble")}
        tail="left"
        delay={1200}
      />
    </>
  );
}

// Wallet and accounts: a wall of mailboxes – every new token gets its own box with a small deposit.
function TokenMailboxes() {
  const t = useTranslations("Lesson.illustration.tokenMailboxes");
  const boxes = [
    { key: "sol", x: 260, y: 90 },
    { key: "usdc", x: 380, y: 90 },
    { key: "jup", x: 260, y: 180 },
  ] as const;
  return (
    <>
      <rect width="640" height="360" className="fill-muted" />
      <rect
        x="240"
        y="70"
        width="380"
        height="210"
        rx="8"
        className="fill-card"
      />
      {boxes.map((box) => (
        <g key={box.key}>
          <rect
            x={box.x}
            y={box.y}
            width="100"
            height="70"
            rx="6"
            className="fill-chart-1"
          />
          <rect
            x={box.x + 20}
            y={box.y + 14}
            width="60"
            height="8"
            rx="4"
            className="fill-background"
          />
          <text
            x={box.x + 50}
            y={box.y + 52}
            textAnchor="middle"
            className="fill-background text-sm font-bold"
          >
            {t(box.key)}
          </text>
        </g>
      ))}
      {/* The new box with its deposit tag */}
      <g
        className="transform-fill motion-safe:group-data-playing/anim:animate-drop-in"
        style={{ animationDelay: "400ms" }}
      >
        <rect
          x="380"
          y="180"
          width="100"
          height="70"
          rx="6"
          className="fill-warning"
        />
        <text
          x="430"
          y="222"
          textAnchor="middle"
          className="fill-background text-sm font-bold"
        >
          {t("meme")}
        </text>
        <rect
          x="490"
          y="196"
          width="112"
          height="30"
          rx="15"
          className="fill-foreground"
        />
        <text
          x="546"
          y="216"
          textAnchor="middle"
          className="fill-background text-xs font-bold"
        >
          {t("deposit")}
        </text>
      </g>
      <Person x={110} ground={360} mood="surprised" />
      <Bubble
        x={20}
        y={20}
        width={360}
        text={t("bubble")}
        tail="left"
        delay={1200}
      />
    </>
  );
}

// Fees: a toll booth – the priority lane drives through, the ordinary lane queues.
function TollBooth() {
  const t = useTranslations("Lesson.illustration.tollBooth");
  const queue = [80, 190, 300] as const;
  return (
    <>
      <rect width="640" height="360" className="fill-muted" />
      <rect x="0" y="150" width="640" height="70" className="fill-card" />
      <rect x="0" y="250" width="640" height="70" className="fill-card" />
      {/* The booth */}
      <rect
        x="400"
        y="110"
        width="40"
        height="230"
        className="fill-muted-foreground"
      />
      <rect
        x="370"
        y="70"
        width="100"
        height="34"
        rx="6"
        className="fill-warning"
      />
      <text
        x="420"
        y="93"
        textAnchor="middle"
        className="fill-background text-xs font-bold"
      >
        {t("priority")}
      </text>
      {/* The priority car drives through */}
      <g className="motion-safe:group-data-playing/anim:animate-drive-in">
        <rect
          x="470"
          y="165"
          width="100"
          height="40"
          rx="12"
          className="fill-bull"
        />
        <circle cx="492" cy="208" r="10" className="fill-foreground" />
        <circle cx="548" cy="208" r="10" className="fill-foreground" />
      </g>
      {/* The queue */}
      {queue.map((x, index) => (
        <g
          key={x}
          className="motion-safe:group-data-playing/anim:animate-wiggle"
          style={{ animationDelay: `${index * 120}ms` }}
        >
          <rect
            x={x}
            y="265"
            width="90"
            height="40"
            rx="12"
            className="fill-chart-1"
          />
          <circle cx={x + 20} cy="308" r="10" className="fill-foreground" />
          <circle cx={x + 70} cy="308" r="10" className="fill-foreground" />
        </g>
      ))}
      <Bubble
        x={40}
        y={50}
        width={300}
        text={t("bubble")}
        tail="left"
        delay={1100}
      />
    </>
  );
}

// SPL tokens: a token's creator keeps the keys to the printer and to the freezer – just in case.
function TwoKeys() {
  const t = useTranslations("Lesson.illustration.twoKeys");
  const keys = [
    { key: "mint", x: 420, fill: "fill-warning", stroke: "stroke-warning" },
    { key: "freeze", x: 540, fill: "fill-chart-1", stroke: "stroke-chart-1" },
  ] as const;
  return (
    <>
      <rect width="640" height="360" className="fill-muted" />
      {/* The token */}
      <circle cx="170" cy="200" r="80" className="fill-chart-5" />
      <circle
        cx="170"
        cy="200"
        r="62"
        className="fill-none stroke-background"
        strokeWidth="4"
      />
      <text
        x="170"
        y="207"
        textAnchor="middle"
        className="fill-background text-lg font-bold"
      >
        {t("token")}
      </text>
      {/* The keys on a hook */}
      <rect
        x="380"
        y="90"
        width="220"
        height="10"
        rx="5"
        className="fill-muted-foreground"
      />
      {keys.map((key, index) => (
        <g
          key={key.key}
          className="origin-top transform-fill motion-safe:group-data-playing/anim:animate-swing"
          style={{ animationDelay: `${index * 200}ms` }}
        >
          <line
            x1={key.x}
            y1="100"
            x2={key.x}
            y2="140"
            className="stroke-muted-foreground"
            strokeWidth="3"
          />
          <circle
            cx={key.x}
            cy="160"
            r="20"
            className={cn("fill-none", key.stroke)}
            strokeWidth="8"
          />
          <rect
            x={key.x - 5}
            y="178"
            width="10"
            height="70"
            className={key.fill}
          />
          <rect
            x={key.x + 5}
            y="220"
            width="16"
            height="8"
            className={key.fill}
          />
          <rect
            x={key.x + 5}
            y="236"
            width="12"
            height="8"
            className={key.fill}
          />
          <text
            x={key.x}
            y="280"
            textAnchor="middle"
            className="fill-foreground text-sm font-bold"
          >
            {t(key.key)}
          </text>
        </g>
      ))}
      <Bubble
        x={40}
        y={30}
        width={330}
        text={t("bubble")}
        tail="left"
        delay={1100}
      />
    </>
  );
}

// Security: a smiling stranger hands over a paper to sign – the small print says "send everything".
function BlankCheque() {
  const t = useTranslations("Lesson.illustration.blankCheque");
  return (
    <>
      <rect width="640" height="360" className="fill-muted" />
      <Person x={110} ground={360} mood="happy" />
      {/* The paper */}
      <g className="origin-center transform-fill motion-safe:group-data-playing/anim:animate-wiggle">
        <rect
          x="230"
          y="120"
          width="200"
          height="190"
          rx="6"
          className="fill-foreground"
        />
        <text
          x="330"
          y="160"
          textAnchor="middle"
          className="fill-background text-base font-bold"
        >
          {t("title")}
        </text>
        {[185, 205, 225].map((y) => (
          <rect
            key={y}
            x="255"
            y={y}
            width="150"
            height="6"
            rx="3"
            className="fill-muted-foreground opacity-50"
          />
        ))}
        <text
          x="330"
          y="262"
          textAnchor="middle"
          className="fill-bear text-xs font-bold"
        >
          {t("smallPrint")}
        </text>
        <line
          x1="260"
          y1="290"
          x2="400"
          y2="290"
          className="stroke-background"
          strokeWidth="2"
        />
      </g>
      {/* The pen */}
      <g className="origin-bottom transform-fill motion-safe:group-data-playing/anim:animate-scribble">
        <path
          d="M380 288 l50 -50 l10 10 l-50 50 l-14 4 z"
          className="fill-chart-1"
        />
      </g>
      {/* The stranger */}
      <Person x={540} ground={360} mood="happy" />
      <rect
        x="514"
        y="243"
        width="52"
        height="12"
        rx="4"
        className="fill-background"
      />
      <Bubble
        x={300}
        y={30}
        width={320}
        text={t("bubble")}
        tail="right"
        delay={1100}
      />
    </>
  );
}

// Native staking: a piggy bank by a calendar of epochs – a coin drops in every two to three days.
function StakeCalendar() {
  const t = useTranslations("Lesson.illustration.stakeCalendar");
  const pages = [
    { key: "epoch1", x: 340 },
    { key: "epoch2", x: 440 },
    { key: "epoch3", x: 540 },
  ] as const;
  return (
    <>
      <rect width="640" height="360" className="fill-muted" />
      {pages.map((page, index) => (
        <g
          key={page.key}
          className="transform-fill motion-safe:group-data-playing/anim:animate-drop-in"
          style={{ animationDelay: `${index * 400}ms` }}
        >
          <rect
            x={page.x - 40}
            y="140"
            width="80"
            height="90"
            rx="6"
            className="fill-card stroke-border"
            strokeWidth="2"
          />
          <rect
            x={page.x - 40}
            y="140"
            width="80"
            height="24"
            rx="6"
            className="fill-bear"
          />
          <text
            x={page.x}
            y="205"
            textAnchor="middle"
            className="fill-foreground text-sm font-bold"
          >
            {t(page.key)}
          </text>
        </g>
      ))}
      {/* The piggy bank */}
      <ellipse cx="160" cy="260" rx="90" ry="60" className="fill-chart-5" />
      <circle cx="240" cy="245" r="22" className="fill-chart-5" />
      <circle cx="248" cy="240" r="4" className="fill-background" />
      <rect x="110" y="300" width="20" height="30" className="fill-chart-5" />
      <rect x="190" y="300" width="20" height="30" className="fill-chart-5" />
      <rect
        x="140"
        y="200"
        width="44"
        height="8"
        rx="4"
        className="fill-background"
      />
      {[0, 1, 2].map((index) => (
        <circle
          key={index}
          cx="162"
          cy="170"
          r="14"
          className="fill-warning motion-safe:group-data-playing/anim:animate-coin-insert"
          style={{ animationDelay: `${index * 400}ms` }}
        />
      ))}
      <Bubble
        x={300}
        y={40}
        width={300}
        text={t("bubble")}
        tail="left"
        delay={1500}
      />
    </>
  );
}

// Liquid staking: a theatre cloakroom – hand in your SOL coat, get a ticket you can even sell.
function CoatCheck() {
  const t = useTranslations("Lesson.illustration.coatCheck");
  return (
    <>
      <rect width="640" height="360" className="fill-muted" />
      {/* The counter and the coat */}
      <rect x="320" y="230" width="320" height="130" className="fill-card" />
      <line
        x1="380"
        y1="80"
        x2="600"
        y2="80"
        className="stroke-muted-foreground"
        strokeWidth="6"
      />
      <g className="origin-top transform-fill motion-safe:group-data-playing/anim:animate-swing">
        <path
          d="M470 80 l0 20 l-40 20 l0 100 l80 0 l0 -100 l-40 -20"
          className="fill-chart-1"
        />
        <text
          x="470"
          y="180"
          textAnchor="middle"
          className="fill-background text-sm font-bold"
        >
          {t("coat")}
        </text>
      </g>
      {/* The ticket */}
      <Person x={150} ground={360} mood="happy" />
      <g
        className="origin-center transform-fill motion-safe:group-data-playing/anim:animate-bubble-pop"
        style={{ animationDelay: "500ms" }}
      >
        <rect
          x="200"
          y="210"
          width="130"
          height="50"
          rx="6"
          className="fill-warning"
        />
        <text
          x="265"
          y="241"
          textAnchor="middle"
          className="fill-background text-xs font-bold"
        >
          {t("ticket")}
        </text>
      </g>
      <Bubble
        x={40}
        y={40}
        width={330}
        text={t("bubble")}
        tail="left"
        delay={1200}
      />
    </>
  );
}

// Swaps: a shopping robot checks three market stalls (pools) for the best price.
function ShoppingRobot() {
  const t = useTranslations("Lesson.illustration.shoppingRobot");
  const stalls = [
    { key: "price1", x: 300 },
    { key: "price2", x: 420 },
    { key: "price3", x: 540 },
  ] as const;
  return (
    <>
      <rect width="640" height="360" className="fill-muted" />
      {stalls.map((stall) => (
        <g key={stall.key}>
          <path
            d={`M${stall.x - 50} 170 l100 0 l-10 -30 l-80 0 z`}
            className="fill-bear"
          />
          <rect
            x={stall.x - 45}
            y="170"
            width="90"
            height="110"
            className="fill-card"
          />
          <rect
            x={stall.x - 30}
            y="190"
            width="60"
            height="30"
            rx="4"
            className="fill-foreground"
          />
          <text
            x={stall.x}
            y="211"
            textAnchor="middle"
            className="fill-background text-sm font-bold"
          >
            {t(stall.key)}
          </text>
        </g>
      ))}
      {/* The robot with its cart */}
      <g className="motion-safe:group-data-playing/anim:animate-sweep">
        <rect
          x="70"
          y="220"
          width="70"
          height="70"
          rx="10"
          className="fill-chart-1"
        />
        <rect
          x="80"
          y="180"
          width="50"
          height="40"
          rx="8"
          className="fill-chart-1"
        />
        <circle cx="96" cy="198" r="5" className="fill-background" />
        <circle cx="114" cy="198" r="5" className="fill-background" />
        <line
          x1="105"
          y1="180"
          x2="105"
          y2="164"
          className="stroke-chart-1"
          strokeWidth="4"
        />
        <circle cx="105" cy="160" r="6" className="fill-warning" />
        <rect
          x="140"
          y="250"
          width="60"
          height="36"
          rx="4"
          className="fill-none stroke-foreground"
          strokeWidth="4"
        />
        <circle cx="150" cy="300" r="8" className="fill-foreground" />
        <circle cx="190" cy="300" r="8" className="fill-foreground" />
      </g>
      <rect x="0" y="310" width="640" height="50" className="fill-card" />
      <Bubble
        x={40}
        y={40}
        width={300}
        text={t("bubble")}
        tail="left"
        delay={1200}
      />
    </>
  );
}

// Memecoins: a rocket factory – a row of rockets wobbles and fizzles, one jumps up and down.
function RocketFactory() {
  const t = useTranslations("Lesson.illustration.rocketFactory");
  // One rocket of six jumps; the rest only wobble.
  const rockets = [260, 320, 380, 440, 500, 560].map((x) => ({
    x,
    fill: x === 440 ? "fill-bull" : "fill-muted-foreground",
    motion:
      x === 440
        ? "motion-safe:group-data-playing/anim:animate-bounce-ball"
        : "motion-safe:group-data-playing/anim:animate-wiggle",
  }));
  return (
    <>
      <rect width="640" height="360" className="fill-muted" />
      <rect x="0" y="300" width="640" height="60" className="fill-card" />
      {rockets.map(({ x, fill, motion }, index) => (
        <g
          key={x}
          className={cn("origin-bottom transform-fill", motion)}
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <path
            d={`M${x} 200 q14 20 14 60 l0 40 l-28 0 l0 -40 q0 -40 14 -60 z`}
            className={fill}
          />
          <path
            d={`M${x - 14} 290 l-10 10 l10 0 z M${x + 14} 290 l10 10 l-10 0 z`}
            className="fill-bear"
          />
          <circle cx={x} cy="245" r="6" className="fill-background" />
        </g>
      ))}
      <rect
        x="250"
        y="80"
        width="140"
        height="40"
        rx="6"
        className="fill-foreground"
      />
      <text
        x="320"
        y="106"
        textAnchor="middle"
        className="fill-background text-sm font-bold"
      >
        {t("sign")}
      </text>
      <Person x={110} ground={300} mood="happy" />
      <Bubble
        x={20}
        y={20}
        width={220}
        text={t("bubble")}
        tail="left"
        delay={1200}
      />
    </>
  );
}

// Checking a token: a detective with a magnifying glass goes through the checklist.
function TokenDetective() {
  const t = useTranslations("Lesson.illustration.tokenDetective");
  const items = ["mint", "freeze", "holders", "liquidity"] as const;
  return (
    <>
      <rect width="640" height="360" className="fill-muted" />
      <rect
        x="330"
        y="70"
        width="260"
        height="250"
        rx="10"
        className="fill-foreground"
      />
      {items.map((item, index) => (
        <g key={item}>
          <text
            x="360"
            y={124 + index * 52}
            className="fill-background text-base font-semibold"
          >
            {t(item)}
          </text>
          <path
            d={`M545 ${112 + index * 52} l8 10 l16 -18`}
            className="fill-none stroke-bull motion-safe:group-data-playing/anim:animate-drop-in"
            strokeWidth="5"
            strokeLinecap="round"
            style={{ animationDelay: `${400 + index * 300}ms` }}
          />
        </g>
      ))}
      <Person x={150} ground={360} mood="happy" />
      {/* The detective's hat */}
      <path
        d="M100 236 l100 0 l-15 -10 l0 -26 l-70 0 l0 26 z"
        className="fill-chart-3"
      />
      {/* The magnifying glass */}
      <g className="motion-safe:group-data-playing/anim:animate-scan">
        <circle
          cx="300"
          cy="140"
          r="36"
          className="fill-chart-1 stroke-foreground opacity-30"
          strokeWidth="6"
        />
        <line
          x1="274"
          y1="166"
          x2="236"
          y2="210"
          className="stroke-foreground"
          strokeWidth="10"
          strokeLinecap="round"
        />
      </g>
      <Bubble
        x={20}
        y={30}
        width={290}
        text={t("bubble")}
        tail="left"
        delay={1500}
      />
    </>
  );
}

// SOL price history: a rollercoaster with the real peaks and troughs as station signs.
function Rollercoaster() {
  const t = useTranslations("Lesson.illustration.rollercoaster");
  const signs = [
    { key: "peak1", x: 150, y: 80 },
    { key: "low1", x: 270, y: 300 },
    { key: "peak2", x: 410, y: 145 },
    { key: "low2", x: 540, y: 270 },
  ] as const;
  return (
    <>
      <rect width="640" height="360" className="fill-muted" />
      <path
        d="M0 300 C80 300 100 110 150 110 C210 110 220 290 270 290 C330 290 350 90 410 90 C470 90 490 250 540 250 C580 250 600 200 640 190"
        className="fill-none stroke-foreground"
        strokeWidth="6"
      />
      {signs.map((sign) => (
        <g key={sign.key}>
          <rect
            x={sign.x - 40}
            y={sign.y - 22}
            width="80"
            height="30"
            rx="6"
            className="fill-card stroke-border"
            strokeWidth="2"
          />
          <text
            x={sign.x}
            y={sign.y - 2}
            textAnchor="middle"
            className="fill-foreground text-sm font-bold"
          >
            {t(sign.key)}
          </text>
        </g>
      ))}
      {/* The cart at the top */}
      <g className="motion-safe:group-data-playing/anim:animate-bob">
        <rect
          x="380"
          y="56"
          width="60"
          height="28"
          rx="8"
          className="fill-chart-5"
        />
        <circle cx="396" cy="46" r="10" className="fill-foreground" />
        <circle cx="424" cy="46" r="10" className="fill-foreground" />
        <path
          d="M388 36 l-6 -14 M432 36 l6 -14"
          className="stroke-foreground"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </g>
      <Bubble
        x={30}
        y={150}
        width={220}
        text={t("bubble")}
        tail="right"
        delay={1100}
      />
    </>
  );
}

// SOL versus BTC: Bitcoin walks a dog called SOL – it runs ahead and lags behind, but on a leash.
function DogOnLeash() {
  const t = useTranslations("Lesson.illustration.dogOnLeash");
  return (
    <>
      <rect width="640" height="360" className="fill-muted" />
      <rect x="0" y="320" width="640" height="40" className="fill-card" />
      <Person x={150} ground={320} mood="happy" />
      <text
        x="150"
        y="300"
        textAnchor="middle"
        className="fill-background text-sm font-bold"
      >
        {t("owner")}
      </text>
      <g className="motion-safe:group-data-playing/anim:animate-sweep">
        <path
          d="M190 260 Q300 200 380 270"
          className="fill-none stroke-muted-foreground"
          strokeWidth="3"
        />
        <g className="motion-safe:group-data-playing/anim:animate-bob">
          <ellipse cx="420" cy="285" rx="50" ry="22" className="fill-chart-5" />
          <circle cx="470" cy="262" r="20" className="fill-chart-5" />
          <ellipse cx="458" cy="262" rx="7" ry="14" className="fill-chart-3" />
          <circle cx="476" cy="258" r="3" className="fill-background" />
          <path
            d="M372 280 l-20 -14"
            className="stroke-chart-5"
            strokeWidth="6"
            strokeLinecap="round"
          />
          <rect
            x="390"
            y="300"
            width="8"
            height="20"
            className="fill-chart-5"
          />
          <rect
            x="440"
            y="300"
            width="8"
            height="20"
            className="fill-chart-5"
          />
          <text
            x="418"
            y="291"
            textAnchor="middle"
            className="fill-background text-xs font-bold"
          >
            {t("dog")}
          </text>
        </g>
      </g>
      <Bubble
        x={40}
        y={40}
        width={280}
        text={t("bubble")}
        tail="left"
        delay={1200}
      />
    </>
  );
}

// Summary: a hiker on the Solana summit with the ten rules in a backpack, confetti around.
function SolanaSummit() {
  const t = useTranslations("Lesson.illustration.solanaSummit");
  return (
    <>
      <rect width="640" height="360" className="fill-muted" />
      <path d="M40 360 L320 120 L600 360 z" className="fill-card" />
      <path
        d="M270 163 L320 120 L370 163 L345 150 L320 165 L295 150 z"
        className="fill-foreground"
      />
      <rect
        x="380"
        y="70"
        width="6"
        height="90"
        className="fill-muted-foreground"
      />
      <path d="M386 72 l96 18 l-96 18 z" className="fill-chart-5" />
      <text x="408" y="96" className="fill-background text-xs font-bold">
        {t("flag")}
      </text>
      <g className="motion-safe:group-data-playing/anim:animate-bob">
        <Person x={320} ground={150} mood="happy" />
        <rect
          x="358"
          y="84"
          width="30"
          height="46"
          rx="6"
          className="fill-warning"
        />
      </g>
      {(
        [
          { x: 180, y: 80, fill: "fill-warning" },
          { x: 240, y: 50, fill: "fill-chart-1" },
          { x: 460, y: 140, fill: "fill-bull" },
          { x: 520, y: 90, fill: "fill-chart-5" },
        ] as const
      ).map(({ x, y, fill }, index) => (
        <rect
          key={x}
          x={x}
          y={y}
          width="12"
          height="12"
          className={cn(
            fill,
            "motion-safe:group-data-playing/anim:animate-confetti",
          )}
          style={{ animationDelay: `${index * 150}ms` }}
        />
      ))}
      <Bubble
        x={40}
        y={200}
        width={240}
        text={t("bubble")}
        tail="right"
        delay={1300}
      />
    </>
  );
}

export const SOLANA_ILLUSTRATIONS = {
  speedRace: SpeedRace,
  metronomeChoir: MetronomeChoir,
  pitStop: PitStop,
  bathtubSupply: BathtubSupply,
  tokenMailboxes: TokenMailboxes,
  tollBooth: TollBooth,
  twoKeys: TwoKeys,
  blankCheque: BlankCheque,
  stakeCalendar: StakeCalendar,
  coatCheck: CoatCheck,
  shoppingRobot: ShoppingRobot,
  rocketFactory: RocketFactory,
  tokenDetective: TokenDetective,
  rollercoaster: Rollercoaster,
  dogOnLeash: DogOnLeash,
  solanaSummit: SolanaSummit,
} as const;
