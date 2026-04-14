import { CostCategory, CostPeriod } from "@/types/tco";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Server, Database, HardDrive, Globe, FileKey, Wrench, MoreHorizontal, Plus, Trash2 } from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  Server, Database, HardDrive, Globe, FileKey, Wrench, MoreHorizontal,
};

interface Props {
  category: CostCategory;
  onUpdateCost: (itemId: string, cost: number) => void;
  onUpdateName: (itemId: string, name: string) => void;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onUpdateUnitCost: (itemId: string, unitCost: number) => void;
  onUpdatePeriod: (itemId: string, period: CostPeriod) => void;
  onAddItem: () => void;
  onRemoveItem: (itemId: string) => void;
  onRemoveCategory: () => void;
  onUpdateCategoryLabel: (label: string) => void;
}

export function CostCategoryCard({ category, onUpdateCost, onUpdateName, onUpdateQuantity, onUpdateUnitCost, onUpdatePeriod, onAddItem, onRemoveItem, onRemoveCategory, onUpdateCategoryLabel }: Props) {
  const Icon = iconMap[category.icon] || Server;
  const total = category.items.reduce((s, i) => s + i.monthlyCost, 0);

  return (
    <Card className="p-5 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <Icon className="w-4.5 h-4.5 text-primary" size={18} />
          </div>
          <Input
            value={category.label}
            onChange={(e) => onUpdateCategoryLabel(e.target.value)}
            className="font-semibold text-sm h-8 bg-transparent border-0 focus-visible:ring-1 px-1 min-w-0"
          />
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="font-mono text-sm font-semibold text-primary">
            ${total.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            <span className="text-muted-foreground font-normal text-xs">/mo</span>
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground hover:text-destructive"
            onClick={onRemoveCategory}
            title="Remove category"
          >
            <Trash2 size={14} />
          </Button>
        </div>
      </div>

      {/* Column headers */}
      <div className="flex items-center gap-1.5 mb-1.5 px-0.5 overflow-x-auto">
        <span className="flex-1 min-w-[120px] text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Item</span>
        <span className="w-16 shrink-0 text-[10px] text-muted-foreground uppercase tracking-wider font-medium text-center">Qty</span>
        <span className="w-28 shrink-0 text-[10px] text-muted-foreground uppercase tracking-wider font-medium text-center">Unit Cost</span>
        <span className="w-[80px] shrink-0 text-[10px] text-muted-foreground uppercase tracking-wider font-medium text-center">Period</span>
        <span className="w-24 shrink-0 text-[10px] text-muted-foreground uppercase tracking-wider font-medium text-right">Monthly</span>
        <span className="w-9 shrink-0" />
      </div>

      <div className="space-y-2 overflow-x-auto">
        {category.items.map((item) => (
          <div key={item.id} className="flex items-center gap-1.5 min-w-fit">
            <Input
              value={item.name}
              onChange={(e) => onUpdateName(item.id, e.target.value)}
              className="flex-1 min-w-[120px] h-9 text-sm bg-muted/50 border-0 focus-visible:ring-1"
              placeholder="Item name"
            />
            <Input
              type="number"
              min={1}
              value={item.quantity || ""}
              onChange={(e) => onUpdateQuantity(item.id, Math.max(1, parseInt(e.target.value) || 1))}
              className="w-16 shrink-0 h-9 text-sm font-mono text-center bg-muted/50 border-0 focus-visible:ring-1 tabular-nums"
            />
            <div className="relative shrink-0">
              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
              <Input
                type="number"
                min={0}
                value={item.unitCost || ""}
                onChange={(e) => onUpdateUnitCost(item.id, parseFloat(e.target.value) || 0)}
                placeholder="0.00"
                className="w-28 h-9 text-sm font-mono pl-6 bg-muted/50 border-0 focus-visible:ring-1 tabular-nums"
              />
            </div>
            <select
              value={item.period || "monthly"}
              onChange={(e) => onUpdatePeriod(item.id, e.target.value as CostPeriod)}
              className="w-[80px] shrink-0 h-9 text-xs rounded-md bg-muted/50 border-0 text-foreground focus:ring-1 focus:ring-ring px-2 cursor-pointer"
            >
              <option value="monthly">Monthly</option>
              <option value="annual">Annual</option>
            </select>
            <span className="w-24 shrink-0 text-sm font-mono tabular-nums text-right text-muted-foreground">
              ${item.monthlyCost.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 shrink-0 text-muted-foreground hover:text-destructive"
              onClick={() => onRemoveItem(item.id)}
            >
              <Trash2 size={16} />
            </Button>
          </div>
        ))}
      </div>

      <Button variant="ghost" size="sm" className="mt-3 h-7 text-xs text-muted-foreground" onClick={onAddItem}>
        <Plus size={14} className="mr-1" /> Add item
      </Button>
    </Card>
  );
}
