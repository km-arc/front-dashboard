import { describe, expect, it } from "vitest";
import { readSessionResponse } from "./session-client";

const answer = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status });

describe("readSessionResponse", () => {
  it("returns the signed-in user", async () => {
    const user = { id: "u1", mobile: "09123456789", displayName: "Sara" };
    expect(await readSessionResponse(answer({ user }))).toEqual(user);
  });

  it("leaves out a missing name and ignores unknown fields", async () => {
    const user = { id: "u1", mobile: "09123456789", token: "secret" };
    const read = await readSessionResponse(answer({ user }));
    expect(read).toEqual({ id: "u1", mobile: "09123456789" });
  });

  it("is null when nobody is signed in", async () => {
    expect(await readSessionResponse(answer({ user: null }))).toBeNull();
  });

  it("is null for an error status or an answer that is not what we expect", async () => {
    expect(await readSessionResponse(answer({ user: null }, 503))).toBeNull();
    expect(await readSessionResponse(answer({ user: { id: 1 } }))).toBeNull();
    expect(await readSessionResponse(answer("nope"))).toBeNull();
    expect(await readSessionResponse(new Response("<html>", { status: 200 }))).toBeNull();
  });
});
