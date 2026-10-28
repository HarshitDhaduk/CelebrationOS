import React, { useState } from 'react';
import { BudgetItem, BudgetCategory, Currency, EventType } from '../../types';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';
import {
  calculateBudgetMetrics,
  formatCurrency,
  generateAutoAllocation,
} from '../../utils/budgetEngine';
import {
  CATEGORY_LABELS,
  CATEGORY_COLORS,
  BUDGET_BENCHMARKS,
} from '../../data/industryBenchmarks';
import {
  DollarSign,
  Plus,
  Wand2,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  PieChart,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';

interface BudgetManagerProps {
  items: BudgetItem[];
  totalBudget: number;
  guestCount: number;
  currency: Currency;
  eventType: EventType;
  onUpdateItems: (items: BudgetItem[]) => void;
}

export const BudgetManager: React.FC<BudgetManagerProps> = ({
  items,
  totalBudget,
  guestCount,
  currency,
  eventType,
  onUpdateItems,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAutoAllocateModalOpen, setIsAutoAllocateModalOpen] = useState(false);

  // New item form state
  const [newItem, setNewItem] = useState<Partial<BudgetItem>>({
    name: '',
    category: 'catering',
    estimatedCost: 0,
    actualCost: 0,
    paidAmount: 0,
    isPaid: false,
    priority: 'must-have',
    notes: '',
  });

  const metrics = calculateBudgetMetrics(items, totalBudget, guestCount);

  // Filter items
  const filteredItems = items.filter((item) => {
    if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
    return true;
  });

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.name) return;

    const created: BudgetItem = {
      id: `custom-b-${Date.now()}`,
      name: newItem.name,
      category: (newItem.category as BudgetCategory) || 'other',
      estimatedCost: Number(newItem.estimatedCost) || 0,
      actualCost: Number(newItem.actualCost) || 0,
      paidAmount: Number(newItem.paidAmount) || 0,
      isPaid: Boolean(newItem.isPaid),
      priority: newItem.priority || 'must-have',
      notes: newItem.notes || '',
    };

    onUpdateItems([...items, created]);
    setIsAddModalOpen(false);
    setNewItem({
      name: '',
      category: 'catering',
      estimatedCost: 0,
      actualCost: 0,
      paidAmount: 0,
      isPaid: false,
      priority: 'must-have',
      notes: '',
    });
  };

  const handleDeleteItem = (id: string) => {
    onUpdateItems(items.filter((i) => i.id !== id));
  };

  const handleTogglePaid = (item: BudgetItem) => {
    const updated = items.map((i) => {
      if (i.id === item.id) {
        const nextPaid = !i.isPaid;
        return {
          ...i,
          isPaid: nextPaid,
          paidAmount: nextPaid && i.paidAmount === 0 ? (i.actualCost || i.estimatedCost) : i.paidAmount,
        };
      }
      return i;
    });
    onUpdateItems(updated);
  };

  const handleApplyAutoAllocate = () => {
    const generated = generateAutoAllocation(eventType, totalBudget);
    onUpdateItems(generated);
    setIsAutoAllocateModalOpen(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Financial Health Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Budget Card */}
        <Card className="p-5 border-l-4 border-l-blue-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Budget
            </span>
            <DollarSign className="w-4 h-4 text-blue-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">
              {formatCurrency(totalBudget, currency)}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Cost/Guest: <strong className="text-slate-700 dark:text-slate-300">{formatCurrency(metrics.costPerGuestEstimated, currency)}</strong>
          </p>
        </Card>

        {/* Estimated Allocations */}
        <Card className="p-5 border-l-4 border-l-purple-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Estimated Commitments
            </span>
            <TrendingUp className="w-4 h-4 text-purple-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">
              {formatCurrency(metrics.totalEstimated, currency)}
            </span>
            <span className="text-xs text-slate-500">
              ({totalBudget > 0 ? Math.round((metrics.totalEstimated / totalBudget) * 100) : 0}%)
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Across {items.length} budgeted categories
          </p>
        </Card>

        {/* Actual Paid Out */}
        <Card className="p-5 border-l-4 border-l-emerald-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Actual Paid Out
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {formatCurrency(metrics.totalPaid, currency)}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Deposits and settled invoices
          </p>
        </Card>

        {/* Remaining Variance / Contingency */}
        <Card
          className={`p-5 border-l-4 ${
            metrics.isOverBudget ? 'border-l-rose-500 bg-rose-50/20' : 'border-l-amber-500'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {metrics.isOverBudget ? 'Over Budget By' : 'Remaining Cushion'}
            </span>
            {metrics.isOverBudget ? (
              <AlertTriangle className="w-4 h-4 text-rose-500" />
            ) : (
              <ShieldCheck className="w-4 h-4 text-amber-500" />
            )}
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span
              className={`text-2xl font-bold ${
                metrics.isOverBudget ? 'text-rose-600 dark:text-rose-400' : 'text-slate-900 dark:text-white'
              }`}
            >
              {formatCurrency(Math.abs(metrics.variance), currency)}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Contingency Fund: <strong>{formatCurrency(metrics.contingencyTotal, currency)}</strong>
          </p>
        </Card>

      </div>

      {/* Over-budget Warning Banner */}
      {metrics.isOverBudget && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-900 dark:text-rose-200 flex items-start gap-3 animate-slide-up">
          <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs">
            <p className="font-bold text-sm">
              Budget Warning: Projected expenses exceed budget by {formatCurrency(Math.abs(metrics.variance), currency)}
            </p>
            <p>
              AI Recommendation: Consider adjusting non-essential decor rentals or trimming optional stationery items to bring your plan back within target. You can also rebalance using the Auto-Allocate assistant.
            </p>
          </div>
        </div>
      )}

      {/* Visual Category Distribution Stacked Bar */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <PieChart className="w-4 h-4 text-rose-500" />
              Category Budget Distribution
            </h3>
            <p className="text-xs text-slate-500">
              Interactive allocation breakdown mapped to industry benchmarks
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsAutoAllocateModalOpen(true)}
              icon={<Wand2 className="w-3.5 h-3.5 text-amber-500" />}
            >
              AI Smart Allocate
            </Button>
            <Button
              size="sm"
              variant="primary"
              onClick={() => setIsAddModalOpen(true)}
              icon={<Plus className="w-3.5 h-3.5" />}
            >
              Add Expense
            </Button>
          </div>
        </div>

        {/* Stacked Progress Bar */}
        <div className="h-4 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex shadow-inner">
          {metrics.categorySummaries.map((catSummary) => {
            const width = Math.min(100, Math.max(1, (catSummary.estimated / Math.max(1, metrics.totalEstimated)) * 100));
            const color = CATEGORY_COLORS[catSummary.category]?.hex || '#94A3B8';
            return (
              <div
                key={catSummary.category}
                style={{ width: `${width}%`, backgroundColor: color }}
                title={`${CATEGORY_LABELS[catSummary.category]}: ${formatCurrency(catSummary.estimated, currency)} (${Math.round(width)}%)`}
                className="h-full hover:opacity-80 transition-opacity cursor-pointer"
              />
            );
          })}
        </div>

        {/* Category Legend Badges */}
        <div className="flex flex-wrap gap-2.5 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
              selectedCategory === 'all'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
            }`}
          >
            All Categories ({items.length})
          </button>

          {metrics.categorySummaries.map((cat) => {
            const label = CATEGORY_LABELS[cat.category] || cat.category;
            const color = CATEGORY_COLORS[cat.category];
            const isSelected = selectedCategory === cat.category;
            return (
              <button
                key={cat.category}
                onClick={() => setSelectedCategory(isSelected ? 'all' : cat.category)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-medium transition-all border ${
                  isSelected
                    ? 'border-slate-900 dark:border-white shadow-sm ring-1 ring-slate-900 dark:ring-white'
                    : 'border-transparent'
                } ${color?.bg || 'bg-slate-100'} ${color?.text || 'text-slate-700'}`}
              >
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: color?.hex }}
                />
                <span>{label}</span>
                <span className="font-bold ml-1">{formatCurrency(cat.estimated, currency)}</span>
              </button>
            );
          })}
        </div>
      </Card>

      {/* Expense Items Table */}
      <Card className="overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
            Budgeted Items & Line Expenses ({filteredItems.length})
          </h4>
          <span className="text-xs text-slate-500">
            Click checkbox to mark payment complete
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-xs uppercase tracking-wider text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4 w-12 text-center">Paid</th>
                <th className="py-3 px-4">Item & Description</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4 text-right">Estimated</th>
                <th className="py-3 px-4 text-right">Actual</th>
                <th className="py-3 px-4 text-center">Priority</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredItems.map((item) => {
                const catColor = CATEGORY_COLORS[item.category];
                return (
                  <tr
                    key={item.id}
                    className={`hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors ${
                      item.isPaid ? 'bg-emerald-50/30 dark:bg-emerald-950/10' : ''
                    }`}
                  >
                    {/* Paid Checkbox */}
                    <td className="py-3 px-4 text-center">
                      <input
                        type="checkbox"
                        checked={item.isPaid}
                        onChange={() => handleTogglePaid(item)}
                        aria-label={`Mark ${item.name} as paid`}
                        className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 cursor-pointer"
                      />
                    </td>

                    {/* Name & Notes */}
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900 dark:text-white">
                        {item.name}
                      </div>
                      {item.notes && (
                        <div className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                          {item.notes}
                        </div>
                      )}
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4">
                      <span
                        className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                          catColor?.bg || 'bg-slate-100'
                        } ${catColor?.text || 'text-slate-700'}`}
                      >
                        {CATEGORY_LABELS[item.category] || item.category}
                      </span>
                    </td>

                    {/* Estimated Cost */}
                    <td className="py-3 px-4 text-right font-medium text-slate-900 dark:text-slate-100">
                      {formatCurrency(item.estimatedCost, currency)}
                    </td>

                    {/* Actual Cost */}
                    <td className="py-3 px-4 text-right font-medium">
                      {item.actualCost > 0 ? (
                        <span className={item.actualCost > item.estimatedCost ? 'text-rose-600 font-bold' : 'text-slate-900 dark:text-slate-100'}>
                          {formatCurrency(item.actualCost, currency)}
                        </span>
                      ) : (
                        <span className="text-slate-400 text-xs">—</span>
                      )}
                    </td>

                    {/* Priority Badge */}
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`text-[11px] px-2 py-0.5 rounded-md font-semibold uppercase ${
                          item.priority === 'must-have'
                            ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                            : item.priority === 'nice-to-have'
                            ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                            : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                        }`}
                      >
                        {item.priority}
                      </span>
                    </td>

                    {/* Delete Action */}
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="p-1 text-slate-400 hover:text-red-600 transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                        title="Delete expense"
                        aria-label={`Delete ${item.name}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}

              {filteredItems.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-400 text-xs">
                    No budget items found for this category filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add Expense Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Event Expense"
        description="Record a new planned or incurred expense for your celebration."
        maxWidth="md"
      >
        <form onSubmit={handleAddItem} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Expense Item Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Cocktail Hour Canapes, Drone Videographer"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Category
              </label>
              <select
                value={newItem.category}
                onChange={(e) => setNewItem({ ...newItem, category: e.target.value as BudgetCategory })}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
              >
                {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Priority
              </label>
              <select
                value={newItem.priority}
                onChange={(e) => setNewItem({ ...newItem, priority: e.target.value as any })}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
              >
                <option value="must-have">Must-Have</option>
                <option value="nice-to-have">Nice-To-Have</option>
                <option value="optional">Optional</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Estimated Cost ({currency}) *
              </label>
              <input
                type="number"
                min="0"
                required
                value={newItem.estimatedCost || ''}
                onChange={(e) => setNewItem({ ...newItem, estimatedCost: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Actual Cost / Quoted ({currency})
              </label>
              <input
                type="number"
                min="0"
                value={newItem.actualCost || ''}
                onChange={(e) => setNewItem({ ...newItem, actualCost: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Notes & Contract Terms
            </label>
            <textarea
              rows={2}
              placeholder="e.g. 50% deposit required on booking, includes tip"
              value={newItem.notes}
              onChange={(e) => setNewItem({ ...newItem, notes: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button variant="ghost" size="sm" type="button" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Add Expense
            </Button>
          </div>
        </form>
      </Modal>

      {/* AI Smart Auto-Allocate Modal */}
      <Modal
        isOpen={isAutoAllocateModalOpen}
        onClose={() => setIsAutoAllocateModalOpen(false)}
        title="AI Budget Auto-Allocation Engine"
        description={`Automatically distribute your ${formatCurrency(totalBudget, currency)} budget based on professional industry benchmarks for ${eventType.toUpperCase()} events.`}
        maxWidth="lg"
      >
        <div className="space-y-4">
          <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 rounded-xl text-xs text-amber-900 dark:text-amber-200">
            <strong>Notice:</strong> Applying this will rebalance your current budget categories to match standard industry ratios (e.g. 35% Catering, 25% Venue, 12% Photography, 10% Decor, etc.). Existing items will be replaced with optimized benchmark line items.
          </div>

          <div className="space-y-2">
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Benchmark Target Ratios:
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {(BUDGET_BENCHMARKS[eventType] || BUDGET_BENCHMARKS.wedding).map((bm) => {
                const targetAmt = Math.round((totalBudget * bm.defaultPercentage) / 100);
                return (
                  <div
                    key={bm.category}
                    className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-between"
                  >
                    <div>
                      <p className="font-semibold text-slate-800 dark:text-slate-200">{bm.name}</p>
                      <p className="text-[11px] text-slate-400">{bm.defaultPercentage}% of budget</p>
                    </div>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {formatCurrency(targetAmt, currency)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button variant="ghost" size="sm" onClick={() => setIsAutoAllocateModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="gold"
              size="sm"
              onClick={handleApplyAutoAllocate}
              icon={<Wand2 className="w-4 h-4" />}
            >
              Apply Auto-Allocation
            </Button>
          </div>
        </div>
      </Modal>

    </div>
  );
};
