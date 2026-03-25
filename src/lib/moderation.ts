const BLOCKED_WORDS = [
  // Profanity
  "fuck", "fucking", "fucked", "fucker", "fuk",
  "shit", "shitting", "shitty",
  "ass", "asshole", "asses",
  "bitch", "bitches",
  "damn", "crap", "dick", "dicks", "cock", "cocks",
  "bastard", "bastards",
  "pussy", "pussies",
  "cunt", "cunts",
  // Slurs
  "nigger", "nigga", "faggot", "fag", "retard", "retarded",
  "slut", "whore", "tranny",
  "spic", "chink", "kike", "wetback",
  // Threats / harmful
  "kill yourself", "kys", "go die", "i will kill",
  "bomb", "shoot up",
  // Sexual
  "porn", "xxx", "nude", "nudes", "onlyfans", "sex",
];

// Patterns that suggest impersonation or inappropriate usernames
const BLOCKED_USERNAME_PATTERNS = [
  /^admin/i, /^root$/i, /^moderator/i, /^mentino/i,
  /^support/i, /^staff/i, /^official/i,
  /fuck|shit|bitch|ass(?:hole)?|dick|cock|cunt|slut|whore|nigger|nigga|faggot|retard/i,
  /porn|xxx|nude|sex(?:y)?/i,
];

// Patterns that look like spam or bots
const SPAM_PATTERNS = [
  /\b(?:click here|free money|buy now|limited offer|act now|you(?:'ve)? won)\b/i,
  /\b(?:bitcoin|crypto|nft|forex|investment opportunity)\b/i,
  /(\b\w+\b)(?:\s+\1){3,}/, // same word repeated 4+ times
];

interface ModerationResult {
  clean: boolean;
  reason?: string;
}

export function moderateText(input: string): ModerationResult {
  if (!input || input.trim().length === 0) {
    return { clean: true };
  }

  const lower = input.toLowerCase();

  // Profanity check (word boundary matching)
  for (const word of BLOCKED_WORDS) {
    const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`\\b${escaped}\\b`, "i");
    if (regex.test(lower)) {
      return { clean: false, reason: "Your text contains inappropriate language. Please revise." };
    }
  }

  // Spam pattern check
  for (const pattern of SPAM_PATTERNS) {
    if (pattern.test(input)) {
      return { clean: false, reason: "Your text looks like spam. Please write a genuine message." };
    }
  }

  // Spam detection: excessive URLs
  const urlCount = (input.match(/https?:\/\//g) || []).length;
  if (urlCount > 2) {
    return { clean: false, reason: "Too many links detected. Please limit to 2 or fewer URLs." };
  }

  // Spam detection: excessive caps (more than 50% uppercase in text longer than 20 chars)
  if (input.length > 20) {
    const upperCount = (input.match(/[A-Z]/g) || []).length;
    const letterCount = (input.match(/[a-zA-Z]/g) || []).length;
    if (letterCount > 0 && upperCount / letterCount > 0.5) {
      return { clean: false, reason: "Please avoid excessive use of capital letters." };
    }
  }

  // Spam detection: repetitive characters
  if (/(.)\1{5,}/.test(input)) {
    return { clean: false, reason: "Repetitive characters detected. Please write normally." };
  }

  return { clean: true };
}

export function moderateFields(fields: Record<string, string>): ModerationResult {
  for (const [, value] of Object.entries(fields)) {
    if (typeof value === "string") {
      const result = moderateText(value);
      if (!result.clean) return result;
    }
  }
  return { clean: true };
}

/** Validates a display name or username for appropriateness and format */
export function moderateUsername(name: string): ModerationResult {
  const trimmed = name?.trim() || "";

  if (trimmed.length < 2) {
    return { clean: false, reason: "Name must be at least 2 characters." };
  }
  if (trimmed.length > 50) {
    return { clean: false, reason: "Name must be 50 characters or fewer." };
  }

  // No special characters except hyphens, apostrophes, spaces
  if (/[^a-zA-Z0-9\s'\-.]/.test(trimmed)) {
    return { clean: false, reason: "Name contains invalid characters. Only letters, numbers, spaces, hyphens, and apostrophes are allowed." };
  }

  // Check impersonation / inappropriate username patterns
  for (const pattern of BLOCKED_USERNAME_PATTERNS) {
    if (pattern.test(trimmed)) {
      return { clean: false, reason: "That name is not allowed. Please choose a different name." };
    }
  }

  // Profanity check
  const textResult = moderateText(trimmed);
  if (!textResult.clean) return textResult;

  return { clean: true };
}
