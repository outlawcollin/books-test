/** Character → silhouette avatar mapping.
 *  8 archetypes: young-man, young-woman, monster, older-man, older-woman, warrior, child, mysterious.
 *  Layer 1: explicit per-character map. Layer 2: keyword fallback for unknown characters. */

const IMG = "/images/book_characters";

const CHARACTER_AVATAR_MAP: Record<string, string> = {
  // Frankenstein (84)
  "Victor Frankenstein":   `${IMG}/young-man.png`,
  "The Creature":          `${IMG}/monster.png`,
  "Elizabeth Lavenza":     `${IMG}/young-woman.png`,
  "Henry Clerval":         `${IMG}/young-man.png`,
  "Robert Walton":         `${IMG}/young-man.png`,

  // Moby-Dick (2701)
  "Captain Ahab":          `${IMG}/older-man.png`,
  "Ishmael":               `${IMG}/young-man.png`,
  "Queequeg":              `${IMG}/warrior.png`,
  "Starbuck":              `${IMG}/older-man.png`,
  "Stubb":                 `${IMG}/older-man.png`,

  // Pride and Prejudice (1342)
  "Elizabeth Bennet":      `${IMG}/young-woman.png`,
  "Mr. Darcy":             `${IMG}/older-man.png`,
  "Jane Bennet":           `${IMG}/young-woman.png`,
  "Mr. Bingley":           `${IMG}/young-man.png`,
  "Lydia Bennet":          `${IMG}/young-woman.png`,

  // Romeo and Juliet (1513)
  "Romeo":                 `${IMG}/young-man.png`,
  "Juliet":                `${IMG}/young-woman.png`,
  "Mercutio":              `${IMG}/warrior.png`,
  "Tybalt":                `${IMG}/warrior.png`,
  "Nurse":                 `${IMG}/older-woman.png`,

  // Shakespeare (100)
  "Hamlet":                `${IMG}/young-man.png`,
  "Othello":               `${IMG}/warrior.png`,
  "Macbeth":               `${IMG}/warrior.png`,
  "Prospero":              `${IMG}/older-man.png`,
  "Puck":                  `${IMG}/child.png`,

  // A Room with a View (2641)
  "Lucy Honeychurch":      `${IMG}/young-woman.png`,
  "George Emerson":        `${IMG}/young-man.png`,
  "Cecil Vyse":            `${IMG}/young-man.png`,
  "Charlotte Bartlett":    `${IMG}/older-woman.png`,
  "Mr. Beebe":             `${IMG}/older-man.png`,

  // Middlemarch (145)
  "Dorothea Brooke":       `${IMG}/young-woman.png`,
  "Tertius Lydgate":       `${IMG}/older-man.png`,
  "Rosamond Vincy":        `${IMG}/young-woman.png`,
  "Will Ladislaw":         `${IMG}/young-man.png`,
  "Nicholas Bulstrode":    `${IMG}/older-man.png`,

  // Dr Jekyll and Mr Hyde (43)
  "Dr. Jekyll":            `${IMG}/young-man.png`,
  "Mr. Hyde":              `${IMG}/monster.png`,
  "Mr. Utterson":          `${IMG}/young-man.png`,
  "Dr. Lanyon":            `${IMG}/older-man.png`,
  "Mr. Enfield":           `${IMG}/young-man.png`,

  // Alice in Wonderland (11)
  "Alice":                 `${IMG}/child.png`,
  "The Queen of Hearts":   `${IMG}/mysterious.png`,
  "The Mad Hatter":        `${IMG}/mysterious.png`,
  "The Cheshire Cat":      `${IMG}/mysterious.png`,
  "The White Rabbit":      `${IMG}/child.png`,

  // Crime and Punishment (2554)
  "Raskolnikov":           `${IMG}/young-man.png`,
  "Sonya Marmeladova":     `${IMG}/young-woman.png`,
  "Porfiry Petrovich":     `${IMG}/older-man.png`,
  "Dunya Raskolnikova":    `${IMG}/young-woman.png`,
  "Svidrigailov":          `${IMG}/young-man.png`,

  // Little Women (37106)
  "Jo March":              `${IMG}/young-woman.png`,
  "Meg March":             `${IMG}/young-woman.png`,
  "Beth March":            `${IMG}/young-woman.png`,
  "Amy March":             `${IMG}/young-woman.png`,
  "Laurie":                `${IMG}/young-man.png`,

  // Jane Eyre (1260)
  "Jane Eyre":             `${IMG}/young-woman.png`,
  "Mr. Rochester":         `${IMG}/older-man.png`,
  "St. John Rivers":       `${IMG}/young-man.png`,
  "Mrs. Reed":             `${IMG}/older-woman.png`,
  "Adèle Varens":          `${IMG}/young-woman.png`,

  // The Blue Castle (67979)
  "Valancy Stirling":      `${IMG}/young-woman.png`,
  "Barney Snaith":         `${IMG}/young-man.png`,
  "Olive Stirling":        `${IMG}/older-woman.png`,
  "Cissy Gay":             `${IMG}/young-woman.png`,
  "Mrs. Frederick":        `${IMG}/older-woman.png`,

  // Beowulf (16328)
  "Beowulf":               `${IMG}/warrior.png`,
  "Hrothgar":              `${IMG}/older-man.png`,
  "Grendel":               `${IMG}/monster.png`,
  "Wiglaf":                `${IMG}/warrior.png`,
  "Unferth":               `${IMG}/warrior.png`,

  // The Enchanted April (16389)
  "Lottie Wilkins":        `${IMG}/young-woman.png`,
  "Rose Arbuthnot":        `${IMG}/young-woman.png`,
  "Mrs. Fisher":           `${IMG}/older-woman.png`,
  "Lady Caroline Dester":  `${IMG}/young-woman.png`,
  "Mr. Briggs":            `${IMG}/young-man.png`,

  // Wuthering Heights (768)
  "Heathcliff":            `${IMG}/young-man.png`,
  "Catherine Earnshaw":    `${IMG}/young-woman.png`,
  "Edgar Linton":          `${IMG}/young-man.png`,
  "Nelly Dean":            `${IMG}/older-woman.png`,
  "Isabella Linton":       `${IMG}/young-woman.png`,

  // Ferdinand Count Fathom (6761)
  "Ferdinand Fathom":      `${IMG}/young-man.png`,
  "Renaldo de Melvil":     `${IMG}/young-man.png`,
  "Monimia":               `${IMG}/young-woman.png`,
  "Elinor":                `${IMG}/young-woman.png`,
  "Celinda":               `${IMG}/young-woman.png`,

  // Cranford (394)
  "Mary Smith":            `${IMG}/young-woman.png`,
  "Miss Matty":            `${IMG}/older-woman.png`,
  "Miss Deborah":          `${IMG}/older-woman.png`,
  "Captain Brown":         `${IMG}/older-man.png`,
  "Mrs. Jamieson":         `${IMG}/older-woman.png`,

  // Humphry Clinker (2160)
  "Humphry Clinker":       `${IMG}/young-man.png`,
  "Matthew Bramble":       `${IMG}/older-man.png`,
  "Lydia Melford":         `${IMG}/young-woman.png`,
  "Tabitha Bramble":       `${IMG}/older-woman.png`,
  "Winifred Jenkins":      `${IMG}/young-woman.png`,

  // Wagner (5197)
  "Richard Wagner":        `${IMG}/older-man.png`,
  "Minna Planer":          `${IMG}/young-woman.png`,
  "Franz Liszt":           `${IMG}/older-man.png`,
  "King Ludwig":           `${IMG}/older-man.png`,
  "Hans von Bülow":        `${IMG}/young-man.png`,

  // Three Musketeers (1259)
  "D'Artagnan":            `${IMG}/warrior.png`,
  "Athos":                 `${IMG}/warrior.png`,
  "Porthos":               `${IMG}/warrior.png`,
  "Aramis":                `${IMG}/warrior.png`,
  "Mazarin":               `${IMG}/older-man.png`,

  // Roderick Random (4085)
  "Roderick Random":       `${IMG}/young-man.png`,
  "Strap":                 `${IMG}/young-man.png`,
  "Narcissa":              `${IMG}/young-woman.png`,
  "Captain Oakum":         `${IMG}/warrior.png`,
  "Miss Williams":         `${IMG}/young-woman.png`,

  // Tom Jones (6593)
  "Tom Jones":             `${IMG}/young-man.png`,
  "Sophia Western":        `${IMG}/young-woman.png`,
  "Squire Allworthy":      `${IMG}/older-man.png`,
  "Blifil":                `${IMG}/young-man.png`,
  "Lady Bellaston":        `${IMG}/older-woman.png`,

  // The King in Yellow (8492)
  "Hildred Castaigne":     `${IMG}/young-man.png`,
  "Louis Castaigne":       `${IMG}/young-man.png`,
  "Camilla":               `${IMG}/young-woman.png`,
  "Cassilda":              `${IMG}/young-woman.png`,
  "Mr. Wilde":             `${IMG}/older-man.png`,

  // The Count of Monte Cristo (1184)
  "Edmond Dantès":         `${IMG}/young-man.png`,
  "Fernand Mondego":       `${IMG}/young-man.png`,
  "Abbé Faria":            `${IMG}/older-man.png`,
  "Mercédès":              `${IMG}/young-woman.png`,
  "Villefort":             `${IMG}/older-man.png`,

  // Generic fallback characters
  "Protagonist":           `${IMG}/young-man.png`,
  "Narrator":              `${IMG}/mysterious.png`,
  "Companion":             `${IMG}/young-man.png`,
  "Rival":                 `${IMG}/young-man.png`,
  "Mentor":                `${IMG}/older-man.png`,
};

