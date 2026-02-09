"use client";

import { useState, useCallback } from "react";
import { Html } from "@react-three/drei";
import type { BookData } from "@/lib/types";

interface BookInteriorProps {
  book: BookData;
  width: number;
  height: number;
  depth: number;
}

export default function BookInterior({
  book,
  width,
  height,
  depth,
}: BookInteriorProps) {
  return (
    <Html
      transform
      position={[0.1, 0, depth / 2 + 0.03]}
      rotation={[0, 0, 0]}
      scale={0.008}
      style={{
        width: `${width * 120}px`,
        height: `${height * 120}px`,
        pointerEvents: "auto",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "var(--color-book-background)",
          borderRadius: 4,
          padding: 20,
          fontFamily: "var(--font-libre-baskerville), serif",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <TitlePage book={book} />
      </div>
    </Html>
  );
}

function TitlePage({ book }: { book: BookData }) {
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        gap: 12,
        color: "var(--color-ink)",
      }}
    >
      <div
        style={{
          fontSize: 22,
          fontWeight: 700,
          lineHeight: 1.2,
          maxWidth: "90%",
        }}
      >
        {book.title}
      </div>
      <div style={{ fontSize: 12, color: "#666", letterSpacing: 1 }}>
        <span>by</span>
        <br />
        <span style={{ fontSize: 14, fontWeight: 600 }}>
          {book.author.toUpperCase()}
        </span>
      </div>
      {book.description && (
        <div
          style={{
            fontSize: 11,
            color: "#555",
            maxWidth: "85%",
            lineHeight: 1.5,
            marginTop: 8,
          }}
        >
          {book.description}
        </div>
      )}
      {book.chapters && book.chapters.length > 0 && (
        <div style={{ marginTop: 12, fontSize: 10, color: "#777" }}>
          <div style={{ letterSpacing: 2, marginBottom: 6 }}>CHAPTERS</div>
          {book.chapters.map((ch, i) => (
            <div key={i} style={{ marginBottom: 2 }}>
              <span style={{ fontWeight: 600 }}>{ch.label}</span> {ch.name}
            </div>
          ))}
        </div>
      )}
      {book.publishedYear && (
        <div style={{ fontSize: 10, color: "#999", marginTop: 8 }}>
          First published {book.publishedYear}
        </div>
      )}

      <RolePlaySetup characters={book.characters} />
    </div>
  );
}

function RolePlaySetup({ characters }: { characters?: string[] }) {
  const [charIndex, setCharIndex] = useState(0);
  const charList =
    characters && characters.length > 0 ? characters : ["Character"];

  const cycleChar = useCallback(
    (dir: 1 | -1) => {
      setCharIndex(
        (prev) => (prev + dir + charList.length) % charList.length
      );
    },
    [charList.length]
  );

  return (
    <div
      style={{
        marginTop: 16,
        padding: 12,
        background: "rgba(0,0,0,0.04)",
        borderRadius: 8,
        width: "90%",
      }}
    >
      <div
        style={{
          fontSize: 9,
          letterSpacing: 2,
          color: "#999",
          marginBottom: 8,
        }}
      >
        ROLE PLAY SETUP
      </div>

      <div style={{ marginBottom: 8 }}>
        <span style={{ fontSize: 9, letterSpacing: 1, color: "#888" }}>
          PLAY AS
        </span>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginTop: 4,
          }}
        >
          <button
            onClick={() => cycleChar(-1)}
            style={{
              background: "none",
              border: "1px solid #ccc",
              borderRadius: 4,
              cursor: "pointer",
              padding: "2px 6px",
              fontSize: 12,
            }}
          >
            &lt;
          </button>
          <span style={{ fontSize: 12, fontWeight: 600, flex: 1 }}>
            {charList[charIndex]}
          </span>
          <button
            onClick={() => cycleChar(1)}
            style={{
              background: "none",
              border: "1px solid #ccc",
              borderRadius: 4,
              cursor: "pointer",
              padding: "2px 6px",
              fontSize: 12,
            }}
          >
            &gt;
          </button>
        </div>
      </div>

      <button
        style={{
          width: "100%",
          padding: "8px 0",
          background: "var(--color-ink)",
          color: "var(--color-pure-white)",
          border: "none",
          borderRadius: 6,
          fontSize: 12,
          fontWeight: 600,
          cursor: "pointer",
          letterSpacing: 1,
        }}
      >
        Dive In
      </button>
    </div>
  );
}
