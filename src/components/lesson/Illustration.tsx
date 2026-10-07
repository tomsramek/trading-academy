import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";

import { AnimateOnView } from "./AnimateOnView";

/*
 * Fun illustrations for lessons, drawn in code: <Illustration name="midnightEdit" />
 * Colors come from the design tokens. Illustrations always use the dark theme (the `dark` class on
 * the <svg> switches the tokens inside it), matching the dark-first look of lesson images.
 * A new illustration = a new entry in ILLUSTRATIONS + texts in messages (Lesson.illustration.<name>).
 */

// George secretly "improves" his notebook at night; a chicken at the window cannot believe it.
function MidnightEdit() {
  const t = useTranslations("Lesson.illustration.midnightEdit");
  return (
    <>
      {/* Night sky with stars and the moon */}
      <rect width="640" height="360" className="fill-muted" />
      {[
        [40, 40],
        [120, 70],
        [210, 30],
        [330, 55],
        [420, 25],
        [600, 150],
        [500, 120],
      ].map(([x = 0, y = 0]) => (
        <circle
          key={`${x}-${y}`}
          cx={x}
          cy={y}
          r="1.8"
          className="fill-foreground opacity-50"
        />
      ))}
      <circle cx="565" cy="70" r="32" className="fill-warning" />
      <circle cx="580" cy="60" r="28" className="fill-muted" />

      {/* Window frame with the chicken peeking in */}
      <rect
        x="40"
        y="110"
        width="170"
        height="150"
        rx="8"
        className="fill-background stroke-border"
        strokeWidth="6"
      />
      <line
        x1="125"
        y1="110"
        x2="125"
        y2="260"
        className="stroke-border"
        strokeWidth="6"
      />
      <g className="motion-safe:group-data-playing/anim:animate-peek">
        <ellipse
          cx="110"
          cy="240"
          rx="44"
          ry="30"
          className="fill-foreground"
        />
        <circle cx="140" cy="200" r="22" className="fill-foreground" />
        <path
          d="M128 180 q4 -14 10 -2 q4 -14 10 0 q6 -10 8 4"
          className="fill-bear"
        />
        <path d="M161 200 l14 5 l-14 5 z" className="fill-warning" />
        <circle cx="146" cy="196" r="3.5" className="fill-background" />
        <path
          d="M88 232 q22 22 42 -4"
          className="fill-none stroke-background"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </g>

      {/* Speech bubble */}
      <g
        className="origin-center transform-fill motion-safe:group-data-playing/anim:animate-bubble-pop"
        style={{ animationDelay: "700ms" }}
      >
        <rect
          x="160"
          y="78"
          width="150"
          height="46"
          rx="23"
          className="fill-card stroke-border"
          strokeWidth="2"
        />
        <path d="M182 122 l-14 22 l28 -22 z" className="fill-card" />
        <text
          x="235"
          y="108"
          textAnchor="middle"
          className="fill-foreground text-xl font-semibold"
        >
          {t("bubble")}
        </text>
      </g>

      {/* Candle on the desk – a little nod to candlestick charts */}
      <circle cx="505" cy="215" r="55" className="fill-warning opacity-15" />
      <ellipse
        cx="505"
        cy="212"
        rx="7"
        ry="13"
        className="origin-bottom fill-warning transform-fill motion-safe:group-data-playing/anim:animate-flame-flicker"
      />
      <rect
        x="496"
        y="225"
        width="18"
        height="60"
        rx="3"
        className="fill-card"
      />

      {/* George behind the desk, looking around a bit too carefully */}
      <path
        d="M270 285 q0 -80 75 -80 q75 0 75 80 z"
        className="fill-foreground"
      />
      <circle cx="345" cy="160" r="40" className="fill-foreground" />
      <ellipse cx="333" cy="156" rx="9" ry="7" className="fill-background" />
      <ellipse cx="362" cy="156" rx="9" ry="7" className="fill-background" />
      <circle cx="328" cy="157" r="3.5" className="fill-foreground" />
      <circle cx="357" cy="157" r="3.5" className="fill-foreground" />
      <path
        d="M330 180 q15 10 30 0"
        className="fill-none stroke-background"
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* Desk and the open notebook with the forged entry */}
      <rect x="0" y="285" width="640" height="75" className="fill-card" />
      <rect
        x="285"
        y="262"
        width="85"
        height="40"
        rx="3"
        className="fill-card stroke-border"
        strokeWidth="2"
      />
      <rect
        x="370"
        y="262"
        width="85"
        height="40"
        rx="3"
        className="fill-card stroke-border"
        strokeWidth="2"
      />
      <rect
        x="295"
        y="272"
        width="60"
        height="3"
        className="fill-muted-foreground"
      />
      <rect
        x="295"
        y="282"
        width="45"
        height="3"
        className="fill-muted-foreground"
      />
      <rect
        x="295"
        y="292"
        width="55"
        height="3"
        className="fill-muted-foreground"
      />
      <text
        x="412"
        y="292"
        textAnchor="middle"
        className="fill-destructive text-lg font-bold"
      >
        20
      </text>
      {/* Hand with a pencil */}
      <g className="origin-top-left transform-fill motion-safe:group-data-playing/anim:animate-scribble">
        <line
          x1="400"
          y1="235"
          x2="440"
          y2="270"
          className="stroke-foreground"
          strokeWidth="12"
          strokeLinecap="round"
        />
        <line
          x1="440"
          y1="270"
          x2="452"
          y2="250"
          className="stroke-warning"
          strokeWidth="5"
          strokeLinecap="round"
        />
      </g>
    </>
  );
}

// Digital money copied like a file: a copy machine spitting out banknotes.
function CopyMachine() {
  const t = useTranslations("Lesson.illustration.copyMachine");
  const notes = [
    { x: 430, y: 150, r: -18 },
    { x: 470, y: 205, r: 12 },
    { x: 520, y: 140, r: 28 },
    { x: 545, y: 230, r: -8 },
    { x: 455, y: 265, r: 20 },
  ];
  return (
    <>
      <rect width="640" height="360" className="fill-muted" />
      <rect x="0" y="300" width="640" height="60" className="fill-card" />

      {/* Copy machine with a glowing scan light and the original banknote on top */}
      <rect
        x="250"
        y="150"
        width="170"
        height="150"
        rx="10"
        className="fill-background stroke-muted-foreground"
        strokeWidth="3"
      />
      <rect
        x="240"
        y="130"
        width="190"
        height="24"
        rx="6"
        className="fill-muted-foreground"
      />
      <g transform="rotate(-4 335 122)">
        <rect
          x="303"
          y="106"
          width="64"
          height="30"
          rx="4"
          className="fill-bull"
        />
        <text
          x="335"
          y="127"
          textAnchor="middle"
          className="fill-background text-sm font-bold"
        >
          100
        </text>
      </g>
      <rect
        x="262"
        y="172"
        width="146"
        height="8"
        rx="4"
        className="fill-primary motion-safe:group-data-playing/anim:animate-scan"
      />
      <rect
        x="270"
        y="205"
        width="90"
        height="10"
        rx="3"
        className="fill-muted-foreground opacity-50"
      />
      <circle cx="392" cy="210" r="8" className="fill-bull" />
      <rect
        x="418"
        y="232"
        width="44"
        height="12"
        rx="3"
        className="fill-muted-foreground"
      />

      {/* Banknotes flying out */}
      {notes.map(({ x, y, r }, index) => (
        <g key={`${x}-${y}`} transform={`rotate(${r} ${x} ${y})`}>
          <g
            className="origin-center transform-fill motion-safe:group-data-playing/anim:animate-note-out"
            style={{ animationDelay: `${index * 250}ms` }}
          >
            <rect
              x={x - 32}
              y={y - 17}
              width="64"
              height="34"
              rx="4"
              className="fill-bull"
            />
            <rect
              x={x - 26}
              y={y - 11}
              width="52"
              height="22"
              rx="3"
              className="fill-none stroke-background opacity-60"
              strokeWidth="2"
            />
            <text
              x={x}
              y={y + 6}
              textAnchor="middle"
              className="fill-background text-base font-bold"
            >
              100
            </text>
          </g>
        </g>
      ))}

      {/* Happy person pressing the button, arms up */}
      <path
        d="M90 300 q0 -75 65 -75 q65 0 65 75 z"
        className="fill-foreground"
      />
      <circle cx="155" cy="185" r="36" className="fill-foreground" />
      <path
        d="M138 178 q6 -6 12 0 M162 178 q6 -6 12 0"
        className="fill-none stroke-background"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path d="M138 196 q17 16 34 0" className="fill-background" />
      <line
        x1="200"
        y1="245"
        x2="262"
        y2="210"
        className="stroke-foreground"
        strokeWidth="12"
        strokeLinecap="round"
      />
      <line
        x1="110"
        y1="245"
        x2="80"
        y2="190"
        className="stroke-foreground"
        strokeWidth="12"
        strokeLinecap="round"
      />

      {/* Speech bubble */}
      <g
        className="origin-center transform-fill motion-safe:group-data-playing/anim:animate-bubble-pop"
        style={{ animationDelay: "1300ms" }}
      >
        <rect
          x="40"
          y="60"
          width="200"
          height="48"
          rx="24"
          className="fill-card stroke-border"
          strokeWidth="2"
        />
        <path d="M150 106 l-6 24 l26 -24 z" className="fill-card" />
        <text
          x="140"
          y="91"
          textAnchor="middle"
          className="fill-foreground text-lg font-semibold"
        >
          {t("bubble")}
        </text>
      </g>
    </>
  );
}

