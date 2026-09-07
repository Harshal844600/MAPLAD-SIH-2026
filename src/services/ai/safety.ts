// ==============================================================================
// SENTINEL AI — SAFETY, PROMPT INJECTION DEFENSE & ACCUSATORY LANGUAGE SANITIZER
// ==============================================================================

/**
 * Sanitizes untrusted user or document text to prevent prompt injection attacks.
 */
export function sanitizeUntrustedText(input: string): string {
  if (!input) return '';
  // Neutralize common instruction-override vectors
  return input
    .replace(/ignore (all )?previous instructions/gi, '[FILTERED_INSTRUCTION]')
    .replace(/system prompt/gi, '[FILTERED_KEYWORD]')
    .replace(/you are now/gi, '[FILTERED_INSTRUCTION]')
    .replace(/developer mode/gi, '[FILTERED_KEYWORD]')
    .trim();
}

/**
 * Ensures AI outputs adhere to non-defamatory, decision-support government language guidelines.
 */
export function enforceSafetyLanguage(text: string): string {
  let vetted = text;

  // Replace accusatory phrases with evidence-grounded risk indicators
  const replacements: [RegExp, string][] = [
    [/is fraudulent/gi, 'exhibits potential irregularities requiring verification'],
    [/is corrupt/gi, 'displays unusual operational patterns'],
    [/committed fraud/gi, 'has unexplained documentation and cost discrepancies'],
    [/illegal activity/gi, 'non-compliant implementation pattern'],
    [/guilty of/gi, 'associated with flagged indicators of'],
    [/fake project/gi, 'unverified asset record with geographic inconsistencies'],
    [/stolen funds/gi, 'unaccounted fund disbursement pace'],
  ];

  for (const [pattern, substitute] of replacements) {
    vetted = vetted.replace(pattern, substitute);
  }

  return vetted;
}
