const CRISIS_PATTERNS = [
  /\bself.?harm\b/i,
  /\bcut(ting)?\s+(myself|me)\b/i,
  /\bhurt(ing)?\s+(myself|me)\b/i,
  /\bburn(ing)?\s+(myself|me)\b/i,
  /\bsuicid/i,
  /\bkill\s+(myself|me)\b/i,
  /\bend\s+(my|this)\s+life\b/i,
  /\bwant\s+to\s+die\b/i,
  /\bdon't\s+want\s+to\s+(be\s+)?alive\b/i,
  /\bnot\s+worth\s+living\b/i,
  /\bno\s+reason\s+to\s+live\b/i,
  /\bkill\s+(someone|him|her|them|you|people)\b/i,
  /\bmurder\b/i,
  /\bshoot\s+(someone|him|her|them|up)\b/i,
];

function isCrisisInput(text) {
  return CRISIS_PATTERNS.some((pattern) => pattern.test(text));
}

module.exports = { isCrisisInput };