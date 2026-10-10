import { z } from "zod";

import { ORDER_TYPES, SIDES } from "@/lib/content/order-simulator";

import { OrderSimulatorPanelLazy } from "./OrderSimulatorPanelLazy";

const orderSimulatorSchema = z.strictObject({
  // What the form starts with, so a lesson can open it on its own topic.
  side: z.enum(SIDES).default("buy"),
  type: z.enum(ORDER_TYPES).default("limit"),
  label: z.string().trim().min(1),
});

type OrderSimulatorProps = z.input<typeof orderSimulatorSchema>;

// A practice order panel with a simulated order book – no exchange, no money:
//   <OrderSimulator side="sell" type="stopLimit" label="…" />
export function OrderSimulator(props: OrderSimulatorProps) {
  const result = orderSimulatorSchema.safeParse(props);
  if (!result.success) {
    throw new Error(
      `Invalid <OrderSimulator label="${props.label}">:\n${z.prettifyError(result.error)}`,
    );
  }
  const { side, type, label } = result.data;

  return (
    <div className="not-prose my-8">
      <OrderSimulatorPanelLazy
        initialSide={side}
        initialType={type}
        label={label}
      />
    </div>
  );
}
