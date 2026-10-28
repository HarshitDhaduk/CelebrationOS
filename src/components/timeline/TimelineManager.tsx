import React, { useState } from 'react';
import { RunOfShowItem, MilestoneTask, EventProject } from '../../types';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';
import {
  detectTimelineConflicts,
  PHASE_LABELS,
  PHASE_ORDER,
  parseTimeToMinutes,
} from '../../utils/timelineEngine';
import { downloadIcsFile } from '../../services/calendarExport';
import {
  Clock,
  Calendar,
  AlertTriangle,
  Plus,
  Download,
  Trash2,
  CheckCircle2,
  MapPin,
  UserCheck,
  ListOrdered,
  Milestone,
} from 'lucide-react';

interface TimelineManagerProps {
  project: EventProject;
  onUpdateRunOfShow: (items: RunOfShowItem[]) => void;
  onUpdateMilestones: (milestones: MilestoneTask[]) => void;
}

export const TimelineManager: React.FC<TimelineManagerProps> = ({
  project,
  onUpdateRunOfShow,
  onUpdateMilestones,
}) => {
  const [activeTab, setActiveTab] = useState<'runOfShow' | 'milestones'>('runOfShow');
  const [isAddScheduleModalOpen, setIsAddScheduleModalOpen] = useState(false);
  const [isAddMilestoneModalOpen, setIsAddMilestoneModalOpen] = useState(false);

  // New Run-of-Show form
  const [newScheduleItem, setNewScheduleItem] = useState<Partial<RunOfShowItem>>({
    startTime: '17:00',
    endTime: '18:00',
    title: '',
    description: '',
    responsibleParty: 'Event Coordinator',
    location: 'Main Hall',
    completed: false,
  });

  // New Milestone form
  const [newMilestone, setNewMilestone] = useState<Partial<MilestoneTask>>({
    title: '',
    phase: '1_to_2_months',
    dueDate: '',
    category: 'catering',
    priority: 'high',
    assignedTo: 'Lead Organizer',
  });

  const conflicts = detectTimelineConflicts(project.runOfShow);

  // Sort run of show by time
  const sortedRunOfShow = [...project.runOfShow].sort(
    (a, b) => parseTimeToMinutes(a.startTime) - parseTimeToMinutes(b.startTime)
  );

  const handleToggleScheduleItem = (id: string) => {
    const updated = project.runOfShow.map((item) =>
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    onUpdateRunOfShow(updated);
  };

  const handleDeleteScheduleItem = (id: string) => {
    onUpdateRunOfShow(project.runOfShow.filter((i) => i.id !== id));
  };

  const handleAddScheduleItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newScheduleItem.title || !newScheduleItem.startTime) return;

    const item: RunOfShowItem = {
      id: `custom-ros-${Date.now()}`,
      startTime: newScheduleItem.startTime,
      endTime: newScheduleItem.endTime || '',
      title: newScheduleItem.title,
      description: newScheduleItem.description || '',
      responsibleParty: newScheduleItem.responsibleParty || 'Event Team',
      location: newScheduleItem.location || 'Venue',
      completed: false,
    };

    onUpdateRunOfShow([...project.runOfShow, item]);
    setIsAddScheduleModalOpen(false);
    setNewScheduleItem({
      startTime: '17:00',
      endTime: '18:00',
      title: '',
      description: '',
      responsibleParty: 'Event Coordinator',
      location: 'Main Hall',
      completed: false,
    });
  };

  const handleToggleMilestone = (id: string) => {
    const updated = project.milestones.map((m) =>
      m.id === id ? { ...m, completed: !m.completed } : m
    );
    onUpdateMilestones(updated);
  };

  const handleDeleteMilestone = (id: string) => {
    onUpdateMilestones(project.milestones.filter((m) => m.id !== id));
  };

  const handleAddMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMilestone.title) return;

    const task: MilestoneTask = {
      id: `custom-m-${Date.now()}`,
      title: newMilestone.title,
      phase: newMilestone.phase || '1_to_2_months',
      dueDate: newMilestone.dueDate,
      completed: false,
      category: newMilestone.category || 'other',
      priority: newMilestone.priority || 'medium',
      assignedTo: newMilestone.assignedTo,
    };

    onUpdateMilestones([...project.milestones, task]);
    setIsAddMilestoneModalOpen(false);
    setNewMilestone({
      title: '',
      phase: '1_to_2_months',
      dueDate: '',
      category: 'catering',
      priority: 'high',
      assignedTo: 'Lead Organizer',
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Header with Sub-tabs and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        
        {/* Toggle sub-view */}
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700/60 max-w-fit">
          <button
            onClick={() => setActiveTab('runOfShow')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'runOfShow'
                ? 'bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <ListOrdered className="w-3.5 h-3.5" />
            <span>Day-of Run of Show ({project.runOfShow.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('milestones')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'milestones'
                ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Milestone className="w-3.5 h-3.5" />
            <span>Planning Roadmap ({project.milestones.length})</span>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {activeTab === 'runOfShow' && (
            <>
              <Button
                size="sm"
                variant="outline"
                onClick={() => downloadIcsFile(project)}
                icon={<Download className="w-3.5 h-3.5 text-blue-500" />}
              >
                Export .ICS
              </Button>
              <Button
                size="sm"
                variant="primary"
                onClick={() => setIsAddScheduleModalOpen(true)}
                icon={<Plus className="w-3.5 h-3.5" />}
              >
                Add Schedule Item
              </Button>
            </>
          )}

          {activeTab === 'milestones' && (
            <Button
              size="sm"
              variant="primary"
              onClick={() => setIsAddMilestoneModalOpen(true)}
              icon={<Plus className="w-3.5 h-3.5" />}
            >
              Add Milestone Task
            </Button>
          )}
        </div>

      </div>

      {/* AI Schedule Conflict Detection Alert */}
      {conflicts.length > 0 && activeTab === 'runOfShow' && (
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-amber-900 dark:text-amber-200 space-y-2 animate-slide-up">
          <div className="flex items-center gap-2 font-bold text-sm">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>AI Schedule Conflict Detector ({conflicts.length} alert{conflicts.length > 1 ? 's' : ''})</span>
          </div>
          <div className="space-y-1.5 pl-6 text-xs">
            {conflicts.map((c, i) => (
              <p key={i} className="flex items-start gap-1.5">
                <span className="font-semibold">•</span>
                <span>{c.reason}</span>
              </p>
            ))}
          </div>
        </div>
      )}

      {/* TAB 1: Day-of Run-of-Show */}
      {activeTab === 'runOfShow' && (
        <div className="space-y-3">
          {sortedRunOfShow.map((item, index) => (
            <Card
              key={item.id}
              className={`p-4 sm:p-5 transition-all ${
                item.completed
                  ? 'bg-slate-50/60 dark:bg-slate-900/40 opacity-75'
                  : 'hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                
                {/* Time & Title info */}
                <div className="flex items-start gap-3">
                  {/* Status checkbox */}
                  <button
                    onClick={() => handleToggleScheduleItem(item.id)}
                    className="mt-1 shrink-0 p-1 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                    title={item.completed ? 'Mark incomplete' : 'Mark completed'}
                    aria-label={`Toggle completion for ${item.title}`}
                  >
                    <CheckCircle2
                      className={`w-5 h-5 ${
                        item.completed ? 'text-emerald-600 fill-emerald-100 dark:fill-emerald-950' : 'text-slate-300 dark:text-slate-700'
                      }`}
                    />
                  </button>

                  <div className="space-y-1">
                    {/* Time Pill */}
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 font-mono text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 px-2.5 py-0.5 rounded-lg border border-rose-200 dark:border-rose-900/60">
                        <Clock className="w-3 h-3" />
                        {item.startTime} {item.endTime ? `– ${item.endTime}` : ''}
                      </span>
                      <h4
                        className={`text-sm sm:text-base font-bold text-slate-900 dark:text-white ${
                          item.completed ? 'line-through text-slate-400 dark:text-slate-500' : ''
                        }`}
                      >
                        {item.title}
                      </h4>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl">
                      {item.description}
                    </p>

                    {/* Metadata tags: responsible party & location */}
                    <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-slate-500">
                      <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                        <UserCheck className="w-3 h-3 text-purple-500" />
                        <span>{item.responsibleParty}</span>
                      </div>

                      <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                        <MapPin className="w-3 h-3 text-amber-500" />
                        <span>{item.location}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right controls */}
                <div className="flex items-center gap-1 self-end sm:self-start">
                  <button
                    onClick={() => handleDeleteScheduleItem(item.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
                    title="Delete item"
                    aria-label={`Delete ${item.title}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

              </div>
            </Card>
          ))}

          {sortedRunOfShow.length === 0 && (
            <Card className="p-8 text-center text-slate-400 text-xs">
              No schedule items added yet. Click "Add Schedule Item" above.
            </Card>
          )}
        </div>
      )}

      {/* TAB 2: Planning Roadmap (Milestones) */}
      {activeTab === 'milestones' && (
        <div className="space-y-6">
          {PHASE_ORDER.map((phaseKey) => {
            const phaseTasks = project.milestones.filter((m) => m.phase === phaseKey);
            if (phaseTasks.length === 0) return null;

            return (
              <div key={phaseKey} className="space-y-3">
                <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
                  <Calendar className="w-4 h-4 text-rose-500" />
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                    {PHASE_LABELS[phaseKey]} ({phaseTasks.length})
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {phaseTasks.map((task) => (
                    <Card
                      key={task.id}
                      className={`p-4 transition-all ${
                        task.completed ? 'bg-slate-50/60 dark:bg-slate-900/40 opacity-70' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-2.5">
                          <button
                            onClick={() => handleToggleMilestone(task.id)}
                            className="mt-0.5 text-slate-400 hover:text-emerald-600 transition-colors"
                            aria-label={`Toggle ${task.title}`}
                          >
                            <CheckCircle2
                              className={`w-4 h-4 ${
                                task.completed ? 'text-emerald-600 fill-emerald-100' : 'text-slate-300'
                              }`}
                            />
                          </button>
                          <div>
                            <p
                              className={`text-sm font-semibold text-slate-900 dark:text-white ${
                                task.completed ? 'line-through text-slate-400' : ''
                              }`}
                            >
                              {task.title}
                            </p>
                            <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500">
                              {task.dueDate && <span>Due: {task.dueDate}</span>}
                              {task.assignedTo && <span>• {task.assignedTo}</span>}
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => handleDeleteMilestone(task.id)}
                          className="text-slate-400 hover:text-red-600 p-1 rounded"
                          aria-label={`Delete ${task.title}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Run-of-Show Item Modal */}
      <Modal
        isOpen={isAddScheduleModalOpen}
        onClose={() => setIsAddScheduleModalOpen(false)}
        title="Add Run-of-Show Schedule Item"
        description="Insert a timestamped event into the day-of master run-of-show."
        maxWidth="md"
      >
        <form onSubmit={handleAddScheduleItem} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Event Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. First Dance & Welcome Toast, Cake Cutting"
              value={newScheduleItem.title}
              onChange={(e) => setNewScheduleItem({ ...newScheduleItem, title: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Start Time *
              </label>
              <input
                type="time"
                required
                value={newScheduleItem.startTime}
                onChange={(e) => setNewScheduleItem({ ...newScheduleItem, startTime: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none text-slate-900 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                End Time
              </label>
              <input
                type="time"
                value={newScheduleItem.endTime}
                onChange={(e) => setNewScheduleItem({ ...newScheduleItem, endTime: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none text-slate-900 dark:text-slate-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Responsible Party
              </label>
              <input
                type="text"
                placeholder="e.g. Lead DJ, Maid of Honor, Caterer"
                value={newScheduleItem.responsibleParty}
                onChange={(e) => setNewScheduleItem({ ...newScheduleItem, responsibleParty: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Location
              </label>
              <input
                type="text"
                placeholder="e.g. Lawn Altar, Dining Pavilion, Rooftop"
                value={newScheduleItem.location}
                onChange={(e) => setNewScheduleItem({ ...newScheduleItem, location: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Description & Logistics Notes
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Cue acoustic track #4 as doors open; ensure wireless mic is ready."
              value={newScheduleItem.description}
              onChange={(e) => setNewScheduleItem({ ...newScheduleItem, description: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button variant="ghost" size="sm" type="button" onClick={() => setIsAddScheduleModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Add to Schedule
            </Button>
          </div>
        </form>
      </Modal>

      {/* Add Milestone Task Modal */}
      <Modal
        isOpen={isAddMilestoneModalOpen}
        onClose={() => setIsAddMilestoneModalOpen(false)}
        title="Add Planning Milestone"
        description="Schedule a high-level task for your event countdown roadmap."
        maxWidth="md"
      >
        <form onSubmit={handleAddMilestone} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Milestone Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Mail formal invitations, Finalize floral contract"
              value={newMilestone.title}
              onChange={(e) => setNewMilestone({ ...newMilestone, title: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Countdown Phase
              </label>
              <select
                value={newMilestone.phase}
                onChange={(e) => setNewMilestone({ ...newMilestone, phase: e.target.value as any })}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none text-slate-900 dark:text-slate-100"
              >
                {PHASE_ORDER.map((pk) => (
                  <option key={pk} value={pk}>
                    {PHASE_LABELS[pk]}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Target Due Date
              </label>
              <input
                type="date"
                value={newMilestone.dueDate}
                onChange={(e) => setNewMilestone({ ...newMilestone, dueDate: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none text-slate-900 dark:text-slate-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Priority
              </label>
              <select
                value={newMilestone.priority}
                onChange={(e) => setNewMilestone({ ...newMilestone, priority: e.target.value as any })}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none text-slate-900 dark:text-slate-100"
              >
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Assignee
              </label>
              <input
                type="text"
                placeholder="e.g. Elena, Alex, Committee"
                value={newMilestone.assignedTo}
                onChange={(e) => setNewMilestone({ ...newMilestone, assignedTo: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button variant="ghost" size="sm" type="button" onClick={() => setIsAddMilestoneModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Add Milestone
            </Button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
