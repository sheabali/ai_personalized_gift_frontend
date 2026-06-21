"use client";
import dynamic from "next/dynamic";

// Dynamically import MockupCanvas with SSR disabled
// This prevents Next.js hydration errors since Konva relies on window/canvas API
const DynamicMockupCanvas = dynamic(() => import("./MockupCanvas"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center text-neutral-400">
      Loading Canvas...
    </div>
  ),
});

export default DynamicMockupCanvas;
