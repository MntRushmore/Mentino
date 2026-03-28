const BLOCKED_WORDS = [
  // Profanity
  "fuck", "fucking", "fucked", "fucker", "fuk", "f*ck", "fck",
  "shit", "shitting", "shitty", "sh*t",
  "asshole", "a**",
  "bitch", "bitches", "b*tch",
  "damn", "dammit", "crap", "crud",
  "dick", "dicks", "dik", "dihh", "dih", "cock", "cocks",
  "bastard", "bastards",
  "pussy", "pussies",
  "cunt", "cunts",
  "hell", "wtf", "stfu", "gtfo",
  "piss", "pissed", "pissoff",
  "douche", "douchebag",
  "jackass", "dumbass", "smartass", "fatass",
  "moron", "idiot", "imbecile", "dipshit", "dumbshit",
  "screw you", "screw off",
  "bloody hell", "bollocks", "bugger", "tosser", "wanker", "twat", "arsehole",
  // Sexual
  "butt", "butthole", "boobs", "boob", "tits", "tit", "penis", "vagina",
  "anus", "anal", "horny", "boner", "dildo", "jerk", "jerking",
  "cum", "cumshot", "orgasm", "masturbate", "masturbation",
  "blowjob", "handjob", "fingering", "erection",
  // Slurs — n-word and all common variants/spellings
  "nigger", "nigga", "nigg", "n1gger", "n1gga", "n!gger", "n!gga",
  "nig", "niggah", "niggaz", "niggr", "n*gger", "n*gga",
  "faggot", "fag", "f*ggot", "fgt",
  "retard", "retarded",
  "slut", "whore",
  "tranny", "trannies",
  "spic", "spics", "chink", "chinks", "kike", "kikes", "wetback", "wetbacks",
  "gook", "gooks", "zipperhead", "beaner", "beaners", "sandnigger", "raghead",
  "cracker", "honky", "coon", "jigaboo", "pickaninny",
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
  /fuck|shit|bitch|asshole|dick|cock|cunt|slut|whore|nigger|nigga|nigg|faggot|retard/i,
  /n[i1!*]gg[ae]/i,
  /porn|xxx|nude|sex(?:y)?/i,
  /butt|butthole|boob|tits?|penis|vagina|anus|anal|horny|boner|dildo/i,
  /dih{1,3}|onthedih|inthebutt/i,
  /wanker|twat|tosser|bollocks|arsehole|douche(?:bag)?|jackass|dumbass|asshole/i,
  /cum|blowjob|handjob|masturbat/i,
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
