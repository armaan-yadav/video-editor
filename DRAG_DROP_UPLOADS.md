# Drag and Drop Assets to Timeline

## Overview

Assets from the "Uploads" menu can now be dragged and dropped directly onto the timeline, providing a more intuitive way to add videos, images, and audio to your compositions.

## Features

### ✨ Draggable Assets

All uploaded assets in the "Your uploads" section are now draggable:

- **Videos** 🎥 - Drag video files to add them to the timeline
- **Images** 🖼️ - Drag image files to add them to the timeline  
- **Audio** 🎵 - Drag audio files to add them to the timeline

### 🎯 How to Use

1. **Upload assets** using the "Upload" button in the Uploads menu
2. **Click and drag** any asset thumbnail from the uploads section
3. **Drop it onto the timeline** where you want it to appear
4. The asset will be automatically added to the timeline at the drop location

### 👀 Visual Feedback

- **Custom drag preview**: Shows a thumbnail of the asset while dragging
- **Cursor following**: Preview follows your cursor as you drag
- **Timeline highlight**: Timeline shows where the asset will be dropped
- **Preview hiding**: Custom preview is hidden when dragging over timeline (uses native timeline drop indicator)

## Implementation Details

### Wrapped Components

Each asset card in the uploads menu is wrapped with the `Draggable` component:

```tsx
<Draggable
  data={{
    id: generateId(),
    type: "video",
    details: {
      src: videoSrc,
    },
    metadata: {
      previewUrl: videoSrc,
    },
  }}
  renderCustomPreview={...}
  shouldDisplayPreview={!isDraggingOverTimeline}
>
  {/* Asset card content */}
</Draggable>
```

### Data Structure

When dragging, the following data is passed to the timeline:

#### Video
```typescript
{
  id: string,          // Generated unique ID
  type: "video",
  details: {
    src: string,       // Video source URL/path
  },
  metadata: {
    previewUrl: string // Thumbnail URL
  }
}
```

#### Image
```typescript
{
  id: string,          // Generated unique ID
  type: "image",
  display: {
    from: 0,
    to: 5000,          // Default 5 second duration
  },
  details: {
    src: string,       // Image source URL/path
  },
  metadata: {}
}
```

#### Audio
```typescript
{
  id: string,          // Generated unique ID
  type: "audio",
  details: {
    src: string,       // Audio source URL/path
  },
  metadata: {}
}
```

### Drag Previews

Each asset type has a custom drag preview:

- **Video**: 80x80px video thumbnail with rounded corners
- **Image**: 80x80px image thumbnail with rounded corners
- **Audio**: 80x80px gradient card with music icon

### Components Used

- `Draggable` - From `@/components/shared/draggable`
- `useIsDraggingOverTimeline` - Hook to detect when dragging over timeline

## Integration with Timeline

The timeline already has built-in drop handling that:

1. Detects when a draggable item is dropped
2. Extracts the data from the drag event
3. Calculates the drop position/time
4. Dispatches the appropriate action (ADD_VIDEO, ADD_IMAGE, ADD_AUDIO)
5. Adds the item to the timeline at the correct position

## Alternative Methods

You can still add assets using:

1. **Click to add**: Click on any asset thumbnail to add it at time 0
2. **Buttons**: Use the add buttons in other menu sections
3. **Drag from other sections**: Images, Videos, and Audio menu sections also support drag and drop

## Benefits

- **Faster workflow**: No need to scroll timeline to time 0
- **Precise placement**: Drop assets exactly where you want them
- **Visual feedback**: See where assets will land before dropping
- **Intuitive UX**: Familiar drag-and-drop interaction

## Technical Notes

### File Paths

Assets can have multiple path properties, resolved in order:
1. `metadata.uploadedUrl` - Preferred cloud/CDN URL
2. `filePath` - Local file path (from local uploads)
3. `url` - Fallback URL

### Timeline Detection

The `useIsDraggingOverTimeline` hook detects when the user is dragging over the timeline area, which hides the custom preview and shows the timeline's native drop indicator.

### ID Generation

Each dragged asset gets a unique ID via `generateId()` from `@designcombo/timeline`.

## Future Enhancements

Potential improvements:
- [ ] Show duration indicator on video/audio drag previews
- [ ] Support multi-select drag (drag multiple assets at once)
- [ ] Snap to grid/markers when dropping
- [ ] Preview playhead position while dragging
- [ ] Drag to specific tracks (not just time position)
- [ ] Undo/redo support for drag operations

## Testing

To test the drag and drop functionality:

1. Upload some assets (video, image, or audio)
2. Open the Uploads menu
3. Click and hold on an asset thumbnail
4. Drag it over to the timeline
5. Release to drop
6. Verify the asset appears at the correct position

## Troubleshooting

**Asset not dropping?**
- Make sure you're dropping on the timeline area
- Check that the timeline is visible (not minimized)
- Verify the asset uploaded successfully

**Wrong position?**
- The asset drops at the time position where you release
- Adjust the playhead or drop position as needed

**Preview not showing?**
- Custom preview is hidden when over timeline (normal behavior)
- Preview shows when dragging over other areas

## Files Modified

- `src/features/editor/menu-item/uploads.tsx` - Added Draggable wrapper to all assets
- Added custom drag previews for each asset type
- Integrated with timeline drop detection
