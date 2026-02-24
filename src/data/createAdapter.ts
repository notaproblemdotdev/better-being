import { GoogleDriveRatingsAdapter } from "./adapters/googleDrive";
import { IndexedDbRatingsAdapter } from "./adapters/indexedDb";
import { getEnvVar } from "../config/env";
import type { RatingsStoreAdapter } from "./types";

export type DataBackend = "google" | "indexeddb";

export function resolveDataBackend(value: string | undefined): DataBackend | null {
  if (value === "indexeddb" || value === "local_api") {
    return "indexeddb";
  }
  if (value === "google") {
    return "google";
  }
  return null;
}

export function createAdapter(backend?: DataBackend): RatingsStoreAdapter {
  const selected = backend ?? resolveDataBackend(getEnvVar("VITE_DATA_BACKEND")) ?? "google";

  if (selected === "indexeddb") {
    return new IndexedDbRatingsAdapter();
  }

  return new GoogleDriveRatingsAdapter();
}
