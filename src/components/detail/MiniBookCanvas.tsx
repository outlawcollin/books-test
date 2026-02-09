"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import Book3D from "../Book3D";
import type { BookData } from "@/lib/types";

interface MiniBookCanvasProps {
  book: BookData;
}

export default function MiniBookCanvas({ book }: MiniBookCanvasProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 4], fov: 50 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      style={{ width: 124, height: 189 }}
    >
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <directionalLight position={[-3, 2, 4]} intensity={0.3} />
      <ContactShadows position={[0, -1.3, 0]} opacity={0.3} scale={5} blur={2} far={3} resolution={128} />
      <Suspense fallback={null}>
        <group rotation={[0, -0.3, 0]}>
          <Book3D
            book={book}
            state="cover"
            isActive={false}
          />
        </group>
      </Suspense>
    </Canvas>
  );
}
