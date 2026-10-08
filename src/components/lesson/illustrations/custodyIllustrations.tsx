import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";

import { Bubble } from "./Bubble";
import { Person } from "./Person";

/*
 * Fun illustrations of the course "Keeping crypto safe" (content/courses/crypto-custody).
 * Same rules as in ../Illustration.tsx, which shows them: a 640×360 drawing, colors from the design
 * tokens, the dark theme, texts from messages (Lesson.illustration.<name>) and short animations.
 */

// Exchange or own wallet: a hotel safe – the receptionist keeps the spare key dangling from a finger.
function HotelSafe() {
  const t = useTranslations("Lesson.illustration.hotelSafe");
  return (
    <>
      <rect width="640" height="360" className="fill-muted" />
      {/* The safe */}
      <rect
        x="60"
        y="150"
        width="170"
        height="170"
        rx="10"
        className="fill-muted-foreground"
      />
      <circle
        cx="145"
        cy="235"
        r="34"
        className="fill-none stroke-background"
        strokeWidth="8"
      />
      <rect
        x="196"
        y="215"
        width="10"
        height="40"
        rx="4"
        className="fill-background"
      />
      <text
        x="145"
        y="304"
        textAnchor="middle"
        className="fill-background text-xs font-bold"
      >
        {t("safe")}
      </text>
      {/* The reception desk and the receptionist */}
      <Person x={460} ground={260} mood="happy" />
      <rect x="320" y="250" width="300" height="110" className="fill-card" />
      <text
        x="470"
        y="300"
        textAnchor="middle"
        className="fill-foreground text-sm font-bold"
      >
        {t("desk")}
      </text>
      <g className="origin-top transform-fill motion-safe:group-data-playing/anim:animate-swing">
        <line
          x1="530"
          y1="180"
          x2="530"
          y2="200"
          className="stroke-muted-foreground"
          strokeWidth="3"
        />
        <circle
          cx="530"
          cy="210"
          r="10"
          className="fill-none stroke-warning"
          strokeWidth="5"
        />
        <rect x="527" y="218" width="6" height="26" className="fill-warning" />
        <rect x="533" y="236" width="8" height="5" className="fill-warning" />
      </g>
      <Bubble
        x={250}
        y={40}
        width={330}
        text={t("bubble")}
        tail="right"
        delay={1100}
      />
    </>
  );
}

// Keys and the seed phrase: one golden key opens three doors at once.
function MasterKey() {
  const t = useTranslations("Lesson.illustration.masterKey");
  const doors = [
    { key: "btc", x: 300 },
    { key: "eth", x: 420 },
    { key: "sol", x: 540 },
  ] as const;
  return (
    <>
      <rect width="640" height="360" className="fill-muted" />
      {doors.map((door, index) => (
        <g key={door.key}>
          <rect
            x={door.x - 45}
            y="130"
            width="90"
            height="190"
            rx="6"
            className="fill-card stroke-border"
            strokeWidth="2"
          />
          <g
            className="origin-left transform-fill motion-safe:group-data-playing/anim:animate-drop-in"
            style={{ animationDelay: `${400 + index * 250}ms` }}
          >
            <rect
              x={door.x - 45}
              y="130"
              width="50"
              height="190"
              rx="4"
              className="fill-chart-1"
            />
          </g>
          <text
            x={door.x}
            y="120"
            textAnchor="middle"
            className="fill-foreground text-sm font-bold"
          >
            {t(door.key)}
          </text>
        </g>
      ))}
      {/* The golden key */}
      <g className="motion-safe:group-data-playing/anim:animate-bob">
        <circle
          cx="110"
          cy="230"
          r="40"
          className="fill-none stroke-warning"
          strokeWidth="14"
        />
        <rect x="148" y="223" width="80" height="14" className="fill-warning" />
        <rect x="200" y="237" width="12" height="20" className="fill-warning" />
        <rect x="218" y="237" width="10" height="14" className="fill-warning" />
        <text
          x="110"
          y="236"
          textAnchor="middle"
          className="fill-foreground text-xs font-bold"
        >
          {t("seed")}
        </text>
      </g>
      <Bubble
        x={40}
        y={40}
        width={300}
        text={t("bubble")}
        tail="left"
        delay={1300}
      />
    </>
  );
}

