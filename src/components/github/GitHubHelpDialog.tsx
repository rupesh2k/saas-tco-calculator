import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ExternalLink, CheckCircle2, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface GitHubHelpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GitHubHelpDialog({ open, onOpenChange }: GitHubHelpDialogProps) {
  const { toast } = useToast();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "The link has been copied to your clipboard",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>How to Get a GitHub Personal Access Token</DialogTitle>
          <DialogDescription>
            Follow these steps to create a token for GitHub integration
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Alert>
            <AlertDescription>
              A Personal Access Token (PAT) allows this app to access your GitHub repositories
              securely. It will be stored locally in your browser.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-sm mb-2 flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs">
                  1
                </span>
                Go to GitHub Settings
              </h3>
              <p className="text-sm text-muted-foreground ml-8 mb-2">
                Visit GitHub's Personal Access Token creation page:
              </p>
              <div className="ml-8 flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    window.open(
                      "https://github.com/settings/tokens/new?scopes=repo&description=TCO%20Calculator",
                      "_blank"
                    )
                  }
                  className="text-xs"
                >
                  <ExternalLink size={14} className="mr-2" />
                  Create Token on GitHub
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    copyToClipboard(
                      "https://github.com/settings/tokens/new?scopes=repo&description=TCO%20Calculator"
                    )
                  }
                  className="text-xs"
                >
                  <Copy size={14} />
                </Button>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-sm mb-2 flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs">
                  2
                </span>
                Configure Token Settings
              </h3>
              <div className="ml-8 space-y-2">
                <div className="text-sm">
                  <p className="text-muted-foreground mb-1">
                    <strong>Note:</strong> Add a description (e.g., "TCO Calculator")
                  </p>
                  <p className="text-muted-foreground mb-1">
                    <strong>Expiration:</strong> Choose an expiration date (recommended: 90 days)
                  </p>
                  <p className="text-muted-foreground">
                    <strong>Scopes:</strong> Select <code className="bg-muted px-1 py-0.5 rounded">repo</code> (Full control of private repositories)
                  </p>
                </div>
                <Alert>
                  <CheckCircle2 size={16} />
                  <AlertDescription className="text-xs">
                    The <code>repo</code> scope allows reading and writing repository contents,
                    which is required for loading and saving configurations.
                  </AlertDescription>
                </Alert>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-sm mb-2 flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs">
                  3
                </span>
                Generate and Copy Token
              </h3>
              <div className="ml-8 space-y-2">
                <p className="text-sm text-muted-foreground">
                  Click "Generate token" at the bottom of the page. GitHub will display your new
                  token only once.
                </p>
                <Alert variant="destructive">
                  <AlertDescription className="text-xs">
                    <strong>Important:</strong> Copy your token immediately! You won't be able to
                    see it again. Store it securely.
                  </AlertDescription>
                </Alert>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-sm mb-2 flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs">
                  4
                </span>
                Paste Token in App
              </h3>
              <p className="text-sm text-muted-foreground ml-8">
                Return to the GitHub Settings dialog and paste your token in the "Personal Access
                Token" field, then click "Connect".
              </p>
            </div>
          </div>

          <div className="pt-4 border-t">
            <h3 className="font-semibold text-sm mb-2">Security Best Practices</h3>
            <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
              <li>Use fine-grained tokens when possible (better security)</li>
              <li>Only grant access to specific repositories if you can</li>
              <li>Set reasonable expiration dates (30-90 days)</li>
              <li>Never share your token with anyone</li>
              <li>Revoke tokens you no longer use</li>
              <li>Your token is stored locally in your browser only</li>
            </ul>
          </div>

          <div className="pt-4 border-t">
            <h3 className="font-semibold text-sm mb-2">Alternative: Fine-Grained Tokens</h3>
            <p className="text-xs text-muted-foreground mb-2">
              For better security, you can create a fine-grained personal access token that only
              has access to specific repositories:
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                window.open("https://github.com/settings/personal-access-tokens/new", "_blank")
              }
              className="text-xs"
            >
              <ExternalLink size={14} className="mr-2" />
              Create Fine-Grained Token
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
