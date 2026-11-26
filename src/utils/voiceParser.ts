import { Product } from '../types/pos';

export interface ParsedVoiceCommand {
  rawTranscript: string;
  matchedItems: {
    product: Product;
    qty: number;
  }[];
  tenderedCash: number | null;
  suggestedPaymentMethod: 'CASH' | 'CARD';
}

const NUMBER_WORDS: Record<string, number> = {
  one: 1,
  a: 1,
  an: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  ten: 10,
};

export const VOICE_PRESET_PHRASES = [
  'Two cold brews, one chips, paid 20',
  'Three bottled water, one notebook, paid 50',
  'One espresso, two croissants, card',
  'Two phone cables, one notebook, paid 100',
];

export function parseVoiceOrder(transcript: string, catalog: Product[]): ParsedVoiceCommand {
  const normalized = transcript.toLowerCase().trim();

  // Detect tendered cash: e.g. "paid 100", "cash 50", "20 dollars"
  let tenderedCash: number | null = null;
  const cashMatch = normalized.match(/(?:paid|cash|bill|tendered)\s*(?:₱|php|\$|€|£|¥)?\s*(\d{1,5})/i);
  if (cashMatch) {
    tenderedCash = parseFloat(cashMatch[1]);
  }

  // Detect payment method
  let suggestedPaymentMethod: 'CASH' | 'CARD' = 'CASH';
  if (normalized.includes('card') || normalized.includes('credit card') || normalized.includes('debit')) {
    suggestedPaymentMethod = 'CARD';
  }

  // Split into clauses by comma or "and" / "plus"
  const clauses = normalized
    .split(/,|\band\b|\bplus\b/)
    .map((c) => c.trim())
    .filter(Boolean);

  const matchedMap = new Map<string, { product: Product; qty: number }>();

  for (const clause of clauses) {
    // Skip pure payment clauses like "paid 100"
    if (/^(?:paid|cash|bill|card)\b/.test(clause)) {
      continue;
    }

    // Find best matching product in this clause
    let bestProduct: Product | null = null;
    let longestAliasLen = 0;

    for (const product of catalog) {
      const candidates = [
        product.shortName.toLowerCase(),
        product.name.toLowerCase(),
        ...product.voiceAliases.map((a) => a.toLowerCase()),
      ];
      for (const alias of candidates) {
        if (clause.includes(alias) && alias.length > longestAliasLen) {
          bestProduct = product;
          longestAliasLen = alias.length;
        }
      }
    }

    if (bestProduct) {
      // Extract quantity before the product name or anywhere in the clause
      let qty = 1;
      const tokens = clause.split(/\s+/);
      for (const tok of tokens) {
        const cleanTok = tok.replace(/[^a-z0-9]/g, '');
        if (NUMBER_WORDS[cleanTok] !== undefined) {
          qty = NUMBER_WORDS[cleanTok];
          break;
        }
        const parsedInt = parseInt(cleanTok, 10);
        // Avoid matching "1.5" in "Coke 1.5" or "3" in "3in1"
        if (!Number.isNaN(parsedInt) && parsedInt > 0 && parsedInt <= 50 && cleanTok === String(parsedInt)) {
          qty = parsedInt;
          break;
        }
      }

      const existing = matchedMap.get(bestProduct.id);
      if (existing) {
        existing.qty += qty;
      } else {
        matchedMap.set(bestProduct.id, { product: bestProduct, qty });
      }
    }
  }

  return {
    rawTranscript: transcript,
    matchedItems: Array.from(matchedMap.values()),
    tenderedCash,
    suggestedPaymentMethod,
  };
}
