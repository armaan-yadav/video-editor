import React, { useLayoutEffect, useState } from "react";
import { IDesign } from "@designcombo/types";
import { AbsoluteFill, continueRender, delayRender } from "remotion";
import Composition from "../src/features/editor/player/composition";
import useStore from "../src/features/editor/store/use-store";

export interface VideoCompositionProps {
  design?: IDesign;
}

export const VideoComposition: React.FC<VideoCompositionProps> = ({
  design,
}) => {
  const [handle] = useState(() => delayRender());
  const [initialized, setInitialized] = useState(false);

  // Use useLayoutEffect to initialize before render
  useLayoutEffect(() => {
    if (design && !initialized) {
      // Get the store and update it synchronously
      const store = useStore.getState();

      console.log("[Remotion Composition] Initializing with design:", {
        trackItems: Object.keys(design.trackItemsMap || {}).length,
        transitions: Object.keys(design.transitionsMap || {}).length,
        structure: design.structure?.length || 0,
      });

      // Update store with ALL design data
      store.setState({
        trackItemIds: design.trackItemIds || [],
        trackItemsMap: design.trackItemsMap || {},
        size: design.size || { width: 1920, height: 1080 },
        fps: design.fps || 30,
        duration: design.duration || 5000,
        transitionsMap: design.transitionsMap || {},
        structure: design.structure || [],
        background: design.background || { type: "color", value: "white" },
        tracks: design.tracks || [],
        transitionIds: design.transitionIds || [],
        // Make sure to include any additional properties from design
        ...(design as any),
      });

      setInitialized(true);
      continueRender(handle);
    }
  }, [design, initialized, handle]);

  if (!initialized) {
    return null;
  }

  const bgColor =
    design?.background?.type === "color" ? design.background.value : "white";

  return (
    <AbsoluteFill
      style={{
        backgroundColor: bgColor,
        width: design?.size?.width || 1920,
        height: design?.size?.height || 1080,
      }}
    >
      <Composition />
    </AbsoluteFill>
  );
};
