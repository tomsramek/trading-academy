import { z } from "zod";

/*
 * Features that are built but not public yet. NEXT_PUBLIC_ variables are baked into the build, so
 * switching one on in production means a new deploy.
 */

const flag = z.enum(["true", "false"]).default("false");

// Login: sign-in page, account page and the account link in the header. Off until the privacy
// policy (#36) is out.
export const LOGIN_ENABLED =
  flag.parse(process.env.NEXT_PUBLIC_LOGIN_ENABLED) === "true";
