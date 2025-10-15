# Fix: Remotion Version Mismatch

## Problem
```
TypeError: Multiple versions of Remotion detected: 4.0.357 and 4.0.315
```

## Root Cause
The package.json had inconsistent Remotion version specifications:
- Some packages used `^4.0.315` (which allowed installing newer versions like 4.0.357)
- Some packages used `^4.0.0` (which allowed installing any 4.0.x version)

This caused pnpm to install different versions across the Remotion ecosystem.

## Solution Applied
Updated all Remotion packages to use **exact version 4.0.315** (removed the `^` prefix):

```json
"@remotion/bundler": "4.0.315",
"@remotion/cli": "4.0.315",
"@remotion/media-utils": "4.0.315",
"@remotion/paths": "4.0.315",
"@remotion/player": "4.0.315",
"@remotion/renderer": "4.0.315",
"@remotion/shapes": "4.0.315",
"@remotion/three": "4.0.315",
"@remotion/transitions": "4.0.315",
"remotion": "4.0.315"
```

## Steps Completed
1. ✅ Updated package.json with exact versions
2. ✅ Ran `pnpm install` to reinstall dependencies
3. ✅ Verified all packages are on 4.0.315

## Next Steps
1. Restart your dev server (if not already running)
2. Try exporting a video again
3. Check the terminal logs for render progress

## Verification
You can verify the versions are correct by running:
```bash
pnpm list remotion @remotion/bundler @remotion/renderer
```

All should show version 4.0.315.

## Note
If you still see version mismatch errors, try:
```bash
# Clear node_modules and reinstall
rm -rf node_modules
pnpm install

# Or clear pnpm cache
pnpm store prune
pnpm install
```
