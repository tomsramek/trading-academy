// Colors of the canvas charts: lightweight-charts draws on a canvas and does not understand CSS
// variables or oklch(), so the design tokens are read and converted here.

export type ColorOf = (token: string) => string;

// Reads a design token (e.g. "--bull") as rgb(), because lightweight-charts does not understand oklch().
// The browser converts any CSS color when it is drawn on a canvas, so a 1×1 canvas does the conversion.
export function tokenReader(element: HTMLElement): ColorOf {
  const styles = getComputedStyle(element);
  const context = document.createElement("canvas").getContext("2d", {
    willReadFrequently: true,
  });

  return (token) => {
    const value = styles.getPropertyValue(token).trim();
    if (!context) {
      return value;
    }
    context.clearRect(0, 0, 1, 1);
    context.fillStyle = value;
    context.fillRect(0, 0, 1, 1);
    const [red = 0, green = 0, blue = 0, alpha = 255] = context.getImageData(
      0,
      0,
      1,
      1,
    ).data;
    return `rgba(${red}, ${green}, ${blue}, ${alpha / 255})`;
  };
}

// "rgba(22, 163, 74, 1)" → "rgba(22, 163, 74, 0.5)"
export function withAlpha(rgba: string, alpha: number): string {
  return rgba.replace(/,\s*[\d.]+\)$/, `, ${alpha})`);
}
