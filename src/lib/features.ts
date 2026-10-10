/*
 * Features that are built but not public yet. NEXT_PUBLIC_ variables are baked into the build, so
 * switching one on in production means a new deploy. Their values are validated with zod in
 * next.config.ts at build time – this module runs in the browser on every page, where zod would cost
 * tens of kB for a single comparison.
 */

// Login: sign-in page, account page and the account link in the header. Off until the privacy
// policy (#36) is out.
export const LOGIN_ENABLED = process.env.NEXT_PUBLIC_LOGIN_ENABLED === "true";
