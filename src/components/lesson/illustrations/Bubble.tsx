// Speech bubble shared by the lesson illustrations (a 640×360 drawing).

type BubbleProps = {
  x: number;
  y: number;
  width: number;
  text: string;
  // Which corner the tail points from: towards the speaker on the left or right below the bubble.
  tail: "left" | "right";
  // When the bubble pops up, in ms after the animation starts.
  delay?: number;
};

// Speech bubble that pops up after the rest of the scene has moved.
export function Bubble({ x, y, width, text, tail, delay = 800 }: BubbleProps) {
  const tailX = tail === "left" ? x + 30 : x + width - 30;
  return (
    <g
      className="origin-center transform-fill motion-safe:group-data-playing/anim:animate-bubble-pop"
      style={{ animationDelay: `${delay}ms` }}
    >
      <rect
        x={x}
        y={y}
        width={width}
        height="48"
        rx="24"
        className="fill-card stroke-border"
        strokeWidth="2"
      />
      <path
        d={`M${tailX - 10} ${y + 46} l10 22 l10 -22 z`}
        className="fill-card"
      />
      <text
        x={x + width / 2}
        y={y + 31}
        textAnchor="middle"
        className="fill-foreground text-lg font-semibold"
      >
        {text}
      </text>
    </g>
  );
}
