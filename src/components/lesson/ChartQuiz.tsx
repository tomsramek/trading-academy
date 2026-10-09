import { z } from "zod";

import {
  buildChartQuiz,
  chartQuizSchema,
  type ChartQuizInput,
} from "@/lib/content/chart-quiz";

import type { CandleDataset } from "./CandleChart";
import { ChartQuizPlayer } from "./ChartQuizPlayer";
import { ChartSource } from "./ChartSource";

type ChartQuizProps = ChartQuizInput & {
  data: CandleDataset;
};

// "Click the candle where…" with an instant answer:
//   <ChartQuiz data={btc} from="2024-03-01" question="…" answer="2024-03-05" explanation="…"
//     indicators={{ panel: "rsi" }} label="…" />
// The answer can be a range: answer={["2024-03-05", "2024-03-07"]}.
export function ChartQuiz({ data, ...input }: ChartQuizProps) {
  const result = chartQuizSchema.safeParse(input);
  if (!result.success) {
    throw new Error(
      `Invalid <ChartQuiz label="${input.label}">:\n${z.prettifyError(result.error)}`,
    );
  }
  const quiz = buildChartQuiz(input, data.candles);

  return (
    <figure className="not-prose my-8 flex flex-col gap-3">
      <ChartQuizPlayer
        quiz={quiz}
        question={result.data.question}
        explanation={result.data.explanation}
        label={result.data.label}
      />
      <figcaption className="text-sm text-muted-foreground">
        <ChartSource source={data.source} license={data.license} />
      </figcaption>
    </figure>
  );
}
