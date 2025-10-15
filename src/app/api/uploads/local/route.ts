import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { join } from "path";

export async function PUT(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const fileId = searchParams.get("fileId");
    const fileName = searchParams.get("fileName");

    if (!fileId || !fileName) {
      return NextResponse.json(
        { error: "fileId and fileName are required" },
        { status: 400 }
      );
    }

    // Get the file data as buffer
    const buffer = await request.arrayBuffer();
    const fileBuffer = Buffer.from(buffer);

    // Get file extension
    const ext = fileName.split('.').pop() || '';
    const uniqueFileName = `${fileId}.${ext}`;

    // Save to public/user-uploads directory
    const filePath = join(process.cwd(), "public", "user-uploads", uniqueFileName);
    await writeFile(filePath, fileBuffer);

    console.log(`[Upload] File saved locally: ${uniqueFileName}`);

    return new NextResponse(null, { status: 200 });
  } catch (error) {
    console.error("Error in local upload route:", error);
    return NextResponse.json(
      {
        error: "Failed to save file",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
