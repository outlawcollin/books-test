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
}
