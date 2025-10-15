# Local Asset Storage System

## Overview

All user uploads are stored **locally only** in the `public/user-uploads` directory. No cloud storage services are used.

## Architecture

This application uses a **fully local** asset storage system:
- ✅ User uploads → Local filesystem
- ✅ Rendered videos → Local filesystem
- ✅ External URLs → Downloaded and saved locally
- ❌ Cloud storage → **Completely removed**

## How It Works

### File Upload Flow

1. **Request Presigned URL**: Client requests upload URLs from `/api/uploads/presign`
   - Server generates unique file IDs using nanoid
   - Returns local API endpoint for upload

2. **Upload File**: Client uploads file to `/api/uploads/local`
   - File is saved to `public/user-uploads/{fileId}.{ext}`
   - File is accessible at `/user-uploads/{fileId}.{ext}`

3. **URL Upload**: Client can also upload from external URLs via `/api/uploads/url`
   - Server downloads file from external URL
   - Saves locally to `public/user-uploads/`

### Directory Structure

```
public/
├── user-uploads/        # User uploaded files (images, videos, audio)
│   ├── .gitkeep        # Keeps directory in git
│   └── {fileId}.{ext}  # Uploaded files
└── renders/            # Rendered videos
    ├── .gitkeep        # Keeps directory in git
    └── {renderId}.mp4  # Rendered video files
```

## Supported File Types

### Images
- JPEG/JPG
- PNG
- GIF
- WebP
- SVG

### Videos
- MP4
- WebM
- MOV
- AVI

### Audio
- MP3
- WAV
- OGG
- M4A
- AAC

## Benefits of Local Storage

1. **No External Dependencies**: No need for cloud storage services
2. **Faster Uploads**: Direct file system writes
3. **Simpler Development**: No API keys or external configurations
4. **Cost Savings**: No cloud storage costs
5. **Privacy**: Files stay on your machine

## Important Notes

⚠️ **Git Ignore**: Uploaded files are excluded from git via `.gitignore`
⚠️ **Backup**: Make sure to backup `public/user-uploads` directory
⚠️ **Disk Space**: Monitor disk usage as files accumulate
⚠️ **Production**: For production, consider cloud storage for scalability

## API Endpoints

### POST /api/uploads/presign
Request presigned URLs for file uploads

**Request:**
```json
{
  "userId": "string",
  "fileNames": ["file1.jpg", "file2.mp4"]
}
```

**Response:**
```json
{
  "success": true,
  "uploads": [
    {
      "fileName": "file1.jpg",
      "filePath": "/user-uploads/abc123.jpg",
      "contentType": "image/jpeg",
      "presignedUrl": "/api/uploads/local?fileId=abc123&fileName=file1.jpg",
      "folder": "user-uploads",
      "url": "/user-uploads/abc123.jpg"
    }
  ]
}
```

### PUT /api/uploads/local
Upload file to local storage

**Query Parameters:**
- `fileId`: Unique file identifier
- `fileName`: Original file name

**Body:** Binary file data

### POST /api/uploads/url
Upload from external URL

**Request:**
```json
{
  "userId": "string",
  "urls": ["https://example.com/image.jpg"]
}
```

**Response:**
```json
{
  "success": true,
  "uploads": [
    {
      "fileName": "xyz789.jpg",
      "filePath": "/user-uploads/xyz789.jpg",
      "contentType": "image/jpeg",
      "originalUrl": "https://example.com/image.jpg",
      "folder": "user-uploads",
      "url": "/user-uploads/xyz789.jpg"
    }
  ]
}
```

## Cleanup

To remove old uploads, you can manually delete files from `public/user-uploads/` directory or create a cleanup script.
