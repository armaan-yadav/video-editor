import { Composition, registerRoot } from "remotion";
import { VideoComposition, VideoCompositionProps } from "./Composition";
import { IDesign } from "@designcombo/types";

// This will receive the design via inputProps
export const RemotionRoot: React.FC<{ design?: IDesign }> = ({ design }) => {
  // Calculate dynamic values from design
  const fps = design?.fps || 30;
  const width = design?.size?.width || 1920;
  const height = design?.size?.height || 1080;
  
  // Calculate actual duration from track items
  let duration = design?.duration || 5000;
  if (design?.trackItemsMap && Object.keys(design.trackItemsMap).length > 0) {
    const maxEndTime = Math.max(
      ...Object.values(design.trackItemsMap).map((item: any) => {
        const start = item.display?.from || 0;
        const itemDuration = item.display?.to ? item.display.to - start : item.details?.duration || 0;
        return start + itemDuration;
      })
    );
    if (maxEndTime > 0) {
      duration = maxEndTime;
    }
  }
  
  const durationInFrames = Math.max(1, Math.ceil((duration / 1000) * fps));

  return (
    <>
      <Composition
        id="VideoComposition"
        component={VideoComposition}
        durationInFrames={durationInFrames}
        fps={fps}
        width={width}
        height={height}
        defaultProps={{
          design: design || {
            trackItemIds: [],
            trackItemsMap: {},
            size: { width, height },
            fps,
            duration,
            transitionsMap: {},
            structure: [],
            background: { type: "color", value: "white" },
          },
        }}
      />
    </>
  );
};

registerRoot(RemotionRoot);
