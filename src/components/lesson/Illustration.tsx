import { useTranslations } from "next-intl";

/*
 * Fun illustrations for lessons, drawn in code: <Illustration name="midnightEdit" />
 * Colors come from the design tokens. Illustrations always use the dark theme (the `dark` class on
 * the <svg> switches the tokens inside it), matching the dark-first look of lesson images.
 * A new illustration = a new entry in ILLUSTRATIONS + texts in messages (Lesson.illustration.<name>).
 */

type Texts = { bubble: string };

// George secretly "improves" his notebook at night; a chicken at the window cannot believe it.
function MidnightEdit({ bubble }: Texts) {
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
      <ellipse cx="110" cy="240" rx="44" ry="30" className="fill-foreground" />
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

      {/* Speech bubble */}
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
        {bubble}
      </text>

      {/* Candle on the desk – a little nod to candlestick charts */}
      <circle cx="505" cy="215" r="55" className="fill-warning opacity-15" />
      <ellipse cx="505" cy="212" rx="7" ry="13" className="fill-warning" />
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
    </>
  );
}

// Digital money copied like a file: a copy machine spitting out banknotes.
function CopyMachine({ bubble }: Texts) {
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
        className="fill-primary"
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
      {notes.map(({ x, y, r }) => (
        <g key={`${x}-${y}`} transform={`rotate(${r} ${x} ${y})`}>
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
        {bubble}
      </text>
    </>
  );
}

// Mining as a race: sweating computers guessing numbers while the electricity meter spins.
function MiningRace({ bubble }: Texts) {
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
            className="fill-bull font-mono text-lg font-bold"
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
            className="fill-primary"
          />
          <path
            d={`M${x + 76} 195 q5 8 0 11 q-5 -3 0 -11 z`}
            className="fill-primary opacity-70"
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
        className="stroke-warning"
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
        {bubble}
      </text>
    </>
  );
}

const ILLUSTRATIONS = {
  midnightEdit: MidnightEdit,
  copyMachine: CopyMachine,
  miningRace: MiningRace,
} as const;

type IllustrationName = keyof typeof ILLUSTRATIONS;

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
  return (
    <figure className="not-prose my-8">
      <svg
        viewBox="0 0 640 360"
        role="img"
        aria-label={t(`${name}.label`)}
        className="dark w-full overflow-hidden rounded-lg border border-border"
      >
        <Drawing bubble={t(`${name}.bubble`)} />
      </svg>
      <figcaption className="mt-3 text-sm text-muted-foreground">
        {t(`${name}.caption`)}
      </figcaption>
    </figure>
  );
}
