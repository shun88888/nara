export function normalizePhone(input: string): string {
  const trimmed = input.trim().replace(/[-\s]/g, '');
  // Accept digits and leading + for E.164; remove other chars
  const cleaned = trimmed.replace(/[^+\d]/g, '');
  // If starts with 0 and length looks JP, convert to +81
  if (cleaned.startsWith('0')) {
    return '+81' + cleaned.slice(1);
  }
  return cleaned;
}

export function isValidPhone(input: string): boolean {
  const v = normalizePhone(input);
  // Simple E.164-like check: + and 8-15 digits or JP style converted
  return /^\+\d{8,15}$/.test(v);
}


