import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Card } from "@/components/ui/card";

interface CategoryTotal {
  id: string;
  label: string;
  total: number;
}

const COLORS = [
  "hsl(168 50% 38%)",
  "hsl(210 65% 50%)",
  "hsl(38 92% 50%)",
  "hsl(340 60% 50%)",
  "hsl(260 50% 55%)",
  "hsl(152 55% 40%)",
  "hsl(20 70% 50%)",
];

const fmt = (n: number) => `$${n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

export function CostBreakdownChart({ categoryTotals }: { categoryTotals: CategoryTotal[] }) {
  const data = categoryTotals.filter((c) => c.total > 0);
  const total = data.reduce((s, c) => s + c.total, 0);

  if (data.length === 0) {
    return (
      <Card className="p-5 shadow-sm flex items-center justify-center h-full min-h-[300px]">
        <p className="text-sm text-muted-foreground">Enter costs to see breakdown</p>
      </Card>
    );
  }

  return (
    <Card className="p-5 shadow-sm">
      <h3 className="font-semibold text-sm mb-4">Cost Breakdown</h3>
      <div className="flex items-center gap-6">
        <div className="w-48 h-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={80}
                dataKey="total"
                nameKey="label"
                strokeWidth={2}
                stroke="hsl(0 0% 100%)"
              >
                {data.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => fmt(value)}
                contentStyle={{
                  borderRadius: "8px",
                  border: "1px solid hsl(220 13% 89%)",
                  fontSize: "12px",
                  fontFamily: "JetBrains Mono",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex-1 space-y-2">
          {data.map((c, i) => (
            <div key={c.id} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                <span>{c.label}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-muted-foreground">{total > 0 ? ((c.total / total) * 100).toFixed(1) : 0}%</span>
                <span className="font-mono tabular-nums font-medium w-20 text-right">{fmt(c.total)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
