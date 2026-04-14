import { useState, useCallback, useMemo } from "react";
import { CostCategory, DEFAULT_CATEGORIES, CostItem } from "@/types/tco";

let nextId = 100;
const uid = () => `item-${nextId++}`;

interface TCOSnapshot {
  categories: CostCategory[];
  appCount: number;
  annualGrowthRate: number;
  projectionYears: number;
}

export function useTCOStore() {
  const [categories, setCategories] = useState<CostCategory[]>(DEFAULT_CATEGORIES);
  const [appCount, setAppCount] = useState(1_000_000);
  const [annualGrowthRate, setAnnualGrowthRate] = useState(10);
  const [projectionYears, setProjectionYears] = useState(5);

  const updateItemField = useCallback((categoryId: string, itemId: string, field: string, value: number | string) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === categoryId
          ? {
              ...cat,
              items: cat.items.map((i) => {
                if (i.id !== itemId) return i;
                const updated = { ...i, [field]: value };
                if (field === "quantity" || field === "unitCost" || field === "period") {
                  const rawCost = updated.quantity * updated.unitCost;
                  updated.monthlyCost = updated.period === "annual" ? rawCost / 12 : updated.period === "daily" ? rawCost * 30 : rawCost;
                }
                return updated;
              }),
            }
          : cat
      )
    );
  }, []);

  const updateItemCost = useCallback((categoryId: string, itemId: string, cost: number) => {
    updateItemField(categoryId, itemId, "monthlyCost", cost);
  }, [updateItemField]);

  const updateItemName = useCallback((categoryId: string, itemId: string, name: string) => {
    updateItemField(categoryId, itemId, "name", name);
  }, [updateItemField]);

  const updateItemQuantity = useCallback((categoryId: string, itemId: string, quantity: number) => {
    updateItemField(categoryId, itemId, "quantity", quantity);
  }, [updateItemField]);

  const updateItemUnitCost = useCallback((categoryId: string, itemId: string, unitCost: number) => {
    updateItemField(categoryId, itemId, "unitCost", unitCost);
  }, [updateItemField]);

  const updateItemPeriod = useCallback((categoryId: string, itemId: string, period: "monthly" | "annual") => {
    updateItemField(categoryId, itemId, "period", period);
  }, [updateItemField]);

  const addItem = useCallback((categoryId: string) => {
    const newItem: CostItem = { id: uid(), name: "New Item", quantity: 1, unitCost: 0, period: "monthly", monthlyCost: 0, notes: "" };
    setCategories((prev) =>
      prev.map((cat) => (cat.id === categoryId ? { ...cat, items: [...cat.items, newItem] } : cat))
    );
  }, []);

  const removeItem = useCallback((categoryId: string, itemId: string) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === categoryId ? { ...cat, items: cat.items.filter((i) => i.id !== itemId) } : cat
      )
    );
  }, []);

  const addCategory = useCallback((label: string) => {
    const newCat: CostCategory = {
      id: `cat-${nextId++}`,
      label,
      icon: "MoreHorizontal",
      items: [{ id: uid(), name: "New Item", quantity: 1, unitCost: 0, period: "monthly", monthlyCost: 0, notes: "" }],
    };
    setCategories((prev) => [...prev, newCat]);
  }, []);

  const removeCategory = useCallback((categoryId: string) => {
    setCategories((prev) => prev.filter((cat) => cat.id !== categoryId));
  }, []);

  const updateCategoryLabel = useCallback((categoryId: string, label: string) => {
    setCategories((prev) =>
      prev.map((cat) => (cat.id === categoryId ? { ...cat, label } : cat))
    );
  }, []);

  const totalMonthlyCost = useMemo(
    () => categories.reduce((sum, cat) => sum + cat.items.reduce((s, i) => s + i.monthlyCost, 0), 0),
    [categories]
  );

  const totalAnnualCost = totalMonthlyCost * 12;

  const costPerAppMonthly = appCount > 0 ? totalMonthlyCost / appCount : 0;
  const costPerAppAnnual = appCount > 0 ? totalAnnualCost / appCount : 0;

  const categoryTotals = useMemo(
    () => categories.map((cat) => ({
      id: cat.id,
      label: cat.label,
      total: cat.items.reduce((s, i) => s + i.monthlyCost, 0),
    })),
    [categories]
  );

  const projections = useMemo(() => {
    const result = [];
    for (let y = 0; y <= projectionYears; y++) {
      const factor = Math.pow(1 + annualGrowthRate / 100, y);
      result.push({ year: y, growthRate: annualGrowthRate, totalCost: totalAnnualCost * factor });
    }
    return result;
  }, [totalAnnualCost, annualGrowthRate, projectionYears]);

  const exportToFile = useCallback(() => {
    const snapshot: TCOSnapshot = { categories, appCount, annualGrowthRate, projectionYears };
    const blob = new Blob([JSON.stringify(snapshot, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `tco-config-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [categories, appCount, annualGrowthRate, projectionYears]);

  const importFromFile = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const data: TCOSnapshot = JSON.parse(ev.target?.result as string);
          if (data.categories) setCategories(data.categories);
          if (data.appCount) setAppCount(data.appCount);
          if (data.annualGrowthRate !== undefined) setAnnualGrowthRate(data.annualGrowthRate);
          if (data.projectionYears !== undefined) setProjectionYears(data.projectionYears);
        } catch {
          alert("Invalid TCO configuration file.");
        }
      };
      reader.readAsText(file);
    };
    input.click();
  }, []);

  return {
    categories,
    appCount,
    setAppCount,
    annualGrowthRate,
    setAnnualGrowthRate,
    projectionYears,
    setProjectionYears,
    updateItemCost,
    updateItemName,
    updateItemQuantity,
    updateItemUnitCost,
    updateItemPeriod,
    addItem,
    removeItem,
    addCategory,
    removeCategory,
    updateCategoryLabel,
    totalMonthlyCost,
    totalAnnualCost,
    costPerAppMonthly,
    costPerAppAnnual,
    categoryTotals,
    projections,
    exportToFile,
    importFromFile,
  };
}
