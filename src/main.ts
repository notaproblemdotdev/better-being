import "./styles.css";

type GoogleTokenResponse = {
  access_token: string;
  expires_in: number;
  prompt: string;
  token_type: string;
  scope: string;
};

type GoogleTokenClient = {
  requestAccessToken: (options?: { prompt?: string }) => void;
};

type RatingPoint = {
  dayKey: string;
  dayLabel: string;
  value: number | null;
};

type StoredAuthSession = {
  accessToken: string;
  expiresAtMs: number;
};

type Locale = "pl" | "en";
type Theme = "light" | "dark";

type I18nKey =
  | "app.title"
  | "auth.signIn"
  | "auth.connected"
  | "status.waitingForLogin"
  | "status.missingClientId"
  | "status.clickSignIn"
  | "status.googleClientInitFailed"
  | "status.connected"
  | "status.sheetInitFailed"
  | "status.authRejected"
  | "status.oauthNotReady"
  | "status.openingGoogleLogin"
  | "status.signInFirst"
  | "status.invalidRating"
  | "status.savingRating"
  | "status.ratingSaved"
  | "status.ratingSaveFailed"
  | "status.sessionRestored"
  | "status.chartLoadFailed"
  | "status.generatingChart"
  | "status.chartUpdated"
  | "tabs.ariaLabel"
  | "tabs.entry"
  | "tabs.week"
  | "form.question"
  | "form.save"
  | "chart.title"
  | "chart.ariaLabel"
  | "chart.empty"
  | "locale.label"
  | "theme.toggle"
  | "theme.light"
  | "theme.dark";

type I18nDict = Record<I18nKey, string>;
type I18nVars = Record<string, string>;

const I18N: Record<Locale, I18nDict> = {
  pl: {
    "app.title": "being better",
    "auth.signIn": "Zaloguj przez Google",
    "auth.connected": "Połączono",
    "status.waitingForLogin": "Oczekiwanie na logowanie.",
    "status.missingClientId": "Ustaw VITE_GOOGLE_CLIENT_ID w środowisku (np. .env.local).",
    "status.clickSignIn": "Kliknij '{signIn}'.",
    "status.googleClientInitFailed": "Nie udało się uruchomić klienta Google API.",
    "status.connected": "Połączono z Google. Możesz zapisywać dane.",
    "status.sheetInitFailed": "Logowanie powiodło się, ale inicjalizacja arkusza nie powiodła się.",
    "status.authRejected": "Autoryzacja Google została odrzucona lub przerwana.",
    "status.oauthNotReady": "Klient OAuth nie jest gotowy.",
    "status.openingGoogleLogin": "Otwieranie logowania Google...",
    "status.signInFirst": "Najpierw zaloguj się przez Google.",
    "status.invalidRating": "Podaj liczbę całkowitą od 1 do 10.",
    "status.savingRating": "Zapisywanie oceny...",
    "status.ratingSaved": "Ocena zapisana.",
    "status.ratingSaveFailed": "Nie udało się zapisać oceny do Google Sheets.",
    "status.sessionRestored": "Przywrócono sesję z poprzedniego logowania.",
    "status.chartLoadFailed": "Nie udało się odczytać danych do wykresu.",
    "status.generatingChart": "Generowanie wykresu z ostatniego tygodnia...",
    "status.chartUpdated": "Wykres zaktualizowany.",
    "tabs.ariaLabel": "Widoki aplikacji",
    "tabs.entry": "Dodaj ocenę",
    "tabs.week": "Ostatni tydzień",
    "form.question": "Jak oceniasz swój dzień? 1 - bardzo zły dzień, 10 - najlepszy dzień od dawna",
    "form.save": "Zapisz ocenę",
    "chart.title": "Oceny z ostatnich 7 dni",
    "chart.ariaLabel": "Wykres ocen z ostatnich 7 dni",
    "chart.empty": "Brak danych z ostatniego tygodnia.",
    "locale.label": "Język",
    "theme.toggle": "Motyw: {theme}",
    "theme.light": "jasny",
    "theme.dark": "ciemny",
  },
  en: {
    "app.title": "being better",
    "auth.signIn": "Sign in with Google",
    "auth.connected": "Connected",
    "status.waitingForLogin": "Waiting for sign in.",
    "status.missingClientId": "Set VITE_GOOGLE_CLIENT_ID in the environment (for example, .env.local).",
    "status.clickSignIn": "Click '{signIn}'.",
    "status.googleClientInitFailed": "Failed to initialize the Google API client.",
    "status.connected": "Connected to Google. You can save data now.",
    "status.sheetInitFailed": "Sign in succeeded, but spreadsheet initialization failed.",
    "status.authRejected": "Google authorization was rejected or interrupted.",
    "status.oauthNotReady": "OAuth client is not ready.",
    "status.openingGoogleLogin": "Opening Google sign in...",
    "status.signInFirst": "Sign in with Google first.",
    "status.invalidRating": "Enter an integer between 1 and 10.",
    "status.savingRating": "Saving rating...",
    "status.ratingSaved": "Rating saved.",
    "status.ratingSaveFailed": "Failed to save rating to Google Sheets.",
    "status.sessionRestored": "Session restored from previous sign in.",
    "status.chartLoadFailed": "Failed to load data for the chart.",
    "status.generatingChart": "Generating chart for the last week...",
    "status.chartUpdated": "Chart updated.",
    "tabs.ariaLabel": "App views",
    "tabs.entry": "Add rating",
    "tabs.week": "Last week",
    "form.question": "How do you rate your day? 1 - very bad day, 10 - best day in a long time",
    "form.save": "Save rating",
    "chart.title": "Ratings from the last 7 days",
    "chart.ariaLabel": "Ratings chart from the last 7 days",
    "chart.empty": "No data from the last week.",
    "locale.label": "Language",
    "theme.toggle": "Theme: {theme}",
    "theme.light": "light",
    "theme.dark": "dark",
  },
};

