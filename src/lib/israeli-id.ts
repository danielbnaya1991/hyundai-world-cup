/**
 * Validates an Israeli Teudat Zehut number using the Luhn-like check digit algorithm.
 * Accepts 5-9 digit strings (left-padded to 9 digits internally).
 */
export function validateIsraeliId(id: string): boolean {
  // Remove whitespace/dashes
  const cleaned = id.replace(/[\s-]/g, "");

  // Must be 5-9 digits
  if (!/^\d{5,9}$/.test(cleaned)) return false;

  // Pad to 9 digits
  const padded = cleaned.padStart(9, "0");

  let sum = 0;
  for (let i = 0; i < 9; i++) {
    let digit = Number(padded[i]) * ((i % 2) + 1);
    if (digit > 9) digit -= 9;
    sum += digit;
  }

  return sum % 10 === 0;
}
