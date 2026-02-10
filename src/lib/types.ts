export type TabId = "all-books" | "in-progress" | "my-copies";
export type DetailTabId = "play-book" | "build-world" | "playthroughs";

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
  communityRewrites?: { premise: string; coverUrl?: string }[];
  hasPlaythrough?: boolean;
  isMyCopy?: boolean;
  isLoading?: boolean;
}

export interface Playthrough {
  id: string;
  characterName: string;
  characterAvatar?: string;
  type: "normal" | "rewrite";
  timestamp: string;
}

export type StoryInputMode = "text" | "taptale" | "cardtale";

export interface ChatMessage {
  id: string;
  type: "narrator" | "npc" | "player";
  characterName?: string;
  text: string;
  suggestions?: string[];
  choices?: { category: string; text: string }[];
}

export interface ChatSession {
  bookId: string;
  characterName: string;
  characterAvatar?: string;
  storyMode: string;
  storyInput: StoryInputMode;
  premise?: string;
  messages: ChatMessage[];
}
