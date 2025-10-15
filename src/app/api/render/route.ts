import { createRenderJob, updateRenderJob } from "@/lib/render-jobs";
import fs from "fs";
import { nanoid } from "nanoid";
import { NextResponse } from "next/server";
import path from "path";

export { getRenderJobs } from "@/lib/render-jobs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { design, options } = body;

    if (!design) {
      return NextResponse.json(
        { message: "Design data is required" },
        { status: 400 }
      );
    }

    // Create a unique render job ID
    const renderId = nanoid();

    // Initialize the render job
    createRenderJob(renderId);

    // Start rendering in the background
    startLocalRender(renderId, design, options || {}).catch((error) => {
      console.error("Render error:", error);
      updateRenderJob(renderId, {
        status: "FAILED",
        error: error.message,
      });
    });

    // Return immediately with the render ID
    return NextResponse.json(
      {
        render: {
          id: renderId,
          status: "PENDING",
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

async function startLocalRender(renderId: string, design: any, options: any) {
  const { getRenderJobs: getJobs } = await import("@/lib/render-jobs");
  const jobs = getJobs();
  const job = jobs.get(renderId);
  if (!job) return;

  try {
    updateRenderJob(renderId, { status: "PROCESSING", progress: 10 });

    // Dynamically import Remotion dependencies to avoid Next.js bundling issues
    const { bundle } = await import("@remotion/bundler");
    const { renderMedia, selectComposition } = await import(
      "@remotion/renderer"
    );

    // Bundle the Remotion project
    const bundleLocation = await bundle({
      entryPoint: path.resolve(process.cwd(), "remotion/Root.tsx"),
      webpackOverride: (config: any) => config,
    });

    updateRenderJob(renderId, { progress: 30 });

    // Get composition details
    const composition = await selectComposition({
      serveUrl: bundleLocation,
      id: "VideoComposition",
      inputProps: { design },
    });


    updateRenderJob(renderId, { progress: 40 });

    // Set up output path
    const outputDir = path.resolve(process.cwd(), "public", "renders");
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const outputPath = path.join(outputDir, `${renderId}.mp4`);

    // Calculate actual duration from track items
    const fps = options.fps || composition.fps || 30;
    let actualDuration = design.duration || 5000;

    // Calculate duration from track items if available
    if (design.trackItemsMap && Object.keys(design.trackItemsMap).length > 0) {
      const maxEndTime = Math.max(
        ...Object.values(design.trackItemsMap).map((item: any) => {
          const start = item.display?.from || 0;
          const duration = item.display?.to
            ? item.display.to - start
            : item.details?.duration || 0;
          return start + duration;
        })
      );
      if (maxEndTime > 0) {
        actualDuration = maxEndTime;
        console.log(
          `[Render] Calculated duration from track items: ${actualDuration}ms`
        );
      }
    }

    const durationInFrames = Math.max(
      1,
      Math.ceil((actualDuration / 1000) * fps)
    );

    console.log(
      `[Render] Duration: ${actualDuration}ms (design.duration: ${design.duration}), FPS: ${fps}, Frames: ${durationInFrames}`
    );

    // Render the video with audio - comprehensive audio settings
    await renderMedia({
      composition: {
        ...composition,
        width: options.size?.width || composition.width,
        height: options.size?.height || composition.height,
        fps,
        durationInFrames,
      },
      serveUrl: bundleLocation,
      codec: "h264",
      audioCodec: "mp3",
      audioBitrate: "320k",
      outputLocation: outputPath,
      inputProps: { design },
      // Explicitly disable muting and enforce audio track
      disallowParallelEncoding: false,
      numberOfGifLoops: null,
      everyNthFrame: 1,
      // Force FFmpeg to include audio
      ffmpegOverride: ({ args }) => {
        console.log("[Render] FFmpeg args:", args.join(" "));
        return args;
      },
      onProgress: ({ progress }: { progress: number }) => {
        // Progress from 40% to 95% during rendering
        updateRenderJob(renderId, {
          progress: Math.floor(40 + progress * 55),
        });
      },
    });

    // Mark as complete
    updateRenderJob(renderId, {
      status: "COMPLETED",
      progress: 100,
      outputPath: `/renders/${renderId}.mp4`,
    });

    console.log(`Render completed: ${renderId}`);
  } catch (error) {
    console.error("Render failed:", error);
    updateRenderJob(renderId, {
      status: "FAILED",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
