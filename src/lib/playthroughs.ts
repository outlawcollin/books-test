import type { Playthrough } from "./types";

/** Mock playthrough history per book (by Gutenberg book ID). */
export const BOOK_PLAYTHROUGHS: Record<string, Playthrough[]> = {
  "1513": [
    { id: "1", characterName: "Juliet", type: "normal", timestamp: "Two days ago" },
    { id: "2", characterName: "Vampire Romeo", type: "rewrite", timestamp: "Three days ago" },
  ],
  "84": [
    { id: "3", characterName: "The Creature", type: "normal", timestamp: "One week ago" },
    { id: "4", characterName: "Victor", type: "rewrite", timestamp: "Two weeks ago" },
  ],
  "1342": [
    { id: "5", characterName: "Elizabeth", type: "normal", timestamp: "Yesterday" },
  ],
  "2701": [
    { id: "6", characterName: "Ishmael", type: "normal", timestamp: "Four days ago" },
    { id: "7", characterName: "Ahab", type: "rewrite", timestamp: "One week ago" },
  ],
  "11": [
    { id: "8", characterName: "Alice", type: "normal", timestamp: "Three days ago" },
  ],
};
