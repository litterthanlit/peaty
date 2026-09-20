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
      /\b(t3|cytomel|liothyronine|levothyroxine|synthroid|t4|armour\s*thyroid|ndtj?|wp\s*thyroid|self[-\s]?dos(?:e|ing)\s+t3|t3\s+self[-\s]?dos(?:e|ing))\b/i,
  },
  {
    label: "aspirin protocol",
    pattern:
      /\b((topical|oral)\s+aspirin|aspirin(\s+(cream|gel|topical|oral|protocol|diy))?|asa|salicylate)\b/i,
  },
  {
    label: "cyproheptadine",
    pattern: /\b(cyproheptadine|periactin|cypro)\b/i,
  },
  {
    label: "exogenous hormones",
    pattern:
      /\b(progesterone|pregnenolone|dhea|hrt|trtr?|testosterone|estradiol|anastrozole|clomid|hormone\s*(dosing|dose|protocol|stack|framing|cream|oil)|diy\s+hormones?)\b/i,
  },
  {
    label: "peptides / BPC",
    pattern:
      /\b((?:oral|inject(?:ed|ing)?|diy)\s+bpc(?:[-\s]?157)?|bpc(?:[-\s]?157)?(?:\s+(?:oral|inject(?:ed|ing)?|diy))?|tb[-\s]?(?:500|4)\b|thymosin\s*beta[-\s]?4|ghk[-\s]?cu|copper\s+peptide|vilon|ipamorelin|cjc[-\s]?1295|semaglutide|tirzepatide|retatrutide|(?:diy\s+)?peptide\s+(?:stack|protocol|cycle|coaching)|stack(?:ing)?\s+peptides?)\b/i,
  },
  {
    label: "DIY AAS / oral steroids",
    pattern:
      /\b(anavar|oxandrolone|winstrol|stanozolol|dianabol|dbol|anadrol|oxymetholone|turinabol|superdrol|anabolic(?:-androgenic)?\s+steroids?|\baas\b|oral\s+steroids?|steroid\s+(?:stack|cycle|protocol|framing)|(?:stack|cycle|protocol)\b[^.!?\n]{0,48}\b(?:anavar|oxandrolone|aas|oral\s+steroids?))\b/i,
  },
  {
    label: "DIY bromantane",
    pattern: /\b(bromantane|ladasten)\b/i,
  },
  {
    label: "dopamine / prolactin stack",
    pattern:
      /\b((dopamine|prolactin)\b[^.!?\n]{0,80}\b(stack|protocol|agonists?)|(stack|protocol)\b[^.!?\n]{0,80}\b(dopamine|prolactin)|cabergoline|bromocriptine|dostinex)\b/i,
  },
  {
    label: "DIY antimicrobial gut-kill",
    pattern:
      /\b((h\.?\s*pylori|helicobacter)[^.!?\n]{0,100}\b(kill|eradicat|stack|protocol|mastic|lactoferrin|antimicrobial)|(mastic|mastica)\b[^.!?\n]{0,80}\b(lactoferrin)|(lactoferrin)\b[^.!?\n]{0,80}\b(mastic|mastica)|(diy\s+)?(antimicrobial\s+gut[-\s]?kill|gut[-\s]?kill)\s+(stack|protocol)|(antimicrobial)\s+(stack|protocol|kill)[^.!?\n]{0,40}\b(gut|pylori|helicobacter))\b/i,
  },
];

const CAUTION_PATTERNS: Array<{ label: string; pattern: RegExp }> = [
  {
    label: "supplement megadose",
    pattern:
      /\b(megadose|high[-\s]?dose\s+(niacinamide|nicotinamide|niacin|vitamin\s*a|k2))\b/i,
  },
  {
    label: "niacinamide supplement protocol",
    pattern:
      /\b(niacinamide|nicotinamide)\b[^.!?\n]{0,60}\b(protocol|stack|dosing)\b|\b(protocol|stack|dosing)\b[^.!?\n]{0,60}\b(niacinamide|nicotinamide)\b/i,
  },
  {
    label: "injection / self-experiment",
    pattern: /\b(inject|subq|intramuscular)\b/i,
  },
];

const BLOCK_REDIRECT =
  "This is clinician territory. Peaty will not sketch doses, stacks, or DIY protocols for thyroid hormone (including T3 self-dosing), aspirin (topical or oral), cyproheptadine, sex hormones (including pregnenolone and progesterone), peptides (including oral or injected BPC-157, TB-4/TB-500, GHK-Cu, and oral Vilon), AAS/Anavar or similar oral steroids, bromantane, dopamine/prolactin stacks, or DIY antimicrobial gut-kill protocols (including FarvingCo-style H. pylori mastic+lactoferrin kill stacks). No peptide-stack coaching. No stack coaching. Take it to a licensed clinician who can see labs and history. We can keep working on food, warmth, rest, salt/minerals, and the markers you chose.";

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
