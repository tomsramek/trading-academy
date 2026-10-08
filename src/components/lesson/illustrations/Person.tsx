// Simple figure shared by the lesson illustrations (a 640×360 drawing).

type PersonProps = {
  x: number;
  // The line the person stands on.
  ground: number;
  mood?: "happy" | "worried" | "surprised";
};

// Simple figure in the style of the other lesson illustrations: round head, rounded body.
export function Person({ x, ground, mood = "happy" }: PersonProps) {
  const headY = ground - 105;
  const mouths = {
    happy: `M${x - 10} ${headY + 8} q10 10 20 0`,
    worried: `M${x - 10} ${headY + 12} q10 -8 20 0`,
    surprised: "",
  };
  return (
    <g>
      <path
        d={`M${x - 45} ${ground} q0 -70 45 -70 q45 0 45 70 z`}
        className="fill-foreground"
      />
      <circle cx={x} cy={headY} r="28" className="fill-foreground" />
      <circle cx={x - 9} cy={headY - 6} r="3.5" className="fill-background" />
      <circle cx={x + 9} cy={headY - 6} r="3.5" className="fill-background" />
      {mood === "surprised" ? (
        <ellipse
          cx={x}
          cy={headY + 11}
          rx="5"
          ry="7"
          className="fill-background"
        />
      ) : (
        <path
          d={mouths[mood]}
          className="fill-none stroke-background"
          strokeWidth="3"
          strokeLinecap="round"
        />
      )}
    </g>
  );
}
