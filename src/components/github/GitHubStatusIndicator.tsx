import { Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface GitHubStatusIndicatorProps {
  isConnected: boolean;
  repoName?: string;
  onClick?: () => void;
}

export function GitHubStatusIndicator({
  isConnected,
  repoName,
  onClick,
}: GitHubStatusIndicatorProps) {
  if (!isConnected) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={onClick}
              className="h-7 gap-1.5 text-xs"
            >
              <Github size={16} className="text-muted-foreground" />
              <span className="text-muted-foreground">Connect</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Connect to GitHub</p>
            <p className="text-xs text-muted-foreground">Save and load from repositories</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            onClick={onClick}
            className="h-7 gap-1.5 text-xs bg-primary/5 border-primary/20 hover:bg-primary/10"
          >
            <Github size={16} className="text-primary" />
            <span className="text-primary font-medium max-w-[120px] truncate">
              {repoName || "Connected"}
            </span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p className="font-medium">Connected to {repoName || "GitHub"}</p>
          <p className="text-xs text-muted-foreground">Click to manage settings</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
