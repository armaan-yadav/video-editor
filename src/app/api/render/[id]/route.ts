import { NextResponse } from "next/server";
import { getRenderJob } from "@/lib/render-jobs";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { message: "Render ID is required" },
        { status: 400 }
      );
    }

    const job = getRenderJob(id);

    if (!job) {
      return NextResponse.json(
        { message: "Render job not found" },
        { status: 404 }
      );
    }

    // Build the response
    const response = {
      render: {
        id: job.id,
        status: job.status,
        progress: job.progress,
        // Local file URL (not presigned, kept for backwards compatibility)
        presigned_url:
          job.status === "COMPLETED" && job.outputPath
            ? `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3002"}${job.outputPath}`
            : undefined,
        error: job.error
      }
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
