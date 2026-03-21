const BLOCKED_WORDS = [
  "fuck", "shit", "ass", "bitch", "damn", "crap", "dick", "bastard",
  "nigger", "faggot", "retard", "slut", "whore",
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
    const regex = new RegExp(`\\b${word}\\b`, "i");
    if (regex.test(lower)) {
      return { clean: false, reason: "Your text contains inappropriate language. Please revise." };
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
