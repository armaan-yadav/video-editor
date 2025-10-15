import { Button } from "@/components/ui/button";
import { ADD_IMAGE, ADD_TEXT } from "@designcombo/state";
import { dispatch } from "@designcombo/events";
import { nanoid } from "nanoid";
import { DEFAULT_FONT } from "../constants/font";

export const Templates = () => {
  const handleAddNewsTemplate = () => {
    // Brand logo at top right corner
    dispatch(ADD_IMAGE, {
      payload: {
        id: nanoid(),
        display: {
          from: 0,
          to: 5000,
        },
        type: "image",
        details: {
          src: "", // User will need to upload their logo
          width: 200,
          height: 200,
          left: 1080 - 220, // 20px padding from right edge
          top: 20, // 20px padding from top
        },
      },
      options: {},
    });

    // Location text beneath the logo
    dispatch(ADD_TEXT, {
      payload: {
        id: nanoid(),
        display: {
          from: 0,
          to: 5000,
        },
        type: "text",
        details: {
          text: "Location",
          fontSize: 40,
          width: 200,
          fontUrl: DEFAULT_FONT.url,
          fontFamily: DEFAULT_FONT.postScriptName,
          color: "#ffffff",
          wordWrap: "break-word",
          textAlign: "center",
          borderWidth: 0,
          borderColor: "#000000",
          left: 1080 - 220, // Aligned with logo
          top: 240, // Below logo (20 + 200 + 20)
          boxShadow: {
            color: "#000000",
            x: 0,
            y: 0,
            blur: 0,
          },
        },
      },
      options: {},
    });

    // Main content area text (left side or center)
    dispatch(ADD_TEXT, {
      payload: {
        id: nanoid(),
        display: {
          from: 0,
          to: 5000,
        },
        type: "text",
        details: {
          text: "Main Content",
          fontSize: 80,
          width: 800,
          fontUrl: DEFAULT_FONT.url,
          fontFamily: DEFAULT_FONT.postScriptName,
          color: "#ffffff",
          wordWrap: "break-word",
          textAlign: "center",
          borderWidth: 0,
          borderColor: "#000000",
          left: 140, // Centered in left area (1080 - 200 - 40 = 840, 840/2 - 400 = 140)
          top: 960, // Vertically centered
          boxShadow: {
            color: "#000000",
            x: 2,
            y: 2,
            blur: 4,
          },
        },
      },
      options: {},
    });
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="text-text-primary flex h-12 flex-none items-center px-4 text-sm font-medium">
        Templates
      </div>

      <div className="flex flex-col gap-2 px-4">
        <Button onClick={handleAddNewsTemplate} variant="default" className="w-full">
          News Template
        </Button>
        <p className="text-xs text-gray-500 mt-2">
          Canvas divided with brand logo at top right corner and location beneath it.
        </p>
      </div>
    </div>
  );
};
