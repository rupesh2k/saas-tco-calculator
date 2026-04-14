import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Projection {
  year: number;
  totalCost: number;
}

interface Props {
  projections: Projection[];
  growthRate: number;
  onGrowthRateChange: (rate: number) => void;
  years: number;
  onYearsChange: (y: number) => void;
}

const fmt = (n: number) => {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n.toFixed(0)}`;
};

export function GrowthProjectionChart({ projections, growthRate, onGrowthRateChange, years, onYearsChange }: Props) {
  const data = projections.map((p) => ({
    name: p.year === 0 ? "Current" : `Year ${p.year}`,
    cost: Math.round(p.totalCost),
  }));

  return (
    <Card className="p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <h3 className="font-semibold text-sm">Growth Projection</h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Label className="text-xs text-muted-foreground whitespace-nowrap">Growth Rate</Label>
            <div className="relative">
              <Input
                type="number"
                min={0}
                max={100}
                value={growthRate}
                onChange={(e) => onGrowthRateChange(parseFloat(e.target.value) || 0)}
                className="h-7 w-16 text-xs font-mono text-right bg-muted/50 border-0 focus-visible:ring-1 pr-5 tabular-nums"
              />
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">%</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Label className="text-xs text-muted-foreground whitespace-nowrap">Years</Label>
            <Input
              type="number"
              min={1}
              max={10}
              value={years}
              onChange={(e) => onYearsChange(parseInt(e.target.value) || 3)}
              className="h-7 w-14 text-xs font-mono text-right bg-muted/50 border-0 focus-visible:ring-1 tabular-nums"
            />
          </div>
        </div>
      </div>

      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 13% 89%)" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
            <YAxis tickFormatter={fmt} tick={{ fontSize: 11, fontFamily: "JetBrains Mono" }} tickLine={false} axisLine={false} width={60} />
            <Tooltip
              formatter={(value: number) => [`$${value.toLocaleString()}`, "Annual Cost"]}
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid hsl(220 13% 89%)",
                fontSize: "12px",
                fontFamily: "JetBrains Mono",
              }}
            />
            <Bar dataKey="cost" fill="hsl(168 50% 38%)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
