import { Card } from "@/components/ui/card";
import { DollarSign, TrendingUp, Layers, Calculator } from "lucide-react";

interface Props {
  totalMonthly: number;
  totalAnnual: number;
  appCount: number;
  costPerApp: number;
}

const fmt = (n: number) => (n ?? 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtCount = (n: number) => (n ?? 0).toLocaleString("en-US");
const fmtSmall = (n: number) => {
  const v = n ?? 0;
  if (v < 0.01 && v > 0) return `$${v.toFixed(4)}`;
  return `$${fmt(v)}`;
};

export function SummaryCards({ totalMonthly, totalAnnual, appCount, costPerApp }: Props) {
  const cards = [
    { label: "Monthly TCO", value: `$${fmt(totalMonthly)}`, icon: DollarSign, accent: "text-primary" },
    { label: "Annual TCO", value: `$${fmt(totalAnnual)}`, icon: TrendingUp, accent: "text-primary" },
    { label: "Total Units", value: fmtCount(appCount), icon: Layers, accent: "text-foreground" },
    { label: "Cost / Unit / Mo", value: fmtSmall(costPerApp), icon: Calculator, accent: "text-primary" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c, i) => (
        <Card
          key={c.label}
          className="p-5 shadow-sm"
          style={{ animationDelay: `${i * 80}ms` }}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{c.label}</span>
            <c.icon size={16} className="text-muted-foreground" />
          </div>
          <p className={`font-mono text-2xl font-bold tabular-nums ${c.accent}`}>
            {c.value}
          </p>
        </Card>
      ))}
    </div>
  );
}
