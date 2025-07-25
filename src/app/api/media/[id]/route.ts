import { verifyRefreshToken } from "@/lib/utils";
import { downloadFile } from "@/database/b2";
import { Readable } from "stream";
import { headers } from "next/headers";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  await verifyRefreshToken();
  const { id } = await params;
  const media = await downloadFile(id);
  const mediaStream = Readable.toWeb(media.body) as ReadableStream;

  const isdocument = new URL(request.url).searchParams.get("doc");

  return new Response(mediaStream, {
    headers: {
      "Content-Type": media.details.content_type as string,
      "Cache-Control": "public, max-age=86400, immutable",
      "Content-Disposition": `${isdocument === "true" ? "attachement" : "inline"}; filename=${media.details.name}`, //Use "inline" to display in-browser or "attachment" to trigger a download.
    },
  });
}
