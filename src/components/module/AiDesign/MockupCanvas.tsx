"use client";
import React, { useState, useRef, useEffect } from 'react';
import { Stage, Layer, Image as KonvaImage, Transformer } from 'react-konva';
import useImage from 'use-image';

export default function MockupCanvas({ imageUrl }: { imageUrl: string }) {
  // Try loading with crossOrigin, if fails, fallback to without it
  const [image, status] = useImage(imageUrl, 'anonymous');
  const [imageFallback] = useImage(status === 'failed' ? imageUrl : '');

  const finalImage = image || imageFallback;

  const [selected, setSelected] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const shapeRef = useRef<any>(null);
  const trRef = useRef<any>(null);

  useEffect(() => {
    const checkSize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight
        });
      }
    };

    checkSize();
    // Use ResizeObserver for more robust resizing
    const observer = new ResizeObserver(checkSize);
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (selected && trRef.current && shapeRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [selected]);

  if (!dimensions.width) {
    return <div ref={containerRef} className="w-full h-full" />;
  }

  // Initial size of the placed image (about 55% of container)
  const initialSize = Math.min(dimensions.width, dimensions.height) * 0.55;

  return (
    <div ref={containerRef} className="w-full h-full relative" onMouseLeave={() => setSelected(false)}>
      <Stage
        width={dimensions.width}
        height={dimensions.height}
        onMouseDown={(e) => {
          if (e.target === e.target.getStage()) {
            setSelected(false);
          }
        }}
        onTouchStart={(e) => {
          if (e.target === e.target.getStage()) {
            setSelected(false);
          }
        }}
      >
        <Layer>
          {finalImage && (
            <KonvaImage
              image={finalImage}
              ref={shapeRef}
              x={dimensions.width / 2 - initialSize / 2}
              y={dimensions.height / 2 - initialSize / 2}
              width={initialSize}
              height={initialSize}
              draggable
              onClick={() => setSelected(true)}
              onTap={() => setSelected(true)}
            // No blend mode needed here since remove.bg makes it completely transparent
            />
          )}
          {selected && (
            <Transformer
              ref={trRef}
              boundBoxFunc={(oldBox, newBox) => {
                // Minimum size limit
                if (newBox.width < 50 || newBox.height < 50) {
                  return oldBox;
                }
                return newBox;
              }}
            />
          )}
        </Layer>
      </Stage>

      {!selected && finalImage && (
        <div className="absolute bottom-6 left-0 right-0 flex justify-center pointer-events-none z-20">
          <span className="bg-black/70 text-white text-xs px-4 py-2 rounded-full font-medium shadow-lg backdrop-blur-sm transition-opacity opacity-100 animate-pulse">
            Tap design to Move & Resize
          </span>
        </div>
      )}
    </div>
  );
}
