import { describe, expect, it } from "vitest";
import en from "../../messages/en.json";
import fa from "../../messages/fa.json";
import { isActivePath, mainNav, utilityNav } from "./navigation";

const items = [...mainNav, ...utilityNav];

describe("navigation config", () => {
  it("lists every destination once", () => {
    const ids = items.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("uses locale-less absolute paths", () => {
    for (const item of items) expect(item.href, item.id).toMatch(/^\/[a-z-]*$/);
  });

  it("has a label for every destination in en and fa", () => {
    for (const messages of [en, fa]) {
      for (const item of items) {
        expect(messages.shell.nav[item.id], item.id).toBeTruthy();
      }
    }
  });

  it("keeps the order: main places, then frequent tools", () => {
    expect(mainNav.map((item) => item.id)).toEqual(["home", "categories", "contact"]);
    expect(utilityNav.map((item) => item.id)).toEqual(["search", "cart", "dashboard"]);
  });

  it("keeps the home page available", () => {
    expect(mainNav.find((item) => item.id === "home")?.available).toBe(true);
  });
});

describe("isActivePath", () => {
  it("matches home only on the root path", () => {
    expect(isActivePath("/", "/")).toBe(true);
    expect(isActivePath("/categories", "/")).toBe(false);
  });

  it("matches a section and its children, not look-alikes", () => {
    expect(isActivePath("/categories", "/categories")).toBe(true);
    expect(isActivePath("/categories/books", "/categories")).toBe(true);
    expect(isActivePath("/categories-old", "/categories")).toBe(false);
  });
});
