"use client";

import { Suspense, Component, type ReactNode, forwardRef, memo, useMemo } from "react";
import { useTexture, Text } from "@react-three/drei";
import { useSpring, animated } from "@react-spring/three";
import * as THREE from "three";
import type { BookData } from "@/lib/types";
import { primary } from "@/lib/tokens";

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
const SPINE_FONT = "/fonts/LibreBaskerville-Regular.ttf";
const PAGE_COLOR = primary.bookBackground;

// Cloth/leather grain bump texture for book covers and spine
function createClothBumpTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext("2d")!;
  const imageData = ctx.createImageData(128, 128);
  for (let i = 0; i < imageData.data.length; i += 4) {
    const v = Math.floor(Math.random() * 60) + 195;
    imageData.data[i] = v;
    imageData.data[i + 1] = v;
    imageData.data[i + 2] = v;
    imageData.data[i + 3] = 255;
  }
  ctx.putImageData(imageData, 0, 0);
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(2, 3);
  return tex;
}

// Page-line bump texture — horizontal stripes simulating individual pages
function createPageBumpTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 4;
  canvas.height = 256;
  const ctx = canvas.getContext("2d")!;
  for (let y = 0; y < 256; y++) {
    ctx.fillStyle = y % 3 === 0 ? "#000000" : "#ffffff";
    ctx.fillRect(0, y, 4, 1);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(1, 4);
  return tex;
}

// Shared textures — created once, reused across all books
const clothBumpMap = typeof document !== "undefined" ? createClothBumpTexture() : null;
const pageBumpMap = typeof document !== "undefined" ? createPageBumpTexture() : null;
const pageMaterial = new THREE.MeshStandardMaterial({
  color: PAGE_COLOR,
  roughness: 0.6,
  bumpMap: pageBumpMap,
  bumpScale: 1.0,
});
const pageEdgeMaterial = new THREE.MeshStandardMaterial({
  color: PAGE_COLOR,
  roughness: 0.5,
  bumpMap: pageBumpMap,
  bumpScale: 1.0,
});

// --- Bookmark ribbon (shared across all books) ---
function createBookmarkGeometry() {
  const w = 0.18;
  const h = 0.45;
  const notch = 0.07;
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.lineTo(w, 0);
  shape.lineTo(w, -h);
  shape.lineTo(w / 2, -h + notch);
  shape.lineTo(0, -h);
  shape.closePath();
  return new THREE.ExtrudeGeometry(shape, { depth: 0.005, bevelEnabled: false });
}

const bookmarkGeometry = typeof document !== "undefined" ? createBookmarkGeometry() : null;
const bookmarkMaterial = new THREE.MeshStandardMaterial({
  color: "#943E3E",
  roughness: 0.7,
  bumpMap: clothBumpMap,
  bumpScale: 0.5,
});

// --- "My copy" tape (shared across all books) ---
const TAPE_W = 256;
const TAPE_H = 96;

// Deterministic pseudo-random for consistent torn edges across redraws
function seeded(i: number) {
  return ((Math.sin(i * 127.1 + 311.7) * 43758.5453) % 1 + 1) % 1;
}

function drawTapeCanvas(canvas: HTMLCanvasElement, caveatLoaded = false) {
  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, TAPE_W, TAPE_H);

  const margin = 8;
  const top = 16;
  const bottom = 80;

  // Tape shape with rough/torn edges
  ctx.fillStyle = "#EDE4D4";
  ctx.beginPath();
  ctx.moveTo(margin, top + (seeded(0) - 0.5) * 6);
  // Top edge
  for (let x = margin + 8; x <= TAPE_W - margin; x += 8) {
    ctx.lineTo(x, top + (seeded(x) - 0.5) * 5);
  }
  // Right torn edge
  for (let y = top + 8; y <= bottom; y += 6) {
    ctx.lineTo(TAPE_W - margin + (seeded(y + 200) - 0.5) * 10, y);
  }
  // Bottom edge
  for (let x = TAPE_W - margin - 8; x >= margin; x -= 8) {
    ctx.lineTo(x, bottom + (seeded(x + 500) - 0.5) * 5);
  }
  // Left torn edge
  for (let y = bottom - 6; y >= top; y -= 6) {
    ctx.lineTo(margin + (seeded(y + 700) - 0.5) * 10, y);
  }
  ctx.closePath();
  ctx.fill();

  // Subtle grain
  ctx.fillStyle = "rgba(180, 160, 130, 0.06)";
  for (let i = 0; i < 150; i++) {
    ctx.fillRect(seeded(i * 3) * TAPE_W, seeded(i * 3 + 1) * TAPE_H, 2, 2);
  }

  // "my copy" text
  ctx.fillStyle = "#3e2733";
  ctx.font = caveatLoaded ? "700 28px Caveat" : "bold italic 20px Georgia, serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("my copy", TAPE_W / 2, TAPE_H / 2);
}

