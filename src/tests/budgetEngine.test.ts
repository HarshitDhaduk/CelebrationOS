import { describe, it, expect } from 'vitest';
import { calculateBudgetMetrics, generateAutoAllocation, formatCurrency } from '../utils/budgetEngine';
import { BudgetItem } from '../types';

describe('Budget Engine Tests', () => {
  const sampleItems: BudgetItem[] = [
    {
      id: '1',
      name: 'Venue Hall',
      category: 'venue',
      estimatedCost: 5000,
      actualCost: 4800,
      paidAmount: 2400,
      isPaid: false,
      priority: 'must-have',
    },
    {
      id: '2',
      name: 'Catering Buffet',
      category: 'catering',
      estimatedCost: 3000,
      actualCost: 3200,
      paidAmount: 3200,
      isPaid: true,
      priority: 'must-have',
    },
    {
      id: '3',
      name: 'Weather Buffer',
      category: 'contingency',
      estimatedCost: 1000,
      actualCost: 0,
      paidAmount: 0,
      isPaid: false,
      priority: 'optional',
    },
  ];

  it('correctly calculates total estimated, actual, and paid amounts', () => {
    const metrics = calculateBudgetMetrics(sampleItems, 10000, 100);
    expect(metrics.totalEstimated).toBe(9000);
    expect(metrics.totalActual).toBe(8000);
    expect(metrics.totalPaid).toBe(5600);
    expect(metrics.isOverBudget).toBe(false);
    expect(metrics.variance).toBe(1000);
    expect(metrics.costPerGuestEstimated).toBe(90);
    expect(metrics.contingencyTotal).toBe(1000);
    expect(metrics.contingencyPercentage).toBe(10);
  });

  it('flags over-budget conditions properly', () => {
    const overItems: BudgetItem[] = [
      {
        id: '1',
        name: 'Lavish Venue',
        category: 'venue',
        estimatedCost: 12000,
        actualCost: 12000,
        paidAmount: 6000,
        isPaid: false,
        priority: 'must-have',
      },
    ];

    const metrics = calculateBudgetMetrics(overItems, 10000, 50);
    expect(metrics.isOverBudget).toBe(true);
    expect(metrics.variance).toBe(-2000);
    expect(metrics.healthStatus).toBe('danger');
  });

  it('flags warning status when allocations slightly exceed target budget', () => {
    const warningItems: BudgetItem[] = [
      {
        id: '1',
        name: 'Venue & Decor',
        category: 'venue',
        estimatedCost: 10200,
        actualCost: 10000,
        paidAmount: 5000,
        isPaid: false,
        priority: 'must-have',
      },
    ];

    const metrics = calculateBudgetMetrics(warningItems, 10000, 50);
    expect(metrics.healthStatus).toBe('warning');
  });

  it('handles empty budget items array gracefully without division by zero', () => {
    const metrics = calculateBudgetMetrics([], 10000, 0);
    expect(metrics.totalEstimated).toBe(0);
    expect(metrics.totalActual).toBe(0);
    expect(metrics.totalPaid).toBe(0);
    expect(metrics.costPerGuestEstimated).toBe(0);
    expect(metrics.healthStatus).toBe('under');
  });

  it('generates auto-allocation aligned with benchmarks for wedding, birthday, and community', () => {
    const weddingAlloc = generateAutoAllocation('wedding', 20000);
    expect(weddingAlloc.length).toBeGreaterThan(0);
    const totalW = weddingAlloc.reduce((sum, item) => sum + item.estimatedCost, 0);
    expect(totalW).toBeGreaterThan(15000);
    expect(totalW).toBeLessThanOrEqual(20000);

    const bdayAlloc = generateAutoAllocation('birthday', 5000);
    expect(bdayAlloc.length).toBeGreaterThan(0);

    const commAlloc = generateAutoAllocation('community', 15000);
    expect(commAlloc.length).toBeGreaterThan(0);
  });

  it('formats all 6 supported currencies cleanly with en-US notation', () => {
    expect(formatCurrency(5000, 'USD')).toBe('$5,000');
    expect(formatCurrency(250000, 'INR')).toBe('₹250,000');
    expect(formatCurrency(1200, 'EUR')).toBe('€1,200');
    expect(formatCurrency(3500, 'GBP')).toBe('£3,500');
    expect(formatCurrency(4000, 'CAD')).toBe('CA$4,000');
    expect(formatCurrency(6000, 'AUD')).toBe('AU$6,000');
    expect(formatCurrency(-500, 'USD')).toBe('-$500');
  });
});
