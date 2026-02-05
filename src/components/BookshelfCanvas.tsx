"use client";

import { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { PerformanceMonitor, ContactShadows, Bvh } from "@react-three/drei";
import BookshelfScene from "./BookshelfScene";
import type { BookData } from "@/lib/types";

interface BookshelfCanvasProps {
  books: BookData[];
  onSelectBook?: (book: BookData) => void;
  selectedBook?: BookData | null;
}

export default function BookshelfCanvas({ books, onSelectBook, selectedBook }: BookshelfCanvasProps) {
  const [dpr, setDpr] = useState(1.5);

  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 50 }}
      dpr={[1, dpr]}
      gl={{ antialias: true }}
      style={{ touchAction: "pan-x" }}
    >
      <PerformanceMonitor
        onIncline={() => setDpr(2)}
        onDecline={() => setDpr(1)}
      />
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <directionalLight position={[-3, 2, 4]} intensity={0.3} />
      <ContactShadows
        position={[0, -1.3, 0]}
        opacity={0.3}
        scale={20}
        blur={2}
        far={3}
        resolution={256}
        color="#000000"
      />
      <Bvh firstHitOnly>
        <Suspense fallback={null}>
          <BookshelfScene books={books} onSelectBook={onSelectBook} selectedBook={selectedBook} />
        </Suspense>
      </Bvh>
    </Canvas>
  );
}
