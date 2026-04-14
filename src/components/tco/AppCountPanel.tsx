import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Layers } from "lucide-react";

interface Props {
  appCount: number;
  onAppCountChange: (count: number) => void;
  costPerAppMonthly: number;
  costPerAppAnnual: number;
  totalMonthlyCost: number;
  totalAnnualCost: number;
}

const fmtCurrency = (n: number) => {
  if (n < 0.01 && n > 0) return `$${n.toFixed(4)}`;
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const fmtCount = (n: number) => n.toLocaleString("en-US");

export function AppCountPanel({ appCount, onAppCountChange, costPerAppMonthly, costPerAppAnnual, totalMonthlyCost, totalAnnualCost }: Props) {
  return (
    <Card className="p-5 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-semibold text-sm">Cost Per Unit</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Total infrastructure cost divided across all service units (apps, seats, tenants, etc.)
          </p>
        </div>
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <Layers size={16} className="text-primary" />
        </div>
      </div>

      <div className="flex items-end gap-6 flex-wrap">
        {/* App count input */}
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Total Units (apps, seats, tenants)</Label>
          <Input
            type="number"
            min={1}
            value={appCount || ""}
            onChange={(e) => onAppCountChange(Math.max(1, parseInt(e.target.value) || 1))}
            className="h-9 w-44 text-sm font-mono tabular-nums bg-muted/50 border-0 focus-visible:ring-1"
          />
          <p className="text-[10px] text-muted-foreground">{fmtCount(appCount)} units on platform</p>
        </div>

        {/* Results */}
        <div className="flex gap-6 flex-wrap">
          <div className="space-y-0.5">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Cost / Unit / Month</p>
            <p className="font-mono text-xl font-bold tabular-nums text-primary">{fmtCurrency(costPerAppMonthly)}</p>
          </div>
          <div className="space-y-0.5">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Cost / Unit / Year</p>
            <p className="font-mono text-xl font-bold tabular-nums">{fmtCurrency(costPerAppAnnual)}</p>
          </div>
          <div className="space-y-0.5">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Platform Monthly</p>
            <p className="font-mono text-lg font-semibold tabular-nums text-muted-foreground">{fmtCurrency(totalMonthlyCost)}</p>
          </div>
          <div className="space-y-0.5">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Platform Annual</p>
            <p className="font-mono text-lg font-semibold tabular-nums text-muted-foreground">{fmtCurrency(totalAnnualCost)}</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