// Mining as a race: sweating computers guessing numbers while the electricity meter spins.
function MiningRace() {
  const t = useTranslations("Lesson.illustration.miningRace");
  const computers = [130, 300, 470];
  return (
    <>
      <rect width="640" height="360" className="fill-muted" />
      <rect x="0" y="300" width="640" height="60" className="fill-card" />

      {computers.map((x, index) => (
        <g key={x}>
          {/* Monitor with a guessed number, stand and keyboard */}
          <rect
            x={x - 60}
            y="170"
            width="120"
            height="85"
            rx="8"
            className="fill-background stroke-muted-foreground"
            strokeWidth="3"
          />
          <text
            x={x}
            y="222"
            textAnchor="middle"
            className="fill-bull font-mono text-lg font-bold motion-safe:group-data-playing/anim:animate-screen-flicker"
            style={{ animationDelay: `${index * 150}ms` }}
          >
            {["7f3a…", "00c1…", "b92e…"][index]}
          </text>
          <rect
            x={x - 8}
            y="255"
            width="16"
            height="25"
            className="fill-muted-foreground"
          />
          <rect
            x={x - 45}
            y="280"
            width="90"
            height="12"
            rx="4"
            className="fill-muted-foreground"
          />
          {/* Strained face: squeezed eyes and a wavy mouth */}
          <path
            d={`M${x - 26} 190 l10 5 l-10 5 M${x + 26} 190 l-10 5 l10 5`}
            className="fill-none stroke-foreground"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d={`M${x - 16} 240 q4 -5 8 0 q4 5 8 0 q4 -5 8 0 q4 5 8 0`}
            className="fill-none stroke-foreground"
            strokeWidth="3"
            strokeLinecap="round"
          />
          {/* Sweat drops */}
          <path
            d={`M${x + 66} 175 q6 10 0 14 q-6 -4 0 -14 z`}
            className="fill-primary motion-safe:group-data-playing/anim:animate-sweat-drop"
            style={{ animationDelay: `${index * 200}ms` }}
          />
          <path
            d={`M${x + 76} 195 q5 8 0 11 q-5 -3 0 -11 z`}
            className="fill-primary opacity-70 motion-safe:group-data-playing/anim:animate-sweat-drop"
            style={{ animationDelay: `${index * 200 + 500}ms` }}
          />
        </g>
      ))}

      {/* Electricity meter spinning wildly */}
      <circle
        cx="575"
        cy="80"
        r="40"
        className="fill-background stroke-warning"
        strokeWidth="4"
      />
      <line
        x1="575"
        y1="80"
        x2="600"
        y2="58"
        className="origin-[575px_80px] stroke-warning motion-safe:group-data-playing/anim:animate-meter-spin"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M540 60 a40 40 0 0 1 20 -18"
        className="fill-none stroke-warning opacity-60"
        strokeWidth="3"
      />
      <path
        d="M612 98 a40 40 0 0 1 -18 18"
        className="fill-none stroke-warning opacity-60"
        strokeWidth="3"
      />
      <text
        x="575"
        y="104"
        textAnchor="middle"
        className="fill-warning text-sm font-bold"
      >
        kWh
      </text>

      {/* Speech bubble from the middle computer */}
      <g className="origin-[315px_86px] motion-safe:group-data-playing/anim:animate-bubble-pop">
        <rect
          x="215"
          y="62"
          width="200"
          height="48"
          rx="24"
          className="fill-card stroke-border"
          strokeWidth="2"
        />
        <path d="M300 108 l4 24 l18 -24 z" className="fill-card" />
        <text
          x="315"
          y="93"
          textAnchor="middle"
          className="fill-foreground text-lg font-semibold"
        >
          {t("bubble")}
        </text>
      </g>
    </>
  );
}

// Bitcoin Pizza Day (22 May 2010): two pizzas for 10,000 BTC.
function PizzaDay() {
  const t = useTranslations("Lesson.illustration.pizzaDay");
  const pepperoni = [
    [-18, -12],
    [14, -16],
    [0, 4],
    [-14, 16],
    [18, 12],
  ];
  return (
    <>
      <rect width="640" height="360" className="fill-muted" />
      <rect x="0" y="290" width="640" height="70" className="fill-card" />

      {/* Two pizzas on an open box */}
      <rect
        x="300"
        y="230"
        width="300"
        height="70"
        rx="6"
        className="fill-muted-foreground opacity-60"
      />
      {[370, 530].map((cx, index) => (
        <g
          key={cx}
          className="origin-center transform-fill motion-safe:group-data-playing/anim:animate-bubble-pop"
          style={{ animationDelay: `${index * 250}ms` }}
        >
          <circle cx={cx} cy="240" r="62" className="fill-warning opacity-70" />
          <circle cx={cx} cy="240" r="52" className="fill-warning" />
          {pepperoni.map(([dx = 0, dy = 0]) => (
            <circle
              key={`${dx}-${dy}`}
              cx={cx + dx}
              cy={240 + dy}
              r="9"
              className="fill-bear"
            />
          ))}
        </g>
      ))}

      {/* Price tag */}
      <g transform="rotate(-8 450 120)">
        <g
          className="origin-left transform-fill motion-safe:group-data-playing/anim:animate-swing"
          style={{ animationDelay: "600ms" }}
        >
          <rect
            x="360"
            y="95"
            width="180"
            height="50"
            rx="8"
            className="fill-background stroke-warning"
            strokeWidth="3"
          />
          <circle cx="378" cy="120" r="6" className="fill-warning" />
          <text
            x="460"
            y="128"
            textAnchor="middle"
            className="fill-warning font-mono text-xl font-bold"
          >
            {t("tag")}
          </text>
        </g>
      </g>

      {/* Happy, hungry person */}
      <path
        d="M90 300 q0 -75 65 -75 q65 0 65 75 z"
        className="fill-foreground"
      />
      <circle cx="155" cy="185" r="36" className="fill-foreground" />
      <circle cx="142" cy="180" r="4" className="fill-background" />
      <circle cx="168" cy="180" r="4" className="fill-background" />
      <path d="M138 196 q17 16 34 0" className="fill-background" />
      <line
        x1="205"
        y1="250"
        x2="300"
        y2="262"
        className="stroke-foreground"
        strokeWidth="12"
        strokeLinecap="round"
      />

      {/* Speech bubble */}
      <g
        className="origin-center transform-fill motion-safe:group-data-playing/anim:animate-bubble-pop"
        style={{ animationDelay: "1200ms" }}
      >
        <rect
          x="40"
          y="60"
          width="200"
          height="48"
          rx="24"
          className="fill-card stroke-border"
          strokeWidth="2"
        />
        <path d="M150 106 l-6 24 l26 -24 z" className="fill-card" />
        <text
          x="140"
          y="91"
          textAnchor="middle"
          className="fill-foreground text-lg font-semibold"
        >
          {t("bubble")}
        </text>
      </g>
    </>
  );
}

