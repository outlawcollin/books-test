"use client";

import { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { PerformanceMonitor, ContactShadows, Bvh, Environment } from "@react-three/drei";
import * as THREE from "three";
import BookshelfScene from "./BookshelfScene";
import type { BookData } from "@/lib/types";
import { primary } from "@/lib/tokens";

interface BookshelfCanvasProps {
  books: BookData[];
  onSelectBook?: (book: BookData) => void;
  selectedBook?: BookData | null;
  spacerCenterY?: number | null;
}

export default function BookshelfCanvas({ books, onSelectBook, selectedBook, spacerCenterY }: BookshelfCanvasProps) {
  const [dpr, setDpr] = useState(1.5);

  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 50 }}
      dpr={[1, dpr]}
      gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 0.9 }}
      style={{ touchAction: "pan-x" }}
    >
      <PerformanceMonitor
        onIncline={() => setDpr(2)}
        onDecline={() => setDpr(1)}
      />
      <ambientLight intensity={0.4} />
      {/* Key light — warm, from upper right */}
      <directionalLight position={[5, 5, 5]} intensity={1.0} color="#fff5e6" />
      {/* Fill light — cool, softer, from left */}
      <directionalLight position={[-3, 2, 4]} intensity={0.2} color="#e6eeff" />
      <ContactShadows
        position={[0, -1.3, 0]}
        opacity={0.3}
        scale={20}
        blur={2}
        far={3}
        resolution={256}
        color={primary.pureBlack}
      />
      <Bvh firstHitOnly>
        <Suspense fallback={null}>
          <Environment preset="studio" environmentIntensity={0.25} />
          <BookshelfScene books={books} onSelectBook={onSelectBook} selectedBook={selectedBook} spacerCenterY={spacerCenterY} />
        </Suspense>
      </Bvh>
    </Canvas>
  );
}
