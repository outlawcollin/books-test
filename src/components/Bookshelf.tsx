"use client";

import { useState, useCallback, useEffect } from "react";
import Book3D from "./Book3D";
import styles from "./Bookshelf.module.css";

export interface BookData {
  id: string;
  title: string;
  author: string;
  coverImage?: string;
  coverImageFallback?: string;
  spineColor?: string;
  thickness?: number;
  description?: string;
  chapters?: { name: string; label: string }[];
  publishedYear?: string;
  origin?: string;
  characters?: string[];
  communityRewrites?: { premise: string }[];
}

interface BookshelfProps {
  books: BookData[];
}

type BookState = "spine" | "cover" | "open";

const SLOT = 80;
const ACTIVE_SLOT = 400;
const OPEN_SLOT = 720;
const GAP = 80;

export default function Bookshelf({ books }: BookshelfProps) {
  const [activeIndex, setActiveIndex] = useState<number>(
    Math.floor(books.length / 2)
  );
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        setActiveIndex((prev) => Math.max(0, prev - 1));
        setIsOpen(false);
      } else if (e.key === "ArrowRight") {
        setActiveIndex((prev) => Math.min(books.length - 1, prev + 1));
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [books.length]);

  const handleBookClick = useCallback(
    (index: number) => {
      if (index === activeIndex) {
        // Toggle open/cover on the active book
        setIsOpen((prev) => !prev);
      } else {
        // Immediately make this the new active book
        setActiveIndex(index);
        setIsOpen(false);
      }
    },
    [activeIndex]
  );

  // Center the active book: offset = spine slots before it + half the active slot
  // When open, the flipped cover extends ~230px left of the hinge, shifting the
  // visual center ~115px left of the slot center. Compensate by shifting right.
  const currentSlot = isOpen ? OPEN_SLOT : ACTIVE_SLOT;
  const openOffset = isOpen ? 0 : 0;
  const translateX = -(activeIndex * (SLOT + GAP) + currentSlot / 2) + openOffset;

  const activeBook = books[activeIndex];

  return (
    <div className={`${styles.outerWrapper} ${isOpen ? styles.outerWrapperOpen : ""}`}>
      <div className={styles.shelfWrapper}>
        {/* Back arrow — visible when book is open */}
        <button
          className={`${styles.backArrow} ${isOpen ? styles.backArrowVisible : ""}`}
          onClick={() => setIsOpen(false)}
          aria-label="Close book"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 15L10 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M5 10L10 5L15 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <div className={styles.bgBlur} />
        <div
          className={styles.shelf}
          style={{ transform: `translateX(${translateX}px)` }}
        >
          {books.map((book, index) => {
            let state: BookState = "spine";
            if (index === activeIndex) {
              state = isOpen ? "open" : "cover";
            }

            return (
              <div key={book.id} className={
                index === activeIndex
                  ? (isOpen ? styles.bookSlotOpen : styles.bookSlotActive)
                  : styles.bookSlot
              }>
                <Book3D
                  title={book.title}
                  author={book.author}
                  coverImage={book.coverImage}
                  coverImageFallback={book.coverImageFallback}
                  spineColor={book.spineColor}
                  thickness={book.thickness}
                  description={book.description}
                  chapters={book.chapters}
                  publishedYear={book.publishedYear}
                  origin={book.origin}
                  characters={book.characters}
                  state={state}
                  onClick={() => handleBookClick(index)}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Community rewrites section — visible when book is open */}
      <div className={`${styles.communitySection} ${isOpen ? styles.communitySectionVisible : ""}`}>
        <h2 className={styles.communityHeading}>community rewrites</h2>
        <p className={styles.communitySubheading}>what if...</p>
        <div className={styles.rewriteGrid}>
          <div className={styles.createCard}>
            <div className={styles.createCardIcon}>
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <path d="M7 25L12.5 23.5L24.5 11.5C25.3 10.7 25.3 9.3 24.5 8.5L23.5 7.5C22.7 6.7 21.3 6.7 20.5 7.5L8.5 19.5L7 25Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className={styles.createCardLabel}>Create your own rewrite</span>
          </div>
          {activeBook.communityRewrites?.map((rewrite, i) => (
            <div key={i} className={styles.rewriteCard}>
              <div
                className={styles.rewriteCardCover}
                style={{ background: activeBook.spineColor }}
              >
                <span className={styles.rewriteCardTitle}>{activeBook.title}</span>
                <span className={styles.rewriteCardAuthor}>{activeBook.author}</span>
              </div>
              <p className={styles.rewriteCardPremise}>{rewrite.premise}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
