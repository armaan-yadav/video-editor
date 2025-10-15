import { useEffect } from "react";
import { dispatch } from "@designcombo/events";
import { LAYER_DELETE, ACTIVE_SPLIT, LAYER_CLONE } from "@designcombo/state";
import { getCurrentTime } from "../utils/time";

/**
 * Custom hook to handle keyboard shortcuts in the editor
 * - Delete: Remove selected items
 * - S: Split selected items at current time
 * - C: Clone/duplicate selected items
 */
export const useKeyboardShortcuts = (activeIds: string[]) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Get the active element to check if user is typing in an input
      const activeElement = document.activeElement;
      const isTyping =
        activeElement?.tagName === "INPUT" ||
        activeElement?.tagName === "TEXTAREA" ||
        activeElement?.getAttribute("contenteditable") === "true";

      // Don't trigger shortcuts if user is typing
      if (isTyping) {
        return;
      }

      // Only allow shortcuts if something is selected
      const hasSelection = activeIds.length > 0;

      switch (event.key.toLowerCase()) {
        case "delete":
        case "backspace":
          if (hasSelection) {
            event.preventDefault();
            dispatch(LAYER_DELETE);
            console.log("[Keyboard Shortcut] Delete triggered");
          }
          break;

        case "s":
          if (hasSelection && !event.ctrlKey && !event.metaKey) {
            event.preventDefault();
            dispatch(ACTIVE_SPLIT, {
              payload: {},
              options: {
                time: getCurrentTime(),
              },
            });
            console.log("[Keyboard Shortcut] Split triggered");
          }
          break;

        case "c":
          if (hasSelection && !event.ctrlKey && !event.metaKey) {
            event.preventDefault();
            dispatch(LAYER_CLONE);
            console.log("[Keyboard Shortcut] Clone triggered");
          }
          break;

        default:
          break;
      }
    };

    // Add event listener
    window.addEventListener("keydown", handleKeyDown);

    // Cleanup
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeIds]); // Re-attach listener when activeIds changes
};
