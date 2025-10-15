import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { join } from "path";
import { nanoid } from "nanoid";

interface UploadUrlRequest {
  userId: string;
  urls: string[];
}

interface UploadResponse {
  fileName: string;
  filePath: string;
  contentType: string;
  originalUrl: string;
  folder?: string;
  url: string;
}

interface UploadsResponse {
  uploads: UploadResponse[];
}

// Helper to get content type from URL or data
function getContentTypeFromUrl(url: string, contentTypeHeader?: string): string {
  if (contentTypeHeader) {
    return contentTypeHeader;
  }
  
  const ext = url.split('.').pop()?.split('?')[0].toLowerCase() || '';
  const contentTypes: Record<string, string> = {
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif',
    'webp': 'image/webp',
    'mp4': 'video/mp4',
    'webm': 'video/webm',
    'mp3': 'audio/mpeg',
    'wav': 'audio/wav',
  };
  return contentTypes[ext] || 'application/octet-stream';
}

export async function POST(request: NextRequest) {
  try {
    const body: UploadUrlRequest = await request.json();
    const { userId, urls } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return NextResponse.json(
        { error: "urls array is required and must not be empty" },
        { status: 400 }
      );
    }

    // Download files from URLs and save locally
    const uploads: UploadResponse[] = [];
    
    for (const url of urls) {
      try {
        // Download the file
        const response = await fetch(url);
        if (!response.ok) {
          console.error(`Failed to download ${url}: ${response.statusText}`);
          continue;
        }

        const buffer = await response.arrayBuffer();
        const fileBuffer = Buffer.from(buffer);
        
        // Get content type and extension
        const contentType = getContentTypeFromUrl(url, response.headers.get('content-type') || undefined);
        const urlExt = url.split('.').pop()?.split('?')[0] || 'bin';
        
        // Generate unique filename
        const fileId = nanoid();
        const uniqueFileName = `${fileId}.${urlExt}`;
        
        // Save to public/user-uploads directory
        const filePath = join(process.cwd(), "public", "user-uploads", uniqueFileName);
        await writeFile(filePath, fileBuffer);
        
        console.log(`[Upload URL] File saved locally: ${uniqueFileName}`);
        
        uploads.push({
          fileName: uniqueFileName,
          filePath: `/user-uploads/${uniqueFileName}`,
          contentType: contentType,
          originalUrl: url,
          folder: 'user-uploads',
          url: `/user-uploads/${uniqueFileName}`
        });
      } catch (error) {
        console.error(`Error downloading ${url}:`, error);
      }
    }

    return NextResponse.json({
      success: true,
      uploads: uploads
    });
  } catch (error) {
    console.error("Error in upload URL route:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
