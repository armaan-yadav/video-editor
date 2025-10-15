# Fix: esbuild/webpack Module Parse Error

## Problem
When using `@remotion/bundler` in Next.js API routes, you encountered this error:
```
Module parse failed: Unexpected token (1:7)
> export type Platform = 'browser' | 'node' | 'neutral'
```

## Root Cause
Next.js was trying to bundle server-side dependencies (`@remotion/bundler` and `esbuild`) with webpack, which caused conflicts because:
1. These packages contain TypeScript declaration files (`.d.ts`)
2. These packages are meant to run only in Node.js, not in a bundled environment
3. esbuild itself is a native binary that shouldn't be processed by webpack

## Solution
**Use dynamic imports** to load these dependencies at runtime rather than at build time:

```typescript
// ❌ Before (static import - causes webpack to bundle it)
import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";

// ✅ After (dynamic import - loaded at runtime, skips webpack)
const { bundle } = await import("@remotion/bundler");
const { renderMedia, selectComposition } = await import("@remotion/renderer");
```

## Changes Made
Updated `src/app/api/render/route.ts`:
- Removed static imports for `@remotion/bundler` and `@remotion/renderer`
- Added dynamic imports inside the `startLocalRender()` function
- This ensures the packages are only loaded at runtime when actually needed

## Why This Works
- Dynamic imports are not processed by webpack's module system
- The packages remain external and are loaded from `node_modules` at runtime
- This is the recommended approach for Node.js-specific packages in Next.js

## Alternative Solutions (Not Used)
1. **webpack externals configuration** - More complex, requires Next.js config changes
2. **Separate microservice** - Overkill for this use case
3. **Different bundler** - Would require rewriting the entire render logic

The dynamic import solution is the cleanest and most maintainable approach! 🎉
