import {
  GitHubUser,
  Repository,
  ContentItem,
  GitHubConfig,
  GitHubFileContent,
  CommitResult,
  GitHubAuthError,
  GitHubNotFoundError,
  GitHubRateLimitError,
  GitHubNetworkError,
} from "@/types/github";

const GITHUB_API_BASE = "https://api.github.com";

async function fetchGitHub<T>(
  endpoint: string,
  token: string,
  options?: RequestInit
): Promise<T> {
  try {
    const response = await fetch(`${GITHUB_API_BASE}${endpoint}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json",
        ...options?.headers,
      },
    });

    // Handle rate limiting
    if (response.status === 403) {
      const resetTime = response.headers.get("X-RateLimit-Reset");
      const resetDate = resetTime
        ? new Date(parseInt(resetTime) * 1000).toLocaleTimeString()
        : "unknown";
      throw new GitHubRateLimitError(
        `GitHub API rate limit reached. Resets at ${resetDate}.`,
        resetDate
      );
    }

    // Handle authentication errors
    if (response.status === 401) {
      throw new GitHubAuthError(
        "Invalid GitHub token. Please verify your Personal Access Token."
      );
    }

    // Handle not found errors
    if (response.status === 404) {
      throw new GitHubNotFoundError(
        "Resource not found. Please check the repository and file path."
      );
    }

    // Handle other errors
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `GitHub API error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    // Re-throw our custom errors
    if (
      error instanceof GitHubAuthError ||
      error instanceof GitHubNotFoundError ||
      error instanceof GitHubRateLimitError
    ) {
      throw error;
    }

    // Handle network errors
    if (error instanceof TypeError) {
      throw new GitHubNetworkError(
        "Network error. Please check your internet connection."
      );
    }

    // Re-throw other errors
    throw error;
  }
}

export async function authenticateUser(token: string): Promise<GitHubUser> {
  return await fetchGitHub<GitHubUser>("/user", token);
}

export async function listUserRepos(token: string): Promise<Repository[]> {
  return await fetchGitHub<Repository[]>("/user/repos?per_page=100&sort=updated", token);
}

export async function getRepoContents(
  config: GitHubConfig,
  path = ""
): Promise<ContentItem[]> {
  const endpoint = `/repos/${config.owner}/${config.repo}/contents/${path}`;
  const data = await fetchGitHub<ContentItem | ContentItem[]>(endpoint, config.token);

  // GitHub returns a single item if it's a file, or an array if it's a directory
  return Array.isArray(data) ? data : [data];
}

export async function getFileContent(
  config: GitHubConfig
): Promise<GitHubFileContent> {
  const endpoint = `/repos/${config.owner}/${config.repo}/contents/${config.path}`;
  const data = await fetchGitHub<{
    content: string;
    sha: string;
    size: number;
    encoding: string;
  }>(endpoint, config.token);

  // Check file size (limit to 1MB)
  if (data.size > 1024 * 1024) {
    throw new Error("File too large. Maximum size is 1MB.");
  }

  // Decode Base64 content
  const content = atob(data.content.replace(/\n/g, ""));

  return {
    content,
    sha: data.sha,
  };
}

export async function updateFileContent(
  config: GitHubConfig,
  content: string,
  message: string,
  sha: string
): Promise<CommitResult> {
  const endpoint = `/repos/${config.owner}/${config.repo}/contents/${config.path}`;

  // Encode content as Base64
  const encodedContent = btoa(content);

  const data = await fetchGitHub<{
    commit: { sha: string; message: string };
  }>(endpoint, config.token, {
    method: "PUT",
    body: JSON.stringify({
      message,
      content: encodedContent,
      sha,
    }),
  });

  return {
    sha: data.commit.sha,
    message: data.commit.message,
  };
}

export function validateToken(token: string): boolean {
  // GitHub PATs start with ghp_ (classic) or github_pat_ (fine-grained)
  return token.startsWith("ghp_") || token.startsWith("github_pat_");
}

export function validateRepoFormat(owner: string, repo: string): boolean {
  // Basic validation: no empty strings, no special characters
  const validPattern = /^[a-zA-Z0-9_-]+$/;
  return (
    owner.length > 0 &&
    repo.length > 0 &&
    validPattern.test(owner) &&
    validPattern.test(repo)
  );
}
