import { AppAllocation } from "@/types/tco";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

interface AppCostRow extends AppAllocation {
  monthlyCost: number;
  annualCost: number;
}

interface Props {
  appCosts: AppCostRow[];
  totalWeight: number;
  onAdd: () => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, updates: Partial<AppAllocation>) => void;
}

const fmt = (n: number) => n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export function AppAllocationPanel({ appCosts, totalWeight, onAdd, onRemove, onUpdate }: Props) {
  return (
    <Card className="p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-sm">App Cost Allocation</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Assign weights to distribute total cost across apps
            {totalWeight > 0 && totalWeight !== 100 && (
              <span className="ml-1 text-orange-500">(weights total {totalWeight}%, will be normalized)</span>
            )}
          </p>
        </div>
        <Button size="sm" variant="outline" className="h-8 text-xs" onClick={onAdd}>
          <Plus size={14} className="mr-1" /> Add App
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b text-muted-foreground">
              <th className="text-left py-2 font-medium">Application</th>
              <th className="text-right py-2 font-medium w-24">Weight %</th>
              <th className="text-right py-2 font-medium w-32">Monthly Cost</th>
              <th className="text-right py-2 font-medium w-32">Annual Cost</th>
              <th className="w-10"></th>
            </tr>
          </thead>
          <tbody>
            {appCosts.map((app) => (
              <tr key={app.id} className="border-b border-dashed last:border-0">
                <td className="py-2">
                  <Input
                    value={app.name}
                    onChange={(e) => onUpdate(app.id, { name: e.target.value })}
                    className="h-7 text-xs bg-muted/50 border-0 focus-visible:ring-1 w-full max-w-[200px]"
                  />
                </td>
                <td className="py-2 text-right">
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    value={app.weight || ""}
                    onChange={(e) => onUpdate(app.id, { weight: parseFloat(e.target.value) || 0 })}
                    className="h-7 text-xs font-mono text-right bg-muted/50 border-0 focus-visible:ring-1 w-20 ml-auto tabular-nums"
                  />
                </td>
                <td className="py-2 text-right font-mono tabular-nums text-primary font-medium">
                  ${fmt(app.monthlyCost)}
                </td>
                <td className="py-2 text-right font-mono tabular-nums font-medium">
                  ${fmt(app.annualCost)}
                </td>
                <td className="py-2 text-center">
                  {appCosts.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-destructive"
                      onClick={() => onRemove(app.id)}
                    >
                      <Trash2 size={13} />
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