/** Keyword fallback for characters not in the explicit map. */
const FALLBACK_KEYWORDS: [RegExp, string][] = [
  [/creature|monster|beast|grendel|hyde/i, `${IMG}/monster.png`],
  [/knight|warrior|soldier|sword|guard|musketeer|captain(?! .*[ae])/i, `${IMG}/warrior.png`],
  [/mrs\.|miss |madam|matron|nurse|nanny|governess|aunt|grandmother/i, `${IMG}/older-woman.png`],
  [/queen|lady|woman|mother|sister|maid|duchess|princess|maiden/i, `${IMG}/young-woman.png`],
  [/captain|king|squire|sir|lord|dr\.|professor|father|elder|abbé|colonel|general/i, `${IMG}/older-man.png`],
  [/alice|child|boy|girl|kid|rabbit/i, `${IMG}/child.png`],
  [/ghost|phantom|shadow|cloak|cat|cheshire|puck|spirit|witch/i, `${IMG}/mysterious.png`],
];

/** Returns the silhouette avatar path for a character name. */
export function getCharacterAvatar(name: string): string {
  const explicit = CHARACTER_AVATAR_MAP[name];
  if (explicit) return explicit;

  for (const [pattern, path] of FALLBACK_KEYWORDS) {
    if (pattern.test(name)) return path;
  }

  return `${IMG}/young-man.png`;
}
