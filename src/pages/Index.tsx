import { useState } from "react";
import { useTCOStore } from "@/hooks/useTCOStore";
import { SummaryCards } from "@/components/tco/SummaryCards";
import { CostCategoryCard } from "@/components/tco/CostCategoryCard";
import { AppCountPanel } from "@/components/tco/AppCountPanel";
import { CostBreakdownChart } from "@/components/tco/CostBreakdownChart";
import { GrowthProjectionChart } from "@/components/tco/GrowthProjectionChart";
import { GitHubSettingsDialog } from "@/components/github/GitHubSettingsDialog";
import { CommitMessageDialog } from "@/components/github/CommitMessageDialog";
import { GitHubStatusIndicator } from "@/components/github/GitHubStatusIndicator";
import { Calculator, Plus, Download, Upload, Github, Settings, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Index = () => {
  const store = useTCOStore();
  const [showGitHubSettings, setShowGitHubSettings] = useState(false);
  const [showCommitDialog, setShowCommitDialog] = useState(false);

  const handleLoadFromGitHub = async () => {
    if (!store.githubStore.isConnected) {
      setShowGitHubSettings(true);
      return;
    }
    await store.loadFromGitHub();
  };

  const handleSaveToGitHub = () => {
    if (!store.githubStore.isConnected) {
      setShowGitHubSettings(true);
      return;
    }
    setShowCommitDialog(true);
  };

  const handleCommit = async (message: string) => {
    await store.saveToGitHub(message);
    setShowCommitDialog(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Calculator size={16} className="text-primary-foreground" />
          </div>
          <div className="flex-1">
            <h1 className="text-sm font-bold leading-tight">SaaS Platform · TCO Calculator</h1>
            <p className="text-[11px] text-muted-foreground leading-tight">Total Cost of Ownership · Infrastructure Cost Modeling</p>
          </div>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-7 text-xs">
                  <Upload size={14} className="mr-1" /> Load
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => store.importFromFile()}>
                  <FileText size={14} className="mr-2" />
                  From File
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLoadFromGitHub}>
                  <Github size={14} className="mr-2" />
                  From GitHub
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-7 text-xs">
                  <Download size={14} className="mr-1" /> Save
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => store.exportToFile()}>
                  <FileText size={14} className="mr-2" />
                  To File
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleSaveToGitHub}
                  disabled={!store.githubStore.isConnected}
                >
                  <Github size={14} className="mr-2" />
                  To GitHub
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setShowGitHubSettings(true)}>
                  <Settings size={14} className="mr-2" />
                  GitHub Settings
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <GitHubStatusIndicator
              isConnected={store.githubStore.isConnected}
              repoName={
                store.githubStore.settings
                  ? `${store.githubStore.settings.owner}/${store.githubStore.settings.repo}`
                  : undefined
              }
              onClick={() => setShowGitHubSettings(true)}
            />
          </div>
        </div>
      </header>

      <main className="container max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Summary */}
        <section className="animate-fade-in-up">
          <SummaryCards
            totalMonthly={store.totalMonthlyCost}
            totalAnnual={store.totalAnnualCost}
            appCount={store.appCount}
            costPerApp={store.costPerAppMonthly}
          />
        </section>

        {/* Cost Input Grid */}
        <section className="animate-fade-in-up" style={{ animationDelay: "100ms" }}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Infrastructure Costs (Monthly)
            </h2>
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-xs"
              onClick={() => store.addCategory("New Category")}
            >
              <Plus size={14} className="mr-1" /> Add Category
            </Button>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {store.categories.map((cat) => (
              <CostCategoryCard
                key={cat.id}
                category={cat}
                onUpdateCost={(itemId, cost) => store.updateItemCost(cat.id, itemId, cost)}
                onUpdateName={(itemId, name) => store.updateItemName(cat.id, itemId, name)}
                onUpdateQuantity={(itemId, qty) => store.updateItemQuantity(cat.id, itemId, qty)}
                onUpdateUnitCost={(itemId, uc) => store.updateItemUnitCost(cat.id, itemId, uc)}
                onUpdatePeriod={(itemId, p) => store.updateItemPeriod(cat.id, itemId, p)}
                onUpdateCostType={(itemId, type) => store.updateItemCostType(cat.id, itemId, type)}
                onUpdateBehavior={(itemId, behavior) => store.updateItemBehavior(cat.id, itemId, behavior)}
                onAddItem={() => store.addItem(cat.id)}
                onRemoveItem={(itemId) => store.removeItem(cat.id, itemId)}
                onRemoveCategory={() => store.removeCategory(cat.id)}
                onUpdateCategoryLabel={(label) => store.updateCategoryLabel(cat.id, label)}
              />
            ))}
          </div>
        </section>

        {/* Charts Row */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 animate-fade-in-up" style={{ animationDelay: "200ms" }}>
          <CostBreakdownChart categoryTotals={store.categoryTotals} />
          <GrowthProjectionChart
            projections={store.projections}
            growthRate={store.annualGrowthRate}
            onGrowthRateChange={store.setAnnualGrowthRate}
            years={store.projectionYears}
            onYearsChange={store.setProjectionYears}
          />
        </section>

        {/* App Cost Allocation */}
        <section className="animate-fade-in-up" style={{ animationDelay: "300ms" }}>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            Cost Per Unit
          </h2>
          <AppCountPanel
            appCount={store.appCount}
            onAppCountChange={store.setAppCount}
            costPerAppMonthly={store.costPerAppMonthly}
            costPerAppAnnual={store.costPerAppAnnual}
            totalMonthlyCost={store.totalMonthlyCost}
            totalAnnualCost={store.totalAnnualCost}
          />
        </section>
      </main>

      {/* GitHub Dialogs */}
      <GitHubSettingsDialog
        open={showGitHubSettings}
        onOpenChange={setShowGitHubSettings}
        onConnect={store.githubStore.connectGitHub}
        onSelectRepo={store.githubStore.selectRepository}
        onSelectFile={store.githubStore.selectFile}
        onDisconnect={store.githubStore.disconnectGitHub}
        isConnected={store.githubStore.isConnected}
        currentToken={store.githubStore.settings?.token}
        currentRepo={
          store.githubStore.settings
            ? {
                owner: store.githubStore.settings.owner,
                repo: store.githubStore.settings.repo,
              }
            : undefined
        }
        currentPath={store.githubStore.settings?.path}
        isLoading={store.githubStore.isLoading}
        error={store.githubStore.lastError}
      />

      <CommitMessageDialog
        open={showCommitDialog}
        onOpenChange={setShowCommitDialog}
        onCommit={handleCommit}
        filePath={store.githubStore.settings?.path}
        isLoading={store.githubStore.isLoading}
      />
    </div>
  );
};

export default Index;
