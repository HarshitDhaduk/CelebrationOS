import React, { useState } from 'react';
import { EventDetails, Currency, MilestoneTask, Vendor, BudgetItem } from '../../types';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { formatCurrency, calculateBudgetMetrics } from '../../utils/budgetEngine';
import { getDaysUntilEvent } from '../../utils/timelineEngine';
import confetti from 'canvas-confetti';
import {
  Calendar,
  MapPin,
  Users,
  DollarSign,
  Sparkles,
  Edit3,
  Clock,
  CheckCircle,
  Briefcase
} from 'lucide-react';

interface EventHeroProps {
  event: EventDetails;
  budgetItems: BudgetItem[];
  milestones: MilestoneTask[];
  vendors: Vendor[];
  currency: Currency;
  onUpdateEvent: (updated: EventDetails) => void;
}

export const EventHero: React.FC<EventHeroProps> = ({
  event,
  budgetItems,
  milestones,
  vendors,
  currency,
  onUpdateEvent,
}) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState<EventDetails>(event);

  const countdown = getDaysUntilEvent(event.date);
  const metrics = calculateBudgetMetrics(budgetItems, event.totalBudget, event.guestCount);

  const completedMilestones = milestones.filter(m => m.completed).length;
  const milestoneProgress = milestones.length > 0 ? Math.round((completedMilestones / milestones.length) * 100) : 0;
  
  const bookedVendors = vendors.filter(v => v.status === 'booked' || v.status === 'completed').length;

  const handleTriggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const handleSaveEvent = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateEvent(formData);
    setIsEditModalOpen(false);
    handleTriggerConfetti();
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-rose-950 text-white p-6 sm:p-8 shadow-xl border border-rose-900/40">
      {/* Ambient background decoration */}
      <div className="absolute -right-16 -top-16 w-72 h-72 rounded-full bg-rose-500/10 blur-3xl pointer-events-none" />
      <div className="absolute right-1/3 -bottom-20 w-64 h-64 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        
        {/* Left: Event Main Details */}
        <div className="space-y-3 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="rose" size="md" className="bg-rose-500/20 text-rose-300 border-rose-500/30">
              {event.eventType.toUpperCase()} PLANNER
            </Badge>
            <span className="text-xs text-rose-200/80 font-medium">
              {event.subType}
            </span>
            <span className="text-slate-500">•</span>
            <Badge variant={countdown.isPast ? 'slate' : 'amber'} size="sm" className="bg-amber-400/20 text-amber-300 border-amber-400/30">
              <Clock className="w-3 h-3 mr-1" />
              {countdown.label}
            </Badge>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight font-serif text-white">
            {event.title}
          </h1>

          <p className="text-sm text-slate-300 leading-relaxed italic">
            "{event.vibe}"
          </p>

          {/* Metadata badges */}
          <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-300 font-medium">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-rose-400" />
              <span>{event.date} {event.time ? `at ${event.time}` : ''}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-amber-400" />
              <span>{event.location}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-cyan-400" />
              <span>{event.guestCount} Guests</span>
            </div>

            <div className="flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <span>Budget: {formatCurrency(event.totalBudget, currency)}</span>
            </div>
          </div>
        </div>

        {/* Right: Quick Action & Health Score Cards */}
        <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setFormData(event);
                setIsEditModalOpen(true);
              }}
              icon={<Edit3 className="w-3.5 h-3.5" />}
              className="border-slate-700 bg-slate-800/80 text-white hover:bg-slate-700"
            >
              Edit Details
            </Button>

            <Button
              variant="gold"
              size="sm"
              onClick={handleTriggerConfetti}
              icon={<Sparkles className="w-3.5 h-3.5" />}
            >
              Celebrate 🎉
            </Button>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-2 bg-slate-800/80 backdrop-blur-sm p-3 rounded-2xl border border-slate-700/60 text-center">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Budget Used</p>
              <p className="text-sm font-bold text-emerald-400">
                {Math.round((metrics.totalEstimated / Math.max(1, event.totalBudget)) * 100)}%
              </p>
            </div>
            <div className="border-x border-slate-700/60 px-2">
              <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Milestones</p>
              <p className="text-sm font-bold text-amber-400">
                {milestoneProgress}%
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Vendors</p>
              <p className="text-sm font-bold text-rose-400">
                {bookedVendors}/{vendors.length}
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Edit Details Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Celebration Parameters"
        description="Update event essentials, target budget, date, and overall vibe."
        maxWidth="lg"
      >
        <form onSubmit={handleSaveEvent} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Event Title
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Event Sub-type / Style
              </label>
              <input
                type="text"
                value={formData.subType || ''}
                onChange={(e) => setFormData({ ...formData, subType: e.target.value })}
                placeholder="e.g. Coastal Wedding, Sweet 16, 5K Charity"
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Date & Time
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
                <input
                  type="time"
                  value={formData.time || '16:00'}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Guest Count
              </label>
              <input
                type="number"
                min="1"
                required
                value={formData.guestCount}
                onChange={(e) => setFormData({ ...formData, guestCount: parseInt(e.target.value, 10) || 1 })}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Total Target Budget ({currency})
              </label>
              <input
                type="number"
                min="0"
                required
                value={formData.totalBudget}
                onChange={(e) => setFormData({ ...formData, totalBudget: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Venue / Location
            </label>
            <input
              type="text"
              required
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Vibe / Aesthetic Vision
            </label>
            <textarea
              rows={2}
              value={formData.vibe}
              onChange={(e) => setFormData({ ...formData, vibe: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button variant="ghost" size="sm" type="button" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
