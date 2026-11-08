import { describe, expect, it } from "vitest";
import en from "../../messages/en.json";
import fa from "../../messages/fa.json";
import { drawerNav, isActivePath, mainNav, tabNav, utilityNav } from "./navigation";

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

  it("keeps the order of every surface", () => {
    expect(mainNav.map((item) => item.id)).toEqual(["home", "categories", "contact"]);
    expect(utilityNav.map((item) => item.id)).toEqual(["search", "cart", "dashboard"]);
    expect(tabNav.map((item) => item.id)).toEqual([
      "home",
      "categories",
      "search",
      "cart",
      "dashboard",
    ]);
    expect(drawerNav.map((item) => item.id)).toEqual(["contact"]);
  });

  it("keeps the phone tab bar to at most five tabs", () => {
    expect(tabNav.length).toBeLessThanOrEqual(5);
  });

  it("covers every destination on phones (tab bar or drawer)", () => {
    const onPhones = new Set([...tabNav, ...drawerNav].map((item) => item.id));
    expect(onPhones).toEqual(new Set(items.map((item) => item.id)));
  });

  it("shares one availability per destination across surfaces", () => {
    for (const item of [...tabNav, ...drawerNav]) {
      expect(
        items.find((other) => other.id === item.id),
        item.id,
      ).toBe(item);
    }
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
