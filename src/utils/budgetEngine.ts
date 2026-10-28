import { BudgetItem, BudgetCategory, EventType, Currency } from '../types';
import { BUDGET_BENCHMARKS, CURRENCY_SYMBOLS } from '../data/industryBenchmarks';

export interface CategorySummary {
  category: BudgetCategory;
  estimated: number;
  actual: number;
  paid: number;
  percentageOfTotal: number;
  itemCount: number;
}

export interface BudgetMetrics {
  totalBudget: number;
  totalEstimated: number;
  totalActual: number;
  totalPaid: number;
  remainingEstimated: number;
  remainingActual: number;
  costPerGuestEstimated: number;
  costPerGuestActual: number;
  contingencyTotal: number;
  contingencyPercentage: number;
  isOverBudget: boolean;
  variance: number;
  healthStatus: 'under' | 'on_track' | 'warning' | 'danger';
  categorySummaries: CategorySummary[];
}

export function calculateBudgetMetrics(
  items: BudgetItem[],
  totalBudget: number,
  guestCount: number
): BudgetMetrics {
  const totalEstimated = items.reduce((sum, item) => sum + (Number(item.estimatedCost) || 0), 0);
  const totalActual = items.reduce((sum, item) => sum + (Number(item.actualCost) || 0), 0);
  const totalPaid = items.reduce((sum, item) => sum + (Number(item.paidAmount) || 0), 0);

  // Group by category
  const categoryMap: Partial<Record<BudgetCategory, { estimated: number; actual: number; paid: number; count: number }>> = {};
  
  items.forEach(item => {
    if (!categoryMap[item.category]) {
      categoryMap[item.category] = { estimated: 0, actual: 0, paid: 0, count: 0 };
    }
    categoryMap[item.category]!.estimated += Number(item.estimatedCost) || 0;
    categoryMap[item.category]!.actual += Number(item.actualCost) || 0;
    categoryMap[item.category]!.paid += Number(item.paidAmount) || 0;
    categoryMap[item.category]!.count += 1;
  });

  const categorySummaries: CategorySummary[] = Object.entries(categoryMap).map(([cat, data]) => ({
    category: cat as BudgetCategory,
    estimated: data.estimated,
    actual: data.actual,
    paid: data.paid,
    percentageOfTotal: totalBudget > 0 ? Math.round((data.estimated / totalBudget) * 100) : 0,
    itemCount: data.count,
  }));

  // Sort descending by estimated cost
  categorySummaries.sort((a, b) => b.estimated - a.estimated);

  const contingencyItem = items.find(i => i.category === 'contingency');
  const contingencyTotal = contingencyItem ? contingencyItem.estimatedCost : 0;
  const contingencyPercentage = totalBudget > 0 ? (contingencyTotal / totalBudget) * 100 : 0;

  const effectiveGuests = Math.max(1, guestCount);
  const costPerGuestEstimated = totalEstimated / effectiveGuests;
  const costPerGuestActual = totalActual / effectiveGuests;

  const remainingEstimated = totalBudget - totalEstimated;
  const remainingActual = totalBudget - totalActual;
  const variance = totalBudget - totalEstimated;
  const isOverBudget = totalEstimated > totalBudget;

  let healthStatus: 'under' | 'on_track' | 'warning' | 'danger' = 'on_track';
  if (totalEstimated > totalBudget * 1.05) {
    healthStatus = 'danger';
  } else if (totalEstimated > totalBudget) {
    healthStatus = 'warning';
  } else if (totalEstimated < totalBudget * 0.8) {
    healthStatus = 'under';
  }

  return {
    totalBudget,
    totalEstimated,
    totalActual,
    totalPaid,
    remainingEstimated,
    remainingActual,
    costPerGuestEstimated,
    costPerGuestActual,
    contingencyTotal,
    contingencyPercentage,
    isOverBudget,
    variance,
    healthStatus,
    categorySummaries,
  };
}

export function generateAutoAllocation(
  eventType: EventType,
  totalBudget: number
): BudgetItem[] {
  const benchmarks = BUDGET_BENCHMARKS[eventType] || BUDGET_BENCHMARKS.wedding;
  const items: BudgetItem[] = [];

  benchmarks.forEach((bm, idx) => {
    const allocated = Math.round((totalBudget * bm.defaultPercentage) / 100);
    // Split into 1 or 2 typical items
    if (bm.typicalItems.length > 0) {
      const primaryShare = bm.typicalItems.length > 1 ? Math.round(allocated * 0.7) : allocated;
      items.push({
        id: `auto-${bm.category}-${idx}-1`,
        name: bm.typicalItems[0],
        category: bm.category,
        estimatedCost: primaryShare,
        actualCost: 0,
        paidAmount: 0,
        isPaid: false,
        priority: bm.category === 'contingency' ? 'optional' : 'must-have',
        notes: `AI benchmark allocated ${bm.defaultPercentage}% of budget for ${bm.name}.`
      });

      if (bm.typicalItems.length > 1 && (allocated - primaryShare) > 0) {
        items.push({
          id: `auto-${bm.category}-${idx}-2`,
          name: bm.typicalItems[1],
          category: bm.category,
          estimatedCost: allocated - primaryShare,
          actualCost: 0,
          paidAmount: 0,
          isPaid: false,
          priority: 'nice-to-have',
          notes: `Secondary allocation for ${bm.typicalItems[1]}.`
        });
      }
    }
  });

  return items;
}

export function formatCurrency(amount: number, currency: Currency = 'USD'): string {
  const symbol = CURRENCY_SYMBOLS[currency] || '$';
  const formatted = Math.abs(amount).toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  return amount < 0 ? `-${symbol}${formatted}` : `${symbol}${formatted}`;
}
