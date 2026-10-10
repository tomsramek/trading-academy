"use client";

import { lazy, Suspense, type ComponentProps } from "react";

// The simulator (and the zod/mini that checks its form) is loaded only in the lessons that use it –
// the lesson page includes every lesson, so a direct import would ship it to all of them.
const OrderSimulatorPanel = lazy(() =>
  import("./OrderSimulatorPanel").then((module) => ({
    default: module.OrderSimulatorPanel,
  })),
);

type OrderSimulatorPanelLazyProps = ComponentProps<typeof OrderSimulatorPanel>;

export function OrderSimulatorPanelLazy(props: OrderSimulatorPanelLazyProps) {
  return (
    <Suspense
      fallback={
        // Shown only while the code loads after navigating; the first visit gets the server render.
        <div className="min-h-96 rounded-xl border border-border" />
      }
    >
      <OrderSimulatorPanel {...props} />
    </Suspense>
  );
}