// Types of wallets: a phone for coffee money, a safe for savings and a paper that flies off in the wind.
function WalletPockets() {
  const t = useTranslations("Lesson.illustration.walletPockets");
  return (
    <>
      <rect width="640" height="360" className="fill-muted" />
      <rect x="0" y="300" width="640" height="60" className="fill-card" />
      {/* Phone */}
      <rect
        x="90"
        y="190"
        width="70"
        height="110"
        rx="12"
        className="fill-chart-1"
      />
      <rect
        x="100"
        y="204"
        width="50"
        height="76"
        rx="4"
        className="fill-background"
      />
      <text
        x="125"
        y="330"
        textAnchor="middle"
        className="fill-foreground text-sm font-bold"
      >
        {t("phone")}
      </text>
      {/* Safe */}
      <rect
        x="260"
        y="180"
        width="120"
        height="120"
        rx="8"
        className="fill-muted-foreground"
      />
      <circle
        cx="320"
        cy="240"
        r="24"
        className="fill-none stroke-background"
        strokeWidth="6"
      />
      <text
        x="320"
        y="330"
        textAnchor="middle"
        className="fill-foreground text-sm font-bold"
      >
        {t("safe")}
      </text>
      {/* Paper flying away */}
      <g className="motion-safe:group-data-playing/anim:animate-sweep">
        <g className="origin-center transform-fill motion-safe:group-data-playing/anim:animate-wiggle">
          <rect
            x="460"
            y="150"
            width="70"
            height="50"
            rx="2"
            className="fill-foreground"
          />
          <line
            x1="470"
            y1="166"
            x2="520"
            y2="166"
            className="stroke-background"
            strokeWidth="3"
          />
          <line
            x1="470"
            y1="180"
            x2="510"
            y2="180"
            className="stroke-background"
            strokeWidth="3"
          />
        </g>
      </g>
      {[0, 1, 2].map((index) => (
        <path
          key={index}
          d={`M420 ${150 + index * 22} q20 -8 40 0`}
          className="fill-none stroke-muted-foreground"
          strokeWidth="3"
        />
      ))}
      <text
        x="500"
        y="330"
        textAnchor="middle"
        className="fill-foreground text-sm font-bold"
      >
        {t("paper")}
      </text>
      <Bubble
        x={40}
        y={40}
        width={380}
        text={t("bubble")}
        tail="left"
        delay={1200}
      />
    </>
  );
}

// How a hardware wallet works: the laptop shows one address, the device another – trust the device.
function TrustTheScreen() {
  const t = useTranslations("Lesson.illustration.trustTheScreen");
  return (
    <>
      <rect width="640" height="360" className="fill-muted" />
      {/* Laptop */}
      <rect
        x="60"
        y="120"
        width="260"
        height="160"
        rx="8"
        className="fill-muted-foreground"
      />
      <rect
        x="74"
        y="134"
        width="232"
        height="132"
        rx="4"
        className="fill-background"
      />
      <path
        d="M40 280 l300 0 l-20 20 l-260 0 z"
        className="fill-muted-foreground"
      />
      <text
        x="190"
        y="196"
        textAnchor="middle"
        className="fill-foreground text-sm font-bold"
      >
        {t("laptopAddress")}
      </text>
      <path
        d="M170 216 l40 40 m0 -40 l-40 40"
        className="stroke-bear motion-safe:group-data-playing/anim:animate-drop-in"
        strokeWidth="8"
        strokeLinecap="round"
        style={{ animationDelay: "500ms" }}
      />
      {/* The hardware wallet */}
      <g className="motion-safe:group-data-playing/anim:animate-bob">
        <rect
          x="400"
          y="170"
          width="180"
          height="100"
          rx="16"
          className="fill-foreground"
        />
        <rect
          x="416"
          y="184"
          width="148"
          height="56"
          rx="6"
          className="fill-background"
        />
        <text
          x="490"
          y="218"
          textAnchor="middle"
          className="fill-foreground text-sm font-bold"
        >
          {t("deviceAddress")}
        </text>
        <circle cx="470" cy="255" r="7" className="fill-bull" />
        <circle cx="510" cy="255" r="7" className="fill-bear" />
      </g>
      <Bubble
        x={300}
        y={40}
        width={300}
        text={t("bubble")}
        tail="right"
        delay={1200}
      />
    </>
  );
}

