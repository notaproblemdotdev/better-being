export type RatingEntry = {
  timestamp: string;
  rating: number;
};

export type RatingsRange = {
  fromIso: string;
  toIso: string;
};

export type AuthState = "connected" | "needs_login" | "initializing";

export interface RatingsStoreAdapter {
  init(): Promise<void>;
  appendRating(entry: RatingEntry): Promise<void>;
  listRatings(range: RatingsRange): Promise<RatingEntry[]>;
  loadSettings?(): Promise<Record<string, string>>;
  saveSettings?(settings: Record<string, string>): Promise<void>;
  isReady(): boolean;
  getAuthState(): AuthState;
  requestSignIn?(): Promise<void>;
}
