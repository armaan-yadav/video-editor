import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";

interface PresignRequest {
  userId: string;
  fileNames: string[];
}

interface PresignResponse {
  fileName: string;
  filePath: string;
  contentType: string;
  presignedUrl: string;
  folder?: string;
  url: string;
}

interface PresignsResponse {
  uploads: PresignResponse[];
}

// Helper to get content type from file extension
function getContentType(fileName: string): string {
  const ext = fileName.split('.').pop()?.toLowerCase() || '';
  const contentTypes: Record<string, string> = {
    // Images
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif',
    'webp': 'image/webp',
    'svg': 'image/svg+xml',
    // Videos
    'mp4': 'video/mp4',
    'webm': 'video/webm',
    'mov': 'video/quicktime',
    'avi': 'video/x-msvideo',
    // Audio
    'mp3': 'audio/mpeg',
    'wav': 'audio/wav',
    'ogg': 'audio/ogg',
    'm4a': 'audio/mp4',
    'aac': 'audio/aac',
  };
  return contentTypes[ext] || 'application/octet-stream';
}

export async function POST(request: NextRequest) {
  try {
    const body: PresignRequest = await request.json();
    const { userId, fileNames } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    if (!fileNames || !Array.isArray(fileNames) || fileNames.length === 0) {
      return NextResponse.json(
        { error: "fileNames array is required and must not be empty" },
        { status: 400 }
      );
    }

    // Generate local upload URLs
    const uploads: PresignResponse[] = fileNames.map((fileName) => {
      const fileId = nanoid();
      const ext = fileName.split('.').pop() || '';
      const uniqueFileName = `${fileId}.${ext}`;
      const contentType = getContentType(fileName);
      const filePath = `/user-uploads/${uniqueFileName}`;
      
      return {
        fileName: fileName,
        filePath: filePath,
        contentType: contentType,
        presignedUrl: `/api/uploads/local?fileId=${fileId}&fileName=${encodeURIComponent(fileName)}`,
        folder: 'user-uploads',
        url: filePath
      };
    });

    return NextResponse.json({
      success: true,
      uploads: uploads
    });
  } catch (error) {
    console.error("Error in presign route:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
