import { useState, useRef } from "react";
import { CostCategory, CostPeriod, CostType, CostBehavior } from "@/types/tco";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Server, Database, HardDrive, Globe, FileKey, Wrench, MoreHorizontal, Plus, Trash2, GripVertical, ChevronDown, ChevronRight } from "lucide-react";

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
  onUpdateCostType: (itemId: string, costType: CostType) => void;
  onUpdateBehavior: (itemId: string, behavior: CostBehavior) => void;
  onAddItem: () => void;
  onRemoveItem: (itemId: string) => void;
  onRemoveCategory: () => void;
  onUpdateCategoryLabel: (label: string) => void;
}

export function CostCategoryCard({ category, onUpdateCost, onUpdateName, onUpdateQuantity, onUpdateUnitCost, onUpdatePeriod, onUpdateCostType, onUpdateBehavior, onAddItem, onRemoveItem, onRemoveCategory, onUpdateCategoryLabel }: Props) {
  const Icon = iconMap[category.icon] || Server;
  const total = category.items.reduce((s, i) => s + i.monthlyCost, 0);
  const fixedTotal = category.items.filter(i => i.behavior === "fixed").reduce((s, i) => s + i.monthlyCost, 0);
  const variableTotal = category.items.filter(i => i.behavior === "variable").reduce((s, i) => s + i.monthlyCost, 0);

  // Track which items have advanced options expanded
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev => {
      const next = new Set(prev);
      if (next.has(itemId)) {
        next.delete(itemId);
      } else {
        next.add(itemId);
      }
      return next;
    });
  };

  // Column widths
  const [colWidths, setColWidths] = useState({
    item: 200,
    qty: 80,
    unitCost: 100,
    period: 90,
    cost: 110,
  });

  const resizingRef = useRef<{ col: keyof typeof colWidths; startX: number; startWidth: number } | null>(null);

  const handleMouseDown = (col: keyof typeof colWidths, e: React.MouseEvent) => {
    e.preventDefault();
    resizingRef.current = {
      col,
      startX: e.clientX,
      startWidth: colWidths[col],
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!resizingRef.current) return;
      const delta = e.clientX - resizingRef.current.startX;
      const newWidth = Math.max(60, resizingRef.current.startWidth + delta);
      setColWidths(prev => ({ ...prev, [resizingRef.current!.col]: newWidth }));
    };

    const handleMouseUp = () => {
      resizingRef.current = null;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

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
          <div className="flex flex-col items-end">
            <span className="font-mono text-sm font-semibold text-primary">
              ${total.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              <span className="text-muted-foreground font-normal text-xs">/mo</span>
            </span>
            {(fixedTotal > 0 || variableTotal > 0) && (
              <span className="text-[10px] text-muted-foreground font-mono">
                <span className="text-blue-600" title="Fixed">🔒 ${fixedTotal.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
                {variableTotal > 0 && (
                  <> · <span className="text-amber-600" title="Variable">📈 ${variableTotal.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span></>
                )}
              </span>
            )}
          </div>
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
      <div className="flex items-center mb-1.5 px-0.5 overflow-x-auto">
        <div className="w-6 shrink-0" />
        <div className="flex items-center" style={{ width: colWidths.item }}>
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Item</span>
          <div
            onMouseDown={(e) => handleMouseDown('item', e)}
            className="ml-auto cursor-col-resize hover:bg-primary/20 px-0.5 py-1 -mr-1"
          >
            <GripVertical size={12} className="text-muted-foreground/50" />
          </div>
        </div>
        <div className="flex items-center justify-center" style={{ width: colWidths.qty }}>
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Qty</span>
          <div
            onMouseDown={(e) => handleMouseDown('qty', e)}
            className="ml-auto cursor-col-resize hover:bg-primary/20 px-0.5 py-1 -mr-1"
          >
            <GripVertical size={12} className="text-muted-foreground/50" />
          </div>
        </div>
        <div className="flex items-center justify-center" style={{ width: colWidths.unitCost }}>
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Unit Cost</span>
          <div
            onMouseDown={(e) => handleMouseDown('unitCost', e)}
            className="ml-auto cursor-col-resize hover:bg-primary/20 px-0.5 py-1 -mr-1"
          >
            <GripVertical size={12} className="text-muted-foreground/50" />
          </div>
        </div>
        <div className="flex items-center justify-center" style={{ width: colWidths.period }}>
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Period</span>
          <div
            onMouseDown={(e) => handleMouseDown('period', e)}
            className="ml-auto cursor-col-resize hover:bg-primary/20 px-0.5 py-1 -mr-1"
          >
            <GripVertical size={12} className="text-muted-foreground/50" />
          </div>
        </div>
        <div className="flex items-center justify-end" style={{ width: colWidths.cost }}>
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Cost</span>
        </div>
        <div className="w-9 shrink-0" />
      </div>

      <div className="space-y-2 overflow-x-auto">
        {category.items.map((item) => {
          const isExpanded = expandedItems.has(item.id);

          return (
            <div key={item.id} className="space-y-1">
              <div className="flex items-center min-w-fit">
                <div className="w-6 shrink-0 pr-1">
                  <button
                    onClick={() => toggleExpanded(item.id)}
                    className="h-9 w-5 flex items-center justify-center hover:bg-muted/50 rounded transition-colors"
                    title="Advanced options"
                  >
                    {isExpanded ? (
                      <ChevronDown size={14} className="text-muted-foreground" />
                    ) : (
                      <ChevronRight size={14} className="text-muted-foreground" />
                    )}
                  </button>
                </div>
                <div style={{ width: colWidths.item }} className="pr-1">
                  <Input
                    value={item.name}
                    onChange={(e) => onUpdateName(item.id, e.target.value)}
                    className="w-full h-9 text-sm bg-muted/50 border-0 focus-visible:ring-1"
                    placeholder="Item name"
                  />
                </div>
                <div style={{ width: colWidths.qty }} className="pr-1">
              <Input
                type="number"
                min={1}
                value={item.quantity || ""}
                onChange={(e) => onUpdateQuantity(item.id, Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full h-9 text-sm font-mono text-center bg-muted/50 border-0 focus-visible:ring-1 tabular-nums"
              />
            </div>
            <div style={{ width: colWidths.unitCost }} className="pr-1 relative">
              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-sm text-muted-foreground z-10">$</span>
              <Input
                type="number"
                min={0}
                value={item.unitCost || ""}
                onChange={(e) => onUpdateUnitCost(item.id, parseFloat(e.target.value) || 0)}
                placeholder="0.00"
                className="w-full h-9 text-sm font-mono pl-6 bg-muted/50 border-0 focus-visible:ring-1 tabular-nums"
              />
            </div>
            <div style={{ width: colWidths.period }} className="pr-1">
              <select
                value={item.period || "monthly"}
                onChange={(e) => onUpdatePeriod(item.id, e.target.value as CostPeriod)}
                className="w-full h-9 text-xs rounded-md bg-muted/50 border-0 text-foreground focus:ring-1 focus:ring-ring px-2 cursor-pointer"
              >
                <option value="daily">Daily</option>
                <option value="monthly">Monthly</option>
                <option value="annual">Annual</option>
              </select>
            </div>
            <div style={{ width: colWidths.cost }} className="pr-1">
              <span className="text-sm font-mono tabular-nums text-right text-muted-foreground block">
                ${item.monthlyCost.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <div className="w-9 shrink-0">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-muted-foreground hover:text-destructive"
                onClick={() => onRemoveItem(item.id)}
              >
                <Trash2 size={16} />
              </Button>
            </div>
          </div>

          {/* Advanced Options Section */}
          {isExpanded && (
            <div className="ml-6 mr-9 bg-muted/30 rounded-md p-2 border-l-2 border-primary/30">
              <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                Advanced Options
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-muted-foreground mb-0.5 block">Cost Type</label>
                  <select
                    value={item.costType || ""}
                    onChange={(e) => onUpdateCostType(item.id, e.target.value as CostType)}
                    className="w-full h-7 text-xs rounded-md bg-background border border-border text-foreground focus:ring-1 focus:ring-ring px-2 cursor-pointer"
                  >
                    <option value="">Not specified</option>
                    <option value="base">Base License</option>
                    <option value="minimum">Platform Minimum</option>
                    <option value="addon">Required Add-On</option>
                    <option value="overage">Overage / Variable</option>
                    <option value="support">Premium Support</option>
                    <option value="hidden">Hidden Cost</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-muted-foreground mb-0.5 block">Cost Behavior</label>
                  <button
                    onClick={() => onUpdateBehavior(item.id, item.behavior === "fixed" ? "variable" : "fixed")}
                    className={`w-full h-7 rounded-md flex items-center justify-center text-xs font-medium transition-colors ${
                      item.behavior === "fixed"
                        ? "bg-blue-500/20 text-blue-600 hover:bg-blue-500/30 border border-blue-500/30"
                        : "bg-amber-500/20 text-amber-600 hover:bg-amber-500/30 border border-amber-500/30"
                    }`}
                  >
                    {item.behavior === "fixed" ? "Fixed Cost" : "Variable Cost"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
          );
        })}
      </div>

      <Button variant="ghost" size="sm" className="mt-3 h-7 text-xs text-muted-foreground" onClick={onAddItem}>
        <Plus size={14} className="mr-1" /> Add item
      </Button>
    </Card>
  );
}
