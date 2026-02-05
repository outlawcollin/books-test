"use client";

import type { BookData } from "@/lib/types";

interface BookInfoOverlayProps {
  book: BookData;
  onBack: () => void;
}

export default function BookInfoOverlay({ book, onBack }: BookInfoOverlayProps) {
  return (
    <div style={{
      flex: "0 0 33%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 24,
      padding: "48px 32px",
      fontFamily: "var(--font-libre-baskerville), serif",
      color: "#3e2733",
      overflow: "hidden",
      minWidth: 0,
      pointerEvents: "none",
    }}>
      {/* Back to shelf */}
      <button
        onClick={onBack}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          background: "none",
          border: "none",
          cursor: "pointer",
          fontFamily: "var(--font-libre-baskerville), serif",
          fontSize: 14,
          color: "#3e2733",
          opacity: 0.8,
          padding: 0,
          pointerEvents: "auto",
        }}
      >
        <span style={{ fontSize: 18 }}>&larr;</span>
        back to the shelf
      </button>

      {/* Spacer — 3D book is visible through canvas below */}
      <div style={{ width: 180, height: 220, flexShrink: 0 }} />

      {/* Book info */}
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 16,
        maxWidth: 396,
      }}>
        <h1 style={{
          fontSize: 36,
          fontWeight: 400,
          textAlign: "center",
          letterSpacing: "-0.72px",
          margin: 0,
          lineHeight: 1.1,
          width: "100%",
        }}>
          {book.title}
        </h1>

        {book.description && (
          <p style={{
            fontSize: 14,
            lineHeight: 1.5,
            textAlign: "center",
            margin: 0,
            maxWidth: 340,
          }}>
            {book.description}
          </p>
        )}

        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          flexWrap: "wrap",
          justifyContent: "center",
          fontSize: 12,
          opacity: 0.8,
        }}>
          <span>{book.author}</span>
          {book.publishedYear && (
            <>
              <span style={{
                width: 4,
                height: 4,
                borderRadius: "50%",
                background: "#3e2733",
                opacity: 0.6,
                flexShrink: 0,
              }} />
              <span>First published {book.publishedYear}</span>
            </>
          )}
          {book.origin && (
            <>
              <span style={{
                width: 4,
                height: 4,
                borderRadius: "50%",
                background: "#3e2733",
                opacity: 0.6,
                flexShrink: 0,
              }} />
              <span>{book.origin}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
