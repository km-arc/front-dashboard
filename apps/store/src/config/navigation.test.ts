import { describe, expect, it } from "vitest";
import en from "../../messages/en.json";
import fa from "../../messages/fa.json";
import {
  accountNav,
  drawerNav,
  isActiveAccountPath,
  isActivePath,
  mainNav,
  tabNav,
  utilityNav,
} from "./navigation";

const items = [...mainNav, ...utilityNav, ...tabNav, ...drawerNav];
const destinations = new Set(items.map((item) => item.id));

describe("navigation config", () => {
  it("lists each surface without repeating a destination", () => {
    for (const list of [mainNav, utilityNav, tabNav, drawerNav]) {
      const ids = list.map((item) => item.id);
      expect(new Set(ids).size, ids.join()).toBe(ids.length);
    }
  });

  it("knows exactly the six destinations", () => {
    expect([...destinations].sort()).toEqual(
      ["cart", "categories", "contact", "dashboard", "home", "search"].sort(),
    );
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
    expect(utilityNav.map((item) => item.id)).toEqual(["search", "cart"]);
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
    expect(onPhones).toEqual(destinations);
  });

  it("shares one availability per destination across surfaces", () => {
    for (const item of items) {
      expect(items.find((other) => other.id === item.id), item.id).toBe(item);
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

describe("account navigation", () => {
  it("lists the six options in order, with the overview available", () => {
    expect(accountNav.map((item) => item.id)).toEqual([
      "overview",
      "orders",
      "profile",
      "addresses",
      "wallet",
      "support",
    ]);
    expect(accountNav[0]?.available).toBe(true);
  });

  it("has a label for every option in en and fa", () => {
    for (const messages of [en, fa]) {
      for (const item of accountNav) expect(messages.account.nav[item.id], item.id).toBeTruthy();
    }
  });

  it("keeps every option under /dashboard", () => {
    for (const item of accountNav) expect(item.href.startsWith("/dashboard"), item.id).toBe(true);
  });

  it("marks the overview only on its own path", () => {
    const overview = { id: "overview", href: "/dashboard", available: true } as const;
    const orders = { id: "orders", href: "/dashboard/orders", available: false } as const;
    expect(isActiveAccountPath("/dashboard", overview)).toBe(true);
    expect(isActiveAccountPath("/dashboard/orders", overview)).toBe(false);
    expect(isActiveAccountPath("/dashboard/orders", orders)).toBe(true);
    expect(isActiveAccountPath("/dashboard/orders/42", orders)).toBe(true);
  });
});
