"use client";

import { useState, useCallback } from "react";
import styles from "./Book3D.module.css";

export interface Book3DProps {
  coverImage?: string;
  coverImageFallback?: string;
  title: string;
  author: string;
  spineColor?: string;
  thickness?: number;
  description?: string;
  chapters?: { name: string; label: string }[];
  publishedYear?: string;
  origin?: string;
  characters?: string[];
  state?: "spine" | "cover" | "open";
  onClick?: () => void;
}

export default function Book3D({
  coverImage,
  coverImageFallback,
  title,
  author,
  spineColor = "#1a1a2e",
  thickness = 72,
  description,
  chapters,
  publishedYear,
  origin,
  characters,
  state = "spine",
  onClick,
}: Book3DProps) {
  const stateClass =
    state === "open"
      ? styles.bookOpen
      : state === "cover"
        ? styles.bookCoverVisible
        : styles.bookDefault;

  return (
    <div className={styles.bookContainer} onClick={onClick}>
      <div
        className={`${styles.book} ${stateClass}`}
        style={
          {
            "--book-depth": `${thickness}px`,
            "--spine-color": spineColor,
          } as React.CSSProperties
        }
      >
        {/* Front cover (hinges open from spine) */}
        <div className={styles.front}>
          {/* Outer cover face */}
          <div className={styles.cover}>
            {coverImage ? (
              <CoverImage src={coverImage} fallback={coverImageFallback} alt={title} />
            ) : (
              <PlaceholderCover title={title} author={author} color={spineColor} />
            )}
          </div>
          {/* Inner cover face — title page (visible when opened) */}
          <div className={styles.coverBack}>
            <div className={styles.titlePageContent}>
              <div className={styles.paperTexture} />
              <div className={styles.titlePageTitle}>{title}</div>
              <div className={styles.titlePageAuthor}>
                <span className={styles.titlePageBy}>by</span>
                <br />
                <span className={styles.titlePageAuthorName}>{author.toUpperCase()}</span>
              </div>
              {description && (
                <div className={styles.titlePageDesc}>{description}</div>
              )}
              {chapters && chapters.length > 0 && (
                <div className={styles.titlePageChapters}>
                  <div className={styles.titlePageChaptersLabel}>CHAPTERS</div>
                  {chapters.map((ch, i) => (
                    <div key={i} className={styles.titlePageChapterRow}>
                      <span className={styles.titlePageChapterLabel}>{ch.label.toUpperCase()}</span>
                      <span className={styles.titlePageChapterName}>{ch.name}</span>
                    </div>
                  ))}
                </div>
              )}
              <div className={styles.titlePageMeta}>
                {publishedYear && <span>First published {publishedYear}</span>}
                {origin && <span>Origin &middot; {origin}</span>}
              </div>
            </div>
          </div>
        </div>

        {/* Interior page — role play setup (visible when open) */}
        <div className={styles.page}>
          <div className={styles.paperTexture} />
          <RolePlaySetup characters={characters} />
        </div>

        {/* Back cover */}
        <div className={styles.back}>
          {description && <p>{description}</p>}
        </div>

        {/* Page edges (right side) */}
        <div className={styles.pages} />

        {/* Spine (left side) */}
        <div className={styles.spine}>
          <span className={styles.spineText}>
            {title} &bull; {author}
          </span>
        </div>
      </div>

    </div>
  );
}

function RolePlaySetup({ characters }: { characters?: string[] }) {
  const [charIndex, setCharIndex] = useState(0);
  const charList = characters && characters.length > 0 ? characters : ["Character"];

  const cycleChar = useCallback(
    (dir: 1 | -1, e: React.MouseEvent) => {
      e.stopPropagation();
      setCharIndex((prev) => (prev + dir + charList.length) % charList.length);
    },
    [charList.length]
  );

  return (
    <div className={styles.setupContent}>
      <div className={styles.setupHeader}>ROLE PLAY SETUP</div>

      <div className={styles.setupControls}>
        {/* Character selector */}
        <div className={styles.selectorGroup}>
          <span className={styles.selectorLabel}>PLAY AS</span>
          <div className={styles.selectorPill}>
            <button
              className={styles.arrowButton}
              onClick={(e) => cycleChar(-1, e)}
              aria-label="Previous character"
            >
              <ArrowLeft />
            </button>
            <span className={styles.selectorValue}>{charList[charIndex]}</span>
            <button
              className={styles.arrowButton}
              onClick={(e) => cycleChar(1, e)}
              aria-label="Next character"
            >
              <ArrowRight />
            </button>
          </div>
        </div>

        {/* Story mode selector */}
        <div className={styles.selectorGroup}>
          <span className={styles.selectorLabel}>STORY MODE</span>
          <div className={styles.selectorPill}>
            <span className={styles.selectorValue}>Follow the book</span>
            <button className={styles.arrowButton} onClick={(e) => e.stopPropagation()} aria-label="Next mode">
              <ArrowRight />
            </button>
          </div>
        </div>
      </div>

      <button className={styles.diveInButton} onClick={(e) => e.stopPropagation()}>
        Dive In
      </button>
    </div>
  );
}

function ArrowLeft() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ArrowRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CoverImage({ src, fallback, alt }: { src: string; fallback?: string; alt: string }) {
  const [imgSrc, setImgSrc] = useState(src);
  const [failed, setFailed] = useState(false);

  const handleError = useCallback(() => {
    if (!failed && fallback) {
      setImgSrc(fallback);
      setFailed(true);
    }
  }, [failed, fallback]);

  return <img src={imgSrc} alt={alt} onError={handleError} />;
}

function PlaceholderCover({
  title,
  author,
  color,
}: {
  title: string;
  author: string;
  color: string;
}) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: `linear-gradient(135deg, ${color}, ${adjustBrightness(color, 30)})`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        textAlign: "center",
        gap: 8,
      }}
    >
      <span
        style={{
          fontSize: 18,
          fontWeight: 700,
          color: "rgba(255,255,255,0.95)",
          lineHeight: 1.2,
        }}
      >
        {title}
      </span>
      <span
        style={{
          fontSize: 12,
          color: "rgba(255,255,255,0.7)",
        }}
      >
        {author}
      </span>
    </div>
  );
}

function adjustBrightness(hex: string, percent: number): string {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = Math.min(255, ((num >> 16) & 0xff) + percent);
  const g = Math.min(255, ((num >> 8) & 0xff) + percent);
  const b = Math.min(255, (num & 0xff) + percent);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}