declare global {
  interface Window {
    google?: {
      accounts?: {
        oauth2?: {
          initTokenClient: (config: {
            client_id: string;
            scope: string;
            callback: (response: GoogleTokenResponse) => void;
            error_callback?: (error: unknown) => void;
          }) => GoogleTokenClient;
        };
      };
    };
    gapi?: {
      load: (name: string, callback: () => void) => void;
      client: {
        setToken: (token: { access_token: string } | null) => void;
        load: (apiName: string, version: string) => Promise<void>;
        drive: {
          files: {
            list: (params: Record<string, unknown>) => Promise<{ result: { files?: Array<{ id?: string; createdTime?: string }> } }>;
          };
        };
        sheets: {
          spreadsheets: {
            get: (params: Record<string, unknown>) => Promise<{ result: { sheets?: Array<{ properties?: { title?: string } }> } }>;
            create: (params: Record<string, unknown>) => Promise<{ result: { spreadsheetId?: string } }>;
            batchUpdate: (params: Record<string, unknown>) => Promise<unknown>;
            values: {
              get: (params: Record<string, unknown>) => Promise<{ result: { values?: string[][] } }>;
              update: (params: Record<string, unknown>) => Promise<unknown>;
              append: (params: Record<string, unknown>) => Promise<unknown>;
            };
          };
        };
      };
    };
  }
}

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID ?? "";
const SHEET_TITLE = "being better";
const DATA_SHEET_TITLE = "data";
const CONFIG_SHEET_TITLE = "config";
const AUTH_COOKIE_NAME = "being_better_auth";
const SCOPES = [
  "https://www.googleapis.com/auth/drive.file",
  "https://www.googleapis.com/auth/spreadsheets",
].join(" ");
const LOCALE_COOKIE_NAME = "being_better_locale";
const SUPPORTED_LOCALES: Locale[] = ["pl", "en"];
const THEME_COOKIE_NAME = "being_better_theme";
const SUPPORTED_THEMES: Theme[] = ["light", "dark"];
let currentLocale = detectInitialLocale();
let currentTheme = detectInitialTheme();
applyTheme(currentTheme);

const app = document.querySelector<HTMLDivElement>("#app");
if (!app) {
  throw new Error("Missing #app container");
}

