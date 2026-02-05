"use client";

import { Suspense, Component, type ReactNode, forwardRef, memo, useMemo } from "react";
import { useTexture, Text } from "@react-three/drei";
import { useSpring, animated } from "@react-spring/three";
import * as THREE from "three";
import type { BookData } from "@/lib/types";

type BookState = "spine" | "cover";

interface Book3DProps {
  book: BookData;
  state: BookState;
  isActive: boolean;
  onClick?: () => void;
  width?: number;
  height?: number;
}

const COVER_THICKNESS = 0.02;
const PAGE_COLOR = "#f5f0e1";

// Shared materials — identical across all 25 books, created once
const pageMaterial = new THREE.MeshStandardMaterial({ color: PAGE_COLOR, roughness: 0.95 });
const pageEdgeMaterial = new THREE.MeshStandardMaterial({ color: PAGE_COLOR, roughness: 0.9 });

class TextureErrorBoundary extends Component<
  { fallback: ReactNode; children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

const Book3D = memo(forwardRef<THREE.Group, Book3DProps>(function Book3D(
  {
    book,
    state,
    isActive,
    onClick,
    width = 1.6,
    height = 2.4,
  },
  ref
) {
  const depth = (book.thickness ?? 72) / 240;
  const spineColor = book.spineColor ?? "#1a1a2e";

  // Memoize geometries — created once per book, reused across renders
  const geometries = useMemo(() => ({
    cover: new THREE.BoxGeometry(width, height, COVER_THICKNESS),
    spine: new THREE.BoxGeometry(COVER_THICKNESS, height, depth),
    pages: new THREE.BoxGeometry(width - 0.04, height - 0.04, depth - 0.01),
    edges: new THREE.BoxGeometry(COVER_THICKNESS, height - 0.02, depth - 0.02),
  }), [width, height, depth]);

  // Memoize per-book materials (spine color varies per book)
  const spineMaterials = useMemo(() => ({
    front: new THREE.MeshStandardMaterial({ color: spineColor, roughness: 0.6 }),
    back: new THREE.MeshStandardMaterial({ color: spineColor, roughness: 0.8 }),
    spine: new THREE.MeshStandardMaterial({ color: spineColor, roughness: 0.7 }),
  }), [spineColor]);

  // Rotation: spine state = PI/2 (spine faces camera), cover = 0 (front faces camera)
  const { rotationY } = useSpring({
    rotationY: state === "spine" ? Math.PI / 2 : 0,
    config: { mass: 1, tension: 120, friction: 20 },
  });

  return (
    <animated.group
      ref={ref}
      rotation-y={rotationY}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
    >
      {/* Front cover */}
      <group position={[0, 0, depth / 2]}>
        <mesh position={[0, 0, COVER_THICKNESS / 2]} geometry={geometries.cover}>
          <TextureErrorBoundary fallback={<primitive object={spineMaterials.front} attach="material" />}>
            <Suspense fallback={<primitive object={spineMaterials.front} attach="material" />}>
              <CoverMaterial
                coverUrl={book.coverImage}
                fallbackColor={spineColor}
              />
            </Suspense>
          </TextureErrorBoundary>
        </mesh>
      </group>

      {/* Back cover */}
      <mesh position={[0, 0, -depth / 2 - COVER_THICKNESS / 2]} geometry={geometries.cover} material={spineMaterials.back} />

      {/* Spine */}
      <mesh position={[-width / 2 - COVER_THICKNESS / 2, 0, 0]} geometry={geometries.spine} material={spineMaterials.spine} />

      {/* Spine text */}
      <Text
        position={[-width / 2 - COVER_THICKNESS - 0.005, 0, 0]}
        rotation={[0, -Math.PI / 2, Math.PI / 2]}
        fontSize={0.07}
        maxWidth={height * 0.85}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        textAlign="center"
      >
        {book.title} {"\u2022"} {book.author}
      </Text>

      {/* Pages block */}
      <mesh position={[0.01, 0, 0]} geometry={geometries.pages} material={pageMaterial} />

      {/* Page edges (right side) */}
      <mesh position={[width / 2, 0, 0]} geometry={geometries.edges} material={pageEdgeMaterial} />
    </animated.group>
  );
}));

export default Book3D;

function CoverMaterial({
  coverUrl,
  fallbackColor,
}: {
  coverUrl?: string;
  fallbackColor: string;
}) {
  if (!coverUrl) {
    return <meshStandardMaterial color={fallbackColor} roughness={0.6} />;
  }
  return <TexturedCover url={coverUrl} fallbackColor={fallbackColor} />;
}

function TexturedCover({
  url,
  fallbackColor,
}: {
  url: string;
  fallbackColor: string;
}) {
  const texture = useTexture(url);
  const material = useMemo(() => {
    if (!texture) return null;
    texture.colorSpace = THREE.SRGBColorSpace;
    return new THREE.MeshStandardMaterial({ map: texture, roughness: 0.6, metalness: 0.05 });
  }, [texture]);

  if (!material) {
    return <meshStandardMaterial color={fallbackColor} roughness={0.6} />;
  }
  return <primitive object={material} attach="material" />;
}
