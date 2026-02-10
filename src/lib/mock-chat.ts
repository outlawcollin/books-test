import type { ChatMessage } from "./types";

/** Mock chat messages per book ID. */
export const BOOK_CHAT_MESSAGES: Record<string, ChatMessage[]> = {
  /* Romeo and Juliet */
  "1513": [
    {
      id: "n1",
      type: "narrator",
      text: "Verona. A sun-bleached street. Two servants of the Capulet household swagger through the market, looking for trouble. They find it almost immediately.",
    },
    {
      id: "c1",
      type: "npc",
      characterName: "Sampson (Capulet Servant)",
      text: "I swear, if any Montague so much as looks at me today, I'll make him regret waking up.",
    },
    {
      id: "c2",
      type: "npc",
      characterName: "Gregory (Capulet servant)",
      text: "Big talk. You always say that and then suddenly find something interesting on the ground.",
      suggestions: ["Make a joke", "Step in", "Signal for help"],
      choices: [
        { category: "Charm", text: '"If you two are done puffing your chests, the market would like its peace back."' },
        { category: "Threaten", text: '"Keep talking and I promise this ends badly for someone."' },
        { category: "Caution", text: '"Easy. The Prince\'s guards are closer than you think."' },
        { category: "Silence", text: '"I stay quiet and watch who makes the first mistake."' },
      ],
    },
  ],

  /* Frankenstein */
  "84": [
    {
      id: "n1",
      type: "narrator",
      text: "The laboratory is dark save for the crackling of lightning outside. A figure lies motionless on the slab, stitched together from stolen parts.",
    },
    {
      id: "c1",
      type: "npc",
      characterName: "Victor Frankenstein",
      text: "It's alive... God help me, it's alive. What have I done?",
    },
    {
      id: "c2",
      type: "npc",
      characterName: "The Creature",
      text: "Where... am I? Why does everything hurt?",
      suggestions: ["Comfort him", "Run away", "Explain what happened"],
      choices: [
        { category: "Compassion", text: '"You are safe. I know this is confusing, but I will explain everything."' },
        { category: "Fear", text: '"Stay back! Don\'t come any closer!"' },
        { category: "Curiosity", text: '"Can you understand me? Do you know what you are?"' },
        { category: "Silence", text: '"I watch from the shadows, saying nothing."' },
      ],
    },
  ],

  /* Pride and Prejudice */
  "1342": [
    {
      id: "n1",
      type: "narrator",
      text: "The assembly hall buzzes with whispered gossip and the rustle of fine dresses. The Bennet sisters have arrived, and all of Meryton is watching.",
    },
    {
      id: "c1",
      type: "npc",
      characterName: "Mrs. Bennet",
      text: "Girls, stand up straight! Mr. Bingley has just arrived and he is worth five thousand a year!",
    },
    {
      id: "c2",
      type: "npc",
      characterName: "Mr. Darcy",
      text: "She is tolerable, I suppose, but not handsome enough to tempt me.",
      suggestions: ["Confront him", "Laugh it off", "Walk away"],
      choices: [
        { category: "Wit", text: '"And yet you have been staring for the past ten minutes, sir."' },
        { category: "Dignity", text: '"I curtsey politely and turn away, refusing to give him the satisfaction."' },
        { category: "Fire", text: '"How fortunate that your opinion is of no consequence to me."' },
        { category: "Grace", text: '"I smile and continue dancing, as if I heard nothing at all."' },
      ],
    },
  ],

  /* Moby Dick */
  "2701": [
    {
      id: "n1",
      type: "narrator",
      text: "The Pequod cuts through grey waters under a heavy sky. Captain Ahab stands at the bow, his ivory leg wedged into a bore-hole in the deck.",
    },
    {
      id: "c1",
      type: "npc",
      characterName: "Captain Ahab",
      text: "Aye, aye! And I'll chase him round Good Hope, and round the Horn, and round the Norway Maelstrom, and round perdition's flames before I give him up!",
    },
    {
      id: "c2",
      type: "npc",
      characterName: "Starbuck",
      text: "Vengeance on a dumb brute, Captain? That simply smote thee from blindest instinct! Madness!",
      suggestions: ["Side with Ahab", "Support Starbuck", "Stay neutral"],
      choices: [
        { category: "Loyalty", text: '"The Captain speaks true. That whale took something from all of us."' },
        { category: "Reason", text: '"Starbuck is right. This voyage will kill us all if we follow this path."' },
        { category: "Curiosity", text: '"What if the whale remembers you, Captain? What then?"' },
        { category: "Silence", text: '"I grip the rigging and say nothing, watching the horizon."' },
      ],
    },
  ],

  /* Alice in Wonderland */
  "11": [
    {
      id: "n1",
      type: "narrator",
      text: "You tumble through darkness, past floating teacups and ticking clocks, until you land with a soft thud on a carpet of enormous mushrooms.",
    },
    {
      id: "c1",
      type: "npc",
      characterName: "Cheshire Cat",
      text: "Well, well. Another one who fell. The question is — did you fall, or were you pushed?",
    },
    {
      id: "c2",
      type: "npc",
      characterName: "Mad Hatter",
      text: "No room! No room! ...Actually, there's plenty of room. I just like saying that.",
      suggestions: ["Sit down anyway", "Ask about the Queen", "Demand answers"],
      choices: [
        { category: "Playful", text: '"If there\'s room, I\'ll take the biggest chair."' },
        { category: "Direct", text: '"I don\'t have time for tea. Where is the way out?"' },
        { category: "Curious", text: '"Why is a raven like a writing desk?"' },
        { category: "Bold", text: '"The Queen sent me. I suggest you cooperate."' },
      ],
    },
  ],
};
