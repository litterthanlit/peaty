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
      /\b(progesterone|pregnenolone|dhea|hrt|trtr?|oral\s+trt|dht|dihydrotestosterone|testosterone|estradiol|anastrozole|clomid|hormone\s*(dosing|dose|protocol|stack|framing|cream|oil)|diy\s+hormones?)\b/i,
  },
  {
    label: "peptides / BPC",
    pattern:
      /\b((?:oral|inject(?:ed|ing)?|diy|topical|sublingual)\s+bpc(?:[-\s]?157)?|bpc(?:[-\s]?157)?(?:\s+(?:oral|inject(?:ed|ing)?|diy|hair|angiogenesis|pills?|capsules?|affiliate))?|bpc(?:[-\s]?157)?[^.!?\n]{0,80}\b(hair|angiogenesis|pills?|capsules?|affiliate|shop|gut[-\s]?barrier|breath|croatia|pharma|r\s*&\s*d)|(?:pills?|capsules?|affiliate|peptide[-\s]?shop)[^.!?\n]{0,80}\bbpc(?:[-\s]?157)?|tb[-\s]?(?:500|4)\b|thymosin(?:\s+(?:beta[-\s]?4|alpha(?:[-\s]?1)?))?|thymalin|thymic\s+peptides?|thymus\s+(?:peptide|extract|hormone)|ghk[-\s]?cu|copper\s+peptide|melanotan(?:[-\s]?[12])?|vilon|ipamorelin|cjc[-\s]?1295|semaglutide|tirzepatide|retatrutide|liraglutide|ozempic|wegovy|mounjaro|glp[-\s]?1s?|incretins?|(?:diy\s+)?peptide\s+(?:stack|protocol|cycle|coaching|shop)|peptide[-\s]?shop|stack(?:ing)?\s+peptides?)\b/i,
  },
  {
    label: "peptides / BPC",
    pattern:
      /\b(croatia[^.!?\n]{0,120}\bresearch[-\s]?trips?|research[-\s]?trips?[^.!?\n]{0,120}\bcroatia)\b/i,
  },
  {
    label: "peptides / BPC",
    pattern:
      /\b((?:pharma(?:ceuticals?)?|they)[^.!?\n]{0,80}(?:isn'?t|is\s+not|not)\s+hid(?:e|ing|den)|(?:just\s+)?bad\s+r\s*(?:&|and)\s*d)[^.!?\n]{0,140}\b(bpc|peptide|abudbakri)|(bpc|peptide|abudbakri)[^.!?\n]{0,160}\b((?:pharma(?:ceuticals?)?|they)[^.!?\n]{0,80}(?:isn'?t|is\s+not|not)\s+hid(?:e|ing|den)|(?:just\s+)?bad\s+r\s*(?:&|and)\s*d)\b/i,
  },
  {
    label: "DIY HGH",
    pattern:
      /\b(hgh|human\s+growth\s+hormone|somatropin|(?:diy\s+)?growth\s+hormone)\b/i,
  },
  {
    label: "DIY HGH",
    pattern:
      /\btatem\b[^.!?\n]{0,160}\b(hgh|trt|trial|growth\s+hormone|testosterone)|(hgh|growth\s+hormone)[^.!?\n]{0,80}\btrial/i,
  },
  {
    label: "DIY bioregulator peptides",
    pattern:
      /\b(vesugen|ovagen|chonluten|pinealon|cardiogen|bronchogen|khavinson(?:\s+wave)?|bioregulator(?:\s+peptides?)?(?:\s+(?:stack|protocol|cycle|wave))?|cardiogen\s*[–\-]+\s*bronchogen)\b/i,
  },
  {
    label: "DIY phenibut",
    pattern: /\b(phenibut|fenibut)\b/i,
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
    label: "DIY bromantane",
    pattern: /\b(soviet[-\s]?adaptogens?)\b/i,
  },
  {
    label: "DIY bromantane",
    pattern:
      /\bfarvingco\b[^.!?\n]{0,160}\b(empty[-\s]?stomach|research[-\s]?use[-\s]?only|soviet|adaptogen|sourcing)/i,
  },
  {
    label: "DIY borax / boron for free testosterone",
    pattern: /\b(borax|20[-\s]?mule(?:\s+team)?)\b/i,
  },
  {
    label: "DIY borax / boron for free testosterone",
    pattern:
      /\bboron\b[^.!?\n]{0,100}\b(free\s+(?:testosterone|t)\b|testosterone|dosing|dose|protocol|diy|self[-\s]?dos)|(?:free\s+(?:testosterone|t)\b|testosterone|dosing|protocol|diy)[^.!?\n]{0,100}\bboron\b/i,
  },
  {
    label: "gray-market / research-use-only peptide sourcing",
    pattern:
      /\b(shenzhen|grey?[-\s]?market|gray[-\s]?market|research[-\s]?use[-\s]?only|ruo)\b[^.!?\n]{0,140}\b(peptide|glp[-\s]?1s?|semaglutide|tirzepatide|retatrutide|liraglutide|ozempic|wegovy|mounjaro|bpc|incretins?|bromantane|ladasten)|(peptide|glp[-\s]?1s?|semaglutide|tirzepatide|bpc|bromantane|ladasten)[^.!?\n]{0,140}\b(shenzhen|grey?[-\s]?market|gray[-\s]?market|research[-\s]?use[-\s]?only|ruo|cheap\s+peptides?|sourcing)\b/i,
  },
  {
    label: "gray-market / research-use-only peptide sourcing",
    pattern:
      /\b(compounded)\s+(glp[-\s]?1s?|semaglutide|tirzepatide|retatrutide|peptides?)\b|\b(cheap\s+peptides?|peptide\s+sourcing|peptide\s+vendors?)\b/i,
  },
  {
    label: "dopamine / prolactin stack",
    pattern:
      /\b((dopamine|prolactin)\b[^.!?\n]{0,80}\b(stack|protocol|agonists?)|(stack|protocol)\b[^.!?\n]{0,80}\b(dopamine|prolactin)|cabergoline|bromocriptine|dostinex)\b/i,
  },
  {
    label: "DIY antimicrobial gut-kill",
    pattern:
      /\b((h\.?\s*pylori|helicobacter)[^.!?\n]{0,100}\b(kill|eradicat|stack|protocol|mastic|lactoferrin|antimicrobial|bpc)|(mastic|mastica)\b[^.!?\n]{0,80}\b(lactoferrin)|(lactoferrin)\b[^.!?\n]{0,80}\b(mastic|mastica)|bpc(?:[-\s]?157)?[^.!?\n]{0,80}\b(lactoferrin|mastic)|(lactoferrin|mastic|mastica)[^.!?\n]{0,80}\bbpc(?:[-\s]?157)?|(diy\s+)?(antimicrobial\s+gut[-\s]?kill|gut[-\s]?kill)\s+(stack|protocol)|(antimicrobial)\s+(stack|protocol|kill)[^.!?\n]{0,40}\b(gut|pylori|helicobacter))\b/i,
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
  "This is clinician territory. Peaty will not sketch doses, stacks, or DIY protocols for thyroid hormone (including T3 self-dosing and topical T3 hair protocols), aspirin (topical or oral) including topical aspirin/T3 hair protocols, cyproheptadine, sex hormones (including pregnenolone, progesterone, oral TRT / DHT DIY, and DIY HGH / TRT curiosity from HGH-trial talk), peptides (including oral or injected BPC-157 by all routes, oral BPC pill/shop CTA framing, BPC hair/angiogenesis framing, pharma-isn't-hiding-it / bad R&D framing, Croatia research-trip stories, TB-4/TB-500, GHK-Cu, GHK-Cu + melanotan topical stacks, oral Vilon, GLP-1s, thymus peptides, and Khavinson-wave bioregulator peptides such as Vesugen, OVAGEN, Chonluten, Pinealon, and Cardiogen–Bronchogen), phenibut, AAS/Anavar or similar oral steroids, bromantane / Soviet-adaptogen dosing (including FarvingCo morning empty-stomach / research-use-only sourcing), DIY borax / boron dosing for free testosterone, gray-market / research-use-only / compounded GLP-1 or peptide sourcing, dopamine/prolactin stacks, or DIY antimicrobial gut-kill protocols (including FarvingCo-style H. pylori mastic+lactoferrin kill stacks and FarvingCo BPC+lactoferrin+mastic gut stacks). No DIY peptide or hormone coaching. No peptide-stack coaching. No stack coaching. Do not echo a schedule. Do not echo prices or vendors. Take it to a licensed clinician who can see labs and history. We can keep working on food, warmth, rest, salt/minerals, and the markers you chose.";

const CAUTION_REDIRECT =
  "Stay on food, rhythm, and markers. Do not turn this into a medical protocol. If it needs a prescription, injection, or hormone, send it to a clinician.";

export function checkSafety(text: string): SafetyCheck {
  const normalized = text.trim();
  if (normalized.length === 0) {
    return { verdict: "ok", matched: [], redirect: "" };
  }

  const blocked = [
    ...new Set(
      BLOCK_PATTERNS.filter((item) => item.pattern.test(normalized)).map(
        (item) => item.label,
      ),
    ),
  ];
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