// Buying and setup: a parcel arrives with a pre-filled seed card – hands off.
function SealedBox() {
  const t = useTranslations("Lesson.illustration.sealedBox");
  return (
    <>
      <rect width="640" height="360" className="fill-muted" />
      <rect x="0" y="300" width="640" height="60" className="fill-card" />
      {/* The parcel */}
      <rect x="300" y="200" width="200" height="100" className="fill-chart-3" />
      <path d="M300 200 l40 -40 l200 0 l-40 40 z" className="fill-warning" />
      <rect
        x="390"
        y="200"
        width="20"
        height="100"
        className="fill-warning opacity-60"
      />
      {/* The pre-filled card pops out */}
      <g
        className="motion-safe:group-data-playing/anim:animate-peek"
        style={{ animationDelay: "300ms" }}
      >
        <rect
          x="350"
          y="110"
          width="140"
          height="80"
          rx="6"
          className="fill-foreground"
        />
        <text
          x="420"
          y="138"
          textAnchor="middle"
          className="fill-background text-xs font-bold"
        >
          {t("card")}
        </text>
        <text
          x="420"
          y="160"
          textAnchor="middle"
          className="fill-muted-foreground text-xs"
        >
          {t("words")}
        </text>
      </g>
      <Person x={150} ground={300} mood="surprised" />
      {/* Stop hand */}
      <rect
        x="200"
        y="210"
        width="60"
        height="16"
        rx="8"
        className="fill-foreground"
      />
      <circle cx="268" cy="218" r="16" className="fill-foreground" />
      <Bubble
        x={30}
        y={40}
        width={330}
        text={t("bubble")}
        tail="left"
        delay={1100}
      />
    </>
  );
}

// Sending safely: a magnifying glass checks the middle of two almost identical addresses.
function AddressCompare() {
  const t = useTranslations("Lesson.illustration.addressCompare");
  const rows = [
    { key: "real", y: 170, fill: "fill-card" },
    { key: "fake", y: 250, fill: "fill-card" },
  ] as const;
  return (
    <>
      <rect width="640" height="360" className="fill-muted" />
      {rows.map((row) => (
        <g key={row.key}>
          <rect
            x="80"
            y={row.y - 34}
            width="480"
            height="52"
            rx="10"
            className={cn("stroke-border", row.fill)}
            strokeWidth="2"
          />
          <text
            x="320"
            y={row.y}
            textAnchor="middle"
            className="fill-foreground text-lg font-bold tracking-wider"
          >
            {t(row.key)}
          </text>
        </g>
      ))}
      {/* Highlight on the differing middle */}
      <g
        className="motion-safe:group-data-playing/anim:animate-drop-in"
        style={{ animationDelay: "700ms" }}
      >
        <rect
          x="282"
          y="222"
          width="84"
          height="40"
          rx="8"
          className="fill-none stroke-bear"
          strokeWidth="4"
        />
      </g>
      <g className="motion-safe:group-data-playing/anim:animate-scan">
        <circle
          cx="420"
          cy="300"
          r="30"
          className="fill-none stroke-foreground"
          strokeWidth="6"
        />
        <line
          x1="441"
          y1="321"
          x2="466"
          y2="348"
          className="stroke-foreground"
          strokeWidth="10"
          strokeLinecap="round"
        />
      </g>
      <Bubble
        x={40}
        y={30}
        width={320}
        text={t("bubble")}
        tail="left"
        delay={1300}
      />
    </>
  );
}

// Backing up: a campfire burns the paper backup, the steel plate does not care.
function FireTest() {
  const t = useTranslations("Lesson.illustration.fireTest");
  return (
    <>
      <rect width="640" height="360" className="fill-muted" />
      <rect x="0" y="300" width="640" height="60" className="fill-card" />
      {/* Fire */}
      {[
        { x: 200, h: 90, fill: "fill-bear" },
        { x: 240, h: 120, fill: "fill-warning" },
        { x: 280, h: 80, fill: "fill-bear" },
      ].map((flame, index) => (
        <path
          key={flame.x}
          d={`M${flame.x - 30} 300 q30 ${-flame.h * 1.4} 30 ${-flame.h} q0 ${flame.h * 0.6} 30 ${flame.h} z`}
          className={cn(
            "origin-bottom transform-fill motion-safe:group-data-playing/anim:animate-flame-flicker",
            flame.fill,
          )}
          style={{ animationDelay: `${index * 100}ms` }}
        />
      ))}
      {/* Burning paper */}
      <g className="origin-center transform-fill motion-safe:group-data-playing/anim:animate-wiggle">
        <path
          d="M200 200 l70 -10 l6 50 l-60 14 z"
          className="fill-foreground opacity-70"
        />
        <text
          x="236"
          y="230"
          textAnchor="middle"
          className="fill-background text-xs font-bold"
        >
          {t("paper")}
        </text>
      </g>
      {/* Steel plate */}
      <rect
        x="400"
        y="180"
        width="160"
        height="100"
        rx="8"
        className="fill-muted-foreground"
      />
      {[200, 222, 244, 266].map((y) => (
        <rect
          key={y}
          x="420"
          y={y}
          width="120"
          height="8"
          rx="2"
          className="fill-background opacity-60"
        />
      ))}
      <text
        x="480"
        y="320"
        textAnchor="middle"
        className="fill-foreground text-sm font-bold"
      >
        {t("steel")}
      </text>
      <Bubble
        x={330}
        y={40}
        width={270}
        text={t("bubble")}
        tail="left"
        delay={1100}
      />
    </>
  );
}