app.innerHTML = `
  <main class="shell">
    <header class="top">
      <h1 id="title">${t("app.title")}</h1>
      <div class="top-actions">
        <label for="locale" id="locale-label" class="locale-label">${t("locale.label")}</label>
        <select id="locale" class="locale-select" aria-labelledby="locale-label">
          ${SUPPORTED_LOCALES.map(
            (locale) => `<option value="${locale}"${locale === currentLocale ? " selected" : ""}>${locale.toUpperCase()}</option>`,
          ).join("")}
        </select>
        <button id="theme-toggle" class="btn" type="button">${t("theme.toggle", { theme: t(themeLabelKey(currentTheme)) })}</button>
        <button id="signin" class="btn btn-primary" disabled>${t("auth.signIn")}</button>
      </div>
    </header>

    <p id="status" class="status">${t("status.waitingForLogin")}</p>

    <nav id="tabs" class="tabs" aria-label="${t("tabs.ariaLabel")}">
      <button id="tab-entry" class="tab tab-active" disabled>${t("tabs.entry")}</button>
      <button id="tab-week" class="tab" disabled>${t("tabs.week")}</button>
    </nav>

    <section id="entry-view" class="view">
      <form id="rating-form" class="card" autocomplete="off">
        <label id="rating-label" for="rating" class="label">${t("form.question")}</label>
        <input id="rating" name="rating" type="number" min="1" max="10" step="1" required />
        <button id="save-rating" class="btn btn-primary" type="submit">${t("form.save")}</button>
      </form>
    </section>

    <section id="week-view" class="view hidden">
      <div class="card">
        <p id="chart-title" class="label">${t("chart.title")}</p>
        <canvas id="chart" width="720" height="320" aria-label="${t("chart.ariaLabel")}"></canvas>
        <p id="chart-empty" class="status hidden">${t("chart.empty")}</p>
      </div>
    </section>
  </main>
`;

const titleEl = must<HTMLHeadingElement>("#title");
const localeSelect = must<HTMLSelectElement>("#locale");
const localeLabel = must<HTMLLabelElement>("#locale-label");
const themeToggleBtn = must<HTMLButtonElement>("#theme-toggle");
const statusEl = must<HTMLParagraphElement>("#status");
const signInBtn = must<HTMLButtonElement>("#signin");
const tabsEl = must<HTMLElement>("#tabs");
const entryTab = must<HTMLButtonElement>("#tab-entry");
const weekTab = must<HTMLButtonElement>("#tab-week");
const entryView = must<HTMLElement>("#entry-view");
const weekView = must<HTMLElement>("#week-view");
const ratingForm = must<HTMLFormElement>("#rating-form");
const ratingLabel = must<HTMLLabelElement>("#rating-label");
const saveRatingBtn = must<HTMLButtonElement>("#save-rating");
const ratingInput = must<HTMLInputElement>("#rating");
const chartTitle = must<HTMLParagraphElement>("#chart-title");
const chartCanvas = must<HTMLCanvasElement>("#chart");
const chartEmpty = must<HTMLParagraphElement>("#chart-empty");

let tokenClient: GoogleTokenClient | null = null;
let hasGrantedToken = false;
let currentSpreadsheetId: string | null = null;

signInBtn.addEventListener("click", onSignInClick);
localeSelect.addEventListener("change", onLocaleChange);
themeToggleBtn.addEventListener("click", onThemeToggle);

void boot();

async function boot(): Promise<void> {
  if (!GOOGLE_CLIENT_ID) {
    setStatus(t("status.missingClientId"), true);
    signInBtn.disabled = true;
    return;
  }

  try {
    await Promise.all([waitForGoogle(), waitForGapi()]);
    await loadGoogleApis();
    tokenClient = initTokenClient();
    await restoreSessionFromCookie();

    signInBtn.disabled = false;
    entryTab.addEventListener("click", () => showTab("entry"));
    weekTab.addEventListener("click", async () => {
      showTab("week");
      await generateWeeklyChartOnDemand();
    });
    ratingForm.addEventListener("submit", onSubmitRating);

    if (!currentSpreadsheetId) {
      setStatus(t("status.clickSignIn", { signIn: t("auth.signIn") }));
    }
  } catch (error) {
    console.error(error);
    setStatus(t("status.googleClientInitFailed"), true);
  }
}

function initTokenClient(): GoogleTokenClient {
  const oauth2 = window.google?.accounts?.oauth2;
  if (!oauth2) {
    throw new Error("Google Identity Services unavailable");
  }

  return oauth2.initTokenClient({
    client_id: GOOGLE_CLIENT_ID,
    scope: SCOPES,
    callback: async (response) => {
      try {
        if (!response.access_token) {
          throw new Error("Missing access token");
        }

        const expiresAtMs = Date.now() + response.expires_in * 1000;
        persistAuthSession({
          accessToken: response.access_token,
          expiresAtMs,
        });
        window.gapi?.client.setToken({ access_token: response.access_token });
        hasGrantedToken = true;
        currentSpreadsheetId = await ensureSpreadsheet();

        setConnectedUiState();
        setStatus(t("status.connected"));
      } catch (error) {
        console.error(error);
        clearAuthSession();
        setStatus(t("status.sheetInitFailed"), true);
      }
    },
    error_callback: (error) => {
      console.error(error);
      setStatus(t("status.authRejected"), true);
    },
  });
}

