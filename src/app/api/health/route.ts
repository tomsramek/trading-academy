export function GET() {
  return Response.json(
    {
      status: "ok",
      commit: process.env.SOURCE_COMMIT ?? "unknown",
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
