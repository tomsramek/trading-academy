# UI states

Every screen or component that depends on data or user input must handle all of its states explicitly — not just the happy path.

| State              | Expectation                                                                                   |
| ------------------ | --------------------------------------------------------------------------------------------- |
| Loading            | Skeleton matching the final layout (no layout shift). Spinners only for short inline actions. |
| Empty              | Friendly message plus the next action ("No lessons yet — start your first course").           |
| Error              | Human-readable message, a retry action, and the technical detail logged, not shown.           |
| Partial            | Render what is available; mark the failed part instead of failing the whole page.             |
| Success            | Confirm mutations (toast or inline) and update the UI optimistically where safe.              |
| Disabled / pending | Buttons show pending state and cannot be double-submitted.                                    |

Forms:

- Validate on the client for UX and again on the server for safety (same zod schema).
- Show field errors next to the field; keep user input after a failed submit.

Before calling a UI task done, check each row of the table above for the changed screen.
