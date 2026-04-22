import { useState, useEffect } from "react";
import { Repository } from "@/types/github";
import { listUserRepos } from "@/lib/github";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Lock, Unlock, Search } from "lucide-react";

interface RepositorySelectorProps {
  token: string;
  onSelect: (owner: string, repo: string) => void;
  selectedRepo?: string;
}

export function RepositorySelector({
  token,
  onSelect,
  selectedRepo,
}: RepositorySelectorProps) {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [filteredRepos, setFilteredRepos] = useState<Repository[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function loadRepositories() {
      setIsLoading(true);
      setError(null);

      try {
        const repos = await listUserRepos(token);
        setRepositories(repos);
        setFilteredRepos(repos);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load repositories");
      } finally {
        setIsLoading(false);
      }
    }

    loadRepositories();
  }, [token]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredRepos(repositories);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredRepos(
        repositories.filter(
          (repo) =>
            repo.name.toLowerCase().includes(query) ||
            repo.full_name.toLowerCase().includes(query) ||
            repo.description?.toLowerCase().includes(query)
        )
      );
    }
  }, [searchQuery, repositories]);

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-sm text-destructive">
        <p>{error}</p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.location.reload()}
          className="mt-2"
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search repositories..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-8"
        />
      </div>

      <ScrollArea className="h-[300px] w-full rounded-md border">
        <div className="p-2 space-y-2">
          {filteredRepos.length === 0 ? (
            <div className="text-sm text-muted-foreground text-center py-8">
              No repositories found
            </div>
          ) : (
            filteredRepos.map((repo) => (
              <button
                key={repo.full_name}
                onClick={() => onSelect(repo.owner.login, repo.name)}
                className={`w-full text-left p-3 rounded-md border transition-colors ${
                  selectedRepo === repo.full_name
                    ? "bg-primary text-primary-foreground border-primary"
                    : "hover:bg-accent border-transparent"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium truncate">{repo.name}</p>
                      {repo.private ? (
                        <Lock size={12} className="flex-shrink-0" />
                      ) : (
                        <Unlock size={12} className="flex-shrink-0" />
                      )}
                    </div>
                    {repo.description && (
                      <p className="text-xs text-muted-foreground truncate mt-1">
                        {repo.description}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      {repo.full_name} • Updated{" "}
                      {new Date(repo.updated_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs flex-shrink-0">
                    {repo.private ? "Private" : "Public"}
                  </Badge>
                </div>
              </button>
            ))
          )}
        </div>
      </ScrollArea>

      <p className="text-xs text-muted-foreground">
        Showing {filteredRepos.length} of {repositories.length} repositories
      </p>
    </div>
  );
}
