"use client";

import { useRef, useState, useCallback, createRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useScroll } from "@react-three/drei";
import { MathUtils, type Group } from "three";
import Book3D from "./Book3D";
import type { BookData } from "@/lib/types";

interface BookGroupProps {
  books: BookData[];
  onSelectBook?: (book: BookData) => void;
  selectedBook?: BookData | null;
  spacerCenterY?: number | null;
}

type BookState = "spine" | "cover";

const BOOK_SPACING = 0.65;
const COVER_SPREAD = 0.8;
const LERP_SPEED = 0.08;
const DETAIL_Z = 0.3;
const DETAIL_SCALE = 0.5;
const OFFSCREEN_X = 10;
const OVERLAY_COLUMN_WIDTH_PX = 400; // matches BookInfoOverlay max-w-[400px]

export default function BookGroup({ books, onSelectBook, selectedBook, spacerCenterY }: BookGroupProps) {
  const scroll = useScroll();
  const { viewport, size } = useThree();
  const [activeIndex, setActiveIndex] = useState(0);
  const activeRef = useRef(0);
  const initialized = useRef(false);
  const wasInDetail = useRef(false);

  const bookRefs = useMemo(
    () => books.map(() => createRef<Group>()),
    [books.length]
  );

  const selectedIndex = selectedBook
    ? books.findIndex((b) => b.id === selectedBook.id)
    : -1;

  useFrame((state) => {
    if (!scroll) return;

    const offset = scroll.offset;
    const total = books.length;
    const scrollIndex = offset * (total - 1);
    const rounded = Math.round(scrollIndex);
    const clamped = Math.max(0, Math.min(total - 1, rounded));

    // Update active book only in shelf mode
    if (!selectedBook && clamped !== activeRef.current) {
      activeRef.current = clamped;
      setActiveIndex(clamped);
    }

    // Compute detail X and Y at the book's actual z-plane (not z=0)
    const columnCenterPx = OVERLAY_COLUMN_WIDTH_PX / 2;
    const vp = viewport.getCurrentViewport(state.camera, [0, 0, DETAIL_Z]);
    const detailX = ((columnCenterPx / size.width) - 0.5) * vp.width;
    const detailY = spacerCenterY != null
      ? (0.5 - spacerCenterY / size.height) * vp.height
      : 0;

    const inDetail = selectedBook && selectedIndex >= 0;
    const isMobile = size.width < 768;
    // Detect transition from detail → shelf on mobile — snap instead of lerping
    const mobileSnap = wasInDetail.current && !inDetail && isMobile;
    wasInDetail.current = !!inDetail;

    for (let i = 0; i < total; i++) {
      const ref = bookRefs[i]?.current;
      if (!ref) continue;

      if (inDetail) {
        const isSelected = i === selectedIndex;

        if (isSelected) {
          // Lerp to detail position — same system and speed as exit
          ref.position.x = MathUtils.lerp(ref.position.x, detailX, LERP_SPEED);
          ref.position.y = MathUtils.lerp(ref.position.y, detailY, 0.05);
          ref.position.z = MathUtils.lerp(ref.position.z, DETAIL_Z, LERP_SPEED);
          const s = MathUtils.lerp(ref.scale.x, DETAIL_SCALE, 0.1);
          ref.scale.set(s, s, s);
        } else {
          // Slide offscreen + fade (gentle exit so books don't shoot away)
          const exitX = i < selectedIndex ? -OFFSCREEN_X : OFFSCREEN_X;
          ref.position.x = MathUtils.lerp(ref.position.x, exitX, 0.04);
          ref.traverse((child) => {
            if ("text" in child) return;
            const mesh = child as { isMesh?: boolean; material?: { transparent: boolean; opacity: number } };
            if (mesh.isMesh && mesh.material) {
              mesh.material.transparent = true;
              mesh.material.opacity = MathUtils.lerp(mesh.material.opacity, 0, 0.1);
            }
          });
          // Hide once fully faded — prevents ghost raycasting and wasted draw calls
          if (!ref.visible) continue;
          const firstChild = ref.children[0] as { isMesh?: boolean; material?: { opacity: number } } | undefined;
          if (firstChild?.isMesh && firstChild.material && firstChild.material.opacity < 0.01) {
            ref.visible = false;
          }
        }
      } else {
        // Restore visibility for books returning from detail mode
        if (!ref.visible) ref.visible = true;

        // Normal shelf positioning
        const isActive = i === clamped;
        let spreadOffset = 0;
        if (!isActive) {
          spreadOffset = i > clamped ? COVER_SPREAD : -COVER_SPREAD;
        }

        const targetX = (i - clamped) * BOOK_SPACING + spreadOffset;
        const targetZ = isActive ? 0.8 : 0;

        if (!initialized.current || mobileSnap) {
          // Snap immediately on init or mobile detail exit
          ref.position.x = targetX;
          ref.position.y = 0;
          ref.position.z = targetZ;
        } else {
          ref.position.x = MathUtils.lerp(ref.position.x, targetX, LERP_SPEED);
          ref.position.y = MathUtils.lerp(ref.position.y, 0, 0.05);
          ref.position.z = MathUtils.lerp(ref.position.z, targetZ, LERP_SPEED);
        }

        // Restore scale for books returning from detail mode
        if (ref.scale.x < 0.99) {
          if (mobileSnap) {
            ref.scale.set(1, 1, 1);
          } else {
            const s = MathUtils.lerp(ref.scale.x, 1, 0.1);
            ref.scale.set(s, s, s);
            if (s > 0.99) ref.scale.set(1, 1, 1);
          }
        }

        // Restore opacity for books returning from detail mode
        ref.traverse((child) => {
          // Skip troika text meshes — SDF shader looks wrong at partial opacity
          if ("text" in child) return;
          const mesh = child as { isMesh?: boolean; material?: { transparent: boolean; opacity: number } };
          if (mesh.isMesh && mesh.material && mesh.material.opacity < 1) {
            if (mobileSnap) {
              mesh.material.opacity = 1;
              mesh.material.transparent = false;
            } else {
              mesh.material.opacity = MathUtils.lerp(mesh.material.opacity, 1, 0.1);
              if (mesh.material.opacity > 0.99) {
                mesh.material.opacity = 1;
                mesh.material.transparent = false;
              }
            }
          }
        });
      }
    }

    initialized.current = true;
  });

  const handleBookClick = useCallback(
    (index: number) => {
      if (selectedBook) return;

      if (index === activeRef.current) {
        onSelectBook?.(books[index]);
      } else {
        activeRef.current = index;
        setActiveIndex(index);
      }
    },
    [books, onSelectBook, selectedBook]
  );

  return (
    <group>
      {books.map((book, i) => {
        const isDetailSelected = selectedBook && i === selectedIndex;
        const state: BookState = (i === activeIndex || isDetailSelected) ? "cover" : "spine";

        return (
          <Book3D
            key={book.id}
            ref={bookRefs[i]}
            book={book}
            state={state}
            isActive={i === activeIndex || !!isDetailSelected}
            onClick={() => handleBookClick(i)}
          />
        );
      })}
    </group>
  );
}
