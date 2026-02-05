"use client";

import Image from "next/image";
import type { BookData } from "@/lib/types";
import styles from "./BookDetailPanel.module.css";

interface BookDetailPanelProps {
  book: BookData;
}

export default function BookDetailPanel({ book }: BookDetailPanelProps) {
  const characters = book.characters?.length
    ? book.characters
    : ["Romeo", "Juliet", "Mercutio", "Tybalt", "Nurse"];

  const rewrites = book.communityRewrites?.length
    ? book.communityRewrites
    : [
        { premise: `${book.title} but set in modern-day New York City.` },
        { premise: `${book.title} retold from the antagonist's perspective.` },
        { premise: `${book.title} as a comedy where everything goes right.` },
      ];

  return (
    <div className={styles.panel}>
      {/* Role Play Setup Column */}
      <div className={styles.setupColumn}>
        <span className={styles.badgeDark}>role play setup</span>

        {/* Character Picker */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <p className={styles.sectionTitle}>who do you want to play as?</p>
            <p className={styles.sectionSubtitle}>pick a book character or your own</p>
          </div>
          <div className={styles.characterRow}>
            <div className={styles.character}>
              <div className={styles.characterCircleAdd}>
                <span>+</span>
              </div>
              <span className={styles.characterName}>Persona</span>
            </div>
            <div className={styles.characterDivider} />
            {characters.map((name, i) => (
              <div key={i} className={styles.character}>
                <div className={styles.characterCircle} />
                <span className={styles.characterName}>{name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Story Mode */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <p className={styles.sectionTitle}>story mode</p>
            <p className={styles.sectionSubtitle}>select the storytelling style</p>
          </div>
          <div className={styles.cardRow}>
            <div className={styles.card}>
              <p className={styles.cardTitle}>book arc</p>
              <p className={styles.cardSubtitle}>follow the story&apos;s narrative</p>
            </div>
            <div className={styles.card}>
              <p className={styles.cardTitle}>anything goes</p>
              <p className={styles.cardSubtitle}>free-form roleplay</p>
            </div>
          </div>
        </div>

        {/* Story Input */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <p className={styles.sectionTitle}>story input</p>
            <p className={styles.sectionSubtitle}>select how to progress through the story</p>
          </div>
          <div className={styles.cardStack}>
            <div className={styles.card}>
              <p className={styles.cardTitle}>text</p>
              <p className={styles.cardSubtitle}>type freely</p>
            </div>
            <div className={styles.card}>
              <p className={styles.cardTitle}>taptale</p>
              <p className={styles.cardSubtitle}>three quick options</p>
            </div>
            <div className={styles.card}>
              <p className={styles.cardTitle}>cardtale</p>
              <p className={styles.cardSubtitle}>four rich categories</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <button className={styles.ctaButton}>Dive In</button>
      </div>

      {/* Vertical Divider */}
      <div className={styles.divider} />

      {/* Community Rewrites Column */}
      <div className={styles.rewritesColumn}>
        <span className={styles.badgeAccent}>community rewrites</span>
        <div className={styles.rewritesList}>
          {rewrites.map((rewrite, i) => (
            <div key={i} className={styles.rewriteCard}>
              {book.coverImage && (
                <Image
                  src={book.coverImage}
                  alt={`${book.title} rewrite`}
                  className={styles.rewriteCover}
                  width={124}
                  height={164}
                  unoptimized
                />
              )}
              <p className={styles.rewritePremise}>{rewrite.premise}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
