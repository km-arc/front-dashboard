import { describe, expect, it } from "vitest";
import { normalizeIranMobile, normalizeOtpCode, toLatinDigits } from "./identity";

describe("toLatinDigits", () => {
  it("converts Persian and Arabic-Indic digits and leaves the rest alone", () => {
    expect(toLatinDigits("۰۱۲۳۴۵۶۷۸۹ ٠١٢٣٤٥٦٧٨٩ abc 09")).toBe("0123456789 0123456789 abc 09");
  });
});

describe("normalizeIranMobile", () => {
  it.each([
    ["09123456789", "plain"],
    ["9123456789", "missing leading zero"],
    ["+98 912 345 6789", "+98 with spaces"],
    ["+989123456789", "+98"],
    ["0098-912-345-6789", "0098 with dashes"],
    ["989123456789", "98 prefix"],
    ["۰۹۱۲۳۴۵۶۷۸۹", "Persian digits"],
    ["٠٩١٢٣٤٥٦٧٨٩", "Arabic-Indic digits"],
    ["0912\u200c345\u200c6789", "invisible marks"],
    ["(0912) 345-6789", "brackets"],
  ])("accepts %s (%s)", (input) => {
    expect(normalizeIranMobile(input)).toBe("09123456789");
  });

  it.each(["", "abc", "0912345678", "091234567890", "08123456789", "12345", "+1 202 555 0100"])(
    "rejects %j",
    (input) => {
      expect(normalizeIranMobile(input)).toBeNull();
    },
  );
});

describe("normalizeOtpCode", () => {
  it("accepts six digits, in any digit script and with spaces", () => {
    expect(normalizeOtpCode("123456")).toBe("123456");
    expect(normalizeOtpCode("۱۲۳ ۴۵۶")).toBe("123456");
  });

  it("rejects the wrong length or non-digits", () => {
    for (const input of ["", "12345", "1234567", "12a456"]) {
      expect(normalizeOtpCode(input), input).toBeNull();
    }
  });

  it("follows a different code length when the server asks for one", () => {
    expect(normalizeOtpCode("1234", 4)).toBe("1234");
    expect(normalizeOtpCode("123456", 4)).toBeNull();
  });
});
