"use client";

import { PaperTexture } from "@paper-design/shaders-react";

export default function PaperBackground() {
  return (
    <PaperTexture
      contrast={0.15}
      roughness={0.3}
      fiber={0.2}
      fiberSize={0.15}
      crumples={0.1}
      crumpleSize={0.15}
      folds={0.15}
      foldCount={3}
      fade={0}
      drops={0.02}
      seed={3.2}
      scale={0.5}
      colorBack="#00000000"
      colorFront="#3e273315"
      className="fixed inset-0 z-0"
      style={{ backgroundColor: "#f4f0e9" }}
    />
  );
}
