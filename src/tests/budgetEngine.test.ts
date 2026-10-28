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

  it('generates auto-allocation aligned with benchmarks', () => {
    const allocated = generateAutoAllocation('wedding', 20000);
    expect(allocated.length).toBeGreaterThan(0);
    const totalAllocated = allocated.reduce((sum, item) => sum + item.estimatedCost, 0);
    // Should be close to total budget
    expect(totalAllocated).toBeGreaterThan(15000);
    expect(totalAllocated).toBeLessThanOrEqual(20000);
  });

  it('formats various currencies cleanly', () => {
    expect(formatCurrency(5000, 'USD')).toBe('$5,000');
    expect(formatCurrency(250000, 'INR')).toBe('₹250,000');
    expect(formatCurrency(1200, 'EUR')).toBe('€1,200');
    expect(formatCurrency(-500, 'USD')).toBe('-$500');
  });
});