function onSignInClick(): void {
  if (!tokenClient) {
    setStatus(t("status.oauthNotReady"), true);
    return;
  }

  setStatus(t("status.openingGoogleLogin"));
  tokenClient.requestAccessToken({ prompt: hasGrantedToken ? "" : "consent" });
}

async function onSubmitRating(event: SubmitEvent): Promise<void> {
  event.preventDefault();

  if (!currentSpreadsheetId) {
    setStatus(t("status.signInFirst"), true);
    return;
  }

  const rawValue = ratingInput.value.trim();
  const rating = Number(rawValue);

  if (!Number.isInteger(rating) || rating < 1 || rating > 10) {
    setStatus(t("status.invalidRating"), true);
    return;
  }

  try {
    setStatus(t("status.savingRating"));
    await window.gapi?.client.sheets.spreadsheets.values.append({
      spreadsheetId: currentSpreadsheetId,
      range: `${DATA_SHEET_TITLE}!A:B`,
      valueInputOption: "RAW",
      insertDataOption: "INSERT_ROWS",
      resource: {
        values: [[new Date().toISOString(), String(rating)]],
      },
    });

    ratingForm.reset();
    setStatus(t("status.ratingSaved"));

    if (!weekView.classList.contains("hidden")) {
      await refreshWeeklyChart();
    }
  } catch (error) {
    console.error(error);
    setStatus(t("status.ratingSaveFailed"), true);
  }
}

async function restoreSessionFromCookie(): Promise<void> {
  const session = readAuthSession();
  if (!session) {
    return;
  }

  if (Date.now() >= session.expiresAtMs) {
    clearAuthSession();
    return;
  }

  try {
    window.gapi?.client.setToken({ access_token: session.accessToken });
    hasGrantedToken = true;
    currentSpreadsheetId = await ensureSpreadsheet();
    setConnectedUiState();
    setStatus(t("status.sessionRestored"));
  } catch (error) {
    console.error(error);
    clearAuthSession();
    window.gapi?.client.setToken(null);
  }
}

function setConnectedUiState(): void {
  entryTab.disabled = false;
  weekTab.disabled = false;
  signInBtn.textContent = t("auth.connected");
  signInBtn.disabled = true;
}

async function ensureSpreadsheet(): Promise<string> {
  const existingId = await findSpreadsheetIdByName(SHEET_TITLE);
  if (existingId) {
    await ensureRequiredSheets(existingId);
    await ensureHeaders(existingId);
    return existingId;
  }

  const createResponse = await window.gapi?.client.sheets.spreadsheets.create({
    properties: { title: SHEET_TITLE },
    sheets: [
      { properties: { title: DATA_SHEET_TITLE } },
      { properties: { title: CONFIG_SHEET_TITLE } },
    ],
  });

  const spreadsheetId = createResponse?.result.spreadsheetId;
  if (!spreadsheetId) {
    throw new Error("Sheets create returned no spreadsheetId");
  }

  await ensureHeaders(spreadsheetId);
  return spreadsheetId;
}

async function findSpreadsheetIdByName(name: string): Promise<string | null> {
  const response = await window.gapi?.client.drive.files.list({
    q: `name = '${escapeDriveString(name)}' and mimeType = 'application/vnd.google-apps.spreadsheet' and trashed = false and 'root' in parents`,
    spaces: "drive",
    fields: "files(id, createdTime)",
    orderBy: "createdTime asc",
    pageSize: 10,
  });

  const files = response?.result.files;
  if (!files?.length) {
    return null;
  }

  const first = files[0];
  return first.id ?? null;
}