let tapeTexture: THREE.CanvasTexture | null = null;
let tapeMaterial: THREE.MeshStandardMaterial | null = null;
const tapeGeometry = new THREE.PlaneGeometry(0.55, 0.2);

if (typeof document !== "undefined") {
  const tapeCanvas = document.createElement("canvas");
  tapeCanvas.width = TAPE_W;
  tapeCanvas.height = TAPE_H;
  drawTapeCanvas(tapeCanvas);
  tapeTexture = new THREE.CanvasTexture(tapeCanvas);
  tapeTexture.colorSpace = THREE.SRGBColorSpace;
  tapeMaterial = new THREE.MeshStandardMaterial({
    map: tapeTexture,
    transparent: true,
    roughness: 0.8,
    bumpMap: clothBumpMap,
    bumpScale: 0.4,
    side: THREE.DoubleSide,
  });

  // Redraw with Caveat once CSS @font-face finishes loading
  document.fonts.ready.then(() => {
    drawTapeCanvas(tapeCanvas, true);
    if (tapeTexture) tapeTexture.needsUpdate = true;
  });
}

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
    front: new THREE.MeshStandardMaterial({ color: spineColor, roughness: 0.6, bumpMap: clothBumpMap, bumpScale: 0.4 }),
    back: new THREE.MeshStandardMaterial({ color: spineColor, roughness: 0.8, bumpMap: clothBumpMap, bumpScale: 0.4 }),
    spine: new THREE.MeshStandardMaterial({ color: spineColor, roughness: 0.7, bumpMap: clothBumpMap, bumpScale: 0.4 }),
  }), [spineColor]);

  // Rotation: spine state = PI/2 (spine faces camera), cover = 0 (front faces camera)
  const { rotationY } = useSpring({
    rotationY: state === "spine" ? Math.PI / 2 : 0,
    config: { mass: 1, tension: 120, friction: 20 },
  });

  // Loading placeholder — invisible group that occupies space in BookGroup
  if (book.isLoading) {
    return <animated.group ref={ref} rotation-y={rotationY} />;
  }

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

        {/* Bookmark ribbon — playthrough indicator */}
        {book.hasPlaythrough && bookmarkGeometry && (
          <mesh
            geometry={bookmarkGeometry}
            material={bookmarkMaterial}
            position={[width / 2 - 0.35, height / 2 + 0.02, COVER_THICKNESS + 0.003]}
          />
        )}

        {/* "My copy" tape — user-uploaded book indicator */}
        {book.isMyCopy && tapeMaterial && (
          <mesh
            geometry={tapeGeometry}
            material={tapeMaterial}
            position={[-0.05, height / 2 - 0.2, COVER_THICKNESS + 0.003]}
            rotation={[0, 0, -Math.PI * 4 / 180]}
          />
        )}
      </group>

      {/* Back cover */}
      <mesh position={[0, 0, -depth / 2 - COVER_THICKNESS / 2]} geometry={geometries.cover} material={spineMaterials.back} />

      {/* Spine */}
      <mesh position={[-width / 2 - COVER_THICKNESS / 2, 0, 0]} geometry={geometries.spine} material={spineMaterials.spine} />

      {/* Spine text */}
      <Text
        font={SPINE_FONT}
        position={[-width / 2 - COVER_THICKNESS - 0.005, 0, 0]}
        rotation={[0, -Math.PI / 2, Math.PI / 2]}
        fontSize={0.07}
        maxWidth={height * 0.85}
        color={primary.pureWhite}
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
    return <meshPhysicalMaterial color={fallbackColor} roughness={0.6} clearcoat={0.4} clearcoatRoughness={0.3} />;
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
    return new THREE.MeshPhysicalMaterial({ map: texture, roughness: 0.6, metalness: 0.05, clearcoat: 0.25, clearcoatRoughness: 0.3 });
  }, [texture]);

  if (!material) {
    return <meshStandardMaterial color={fallbackColor} roughness={0.6} />;
  }
  return <primitive object={material} attach="material" />;
}
