/** Persian (U+06F0..) and Arabic-Indic (U+0660..) digits to 0-9. */
export function toLatinDigits(input: string): string {
  return input.replace(/[\u06F0-\u06F9\u0660-\u0669]/g, (digit) => {
    const code = digit.charCodeAt(0);
    return String(code >= 0x06f0 ? code - 0x06f0 : code - 0x0660);
  });
}

/** Spaces, dashes, brackets and the invisible marks people paste along with numbers. */
const NOISE = /[\s\-()\u200b-\u200f\u202a-\u202e]/g;

/**
 * Iranian mobile number in the form 09123456789, or null when the input is not one.
 * Accepts Persian and Arabic digits and the prefixes +98, 0098, 98 and a missing leading 0.
 */
export function normalizeIranMobile(input: string): string | null {
  let value = toLatinDigits(input).replace(NOISE, "");
  if (value.startsWith("+98")) value = `0${value.slice(3)}`;
  else if (value.startsWith("0098")) value = `0${value.slice(4)}`;
  else if (value.startsWith("98") && value.length === 12) value = `0${value.slice(2)}`;
  else if (value.startsWith("9") && value.length === 10) value = `0${value}`;
  return /^09\d{9}$/.test(value) ? value : null;
}

/** The digits of a one-time code (Persian digits and spaces allowed), or null unless it has `length` digits. */
export function normalizeOtpCode(input: string, length = 6): string | null {
  const value = toLatinDigits(input).replace(NOISE, "");
  return new RegExp(`^\\d{${length}}$`).test(value) ? value : null;
}
