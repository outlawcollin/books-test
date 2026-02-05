"use client";

import { useRef, useState, useCallback, createRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useScroll } from "@react-three/drei";
import { MathUtils, type Group } from "three";
import Book3D from "./Book3D";
import type { BookData } from "@/lib/types";

interface BookGroupProps {
  books: BookData[];
  onSelectBook?: (book: BookData) => void;
  selectedBook?: BookData | null;
}

type BookState = "spine" | "cover";

const BOOK_SPACING = 0.85;
const COVER_SPREAD = 0.8;
const LERP_SPEED = 0.08;
const ENTER_LERP_SPEED = 0.07;
const DETAIL_X = -2.4;
const DETAIL_Z = 0.3;
const DETAIL_SCALE = 0.5;
const OFFSCREEN_X = 10;

export default function BookGroup({ books, onSelectBook, selectedBook }: BookGroupProps) {
  const scroll = useScroll();
  const [activeIndex, setActiveIndex] = useState(0);
  const activeRef = useRef(0);
  const initialized = useRef(false);

  const bookRefs = useMemo(
    () => books.map(() => createRef<Group>()),
    [books.length]
  );

  const selectedIndex = selectedBook
    ? books.findIndex((b) => b.id === selectedBook.id)
    : -1;

  useFrame(() => {
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

    const inDetail = selectedBook && selectedIndex >= 0;

    for (let i = 0; i < total; i++) {
      const ref = bookRefs[i]?.current;
      if (!ref) continue;

      if (inDetail) {
        const isSelected = i === selectedIndex;

        if (isSelected) {
          // Lerp selected book to detail position
          ref.position.x = MathUtils.lerp(ref.position.x, DETAIL_X, ENTER_LERP_SPEED);
          ref.position.z = MathUtils.lerp(ref.position.z, DETAIL_Z, ENTER_LERP_SPEED);
          const s = MathUtils.lerp(ref.scale.x, DETAIL_SCALE, ENTER_LERP_SPEED);
          ref.scale.set(s, s, s);
        } else {
          // Books left of selected exit left, books right exit right
          const exitX = i < selectedIndex ? -OFFSCREEN_X : OFFSCREEN_X;
          ref.position.x = MathUtils.lerp(ref.position.x, exitX, 0.08);
          ref.traverse((child) => {
            const mesh = child as { isMesh?: boolean; material?: { transparent: boolean; opacity: number } };
            if (mesh.isMesh && mesh.material) {
              mesh.material.transparent = true;
              mesh.material.opacity = MathUtils.lerp(mesh.material.opacity, 0, 0.08);
            }
          });
        }
      } else {
        // Normal shelf positioning
        const isActive = i === clamped;
        let spreadOffset = 0;
        if (!isActive) {
          spreadOffset = i > clamped ? COVER_SPREAD : -COVER_SPREAD;
        }

        const targetX = (i - clamped) * BOOK_SPACING + spreadOffset;
        const targetZ = isActive ? 0.8 : 0;

        if (!initialized.current) {
          ref.position.x = targetX;
          ref.position.z = targetZ;
        } else {
          ref.position.x = MathUtils.lerp(ref.position.x, targetX, LERP_SPEED);
          ref.position.z = MathUtils.lerp(ref.position.z, targetZ, LERP_SPEED);
        }

        // Restore scale for books returning from detail mode
        if (ref.scale.x < 0.99) {
          const s = MathUtils.lerp(ref.scale.x, 1, 0.1);
          ref.scale.set(s, s, s);
          if (s > 0.99) ref.scale.set(1, 1, 1);
        }

        // Restore opacity for books returning from detail mode
        ref.traverse((child) => {
          const mesh = child as { isMesh?: boolean; material?: { transparent: boolean; opacity: number } };
          if (mesh.isMesh && mesh.material && mesh.material.opacity < 1) {
            mesh.material.opacity = MathUtils.lerp(mesh.material.opacity, 1, 0.1);
            if (mesh.material.opacity > 0.99) {
              mesh.material.opacity = 1;
              mesh.material.transparent = false;
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