async function ensureHeaders(spreadsheetId: string): Promise<void> {
  const response = await window.gapi?.client.sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${DATA_SHEET_TITLE}!A1:B1`,
  });

  const row = response?.result.values?.[0] ?? [];
  const hasHeaders = row[0] === "timestamp" && row[1] === "rating";
  if (hasHeaders) {
    return;
  }

  await window.gapi?.client.sheets.spreadsheets.values.update({
    spreadsheetId,
    range: `${DATA_SHEET_TITLE}!A1:B1`,
    valueInputOption: "RAW",
    resource: {
      values: [["timestamp", "rating"]],
    },
  });
}

async function ensureRequiredSheets(spreadsheetId: string): Promise<void> {
  const response = await window.gapi?.client.sheets.spreadsheets.get({
    spreadsheetId,
    fields: "sheets.properties.title",
  });

  const existingTitles = new Set(
    (response?.result.sheets ?? [])
      .map((sheet) => sheet.properties?.title)
      .filter((title): title is string => typeof title === "string"),
  );

  const requests: Array<{ addSheet: { properties: { title: string } } }> = [];
  if (!existingTitles.has(DATA_SHEET_TITLE)) {
    requests.push({ addSheet: { properties: { title: DATA_SHEET_TITLE } } });
  }
  if (!existingTitles.has(CONFIG_SHEET_TITLE)) {
    requests.push({ addSheet: { properties: { title: CONFIG_SHEET_TITLE } } });
  }

  if (requests.length === 0) {
    return;
  }

  await window.gapi?.client.sheets.spreadsheets.batchUpdate({
    spreadsheetId,
    resource: { requests },
  });
}

async function refreshWeeklyChart(): Promise<void> {
  if (!currentSpreadsheetId) {
    return;
  }

  try {
    const response = await window.gapi?.client.sheets.spreadsheets.values.get({
      spreadsheetId: currentSpreadsheetId,
      range: `${DATA_SHEET_TITLE}!A2:B`,
    });

    const rows = response?.result.values ?? [];
    const points = buildLastWeekSeries(rows);
    drawWeeklyChart(points);
  } catch (error) {
    console.error(error);
    setStatus(t("status.chartLoadFailed"), true);
  }
}

async function generateWeeklyChartOnDemand(): Promise<void> {
  if (!currentSpreadsheetId) {
    setStatus(t("status.signInFirst"), true);
    return;
  }

  setStatus(t("status.generatingChart"));
  await refreshWeeklyChart();
  setStatus(t("status.chartUpdated"));
}

function buildLastWeekSeries(rows: string[][]): RatingPoint[] {
  const end = startOfDay(new Date());
  const start = new Date(end);
  start.setDate(start.getDate() - 6);

  const buckets = new Map<string, number[]>();

  for (const row of rows) {
    const timestamp = row[0];
    const rawRating = row[1];
    if (!timestamp || !rawRating) {
      continue;
    }

    const date = new Date(timestamp);
    const rating = Number(rawRating);
    if (Number.isNaN(date.getTime()) || !Number.isFinite(rating)) {
      continue;
    }

    const day = startOfDay(date);
    if (day < start || day > end) {
      continue;
    }

    const key = toDayKey(day);
    const values = buckets.get(key) ?? [];
    values.push(rating);
    buckets.set(key, values);
  }

  const points: RatingPoint[] = [];
  for (let i = 0; i < 7; i += 1) {
    const day = new Date(start);
    day.setDate(start.getDate() + i);
    const key = toDayKey(day);
    const values = buckets.get(key);

    points.push({
      dayKey: key,
      dayLabel: day.toLocaleDateString(toBcp47Locale(currentLocale), {
        weekday: "short",
        day: "2-digit",
        month: "2-digit",
      }),
      value: values && values.length > 0 ? average(values) : null,
    });
  }

  return points;
}

function drawWeeklyChart(points: RatingPoint[]): void {
  const ctx = chartCanvas.getContext("2d");
  if (!ctx) {
    return;
  }

  const hasData = points.some((point) => point.value !== null);
  chartEmpty.classList.toggle("hidden", hasData);

  const width = chartCanvas.width;
  const height = chartCanvas.height;
  const left = 52;
  const right = 24;
  const top = 20;
  const bottom = 52;
  const plotWidth = width - left - right;
  const plotHeight = height - top - bottom;
  const chartBg = cssVar("--chart-bg", "#ffffff");
  const chartGrid = cssVar("--chart-grid", "#d8d8d8");
  const chartAxis = cssVar("--chart-axis", "#666666");
  const chartLine = cssVar("--chart-line", "#1f6d8a");
  const chartPoint = cssVar("--chart-point", "#1f6d8a");
  const chartValue = cssVar("--chart-value", "#123b4c");
  const chartLabel = cssVar("--chart-label", "#444444");

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = chartBg;
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = chartGrid;
  ctx.lineWidth = 1;

  for (let yTick = 1; yTick <= 10; yTick += 1) {
    const y = top + plotHeight - ((yTick - 1) / 9) * plotHeight;
    ctx.beginPath();
    ctx.moveTo(left, y);
    ctx.lineTo(width - right, y);
    ctx.stroke();

    if (yTick % 3 === 1 || yTick === 10) {
      ctx.fillStyle = chartAxis;
      ctx.font = "12px system-ui";
      ctx.textAlign = "right";
      ctx.fillText(String(yTick), left - 8, y + 4);
    }
  }

  const xForIndex = (index: number): number => left + (index / 6) * plotWidth;
  const yForValue = (value: number): number => top + plotHeight - ((value - 1) / 9) * plotHeight;

  ctx.strokeStyle = chartLine;
  ctx.lineWidth = 2;
  ctx.beginPath();

  let started = false;
  points.forEach((point, index) => {
    if (point.value === null) {
      started = false;
      return;
    }

    const x = xForIndex(index);
    const y = yForValue(point.value);

    if (!started) {
      ctx.moveTo(x, y);
      started = true;
    } else {
      ctx.lineTo(x, y);
    }
  });
  ctx.stroke();

  points.forEach((point, index) => {
    const x = xForIndex(index);

    if (point.value !== null) {
      const y = yForValue(point.value);
      ctx.fillStyle = chartPoint;
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = chartValue;
      ctx.font = "12px system-ui";
      ctx.textAlign = "center";
      ctx.fillText(point.value.toFixed(1), x, y - 8);
    }

    ctx.fillStyle = chartLabel;
    ctx.font = "11px system-ui";
    ctx.textAlign = "center";
    ctx.fillText(point.dayLabel, x, height - 20);
  });
}

function showTab(tab: "entry" | "week"): void {
  const isEntry = tab === "entry";
  entryView.classList.toggle("hidden", !isEntry);
  weekView.classList.toggle("hidden", isEntry);
  entryTab.classList.toggle("tab-active", isEntry);
  weekTab.classList.toggle("tab-active", !isEntry);
}

function setStatus(text: string, isError = false): void {
  statusEl.textContent = text;
  statusEl.classList.toggle("status-error", isError);
}

async function loadGoogleApis(): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    const gapi = window.gapi;
    if (!gapi) {
      reject(new Error("gapi unavailable"));
      return;
    }

    gapi.load("client", () => {
      void Promise.all([
        gapi.client.load("drive", "v3"),
        gapi.client.load("sheets", "v4"),
      ])
        .then(() => resolve())
        .catch((error) => reject(error));
    });
  });
}

function waitForGoogle(): Promise<void> {
  return waitFor(() => Boolean(window.google?.accounts?.oauth2));
}

function waitForGapi(): Promise<void> {
  return waitFor(() => Boolean(window.gapi?.load));
}

function waitFor(check: () => boolean): Promise<void> {
  return new Promise((resolve, reject) => {
    const timeoutMs = 15000;
    const started = Date.now();

    const tick = (): void => {
      if (check()) {
        resolve();
        return;
      }

      if (Date.now() - started > timeoutMs) {
        reject(new Error("Timeout while loading external Google scripts"));
        return;
      }

      window.setTimeout(tick, 50);
    };

    tick();
  });
}

function escapeDriveString(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/'/g, "\\'");
}

function persistAuthSession(session: StoredAuthSession): void {
  const payload = encodeURIComponent(JSON.stringify(session));
  const maxAgeSeconds = Math.max(0, Math.floor((session.expiresAtMs - Date.now()) / 1000));
  document.cookie = `${AUTH_COOKIE_NAME}=${payload}; Max-Age=${maxAgeSeconds}; Path=/; SameSite=Lax`;
}

function readAuthSession(): StoredAuthSession | null {
  const raw = readCookie(AUTH_COOKIE_NAME);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(decodeURIComponent(raw)) as Partial<StoredAuthSession>;
    if (!parsed.accessToken || typeof parsed.expiresAtMs !== "number") {
      return null;
    }
    return {
      accessToken: parsed.accessToken,
      expiresAtMs: parsed.expiresAtMs,
    };
  } catch {
    return null;
  }
}

function clearAuthSession(): void {
  document.cookie = `${AUTH_COOKIE_NAME}=; Max-Age=0; Path=/; SameSite=Lax`;
}

function readCookie(name: string): string | null {
  const parts = document.cookie.split("; ");
  for (const part of parts) {
    const eqIndex = part.indexOf("=");
    if (eqIndex < 0) {
      continue;
    }

    const key = part.slice(0, eqIndex);
    if (key === name) {
      return part.slice(eqIndex + 1);
    }
  }
  return null;
}

function average(values: number[]): number {
  const sum = values.reduce((acc, value) => acc + value, 0);
  return Math.round((sum / values.length) * 10) / 10;
}

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function toDayKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function onLocaleChange(): void {
  const locale = parseLocale(localeSelect.value) ?? "en";
  if (locale === currentLocale) {
    return;
  }

  currentLocale = locale;
  persistLocale(currentLocale);
  applyTranslations();

  if (!weekView.classList.contains("hidden")) {
    void refreshWeeklyChart();
  }
}

function onThemeToggle(): void {
  currentTheme = currentTheme === "light" ? "dark" : "light";
  applyTheme(currentTheme);
  persistTheme(currentTheme);
  applyTranslations();

  if (!weekView.classList.contains("hidden")) {
    void refreshWeeklyChart();
  }
}

function applyTranslations(): void {
  titleEl.textContent = t("app.title");
  localeLabel.textContent = t("locale.label");
  tabsEl.setAttribute("aria-label", t("tabs.ariaLabel"));
  entryTab.textContent = t("tabs.entry");
  weekTab.textContent = t("tabs.week");
  ratingLabel.textContent = t("form.question");
  saveRatingBtn.textContent = t("form.save");
  chartTitle.textContent = t("chart.title");
  chartCanvas.setAttribute("aria-label", t("chart.ariaLabel"));
  chartEmpty.textContent = t("chart.empty");
  themeToggleBtn.textContent = t("theme.toggle", { theme: t(themeLabelKey(currentTheme)) });

  if (signInBtn.disabled && currentSpreadsheetId) {
    signInBtn.textContent = t("auth.connected");
  } else {
    signInBtn.textContent = t("auth.signIn");
  }
}

function t(key: I18nKey, vars?: I18nVars): string {
  const template = I18N[currentLocale][key];
  if (!vars) {
    return template;
  }

  return template.replace(/\{(\w+)\}/g, (_, token: string) => vars[token] ?? `{${token}}`);
}

function detectInitialLocale(): Locale {
  const cookieLocale = parseLocale(readCookie(LOCALE_COOKIE_NAME) ?? "");
  if (cookieLocale) {
    return cookieLocale;
  }

  const language = navigator.language.toLowerCase();
  if (language.startsWith("pl")) {
    return "pl";
  }
  return "en";
}

function detectInitialTheme(): Theme {
  const cookieTheme = parseTheme(readCookie(THEME_COOKIE_NAME) ?? "");
  if (cookieTheme) {
    return cookieTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function parseLocale(value: string): Locale | null {
  return (SUPPORTED_LOCALES as string[]).includes(value) ? (value as Locale) : null;
}

function parseTheme(value: string): Theme | null {
  return (SUPPORTED_THEMES as string[]).includes(value) ? (value as Theme) : null;
}

function toBcp47Locale(locale: Locale): string {
  return locale === "pl" ? "pl-PL" : "en-US";
}

function persistLocale(locale: Locale): void {
  document.cookie = `${LOCALE_COOKIE_NAME}=${locale}; Max-Age=31536000; Path=/; SameSite=Lax`;
}

function persistTheme(theme: Theme): void {
  document.cookie = `${THEME_COOKIE_NAME}=${theme}; Max-Age=31536000; Path=/; SameSite=Lax`;
}

function applyTheme(theme: Theme): void {
  document.documentElement.dataset.theme = theme;
}

function themeLabelKey(theme: Theme): I18nKey {
  return theme === "light" ? "theme.light" : "theme.dark";
}

function cssVar(name: string, fallback: string): string {
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return value || fallback;
}

function must<T extends Element>(selector: string): T {
  const element = document.querySelector<T>(selector);
  if (!element) {
    throw new Error(`Missing element: ${selector}`);
  }
  return element;
}