// A smart contract as a vending machine: coin in, snack out, no shop assistant.
function VendingMachine() {
  const t = useTranslations("Lesson.illustration.vendingMachine");
  const snacks = ["fill-bull", "fill-primary", "fill-warning", "fill-bear"];
  return (
    <>
      <rect width="640" height="360" className="fill-muted" />
      <rect x="0" y="310" width="640" height="50" className="fill-card" />

      {/* The machine */}
      <rect
        x="330"
        y="40"
        width="210"
        height="270"
        rx="12"
        className="fill-background stroke-muted-foreground"
        strokeWidth="3"
      />
      <rect
        x="348"
        y="60"
        width="130"
        height="170"
        rx="6"
        className="fill-card"
      />
      {[0, 1, 2].map((row) =>
        snacks.map((fill, col) => (
          <rect
            key={`${row}-${col}`}
            x={358 + col * 29}
            y={74 + row * 52}
            width="20"
            height="34"
            rx="4"
            className={fill}
          />
        )),
      )}
      {/* Coin slot with a coin going in, and the code of the contract */}
      <rect
        x="495"
        y="80"
        width="30"
        height="10"
        rx="3"
        className="fill-muted-foreground"
      />
      <circle
        cx="510"
        cy="62"
        r="12"
        className="fill-warning motion-safe:group-data-playing/anim:animate-coin-insert"
      />
      <text
        x="435"
        y="262"
        textAnchor="middle"
        className="fill-bull font-mono text-sm font-bold"
      >
        {t("tag")}
      </text>
      <rect
        x="360"
        y="275"
        width="150"
        height="22"
        rx="4"
        className="fill-card"
      />
      <rect
        x="405"
        y="280"
        width="20"
        height="14"
        rx="3"
        className="fill-warning motion-safe:group-data-playing/anim:animate-drop-in"
        style={{ animationDelay: "900ms" }}
      />

      {/* Surprised customer */}
      <path
        d="M120 310 q0 -75 65 -75 q65 0 65 75 z"
        className="fill-foreground"
      />
      <circle cx="185" cy="195" r="36" className="fill-foreground" />
      <circle cx="172" cy="188" r="5" className="fill-background" />
      <circle cx="198" cy="188" r="5" className="fill-background" />
      <ellipse cx="185" cy="210" rx="7" ry="9" className="fill-background" />
      <line
        x1="235"
        y1="262"
        x2="330"
        y2="285"
        className="stroke-foreground"
        strokeWidth="12"
        strokeLinecap="round"
      />

      {/* Speech bubble */}
      <g
        className="origin-center transform-fill motion-safe:group-data-playing/anim:animate-bubble-pop"
        style={{ animationDelay: "1500ms" }}
      >
        <rect
          x="40"
          y="70"
          width="230"
          height="48"
          rx="24"
          className="fill-card stroke-border"
          strokeWidth="2"
        />
        <path d="M170 116 l-6 24 l26 -24 z" className="fill-card" />
        <text
          x="155"
          y="101"
          textAnchor="middle"
          className="fill-foreground text-lg font-semibold"
        >
          {t("bubble")}
        </text>
      </g>
    </>
  );
}

