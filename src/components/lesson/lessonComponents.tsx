import type { MDXComponents } from "mdx/types";

import { BlockchainDiagram } from "./BlockchainDiagram";
import { CandleAnatomy } from "./CandleAnatomy";
import { CandleChart } from "./CandleChart";
import { CandlePattern } from "./CandlePattern";
import { ChartQuiz } from "./ChartQuiz";
import { Figure } from "./Figure";
import { Illustration } from "./Illustration";
import { IndicatorPeriod } from "./IndicatorPeriod";
import { IndicatorSteps } from "./IndicatorSteps";
import { KeyTerm } from "./KeyTerm";
import { LineChart } from "./LineChart";
import { OrderBook } from "./OrderBook";
import { OrderSimulator } from "./OrderSimulator";
import { SharedLedger } from "./SharedLedger";
import { TransactionFlow } from "./TransactionFlow";
import { Video } from "./Video";
import { WalletKeys } from "./WalletKeys";

// Components available in every lesson without an import. Passed by the lesson page
// (<Content components={LESSON_COMPONENTS} />) rather than registered in mdx-components.tsx, so only
// lesson pages carry their client code.
export const LESSON_COMPONENTS: MDXComponents = {
  BlockchainDiagram,
  CandleAnatomy,
  CandleChart,
  ChartQuiz,
  IndicatorPeriod,
  IndicatorSteps,
  OrderSimulator,
  CandlePattern,
  Figure,
  Illustration,
  KeyTerm,
  LineChart,
  OrderBook,
  SharedLedger,
  TransactionFlow,
  Video,
  WalletKeys,
};
