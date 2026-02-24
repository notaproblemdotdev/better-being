import { expect, test } from "bun:test";
import { createAdapter, resolveDataBackend } from "../../src/data/createAdapter";
import { GoogleDriveRatingsAdapter } from "../../src/data/adapters/googleDrive";
import { IndexedDbRatingsAdapter } from "../../src/data/adapters/indexedDb";

test("resolveDataBackend returns null for unset or invalid values", () => {
  expect(resolveDataBackend(undefined)).toBeNull();
  expect(resolveDataBackend("anything")).toBeNull();
});

test("resolveDataBackend supports configured values", () => {
  expect(resolveDataBackend("google")).toBe("google");
  expect(resolveDataBackend("indexeddb")).toBe("indexeddb");
  expect(resolveDataBackend("local_api")).toBe("indexeddb");
});

test("createAdapter returns requested adapter", () => {
  const indexeddb = createAdapter("indexeddb");
  const google = createAdapter("google");

  expect(indexeddb).toBeInstanceOf(IndexedDbRatingsAdapter);
  expect(google).toBeInstanceOf(GoogleDriveRatingsAdapter);
});
