export interface GitHubUser {
  login: string;
  name: string;
  avatar_url: string;
}

export interface Repository {
  name: string;
  full_name: string;
  owner: {
    login: string;
  };
  default_branch: string;
  private: boolean;
  description?: string;
  updated_at: string;
}

export interface ContentItem {
  name: string;
  path: string;
  type: "file" | "dir";
  sha: string;
  size?: number;
}

export interface GitHubConfig {
  token: string;
  owner: string;
  repo: string;
  path: string;
}

export interface GitHubSettings {
  token: string;
  owner: string;
  repo: string;
  path: string;
  lastSync?: string;
}

export interface GitHubFileContent {
  content: string;
  sha: string;
}

export interface CommitResult {
  sha: string;
  message: string;
}

export interface GitHubError {
  message: string;
  documentation_url?: string;
  status?: number;
}

export class GitHubAuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GitHubAuthError";
  }
}

export class GitHubNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GitHubNotFoundError";
  }
}

export class GitHubRateLimitError extends Error {
  resetTime?: string;

  constructor(message: string, resetTime?: string) {
    super(message);
    this.name = "GitHubRateLimitError";
    this.resetTime = resetTime;
  }
}

export class GitHubNetworkError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GitHubNetworkError";
  }
}
