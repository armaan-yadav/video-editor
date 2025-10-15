# Debugging: Audio Distortion & Text Animation Issues

## Current Issues
1. **Audio distortion** in rendered videos
2. **Text animations/effects** not working correctly
3. **Text backgrounds** appearing shorter than in preview

## Changes Made

### 1. Audio Settings ✅
Changed to:
- **Codec**: AAC (most compatible)
- **Bitrate**: 192k (good quality without overprocessing)
- **No resampling**: Removed forced sample rate conversion
- **No audio filters**: Let FFmpeg handle audio naturally

Lower bitrate (192k vs 320k) can actually help because:
- Less aggressive compression
- Better compatibility with AAC encoder
- Still high quality (standard is 128-192k)

### 2. Enhanced Logging ✅
Added console logs to track:
- Number of track items being rendered
- Transitions, structure, background data
- What the Composition receives

### 3. Full Design Data Passthrough ✅
Added `...(design as any)` to ensure ALL properties from design are passed to the store, not just the ones we explicitly list.

## Next Steps for Debugging

### Check Console Logs
When you render, look for these logs:

```
[Render] Design data: {
  trackItemsCount: 5,
  hasTransitions: true,
  hasStructure: true,
  hasBackground: true
}

[Remotion Composition] Initializing with design: {
  trackItems: 5,
  transitions: 3,
  structure: 2
}
```

### If Numbers Don't Match Preview
The issue is in how the design data is being serialized/sent to the render API.

Check in `use-download-state.ts`:
- Is the full `payload` being sent?
- Are all nested properties included?
- Are animations/effects properties included?

### If Audio Still Distorted

The issue might be in how the `<Video>` or `<Audio>` components in your editor are configured.

Check `src/features/editor/player/composition.tsx`:
- How are video elements rendered?
- Are they using Remotion's `<Video>` or `<OffthreadVideo>` components?
- Do they have `volume` props set correctly?

### If Text Animations Don't Work

This suggests animation properties aren't being stored/passed. Check:
1. Where are text animations stored? (in trackItem.animations? trackItem.effects?)
2. Are these properties included in the design object?
3. Are they being applied in the SequenceItem component?

## Recommended Next Steps

1. **Run a render and share the console logs**
2. **Check what properties exist on a text trackItem**:
   ```javascript
   console.log('Text item:', design.trackItemsMap['text-item-id'])
   ```
3. **Compare preview vs render state**:
   - Add logging in both preview and render composition
   - See what's different

## Potential Root Causes

### Text Animation Issue
- Text animations might be CSS-based and not compatible with Remotion
- Animations might use browser-specific features
- Animation data might not be in the design object

### Audio Distortion
- Source videos might have variable sample rates
- Multiple audio sources might have incompatible formats
- Audio mixing might need special handling

## Quick Test

Try rendering a simple project with:
- 1 text element (no animation)
- 1 video with audio
- 1 background music

If this works, gradually add complexity to find what breaks.
