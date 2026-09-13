export type SafetyVerdict = "block" | "caution" | "ok";

export type SafetyCheck = {
  verdict: SafetyVerdict;
  matched: string[];
  redirect: string;
};

const BLOCK_PATTERNS: Array<{ label: string; pattern: RegExp }> = [
  {
    label: "DIY T3 / thyroid hormone",
    pattern:
      /\b(t3|cytomel|liothyronine|levothyroxine|synthroid|t4|armour\s*thyroid|ndtj?|wp\s*thyroid)\b/i,
  },
  {
    label: "aspirin protocol",
    pattern: /\b(aspirin|asa|salicylate)\b/i,
  },
  {
    label: "exogenous hormones",
    pattern:
      /\b(progesterone\s*(oil|cream|capsule)|pregnenolone|dhea|hrt|trtr?|testosterone|estradiol|anastrozole|clomid)\b/i,
  },
  {
    label: "peptides / BPC",
    pattern:
      /\b(bpc[-\s]?157|tb[-\s]?500|ipamorelin|cjc[-\s]?1295|semaglutide|tirzepatide|retatrutide)\b/i,
  },
];

const CAUTION_PATTERNS: Array<{ label: string; pattern: RegExp }> = [
  {
    label: "supplement megadose",
    pattern: /\b(megadose|high[-\s]?dose\s+(niacin|vitamin\s*a|k2))\b/i,
  },
  {
    label: "injection / self-experiment",
    pattern: /\b(inject|subq|intramuscular)\b/i,
  },
];

const BLOCK_REDIRECT =
  "This is clinician territory. Peaty will not sketch doses, stacks, or DIY protocols for thyroid hormone, aspirin, sex hormones, or peptides (including BPC-157). Take it to a licensed clinician who can see labs and history. We can keep working on food, warmth, rest, salt/minerals, and the markers you chose.";

const CAUTION_REDIRECT =
  "Stay on food, rhythm, and markers. Do not turn this into a medical protocol. If it needs a prescription, injection, or hormone, send it to a clinician.";

export function checkSafety(text: string): SafetyCheck {
  const normalized = text.trim();
  if (normalized.length === 0) {
    return { verdict: "ok", matched: [], redirect: "" };
  }

  const blocked = BLOCK_PATTERNS.filter((item) => item.pattern.test(normalized)).map(
    (item) => item.label,
  );
  if (blocked.length > 0) {
    return { verdict: "block", matched: blocked, redirect: BLOCK_REDIRECT };
  }

  const cautioned = CAUTION_PATTERNS.filter((item) =>
    item.pattern.test(normalized),
  ).map((item) => item.label);
  if (cautioned.length > 0) {
    return { verdict: "caution", matched: cautioned, redirect: CAUTION_REDIRECT };
  }

  return { verdict: "ok", matched: [], redirect: "" };
}