// Memecoins as a slot machine: a Shiba Inu pulls the lever, hoping for ×100.
function MemeSlot() {
  const t = useTranslations("Lesson.illustration.memeSlot");
  const reels = [
    { x: 345, text: "×100", fill: "fill-bull" },
    { x: 415, text: "×100", fill: "fill-bull" },
    { x: 485, text: "−99 %", fill: "fill-bear" },
  ];
  return (
    <>
      <rect width="640" height="360" className="fill-muted" />
      <rect x="0" y="310" width="640" height="50" className="fill-card" />

      {/* Slot machine */}
      <rect
        x="300"
        y="70"
        width="230"
        height="240"
        rx="14"
        className="fill-background stroke-muted-foreground"
        strokeWidth="3"
      />
      <rect
        x="320"
        y="40"
        width="190"
        height="40"
        rx="10"
        className="fill-warning"
      />
      <text
        x="415"
        y="67"
        textAnchor="middle"
        className="fill-background text-lg font-bold"
      >
        {t("tag")}
      </text>
      {reels.map(({ x, text, fill }, index) => (
        <g key={x}>
          <rect
            x={x - 30}
            y="110"
            width="60"
            height="80"
            rx="6"
            className="fill-card"
          />
          <text
            x={x}
            y="157"
            textAnchor="middle"
            className={cn(
              fill,
              "font-mono text-base font-bold motion-safe:group-data-playing/anim:animate-reel-spin",
            )}
            style={{ animationDelay: `${600 + index * 350}ms` }}
          >
            {text}
          </text>
        </g>
      ))}
      <rect
        x="330"
        y="225"
        width="170"
        height="16"
        rx="4"
        className="fill-card"
      />
      {[350, 372, 394, 470, 455].map((cx, index) => (
        <circle
          key={cx}
          cx={cx}
          cy={292 - (index % 2) * 8}
          r="10"
          className="fill-warning"
        />
      ))}
      {/* Lever */}
      <g className="origin-bottom-left transform-fill motion-safe:group-data-playing/anim:animate-lever-pull">
        <line
          x1="530"
          y1="150"
          x2="575"
          y2="110"
          className="stroke-muted-foreground"
          strokeWidth="8"
          strokeLinecap="round"
        />
        <circle cx="578" cy="105" r="14" className="fill-bear" />
      </g>

      {/* Shiba Inu */}
      <path d="M95 310 q0 -80 75 -80 q75 0 75 80 z" className="fill-warning" />
      <path d="M118 150 l10 -45 l30 30 z" className="fill-warning" />
      <path d="M222 150 l-10 -45 l-30 30 z" className="fill-warning" />
      <circle cx="170" cy="175" r="52" className="fill-warning" />
      <ellipse cx="170" cy="198" rx="32" ry="24" className="fill-foreground" />
      <circle cx="150" cy="165" r="6" className="fill-background" />
      <circle cx="190" cy="165" r="6" className="fill-background" />
      <ellipse cx="170" cy="188" rx="8" ry="6" className="fill-background" />
      <path
        d="M158 204 q12 10 24 0"
        className="fill-none stroke-background"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <line
        x1="230"
        y1="260"
        x2="300"
        y2="230"
        className="stroke-warning"
        strokeWidth="14"
        strokeLinecap="round"
      />

      {/* Speech bubble */}
      <g
        className="origin-center transform-fill motion-safe:group-data-playing/anim:animate-bubble-pop"
        style={{ animationDelay: "2200ms" }}
      >
        <rect
          x="30"
          y="40"
          width="250"
          height="48"
          rx="24"
          className="fill-card stroke-border"
          strokeWidth="2"
        />
        <path d="M150 86 l-4 24 l24 -24 z" className="fill-card" />
        <text
          x="155"
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

// Transaction fees as a bus auction: the bus leaves every 10 minutes, the highest bids board first.
function FeeBus() {
  const t = useTranslations("Lesson.illustration.feeBus");
  return (
    <>
      <rect width="640" height="360" className="fill-muted" />
      <rect x="0" y="300" width="640" height="60" className="fill-card" />

      {/* Bus with full windows */}
      <g className="motion-safe:group-data-playing/anim:animate-drive-in">
        <rect
          x="250"
          y="120"
          width="340"
          height="150"
          rx="20"
          className="fill-primary"
        />
        {[275, 345, 415, 485].map((x) => (
          <g key={x}>
            <rect
              x={x}
              y="140"
              width="55"
              height="50"
              rx="6"
              className="fill-card"
            />
            <circle cx={x + 27} cy="165" r="12" className="fill-foreground" />
          </g>
        ))}
        <rect
          x="555"
          y="140"
          width="25"
          height="110"
          rx="4"
          className="fill-card"
        />
        <rect
          x="380"
          y="98"
          width="110"
          height="26"
          rx="6"
          className="fill-background"
        />
        <text
          x="435"
          y="117"
          textAnchor="middle"
          className="fill-warning font-mono text-base font-bold"
        >
          {t("tag")}
        </text>
        <circle
          cx="320"
          cy="275"
          r="24"
          className="fill-background stroke-muted-foreground"
          strokeWidth="4"
        />
        <circle
          cx="530"
          cy="275"
          r="24"
          className="fill-background stroke-muted-foreground"
          strokeWidth="4"
        />
      </g>

      {/* Passenger waving banknotes at the door */}
      <path
        d="M540 300 q0 -50 40 -50 q40 0 40 50 z"
        className="fill-foreground"
      />
      <circle cx="580" cy="225" r="22" className="fill-foreground" />
      <g transform="rotate(-20 600 180)">
        <rect
          x="585"
          y="165"
          width="44"
          height="24"
          rx="3"
          className="origin-center fill-bull transform-fill motion-safe:group-data-playing/anim:animate-wiggle"
          style={{ animationDelay: "1400ms" }}
        />
      </g>
      <g transform="rotate(10 560 170)">
        <rect
          x="540"
          y="160"
          width="44"
          height="24"
          rx="3"
          className="origin-center fill-bull transform-fill motion-safe:group-data-playing/anim:animate-wiggle"
          style={{ animationDelay: "1500ms" }}
        />
      </g>

      {/* Bus stop and the patient person with one coin */}
      <line
        x1="75"
        y1="300"
        x2="75"
        y2="120"
        className="stroke-muted-foreground"
        strokeWidth="6"
      />
      <circle cx="75" cy="115" r="24" className="fill-warning" />
      <path
        d="M120 300 q0 -60 50 -60 q50 0 50 60 z"
        className="fill-foreground"
      />
      <circle cx="170" cy="210" r="28" className="fill-foreground" />
      <path
        d="M155 205 h10 M175 205 h10"
        className="stroke-background"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M160 222 h20"
        className="stroke-background"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle cx="215" cy="265" r="9" className="fill-warning" />

      {/* Speech bubble */}
      <g
        className="origin-center transform-fill motion-safe:group-data-playing/anim:animate-bubble-pop"
        style={{ animationDelay: "1600ms" }}
      >
        <rect
          x="40"
          y="40"
          width="190"
          height="48"
          rx="24"
          className="fill-card stroke-border"
          strokeWidth="2"
        />
        <path d="M150 86 l4 24 l18 -24 z" className="fill-card" />
        <text
          x="135"
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

// An exchange as a market: a buyer and a seller shout their prices, the exchange keeps a small fee.
function MarketShout() {
  const t = useTranslations("Lesson.illustration.marketShout");
  return (
    <>
      <rect width="640" height="360" className="fill-muted" />
      <rect x="0" y="300" width="640" height="60" className="fill-card" />

      {/* The exchange booth in the middle with a fee jar */}
      <rect
        x="250"
        y="150"
        width="140"
        height="150"
        rx="8"
        className="fill-background stroke-muted-foreground"
        strokeWidth="3"
      />
      <rect
        x="240"
        y="120"
        width="160"
        height="34"
        rx="6"
        className="fill-primary"
      />
      <text
        x="320"
        y="144"
        textAnchor="middle"
        className="fill-background text-lg font-bold"
      >
        {t("tag")}
      </text>
      <rect
        x="295"
        y="235"
        width="50"
        height="60"
        rx="8"
        className="fill-card stroke-muted-foreground"
        strokeWidth="2"
      />
      <circle
        cx="320"
        cy="225"
        r="10"
        className="fill-warning motion-safe:group-data-playing/anim:animate-coin-insert"
        style={{ animationDelay: "1300ms" }}
      />

      {/* Buyer (left) and seller (right) */}
      <path
        d="M55 300 q0 -75 65 -75 q65 0 65 75 z"
        className="fill-foreground"
      />
      <circle cx="120" cy="185" r="36" className="fill-foreground" />
      <path
        d="M104 182 q8 12 16 0 M128 182 q8 12 16 0"
        className="fill-none stroke-background"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <ellipse cx="124" cy="203" rx="9" ry="7" className="fill-background" />

      <path
        d="M455 300 q0 -75 65 -75 q65 0 65 75 z"
        className="fill-foreground"
      />
      <circle cx="520" cy="185" r="36" className="fill-foreground" />
      <circle cx="508" cy="180" r="4" className="fill-background" />
      <circle cx="532" cy="180" r="4" className="fill-background" />
      <ellipse cx="520" cy="203" rx="9" ry="7" className="fill-background" />

      <g
        className="origin-center transform-fill motion-safe:group-data-playing/anim:animate-bubble-pop"
        style={{ animationDelay: "200ms" }}
      >
        <rect
          x="20"
          y="40"
          width="230"
          height="48"
          rx="24"
          className="fill-card stroke-border"
          strokeWidth="2"
        />
        <path d="M120 86 l0 24 l22 -24 z" className="fill-card" />
        <text
          x="135"
          y="71"
          textAnchor="middle"
          className="fill-foreground text-lg font-semibold"
        >
          {t("bubble")}
        </text>
      </g>
      <g
        className="origin-center transform-fill motion-safe:group-data-playing/anim:animate-bubble-pop"
        style={{ animationDelay: "700ms" }}
      >
        <rect
          x="390"
          y="40"
          width="230"
          height="48"
          rx="24"
          className="fill-card stroke-border"
          strokeWidth="2"
        />
        <path d="M520 86 l0 24 l-22 -24 z" className="fill-card" />
        <text
          x="505"
          y="71"
          textAnchor="middle"
          className="fill-foreground text-lg font-semibold"
        >
          {t("seller")}
        </text>
      </g>
    </>
  );
}

// A shady booth promising 1000 % a year next to a boring, licensed one.
function ShadyBooth() {
  const t = useTranslations("Lesson.illustration.shadyBooth");
  return (
    <>
      <rect width="640" height="360" className="fill-muted" />
      <rect x="0" y="300" width="640" height="60" className="fill-card" />

      {/* Shady booth with a flashing neon sign */}
      <rect
        x="40"
        y="150"
        width="250"
        height="150"
        rx="8"
        className="fill-background stroke-bear"
        strokeWidth="3"
      />
      <rect
        x="50"
        y="105"
        width="230"
        height="40"
        rx="8"
        className="fill-card stroke-bear"
        strokeWidth="3"
      />
      <text
        x="165"
        y="133"
        textAnchor="middle"
        className="fill-bear text-lg font-bold motion-safe:group-data-playing/anim:animate-screen-flicker"
      >
        {t("tag")}
      </text>
      {/* The salesman in sunglasses */}
      <path
        d="M100 300 q0 -70 65 -70 q65 0 65 70 z"
        className="fill-foreground"
      />
      <circle cx="165" cy="195" r="34" className="fill-foreground" />
      <rect
        x="140"
        y="183"
        width="22"
        height="12"
        rx="4"
        className="fill-background"
      />
      <rect
        x="168"
        y="183"
        width="22"
        height="12"
        rx="4"
        className="fill-background"
      />
      <line
        x1="162"
        y1="189"
        x2="168"
        y2="189"
        className="stroke-background"
        strokeWidth="3"
      />
      <path
        d="M152 210 q13 8 28 -2"
        className="fill-none stroke-background"
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* Licensed booth: boring, but with a certificate */}
      <rect
        x="370"
        y="150"
        width="230"
        height="150"
        rx="8"
        className="fill-background stroke-muted-foreground"
        strokeWidth="3"
      />
      <g
        className="motion-safe:group-data-playing/anim:animate-drop-in"
        style={{ animationDelay: "900ms" }}
      >
        <rect
          x="430"
          y="95"
          width="110"
          height="46"
          rx="6"
          className="fill-card stroke-bull"
          strokeWidth="3"
        />
        <text
          x="485"
          y="125"
          textAnchor="middle"
          className="fill-bull text-base font-bold"
        >
          {t("licence")}
        </text>
      </g>
      <path
        d="M440 300 q0 -60 45 -60 q45 0 45 60 z"
        className="fill-muted-foreground"
      />
      <circle cx="485" cy="215" r="26" className="fill-muted-foreground" />
      <path
        d="M470 213 h10 M490 213 h10"
        className="stroke-background"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M477 228 h16"
        className="stroke-background"
        strokeWidth="3"
        strokeLinecap="round"
      />

      <g
        className="origin-center transform-fill motion-safe:group-data-playing/anim:animate-bubble-pop"
        style={{ animationDelay: "600ms" }}
      >
        <rect
          x="130"
          y="30"
          width="240"
          height="48"
          rx="24"
          className="fill-card stroke-border"
          strokeWidth="2"
        />
        <path d="M200 76 l-10 24 l30 -24 z" className="fill-card" />
        <text
          x="250"
          y="61"
          textAnchor="middle"
          className="fill-foreground text-lg font-semibold"
        >
          {t("bubble")}
        </text>
      </g>
    </>
  );
}

// The seed phrase on a sticky note on the monitor – and a thief with binoculars at the window.
function StickyNote() {
  const t = useTranslations("Lesson.illustration.stickyNote");
  return (
    <>
      <rect width="640" height="360" className="fill-muted" />
      <rect x="0" y="300" width="640" height="60" className="fill-card" />

      {/* Monitor with the sticky note */}
      <rect
        x="60"
        y="110"
        width="260"
        height="160"
        rx="10"
        className="fill-background stroke-muted-foreground"
        strokeWidth="3"
      />
      <rect
        x="175"
        y="270"
        width="30"
        height="30"
        className="fill-muted-foreground"
      />
      <g
        className="origin-top transform-fill motion-safe:group-data-playing/anim:animate-wiggle"
        style={{ animationDelay: "300ms" }}
      >
        <rect
          x="230"
          y="125"
          width="110"
          height="80"
          rx="3"
          className="fill-warning"
        />
        <text
          x="285"
          y="150"
          textAnchor="middle"
          className="fill-background font-mono text-sm font-bold"
        >
          {t("tag")}
        </text>
        <rect
          x="242"
          y="162"
          width="86"
          height="4"
          rx="2"
          className="fill-background opacity-60"
        />
        <rect
          x="242"
          y="174"
          width="70"
          height="4"
          rx="2"
          className="fill-background opacity-60"
        />
        <rect
          x="242"
          y="186"
          width="80"
          height="4"
          rx="2"
          className="fill-background opacity-60"
        />
      </g>

      {/* Window with the thief peeking through binoculars */}
      <rect
        x="400"
        y="80"
        width="200"
        height="190"
        rx="8"
        className="fill-background stroke-border"
        strokeWidth="6"
      />
      <g
        className="motion-safe:group-data-playing/anim:animate-peek"
        style={{ animationDelay: "600ms" }}
      >
        <path
          d="M430 270 q0 -60 70 -60 q70 0 70 60 z"
          className="fill-foreground"
        />
        <circle cx="500" cy="180" r="38" className="fill-foreground" />
        <rect
          x="470"
          y="168"
          width="26"
          height="22"
          rx="6"
          className="fill-muted-foreground"
        />
        <rect
          x="504"
          y="168"
          width="26"
          height="22"
          rx="6"
          className="fill-muted-foreground"
        />
        <circle cx="483" cy="179" r="7" className="fill-primary" />
        <circle cx="517" cy="179" r="7" className="fill-primary" />
        <path
          d="M486 205 q14 10 28 0"
          className="fill-none stroke-background"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </g>

      <g
        className="origin-center transform-fill motion-safe:group-data-playing/anim:animate-bubble-pop"
        style={{ animationDelay: "1400ms" }}
      >
        <rect
          x="380"
          y="20"
          width="180"
          height="48"
          rx="24"
          className="fill-card stroke-border"
          strokeWidth="2"
        />
        <path d="M460 66 l6 24 l18 -24 z" className="fill-card" />
        <text
          x="470"
          y="51"
          textAnchor="middle"
          className="fill-foreground text-lg font-semibold"
        >
          {t("bubble")}
        </text>
      </g>
    </>
  );
}

// The first purchase: a big Buy button, a checklist and a slightly nervous person.
function FirstBuy() {
  const t = useTranslations("Lesson.illustration.firstBuy");
  return (
    <>
      <rect width="640" height="360" className="fill-muted" />
      <rect x="0" y="300" width="640" height="60" className="fill-card" />

      {/* Checklist with ticks appearing one by one */}
      <rect
        x="40"
        y="90"
        width="150"
        height="190"
        rx="10"
        className="fill-background stroke-muted-foreground"
        strokeWidth="3"
      />
      {[130, 180, 230].map((y, index) => (
        <g key={y}>
          <rect
            x="60"
            y={y - 14}
            width="24"
            height="24"
            rx="5"
            className="fill-card stroke-muted-foreground"
            strokeWidth="2"
          />
          <path
            d={`M64 ${y - 2} l7 7 l12 -14`}
            className="fill-none stroke-bull motion-safe:group-data-playing/anim:animate-drop-in"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ animationDelay: `${300 + index * 400}ms` }}
          />
          <rect
            x="94"
            y={y - 4}
            width="78"
            height="6"
            rx="3"
            className="fill-muted-foreground opacity-60"
          />
        </g>
      ))}

      {/* Big Buy button pressed a few times */}
      <g
        className="motion-safe:group-data-playing/anim:animate-press"
        style={{ animationDelay: "1600ms" }}
      >
        <rect
          x="380"
          y="200"
          width="200"
          height="70"
          rx="35"
          className="fill-bull"
        />
        <text
          x="480"
          y="244"
          textAnchor="middle"
          className="fill-background text-2xl font-bold"
        >
          {t("tag")}
        </text>
      </g>
      <rect
        x="370"
        y="270"
        width="220"
        height="14"
        rx="7"
        className="fill-muted-foreground opacity-50"
      />

      {/* Nervous person with a sweat drop */}
      <path
        d="M215 300 q0 -75 65 -75 q65 0 65 75 z"
        className="fill-foreground"
      />
      <circle cx="280" cy="185" r="36" className="fill-foreground" />
      <circle cx="268" cy="182" r="4" className="fill-background" />
      <circle cx="292" cy="182" r="4" className="fill-background" />
      <path
        d="M266 202 q6 -4 12 0 q6 4 12 0"
        className="fill-none stroke-background"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M322 160 q6 10 0 14 q-6 -4 0 -14 z"
        className="fill-primary motion-safe:group-data-playing/anim:animate-sweat-drop"
      />
      <line
        x1="330"
        y1="250"
        x2="400"
        y2="225"
        className="stroke-foreground"
        strokeWidth="12"
        strokeLinecap="round"
      />

      <g
        className="origin-center transform-fill motion-safe:group-data-playing/anim:animate-bubble-pop"
        style={{ animationDelay: "400ms" }}
      >
        <rect
          x="200"
          y="40"
          width="400"
          height="48"
          rx="24"
          className="fill-card stroke-border"
          strokeWidth="2"
        />
        <path d="M290 86 l-6 24 l26 -24 z" className="fill-card" />
        <text
          x="400"
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

// Phishing: a hooded hacker fishes with an urgent email.
function PhishingHook() {
  const t = useTranslations("Lesson.illustration.phishingHook");
  return (
    <>
      <rect width="640" height="360" className="fill-muted" />
      <rect x="0" y="300" width="640" height="60" className="fill-card" />
      {/* Hacker in a hood with a fishing rod */}
      <path
        d="M40 300 q0 -90 70 -90 q70 0 70 90 z"
        className="fill-muted-foreground"
      />
      <circle cx="110" cy="165" r="44" className="fill-muted-foreground" />
      <circle cx="110" cy="172" r="30" className="fill-background" />
      <circle cx="99" cy="168" r="4" className="fill-bear" />
      <circle cx="121" cy="168" r="4" className="fill-bear" />
      <line
        x1="160"
        y1="240"
        x2="330"
        y2="70"
        className="stroke-warning"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <g className="motion-safe:group-data-playing/anim:animate-bob">
        <line
          x1="330"
          y1="70"
          x2="330"
          y2="170"
          className="stroke-muted-foreground"
          strokeWidth="2"
        />
        <rect
          x="290"
          y="170"
          width="80"
          height="54"
          rx="6"
          className="fill-card stroke-bear"
          strokeWidth="3"
        />
        <path
          d="M292 172 l38 28 l38 -28"
          className="fill-none stroke-bear"
          strokeWidth="3"
        />
        <text
          x="330"
          y="218"
          textAnchor="middle"
          className="fill-bear text-base font-bold"
        >
          !
        </text>
      </g>

      {/* Worried user reaching for the email */}
      <path
        d="M445 300 q0 -75 65 -75 q65 0 65 75 z"
        className="fill-foreground"
      />
      <circle cx="510" cy="185" r="36" className="fill-foreground" />
      <circle cx="498" cy="180" r="5" className="fill-background" />
      <circle cx="522" cy="180" r="5" className="fill-background" />
      <ellipse cx="510" cy="203" rx="7" ry="9" className="fill-background" />
      <line
        x1="455"
        y1="250"
        x2="385"
        y2="215"
        className="stroke-foreground"
        strokeWidth="12"
        strokeLinecap="round"
      />
      <g
        className="origin-center transform-fill motion-safe:group-data-playing/anim:animate-bubble-pop"
        style={{ animationDelay: "900ms" }}
      >
        <rect
          x="380"
          y="30"
          width="240"
          height="48"
          rx="24"
          className="fill-card stroke-border"
          strokeWidth="2"
        />
        <path d="M500 76 l0 24 l20 -24 z" className="fill-card" />
        <text
          x="500"
          y="61"
          textAnchor="middle"
          className="fill-foreground text-lg font-semibold"
        >
          {t("bubble")}
        </text>
      </g>
    </>
  );
}

// A fake celebrity giveaway: "send 1, get 2 back".
function GiveawayScam() {
  const t = useTranslations("Lesson.illustration.giveawayScam");
  const sparkles = [
    [70, 70],
    [300, 60],
    [330, 230],
    [40, 220],
  ];
  return (
    <>
      <rect width="640" height="360" className="fill-muted" />
      <rect x="0" y="300" width="640" height="60" className="fill-card" />
      {/* Screen with the "celebrity" */}
      <rect
        x="30"
        y="50"
        width="330"
        height="220"
        rx="12"
        className="fill-background stroke-muted-foreground"
        strokeWidth="3"
      />
      <path d="M130 270 q0 -60 65 -60 q65 0 65 60 z" className="fill-warning" />
      <circle cx="195" cy="160" r="38" className="fill-warning" />
      <rect
        x="168"
        y="148"
        width="24"
        height="12"
        rx="4"
        className="fill-background"
      />
      <rect
        x="198"
        y="148"
        width="24"
        height="12"
        rx="4"
        className="fill-background"
      />
      <path
        d="M178 180 q17 12 34 0"
        className="fill-none stroke-background"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <rect
        x="55"
        y="70"
        width="280"
        height="36"
        rx="6"
        className="fill-bull"
      />
      <text
        x="195"
        y="95"
        textAnchor="middle"
        className="fill-background text-base font-bold"
      >
        {t("tag")}
      </text>
      {sparkles.map(([x = 0, y = 0], index) => (
        <path
          key={`${x}-${y}`}
          d={`M${x} ${y - 12} l4 8 l8 4 l-8 4 l-4 8 l-4 -8 l-8 -4 l8 -4 z`}
          className="fill-warning motion-safe:group-data-playing/anim:animate-screen-flicker"
          style={{ animationDelay: `${index * 150}ms` }}
        />
      ))}

      {/* Viewer, a little too excited */}
      <path
        d="M445 300 q0 -75 65 -75 q65 0 65 75 z"
        className="fill-foreground"
      />
      <circle cx="510" cy="185" r="36" className="fill-foreground" />
      <path
        d="M494 178 q6 -6 12 0 M514 178 q6 -6 12 0"
        className="fill-none stroke-background"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path d="M494 198 q16 16 32 0" className="fill-background" />
      <g
        className="origin-center transform-fill motion-safe:group-data-playing/anim:animate-bubble-pop"
        style={{ animationDelay: "900ms" }}
      >
        <rect
          x="400"
          y="40"
          width="200"
          height="48"
          rx="24"
          className="fill-card stroke-border"
          strokeWidth="2"
        />
        <path d="M500 86 l0 24 l20 -24 z" className="fill-card" />
        <text
          x="500"
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

// Tax time: a person buried in receipts.
function ReceiptPile() {
  const t = useTranslations("Lesson.illustration.receiptPile");
  const receipts = [
    [120, 120, -20],
    [210, 90, 15],
    [470, 110, -10],
    [540, 170, 25],
    [90, 200, 10],
  ];
  return (
    <>
      <rect width="640" height="360" className="fill-muted" />
      <rect x="0" y="300" width="640" height="60" className="fill-card" />
      {/* Desk with a calculator */}
      <rect
        x="180"
        y="250"
        width="300"
        height="20"
        rx="4"
        className="fill-muted-foreground"
      />
      <rect
        x="380"
        y="215"
        width="60"
        height="36"
        rx="4"
        className="fill-background stroke-muted-foreground"
        strokeWidth="2"
      />
      <rect
        x="388"
        y="222"
        width="44"
        height="10"
        rx="2"
        className="fill-bull opacity-60"
      />

      {/* Person behind the desk */}
      <path
        d="M255 250 q0 -75 65 -75 q65 0 65 75 z"
        className="fill-foreground"
      />
      <circle cx="320" cy="135" r="36" className="fill-foreground" />
      <circle cx="308" cy="128" r="5" className="fill-background" />
      <circle cx="332" cy="128" r="5" className="fill-background" />
      <path
        d="M306 150 q14 -8 28 0"
        className="fill-none stroke-background"
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* Flying receipts */}
      {receipts.map(([x = 0, y = 0, r = 0], index) => (
        <g key={`${x}-${y}`} transform={`rotate(${r} ${x} ${y})`}>
          <g
            className="motion-safe:group-data-playing/anim:animate-bob"
            style={{ animationDelay: `${index * 120}ms` }}
          >
            <rect
              x={x - 22}
              y={y - 30}
              width="44"
              height="60"
              rx="3"
              className="fill-foreground"
            />
            <rect
              x={x - 14}
              y={y - 18}
              width="28"
              height="4"
              rx="2"
              className="fill-muted-foreground"
            />
            <rect
              x={x - 14}
              y={y - 8}
              width="22"
              height="4"
              rx="2"
              className="fill-muted-foreground"
            />
            <rect
              x={x - 14}
              y={y + 2}
              width="26"
              height="4"
              rx="2"
              className="fill-muted-foreground"
            />
          </g>
        </g>
      ))}
      <g
        className="origin-center transform-fill motion-safe:group-data-playing/anim:animate-bubble-pop"
        style={{ animationDelay: "700ms" }}
      >
        <rect
          x="150"
          y="20"
          width="340"
          height="48"
          rx="24"
          className="fill-card stroke-border"
          strokeWidth="2"
        />
        <path d="M320 66 l0 24 l20 -24 z" className="fill-card" />
        <text
          x="320"
          y="51"
          textAnchor="middle"
          className="fill-foreground text-lg font-semibold"
        >
          {t("bubble")}
        </text>
      </g>
    </>
  );
}

// The tortoise and the hare: a patient investor and a restless day trader.
function TortoiseHare() {
  const t = useTranslations("Lesson.illustration.tortoiseHare");
  return (
    <>
      <rect width="640" height="360" className="fill-muted" />
      <rect x="0" y="300" width="640" height="60" className="fill-card" />
      {/* Finish flag */}
      <line
        x1="590"
        y1="300"
        x2="590"
        y2="150"
        className="stroke-muted-foreground"
        strokeWidth="5"
      />
      <path
        d="M590 150 l40 12 l-40 12 z"
        className="origin-left fill-bull transform-fill motion-safe:group-data-playing/anim:animate-wiggle"
      />

      {/* Tortoise (investor) */}
      <g className="motion-safe:group-data-playing/anim:animate-bob">
        <path d="M70 290 q0 -70 80 -70 q80 0 80 70 z" className="fill-bull" />
        <path
          d="M100 290 q0 -40 50 -40 q50 0 50 40"
          className="fill-none stroke-background opacity-50"
          strokeWidth="3"
        />
        <circle cx="245" cy="270" r="20" className="fill-bull opacity-80" />
        <circle cx="252" cy="265" r="4" className="fill-background" />
        <rect
          x="90"
          y="285"
          width="18"
          height="15"
          rx="4"
          className="fill-bull opacity-80"
        />
        <rect
          x="190"
          y="285"
          width="18"
          height="15"
          rx="4"
          className="fill-bull opacity-80"
        />
      </g>
      <text
        x="150"
        y="205"
        textAnchor="middle"
        className="fill-bull text-base font-bold"
      >
        {t("tag")}
      </text>

      {/* Hare (day trader) with a phone */}
      <g className="origin-bottom transform-fill motion-safe:group-data-playing/anim:animate-wiggle">
        <ellipse
          cx="420"
          cy="260"
          rx="55"
          ry="35"
          className="fill-foreground"
        />
        <ellipse
          cx="470"
          cy="215"
          rx="28"
          ry="24"
          className="fill-foreground"
        />
        <ellipse cx="462" cy="170" rx="9" ry="30" className="fill-foreground" />
        <ellipse cx="482" cy="172" rx="9" ry="30" className="fill-foreground" />
        <circle cx="478" cy="210" r="4" className="fill-background" />
        <rect
          x="490"
          y="225"
          width="22"
          height="34"
          rx="4"
          className="fill-background stroke-muted-foreground"
          strokeWidth="2"
        />
        <path
          d="M494 252 l5 -8 l5 4 l5 -10"
          className="fill-none stroke-bear"
          strokeWidth="2"
        />
        <path d="M455 192 q6 10 0 14 q-6 -4 0 -14 z" className="fill-primary" />
      </g>
      <text
        x="420"
        y="320"
        textAnchor="middle"
        className="fill-bear text-base font-bold"
      >
        {t("tag2")}
      </text>
      <g
        className="origin-center transform-fill motion-safe:group-data-playing/anim:animate-bubble-pop"
        style={{ animationDelay: "700ms" }}
      >
        <rect
          x="300"
          y="40"
          width="260"
          height="48"
          rx="24"
          className="fill-card stroke-border"
          strokeWidth="2"
        />
        <path d="M440 86 l10 24 l14 -24 z" className="fill-card" />
        <text
          x="430"
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

// Wick color of each candle body color.
const WICK = {
  "fill-bull": "stroke-bull",
  "fill-bear": "stroke-bear",
} as const;

// Riding the trend: a surfer on a wave of candles.
function CandleSurfer() {
  const t = useTranslations("Lesson.illustration.candleSurfer");
  const candles = [
    [60, 250, 30, "fill-bull"],
    [100, 235, 40, "fill-bull"],
    [140, 240, 25, "fill-bear"],
    [180, 210, 45, "fill-bull"],
    [220, 190, 40, "fill-bull"],
    [260, 195, 20, "fill-bear"],
    [300, 160, 50, "fill-bull"],
    [340, 140, 40, "fill-bull"],
  ] as const;
  return (
    <>
      <rect width="640" height="360" className="fill-muted" />
      <rect x="0" y="300" width="640" height="60" className="fill-card" />
      {candles.map(([x, y, h, fill]) => (
        <g key={x}>
          <line
            x1={x}
            x2={x}
            y1={y - 12}
            y2={y + h + 12}
            className={WICK[fill]}
            strokeWidth="3"
          />
          <rect
            x={x - 12}
            y={y}
            width="24"
            height={h}
            rx="3"
            className={fill}
          />
        </g>
      ))}

      {/* Surfer riding on top of the last candles */}
      <g className="motion-safe:group-data-playing/anim:animate-bob">
        <rect
          x="320"
          y="122"
          width="110"
          height="10"
          rx="5"
          className="fill-warning"
          transform="rotate(-12 375 127)"
        />
        <path
          d="M368 120 l-14 -50 M368 120 l18 -40"
          className="stroke-foreground"
          strokeWidth="8"
          strokeLinecap="round"
        />
        <circle cx="375" cy="55" r="18" className="fill-foreground" />
        <path
          d="M360 85 l-28 -10 M378 82 l30 -18"
          className="stroke-foreground"
          strokeWidth="7"
          strokeLinecap="round"
        />
      </g>
      <g
        className="origin-center transform-fill motion-safe:group-data-playing/anim:animate-bubble-pop"
        style={{ animationDelay: "700ms" }}
      >
        <rect
          x="400"
          y="150"
          width="220"
          height="48"
          rx="24"
          className="fill-card stroke-border"
          strokeWidth="2"
        />
        <path d="M440 150 l-24 -14 l40 14 z" className="fill-card" />
        <text
          x="510"
          y="181"
          textAnchor="middle"
          className="fill-foreground text-lg font-semibold"
        >
          {t("bubble")}
        </text>
      </g>
    </>
  );
}

// Stop-loss as a parachute: one jumper floats down calmly, the other falls without one.
function ParachuteStop() {
  const t = useTranslations("Lesson.illustration.parachuteStop");
  return (
    <>
      <rect width="640" height="360" className="fill-muted" />

      {/* With a parachute */}
      <g className="motion-safe:group-data-playing/anim:animate-bob">
        <path d="M80 110 q100 -110 200 0 z" className="fill-bull" />
        <text
          x="180"
          y="95"
          textAnchor="middle"
          className="fill-background text-sm font-bold"
        >
          {t("tag")}
        </text>
        <path
          d="M85 110 l85 90 M275 110 l-85 90 M180 110 l0 90"
          className="stroke-muted-foreground"
          strokeWidth="2"
        />
        <circle cx="180" cy="215" r="18" className="fill-foreground" />
        <path
          d="M172 212 q8 6 16 0"
          className="fill-none stroke-background"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <rect
          x="168"
          y="233"
          width="24"
          height="40"
          rx="10"
          className="fill-foreground"
        />
      </g>

      {/* Without one */}
      <g
        className="motion-safe:group-data-playing/anim:animate-drop-in"
        style={{ animationDelay: "400ms" }}
      >
        <circle cx="460" cy="150" r="20" className="fill-foreground" />
        <ellipse cx="460" cy="158" rx="6" ry="8" className="fill-background" />
        <path
          d="M440 170 l-30 -40 M480 170 l30 -40"
          className="stroke-foreground"
          strokeWidth="8"
          strokeLinecap="round"
        />
        <rect
          x="447"
          y="170"
          width="26"
          height="45"
          rx="10"
          className="fill-foreground"
        />
        <path
          d="M452 215 l-12 35 M468 215 l12 35"
          className="stroke-foreground"
          strokeWidth="8"
          strokeLinecap="round"
        />
      </g>
      <text
        x="460"
        y="300"
        textAnchor="middle"
        className="fill-bear text-2xl font-bold"
      >
        {t("tag2")}
      </text>
      <g
        className="origin-center transform-fill motion-safe:group-data-playing/anim:animate-bubble-pop"
        style={{ animationDelay: "900ms" }}
      >
        <rect
          x="380"
          y="20"
          width="240"
          height="48"
          rx="24"
          className="fill-card stroke-border"
          strokeWidth="2"
        />
        <path d="M470 66 l-6 24 l24 -24 z" className="fill-card" />
        <text
          x="500"
          y="51"
          textAnchor="middle"
          className="fill-foreground text-lg font-semibold"
        >
          {t("bubble")}
        </text>
      </g>
    </>
  );
}

// The end of the course: a graduate with a diploma under falling confetti.
function Graduation() {
  const t = useTranslations("Lesson.illustration.graduation");
  const confetti = [
    [80, 70, "fill-bull"],
    [160, 40, "fill-primary"],
    [240, 90, "fill-warning"],
    [420, 50, "fill-bear"],
    [500, 90, "fill-bull"],
    [570, 60, "fill-primary"],
    [330, 30, "fill-warning"],
  ] as const;
  return (
    <>
      <rect width="640" height="360" className="fill-muted" />
      <rect x="0" y="300" width="640" height="60" className="fill-card" />
      {confetti.map(([x, y, fill], index) => (
        <rect
          key={x}
          x={x}
          y={y}
          width="12"
          height="18"
          rx="2"
          className={cn(
            fill,
            "origin-center transform-fill motion-safe:group-data-playing/anim:animate-confetti",
          )}
          style={{ animationDelay: `${index * 120}ms` }}
        />
      ))}

      {/* Graduate with a cap and a diploma */}
      <path
        d="M255 300 q0 -75 65 -75 q65 0 65 75 z"
        className="fill-foreground"
      />
      <circle cx="320" cy="185" r="36" className="fill-foreground" />
      <path d="M270 150 l50 -22 l50 22 l-50 22 z" className="fill-background" />
      <line
        x1="362"
        y1="153"
        x2="368"
        y2="185"
        className="stroke-warning"
        strokeWidth="3"
      />
      <path
        d="M306 182 q6 -6 12 0 M326 182 q6 -6 12 0"
        className="fill-none stroke-background"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path d="M304 202 q16 16 32 0" className="fill-background" />
      <rect
        x="380"
        y="225"
        width="80"
        height="22"
        rx="11"
        className="fill-foreground"
      />
      <rect x="415" y="225" width="10" height="22" className="fill-bear" />
      <line
        x1="370"
        y1="255"
        x2="400"
        y2="240"
        className="stroke-foreground"
        strokeWidth="12"
        strokeLinecap="round"
      />
      <g
        className="origin-center transform-fill motion-safe:group-data-playing/anim:animate-bubble-pop"
        style={{ animationDelay: "900ms" }}
      >
        <rect
          x="80"
          y="110"
          width="180"
          height="48"
          rx="24"
          className="fill-card stroke-border"
          strokeWidth="2"
        />
        <path d="M230 156 l20 24 l0 -24 z" className="fill-card" />
        <text
          x="170"
          y="141"
          textAnchor="middle"
          className="fill-foreground text-lg font-semibold"
        >
          {t("bubble")}
        </text>
      </g>
    </>
  );
}

const ILLUSTRATIONS = {
  midnightEdit: MidnightEdit,
  copyMachine: CopyMachine,
  miningRace: MiningRace,
  pizzaDay: PizzaDay,
  vendingMachine: VendingMachine,
  memeSlot: MemeSlot,
  feeBus: FeeBus,
  marketShout: MarketShout,
  shadyBooth: ShadyBooth,
  stickyNote: StickyNote,
  firstBuy: FirstBuy,
  phishingHook: PhishingHook,
  giveawayScam: GiveawayScam,
  receiptPile: ReceiptPile,
  tortoiseHare: TortoiseHare,
  candleSurfer: CandleSurfer,
  parachuteStop: ParachuteStop,
  graduation: Graduation,
} as const;

type IllustrationName = keyof typeof ILLUSTRATIONS;

// Illustrations with a short animation (played once when visible, see AnimateOnView).
const ANIMATED: ReadonlySet<IllustrationName> = new Set([
  "midnightEdit",
  "copyMachine",
  "miningRace",
  "pizzaDay",
  "vendingMachine",
  "memeSlot",
  "feeBus",
  "marketShout",
  "shadyBooth",
  "stickyNote",
  "firstBuy",
  "phishingHook",
  "giveawayScam",
  "receiptPile",
  "tortoiseHare",
  "candleSurfer",
  "parachuteStop",
  "graduation",
]);

function isIllustrationName(name: string): name is IllustrationName {
  return Object.hasOwn(ILLUSTRATIONS, name);
}

export function Illustration({ name }: { name: string }) {
  const t = useTranslations("Lesson.illustration");

  // MDX is not type-checked, so an unknown name stops the build here.
  if (!isIllustrationName(name)) {
    throw new Error(
      `Unknown <Illustration name="${name}">. Known: ${Object.keys(ILLUSTRATIONS).join(", ")}`,
    );
  }

  const Drawing = ILLUSTRATIONS[name];
  const drawing = (
    <svg
      viewBox="0 0 640 360"
      role="img"
      aria-label={t(`${name}.label`)}
      className="dark w-full overflow-hidden rounded-lg border border-border"
    >
      {/* Each drawing reads its own texts (bubble, labels inside the picture). */}
      <Drawing />
    </svg>
  );
  return (
    <figure className="not-prose my-8">
      {ANIMATED.has(name) ? (
        <AnimateOnView replayLabel={t("replay")}>{drawing}</AnimateOnView>
      ) : (
        drawing
      )}
      <figcaption className="mt-3 text-sm text-muted-foreground">
        {t(`${name}.caption`)}
      </figcaption>
    </figure>
  );
}
