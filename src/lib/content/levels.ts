// zod/mini: this module also runs in the browser (the catalog filter), where the full zod and the
// other content schemas would add ~90 kB.
import * as z from "zod/mini";

export const LEVELS = ["beginner", "intermediate", "advanced"] as const;

export type Level = (typeof LEVELS)[number];

// ?level=… in the catalog URL.
export const levelParam = z.enum(LEVELS);
