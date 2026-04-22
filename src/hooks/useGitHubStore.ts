import { useState, useCallback, useEffect } from "react";
import { GitHubUser, GitHubSettings } from "@/types/github";
import {
  saveGitHubSettings,
  loadGitHubSettings,
  clearGitHubSettings,
  isGitHubConfigured as checkConfigured,
} from "@/lib/storage";
import {
  authenticateUser,
  getFileContent,
  updateFileContent,
  validateToken,
} from "@/lib/github";

export function useGitHubStore() {
  const [isConnected, setIsConnected] = useState(false);
  const [settings, setSettings] = useState<GitHubSettings | null>(null);
  const [currentUser, setCurrentUser] = useState<GitHubUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);

  // Load settings on mount
  useEffect(() => {
    const savedSettings = loadGitHubSettings();
    if (savedSettings) {
      setSettings(savedSettings);
      setIsConnected(true);
    }
  }, []);

  const connectGitHub = useCallback(async (token: string): Promise<void> => {
    setIsLoading(true);
    setLastError(null);

    try {
      // Validate token format
      if (!validateToken(token)) {
        throw new Error(
          "Invalid token format. GitHub tokens should start with 'ghp_' or 'github_pat_'"
        );
      }

      // Test connection
      const user = await authenticateUser(token);
      setCurrentUser(user);

      // Update state (don't save to storage yet, wait for full config)
      setSettings((prev) => ({ ...prev, token } as GitHubSettings));
      setIsConnected(true);
    } catch (error) {
      setLastError(error instanceof Error ? error.message : "Failed to connect to GitHub");
      setIsConnected(false);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const disconnectGitHub = useCallback((): void => {
    clearGitHubSettings();
    setSettings(null);
    setCurrentUser(null);
    setIsConnected(false);
    setLastError(null);
  }, []);

  const selectRepository = useCallback((owner: string, repo: string): void => {
    setSettings((prev) => {
      if (!prev) return null;
      return { ...prev, owner, repo };
    });
  }, []);

  const selectFile = useCallback((path: string): void => {
    setSettings((prev) => {
      if (!prev) return null;
      const updatedSettings = { ...prev, path, lastSync: new Date().toISOString() };
      saveGitHubSettings(updatedSettings);
      return updatedSettings;
    });
  }, []);

  const loadFromGitHub = useCallback(async (): Promise<string> => {
    if (!settings || !isConnected) {
      throw new Error("GitHub not configured. Please connect first.");
    }

    setIsLoading(true);
    setLastError(null);

    try {
      const { content } = await getFileContent({
        token: settings.token,
        owner: settings.owner,
        repo: settings.repo,
        path: settings.path,
      });

      // Update last sync time
      const updatedSettings = { ...settings, lastSync: new Date().toISOString() };
      saveGitHubSettings(updatedSettings);
      setSettings(updatedSettings);

      return content;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to load from GitHub";
      setLastError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [settings, isConnected]);

  const saveToGitHub = useCallback(
    async (content: string, message: string): Promise<void> => {
      if (!settings || !isConnected) {
        throw new Error("GitHub not configured. Please connect first.");
      }

      setIsLoading(true);
      setLastError(null);

      try {
        // First, get the current file SHA (required for updates)
        const { sha } = await getFileContent({
          token: settings.token,
          owner: settings.owner,
          repo: settings.repo,
          path: settings.path,
        });

        // Commit the update
        await updateFileContent(
          {
            token: settings.token,
            owner: settings.owner,
            repo: settings.repo,
            path: settings.path,
          },
          content,
          message,
          sha
        );

        // Update last sync time
        const updatedSettings = { ...settings, lastSync: new Date().toISOString() };
        saveGitHubSettings(updatedSettings);
        setSettings(updatedSettings);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to save to GitHub";
        setLastError(errorMessage);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [settings, isConnected]
  );

  const testConnection = useCallback(async (): Promise<boolean> => {
    if (!settings?.token) return false;

    try {
      await authenticateUser(settings.token);
      return true;
    } catch {
      return false;
    }
  }, [settings]);

  return {
    isConnected,
    settings,
    currentUser,
    isLoading,
    lastError,
    isConfigured: checkConfigured(),
    connectGitHub,
    disconnectGitHub,
    selectRepository,
    selectFile,
    loadFromGitHub,
    saveToGitHub,
    testConnection,
  };
}