// Passphrase: a bookshelf hides a secret door to the real safe.
function SecretDoor() {
  const t = useTranslations("Lesson.illustration.secretDoor");
  return (
    <>
      <rect width="640" height="360" className="fill-muted" />
      {/* Bookshelf */}
      <rect x="300" y="60" width="280" height="270" className="fill-chart-3" />
      {[110, 170, 230, 290].map((y) => (
        <rect
          key={y}
          x="300"
          y={y}
          width="280"
          height="8"
          className="fill-background opacity-40"
        />
      ))}
      {[316, 340, 362, 390, 414, 450, 476, 500, 530, 552].map((x, index) => (
        <rect
          key={x}
          x={x}
          y={index % 2 === 0 ? 70 : 128}
          width="18"
          height={index % 2 === 0 ? 40 : 42}
          className="fill-chart-1"
        />
      ))}
      {/* The secret door swings open to reveal the safe */}
      <rect
        x="440"
        y="180"
        width="120"
        height="110"
        className="fill-background"
      />
      <rect
        x="460"
        y="200"
        width="80"
        height="80"
        rx="6"
        className="fill-muted-foreground"
      />
      <circle
        cx="500"
        cy="240"
        r="16"
        className="fill-none stroke-background"
        strokeWidth="5"
      />
      <g className="motion-safe:group-data-playing/anim:animate-bob">
        <path d="M560 180 l36 -14 l0 138 l-36 -14 z" className="fill-warning" />
      </g>
      <text
        x="500"
        y="350"
        textAnchor="middle"
        className="fill-foreground text-xs font-bold"
      >
        {t("hint")}
      </text>
      <Person x={150} ground={330} mood="happy" />
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

// Split backups: a chest with two keyholes and three keys – any two open it.
function TwoOfThree() {
  const t = useTranslations("Lesson.illustration.twoOfThree");
  const keys = [
    { label: "1", x: 120, drops: true },
    { label: "2", x: 220, drops: true },
    { label: "3", x: 520, drops: false },
  ] as const;
  return (
    <>
      <rect width="640" height="360" className="fill-muted" />
      {/* The chest */}
      <rect
        x="250"
        y="190"
        width="200"
        height="120"
        rx="8"
        className="fill-chart-3"
      />
      <path d="M250 190 q100 -70 200 0 z" className="fill-warning" />
      <circle cx="320" cy="250" r="10" className="fill-foreground" />
      <circle cx="380" cy="250" r="10" className="fill-foreground" />
      <text
        x="350"
        y="345"
        textAnchor="middle"
        className="fill-foreground text-sm font-bold"
      >
        {t("chest")}
      </text>
      {keys.map((key, index) => (
        <g
          key={key.label}
          className={cn(
            key.drops && "motion-safe:group-data-playing/anim:animate-drop-in",
          )}
          style={{ animationDelay: `${300 + index * 300}ms` }}
        >
          <circle
            cx={key.x}
            cy="130"
            r="20"
            className="fill-none stroke-warning"
            strokeWidth="8"
          />
          <rect
            x={key.x - 4}
            y="148"
            width="8"
            height="50"
            className="fill-warning"
          />
          <text
            x={key.x}
            y="136"
            textAnchor="middle"
            className="fill-foreground text-sm font-bold"
          >
            {key.label}
          </text>
        </g>
      ))}
      <Bubble
        x={300}
        y={30}
        width={280}
        text={t("bubble")}
        tail="left"
        delay={1300}
      />
    </>
  );
}

// Inheritance: writing a letter for the family – what, where and whom to call, but not the words.
function LetterForFamily() {
  const t = useTranslations("Lesson.illustration.letterForFamily");
  return (
    <>
      <rect width="640" height="360" className="fill-muted" />
      <rect x="260" y="260" width="360" height="20" className="fill-chart-3" />
      <rect x="280" y="280" width="16" height="80" className="fill-chart-3" />
      <rect x="584" y="280" width="16" height="80" className="fill-chart-3" />
      {/* The letter */}
      <rect
        x="340"
        y="140"
        width="180"
        height="120"
        rx="4"
        className="fill-foreground"
      />
      {[0, 1, 2].map((index) => (
        <rect
          key={index}
          x="360"
          y={190 + index * 18}
          width="140"
          height="6"
          rx="3"
          className="fill-muted-foreground opacity-50"
        />
      ))}
      <text
        x="430"
        y="172"
        textAnchor="middle"
        className="fill-background text-sm font-bold"
      >
        {t("title")}
      </text>
      {/* The pen */}
      <g className="origin-bottom transform-fill motion-safe:group-data-playing/anim:animate-scribble">
        <path
          d="M480 250 l40 -40 l8 8 l-40 40 l-12 4 z"
          className="fill-chart-1"
        />
      </g>
      <Person x={180} ground={360} mood="happy" />
      <Bubble
        x={30}
        y={40}
        width={330}
        text={t("bubble")}
        tail="left"
        delay={1200}
      />
    </>
  );
}

// Attacks on wallets: a hook dangles an "urgent" email – the owner does not bite.
function PhishingHookWallet() {
  const t = useTranslations("Lesson.illustration.phishingHookWallet");
  return (
    <>
      <rect width="640" height="360" className="fill-muted" />
      <line
        x1="440"
        y1="0"
        x2="440"
        y2="120"
        className="stroke-muted-foreground"
        strokeWidth="2"
      />
      <g className="motion-safe:group-data-playing/anim:animate-bob">
        <rect
          x="350"
          y="120"
          width="180"
          height="110"
          rx="6"
          className="fill-foreground"
        />
        <path
          d="M350 120 l90 60 l90 -60"
          className="fill-none stroke-background"
          strokeWidth="4"
        />
        <text
          x="440"
          y="214"
          textAnchor="middle"
          className="fill-bear text-xs font-bold"
        >
          {t("email")}
        </text>
        <path
          d="M440 230 l0 30 q0 20 -20 20 q-16 0 -16 -14"
          className="fill-none stroke-muted-foreground"
          strokeWidth="5"
          strokeLinecap="round"
        />
      </g>
      <Person x={150} ground={360} mood="worried" />
      <Bubble
        x={30}
        y={40}
        width={280}
        text={t("bubble")}
        tail="left"
        delay={1200}
      />
    </>
  );
}

// Security plan: a shield with a tick and a happy owner – plan done.
function SecurityShield() {
  const t = useTranslations("Lesson.illustration.securityShield");
  return (
    <>
      <rect width="640" height="360" className="fill-muted" />
      <g className="motion-safe:group-data-playing/anim:animate-bob">
        <path
          d="M440 70 l110 40 l0 80 q0 80 -110 130 q-110 -50 -110 -130 l0 -80 z"
          className="fill-chart-1"
        />
        <path
          d="M390 190 l35 35 l70 -80"
          className="fill-none stroke-background motion-safe:group-data-playing/anim:animate-drop-in"
          strokeWidth="16"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ animationDelay: "500ms" }}
        />
      </g>
      {(
        [
          { x: 300, y: 80, fill: "fill-warning" },
          { x: 590, y: 60, fill: "fill-bull" },
          { x: 600, y: 260, fill: "fill-chart-5" },
          { x: 290, y: 280, fill: "fill-bear" },
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
      <Person x={150} ground={360} mood="happy" />
      <Bubble
        x={30}
        y={40}
        width={250}
        text={t("bubble")}
        tail="left"
        delay={1300}
      />
    </>
  );
}

export const CUSTODY_ILLUSTRATIONS = {
  hotelSafe: HotelSafe,
  masterKey: MasterKey,
  walletPockets: WalletPockets,
  trustTheScreen: TrustTheScreen,
  sealedBox: SealedBox,
  addressCompare: AddressCompare,
  fireTest: FireTest,
  secretDoor: SecretDoor,
  twoOfThree: TwoOfThree,
  letterForFamily: LetterForFamily,
  phishingHookWallet: PhishingHookWallet,
  securityShield: SecurityShield,
} as const;
