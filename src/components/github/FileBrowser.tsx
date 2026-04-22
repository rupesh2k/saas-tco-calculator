import { useState, useEffect } from "react";
import { ContentItem, GitHubConfig } from "@/types/github";
import { getRepoContents } from "@/lib/github";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Folder, FileJson, ChevronRight, ChevronDown } from "lucide-react";

interface FileBrowserProps {
  config: GitHubConfig;
  onSelectFile: (path: string) => void;
  selectedPath?: string;
}

interface DirectoryNode {
  item: ContentItem;
  children?: DirectoryNode[];
  isExpanded?: boolean;
  isLoading?: boolean;
}

export function FileBrowser({
  config,
  onSelectFile,
  selectedPath,
}: FileBrowserProps) {
  const [rootItems, setRootItems] = useState<DirectoryNode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadRootContents() {
      setIsLoading(true);
      setError(null);

      try {
        const items = await getRepoContents(config, "");
        const nodes = items
          .filter((item) => item.type === "dir" || item.name.endsWith(".json"))
          .map((item) => ({
            item,
            isExpanded: false,
            isLoading: false,
          }));
        setRootItems(nodes);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load files");
      } finally {
        setIsLoading(false);
      }
    }

    loadRootContents();
  }, [config]);

  const loadDirectoryContents = async (
    node: DirectoryNode,
    path: DirectoryNode[]
  ) => {
    if (node.item.type !== "dir") return;

    // Toggle if already expanded
    if (node.isExpanded) {
      updateNode(path, { isExpanded: false });
      return;
    }

    // Load contents
    updateNode(path, { isLoading: true });

    try {
      const items = await getRepoContents(config, node.item.path);
      const children = items
        .filter((item) => item.type === "dir" || item.name.endsWith(".json"))
        .map((item) => ({
          item,
          isExpanded: false,
          isLoading: false,
        }));

      updateNode(path, {
        children,
        isExpanded: true,
        isLoading: false,
      });
    } catch (err) {
      updateNode(path, { isLoading: false });
    }
  };

  const updateNode = (path: DirectoryNode[], updates: Partial<DirectoryNode>) => {
    setRootItems((items) => {
      const newItems = [...items];
      let current = newItems;

      for (let i = 0; i < path.length; i++) {
        const index = current.findIndex((n) => n.item.path === path[i].item.path);
        if (index === -1) return items;

        if (i === path.length - 1) {
          current[index] = { ...current[index], ...updates };
        } else {
          if (!current[index].children) return items;
          current = current[index].children!;
        }
      }

      return newItems;
    });
  };

  const renderNode = (node: DirectoryNode, depth = 0, path: DirectoryNode[] = []) => {
    const isSelected = selectedPath === node.item.path;
    const currentPath = [...path, node];

    if (node.item.type === "file") {
      return (
        <button
          key={node.item.path}
          onClick={() => onSelectFile(node.item.path)}
          className={`w-full text-left px-3 py-2 rounded text-sm transition-colors flex items-center gap-2 ${
            isSelected
              ? "bg-primary text-primary-foreground"
              : "hover:bg-accent"
          }`}
          style={{ paddingLeft: `${depth * 20 + 12}px` }}
        >
          <FileJson size={14} className="flex-shrink-0" />
          <span className="truncate">{node.item.name}</span>
        </button>
      );
    }

    return (
      <div key={node.item.path}>
        <button
          onClick={() => loadDirectoryContents(node, currentPath)}
          className="w-full text-left px-3 py-2 rounded text-sm hover:bg-accent transition-colors flex items-center gap-2"
          style={{ paddingLeft: `${depth * 20 + 12}px` }}
          disabled={node.isLoading}
        >
          {node.isLoading ? (
            <div className="w-3.5 h-3.5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          ) : node.isExpanded ? (
            <ChevronDown size={14} className="flex-shrink-0" />
          ) : (
            <ChevronRight size={14} className="flex-shrink-0" />
          )}
          <Folder size={14} className="flex-shrink-0" />
          <span className="truncate">{node.item.name}</span>
        </button>
        {node.isExpanded && node.children && (
          <div>
            {node.children.map((child) => renderNode(child, depth + 1, currentPath))}
          </div>
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-9 w-full" />
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
    <div className="space-y-2">
      <p className="text-sm text-muted-foreground">
        Select a JSON file from your repository:
      </p>
      <ScrollArea className="h-[300px] w-full rounded-md border">
        <div className="p-2">
          {rootItems.length === 0 ? (
            <div className="text-sm text-muted-foreground text-center py-8">
              No JSON files or directories found
            </div>
          ) : (
            rootItems.map((node) => renderNode(node))
          )}
        </div>
      </ScrollArea>
      {selectedPath && (
        <div className="text-xs text-muted-foreground">
          Selected: <code className="bg-muted px-1 py-0.5 rounded">{selectedPath}</code>
        </div>
      )}
    </div>
  );
}
