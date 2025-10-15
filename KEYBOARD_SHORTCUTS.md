# Keyboard Shortcuts

This document describes the keyboard shortcuts available in the video editor.

## Available Shortcuts

### Delete - `Del` or `Backspace`
- **Action**: Deletes the selected track item(s)
- **Requirement**: At least one item must be selected
- **State Action**: `LAYER_DELETE`

### Split - `S`
- **Action**: Splits the selected track item(s) at the current playhead position
- **Requirement**: At least one item must be selected
- **State Action**: `ACTIVE_SPLIT`
- **Note**: Will not trigger if Ctrl/Cmd+S is pressed (to avoid conflicts with save shortcuts)

### Clone - `C`
- **Action**: Duplicates/clones the selected track item(s)
- **Requirement**: At least one item must be selected
- **State Action**: `LAYER_CLONE`
- **Note**: Will not trigger if Ctrl/Cmd+C is pressed (to preserve copy functionality)

## Implementation

### Hook Location
- **File**: `src/features/editor/hooks/use-keyboard-shortcuts.ts`
- **Usage**: Called in the main Editor component

### Features
- ✅ Prevents shortcuts when typing in input fields
- ✅ Prevents shortcuts when editing contenteditable elements
- ✅ Requires selection to be active
- ✅ Doesn't conflict with browser shortcuts (Ctrl+C, Ctrl+S, etc.)
- ✅ Console logging for debugging

### UI Indicators
- Keyboard shortcut hints are shown next to buttons in the timeline header (large screens only)
- Help tooltip available via the `?` icon in the timeline header
- Visual `<kbd>` elements show the keys to press

## Usage

1. **Select an item** in the timeline
2. **Press the keyboard shortcut**:
   - `Del` or `Backspace` to delete
   - `S` to split at playhead
   - `C` to clone/duplicate

## Technical Details

### Safety Checks
The keyboard shortcuts will NOT trigger if:
- User is typing in an `<input>` field
- User is typing in a `<textarea>`
- User is editing a `contenteditable` element
- No items are selected
- Ctrl/Cmd modifier key is pressed (for C and S keys)

### Event Handling
- Uses `window.addEventListener("keydown", ...)`
- Cleans up listener on component unmount
- Re-attaches listener when `activeIds` changes

### State Integration
- Integrates with `@designcombo/state` actions
- Uses `dispatch` from `@designcombo/events`
- Respects the current timeline state (playhead position, selected items, etc.)

## Future Enhancements

Potential shortcuts to add:
- `Space` - Play/Pause
- `Ctrl+Z` - Undo
- `Ctrl+Y` - Redo
- `Ctrl+D` - Duplicate
- Arrow keys - Move playhead
- `Home` - Jump to start
- `End` - Jump to end
- `Ctrl+A` - Select all

## Testing

To test the shortcuts:
1. Open the video editor
2. Add some items to the timeline
3. Select an item by clicking on it
4. Try the keyboard shortcuts:
   - Press `Del` - item should be deleted
   - Select item and press `S` - item should split
   - Select item and press `C` - item should be cloned

## Troubleshooting

**Shortcuts not working?**
- Check if you have an item selected (blue outline in timeline)
- Make sure you're not typing in an input field
- Check browser console for "[Keyboard Shortcut]" logs
- Verify no browser extension is intercepting the keys

**Split not working at the right position?**
- Make sure the playhead is positioned where you want to split
- The split happens at the current playhead time

**Clone creates item in wrong place?**
- The clone is created with the same timing as the original
- You may need to move it after cloning
