import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface CommitMessageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCommit: (message: string) => void | Promise<void>;
  filePath?: string;
  isLoading?: boolean;
}

export function CommitMessageDialog({
  open,
  onOpenChange,
  onCommit,
  filePath,
  isLoading = false,
}: CommitMessageDialogProps) {
  const defaultMessage = `Update TCO configuration - ${new Date().toLocaleDateString()}`;
  const [message, setMessage] = useState(defaultMessage);

  const handleCommit = async () => {
    if (message.trim().length < 10) {
      return;
    }
    await onCommit(message);
    setMessage(defaultMessage);
  };

  const isValid = message.trim().length >= 10;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Commit Changes to GitHub</DialogTitle>
          <DialogDescription>
            {filePath ? `Committing to ${filePath}` : "Enter a commit message"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="commit-message">Commit Message</Label>
            <Textarea
              id="commit-message"
              placeholder="Update TCO configuration..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">
              {message.length} characters (minimum 10)
              {message.length > 50 && message.length <= 72 && " - Good length"}
              {message.length > 72 && " - Consider shortening"}
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button onClick={handleCommit} disabled={!isValid || isLoading}>
            {isLoading ? "Committing..." : "Commit"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
