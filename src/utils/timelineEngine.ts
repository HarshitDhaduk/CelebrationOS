import { RunOfShowItem, MilestoneTask } from '../types';

export interface TimelineConflict {
  itemA: RunOfShowItem;
  itemB: RunOfShowItem;
  reason: string;
  severity: 'warning' | 'error';
}

export function parseTimeToMinutes(timeStr: string): number {
  if (!timeStr) return 0;
  const clean = timeStr.trim().toLowerCase();
  
  // Check 12-hour format with am/pm (e.g. "04:30 pm")
  const isPm = clean.includes('pm');
  const isAm = clean.includes('am');
  const numericPart = clean.replace(/[a-z\s]/g, '');
  const [hoursStr, minsStr] = numericPart.split(':');
  
  let hours = parseInt(hoursStr, 10) || 0;
  const mins = parseInt(minsStr, 10) || 0;

  if (isPm && hours < 12) hours += 12;
  if (isAm && hours === 12) hours = 0;

  return hours * 60 + mins;
}

export function formatMinutesToTime(minutes: number): string {
  const normalized = ((minutes % 1440) + 1440) % 1440;
  const h = Math.floor(normalized / 60);
  const m = normalized % 60;
  const hh = h.toString().padStart(2, '0');
  const mm = m.toString().padStart(2, '0');
  return `${hh}:${mm}`;
}

export function detectTimelineConflicts(items: RunOfShowItem[]): TimelineConflict[] {
  const conflicts: TimelineConflict[] = [];

  for (let i = 0; i < items.length; i++) {
    const itemA = items[i];
    const startA = parseTimeToMinutes(itemA.startTime);
    const endA = itemA.endTime ? parseTimeToMinutes(itemA.endTime) : startA + 30;

    // Check invalid start/end on single item
    if (itemA.endTime && endA <= startA) {
      conflicts.push({
        itemA,
        itemB: itemA,
        reason: `End time (${itemA.endTime}) is earlier than or equal to start time (${itemA.startTime}).`,
        severity: 'error'
      });
    }

    for (let j = i + 1; j < items.length; j++) {
      const itemB = items[j];
      const startB = parseTimeToMinutes(itemB.startTime);
      const endB = itemB.endTime ? parseTimeToMinutes(itemB.endTime) : startB + 30;

      // Check overlap: startA < endB && startB < endA
      const overlaps = startA < endB && startB < endA;
      if (overlaps) {
        // If same responsible party
        if (
          itemA.responsibleParty &&
          itemB.responsibleParty &&
          itemA.responsibleParty.toLowerCase().trim() === itemB.responsibleParty.toLowerCase().trim()
        ) {
          conflicts.push({
            itemA,
            itemB,
            reason: `Double-booking conflict: "${itemA.responsibleParty}" is scheduled for both "${itemA.title}" and "${itemB.title}" simultaneously.`,
            severity: 'error'
          });
        } 
        // If same specific location (excluding whole grounds)
        else if (
          itemA.location &&
          itemB.location &&
          itemA.location.toLowerCase().trim() === itemB.location.toLowerCase().trim() &&
          !itemA.location.toLowerCase().includes('entire') &&
          !itemA.location.toLowerCase().includes('grounds')
        ) {
          conflicts.push({
            itemA,
            itemB,
            reason: `Location overlap: Both "${itemA.title}" and "${itemB.title}" share location "${itemA.location}" during overlapping hours.`,
            severity: 'warning'
          });
        }
      }
    }
  }

  return conflicts;
}

export function getDaysUntilEvent(eventDateStr: string): { days: number; label: string; isPast: boolean } {
  if (!eventDateStr) return { days: 0, label: 'Date not set', isPast: false };

  const targetDate = new Date(eventDateStr);
  const now = new Date();
  
  // Reset hours to compare calendar days
  targetDate.setHours(0, 0, 0, 0);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const diffMs = targetDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return { days: 0, label: 'Today is Event Day! 🎉', isPast: false };
  } else if (diffDays === 1) {
    return { days: 1, label: 'Tomorrow! 🚀', isPast: false };
  } else if (diffDays > 1) {
    return { days: diffDays, label: `${diffDays} days to go`, isPast: false };
  } else {
    return { days: Math.abs(diffDays), label: `${Math.abs(diffDays)} days ago`, isPast: true };
  }
}

export const PHASE_LABELS: Record<MilestoneTask['phase'], string> = {
  '6_plus_months': '6+ Months Out',
  '3_to_6_months': '3 to 6 Months Out',
  '1_to_2_months': '1 to 2 Months Out',
  '2_to_4_weeks': '2 to 4 Weeks Out',
  'final_week': 'Final Week Prep',
  'day_of': 'Day-Of Execution',
  'post_event': 'Post-Event Wrap Up'
};

export const PHASE_ORDER: MilestoneTask['phase'][] = [
  '6_plus_months',
  '3_to_6_months',
  '1_to_2_months',
  '2_to_4_weeks',
  'final_week',
  'day_of',
  'post_event'
];
