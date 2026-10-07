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

const ILLUSTRATIONS = {
  midnightEdit: MidnightEdit,
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
