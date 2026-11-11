import { ImageResponse } from "next/og";

const ALLOWED = [180, 192, 512];

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ size: string }> },
) {
  const { size } = await params;
  const px = Number(size);
  if (!ALLOWED.includes(px)) return new Response("Not found", { status: 404 });

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #22d3ee, #8b5cf6)",
          color: "#07080a",
          fontSize: px * 0.55,
          fontWeight: 700,
        }}
      >
        S
      </div>
    ),
    { width: px, height: px },
  );
}
