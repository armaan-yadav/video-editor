import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export const KeyboardShortcutsHelp = () => {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            aria-label="Keyboard shortcuts"
          >
            <HelpCircle className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-xs">
          <div className="space-y-2 p-2">
            <div className="font-semibold text-sm mb-2">Keyboard Shortcuts</div>
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between gap-4">
                <span className="text-muted-foreground">Delete selected</span>
                <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">
                  Del
                </kbd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-muted-foreground">Split at playhead</span>
                <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">
                  S
                </kbd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-muted-foreground">Clone/Duplicate</span>
                <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">
                  C
                </kbd>
              </div>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
