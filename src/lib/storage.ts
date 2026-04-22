import { GitHubSettings } from "@/types/github";

const STORAGE_PREFIX = "tco-github-";
const SETTINGS_KEY = `${STORAGE_PREFIX}settings`;

export function saveGitHubSettings(settings: GitHubSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error("Failed to save GitHub settings:", error);
    throw new Error("Failed to save settings. localStorage may be full or disabled.");
  }
}

export function loadGitHubSettings(): GitHubSettings | null {
  try {
    const data = localStorage.getItem(SETTINGS_KEY);
    if (!data) return null;
    return JSON.parse(data) as GitHubSettings;
  } catch (error) {
    console.error("Failed to load GitHub settings:", error);
    return null;
  }
}

export function clearGitHubSettings(): void {
  try {
    localStorage.removeItem(SETTINGS_KEY);
  } catch (error) {
    console.error("Failed to clear GitHub settings:", error);
  }
}

export function isGitHubConfigured(): boolean {
  const settings = loadGitHubSettings();
  return !!(settings && settings.token && settings.owner && settings.repo && settings.path);
}
