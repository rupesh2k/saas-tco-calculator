import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RepositorySelector } from "./RepositorySelector";
import { FileBrowser } from "./FileBrowser";
import { GitHubHelpDialog } from "./GitHubHelpDialog";
import { Eye, EyeOff, AlertTriangle, CheckCircle2, ExternalLink, HelpCircle } from "lucide-react";

interface GitHubSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConnect: (token: string) => Promise<void>;
  onSelectRepo: (owner: string, repo: string) => void;
  onSelectFile: (path: string) => void;
  onDisconnect: () => void;
  isConnected: boolean;
  currentToken?: string;
  currentRepo?: { owner: string; repo: string };
  currentPath?: string;
  isLoading?: boolean;
  error?: string | null;
}

export function GitHubSettingsDialog({
  open,
  onOpenChange,
  onConnect,
  onSelectRepo,
  onSelectFile,
  onDisconnect,
  isConnected,
  currentToken,
  currentRepo,
  currentPath,
  isLoading = false,
  error,
}: GitHubSettingsDialogProps) {
  const [step, setStep] = useState<"connect" | "repo" | "file">("connect");
  const [token, setToken] = useState("");
  const [showToken, setShowToken] = useState(false);
  const [selectedOwner, setSelectedOwner] = useState("");
  const [selectedRepo, setSelectedRepo] = useState("");
  const [selectedPath, setSelectedPath] = useState("");
  const [showHelpDialog, setShowHelpDialog] = useState(false);

  useEffect(() => {
    if (isConnected && currentToken) {
      setToken(currentToken);
      if (currentRepo) {
        setSelectedOwner(currentRepo.owner);
        setSelectedRepo(currentRepo.repo);
        if (currentPath) {
          setSelectedPath(currentPath);
          setStep("file");
        } else {
          setStep("repo");
        }
      }
    } else {
      setStep("connect");
    }
  }, [isConnected, currentToken, currentRepo, currentPath]);

  const handleConnect = async () => {
    try {
      await onConnect(token);
      setStep("repo");
    } catch (err) {
      // Error is handled by parent
    }
  };

  const handleSelectRepo = (owner: string, repo: string) => {
    setSelectedOwner(owner);
    setSelectedRepo(repo);
    onSelectRepo(owner, repo);
    setStep("file");
  };

  const handleSelectFile = (path: string) => {
    setSelectedPath(path);
    onSelectFile(path);
  };

  const handleSave = () => {
    onOpenChange(false);
  };

  const handleDisconnect = () => {
    onDisconnect();
    setToken("");
    setSelectedOwner("");
    setSelectedRepo("");
    setSelectedPath("");
    setStep("connect");
  };

  const isStepComplete = (stepName: "connect" | "repo" | "file") => {
    if (stepName === "connect") return isConnected && token;
    if (stepName === "repo") return selectedOwner && selectedRepo;
    if (stepName === "file") return selectedPath;
    return false;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>GitHub Settings</DialogTitle>
          <DialogDescription>
            Configure GitHub integration to load and save your TCO configurations
          </DialogDescription>
        </DialogHeader>

        <Tabs value={step} onValueChange={(v) => setStep(v as typeof step)} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="connect" className="relative">
              Connect
              {isStepComplete("connect") && (
                <CheckCircle2 size={14} className="absolute right-2 top-2 text-green-600" />
              )}
            </TabsTrigger>
            <TabsTrigger value="repo" disabled={!isConnected} className="relative">
              Repository
              {isStepComplete("repo") && (
                <CheckCircle2 size={14} className="absolute right-2 top-2 text-green-600" />
              )}
            </TabsTrigger>
            <TabsTrigger value="file" disabled={!selectedRepo} className="relative">
              File
              {isStepComplete("file") && (
                <CheckCircle2 size={14} className="absolute right-2 top-2 text-green-600" />
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="connect" className="space-y-4">
            <Alert>
              <AlertTriangle size={16} />
              <AlertDescription>
                Your GitHub token will be stored locally in your browser. Use a fine-grained
                Personal Access Token with repository read/write permissions only.
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="token">Personal Access Token</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowHelpDialog(true)}
                  className="h-auto p-1 text-primary hover:text-primary/80"
                >
                  <HelpCircle size={18} />
                  <span className="ml-1 text-xs">How to get a token?</span>
                </Button>
              </div>
              <div className="relative">
                <Input
                  id="token"
                  type={showToken ? "text" : "password"}
                  placeholder="ghp_... or github_pat_..."
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowToken(!showToken)}
                  className="absolute right-2 top-2.5 text-muted-foreground hover:text-foreground"
                >
                  {showToken ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href="https://github.com/settings/tokens/new?scopes=repo&description=TCO%20Calculator"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:underline inline-flex items-center gap-1"
                >
                  Create a new Personal Access Token
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex justify-between">
              {isConnected && (
                <Button
                  variant="outline"
                  onClick={handleDisconnect}
                  disabled={isLoading}
                >
                  Disconnect
                </Button>
              )}
              <Button
                onClick={handleConnect}
                disabled={!token || isLoading}
                className="ml-auto"
              >
                {isLoading ? "Connecting..." : isConnected ? "Update Token" : "Connect"}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="repo" className="space-y-4">
            {token && (
              <RepositorySelector
                token={token}
                onSelect={handleSelectRepo}
                selectedRepo={
                  selectedOwner && selectedRepo
                    ? `${selectedOwner}/${selectedRepo}`
                    : undefined
                }
              />
            )}

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep("connect")}>
                Back
              </Button>
              <Button
                onClick={() => setStep("file")}
                disabled={!selectedOwner || !selectedRepo}
              >
                Next
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="file" className="space-y-4">
            {token && selectedOwner && selectedRepo && (
              <FileBrowser
                config={{
                  token,
                  owner: selectedOwner,
                  repo: selectedRepo,
                  path: selectedPath,
                }}
                onSelectFile={handleSelectFile}
                selectedPath={selectedPath}
              />
            )}

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep("repo")}>
                Back
              </Button>
              <Button onClick={handleSave} disabled={!selectedPath}>
                Save Settings
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>

      <GitHubHelpDialog open={showHelpDialog} onOpenChange={setShowHelpDialog} />
    </Dialog>
  );
}
