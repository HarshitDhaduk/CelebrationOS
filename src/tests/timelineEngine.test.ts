import { describe, it, expect } from 'vitest';
import {
  parseTimeToMinutes,
  formatMinutesToTime,
  detectTimelineConflicts,
  getDaysUntilEvent,
} from '../utils/timelineEngine';
import { RunOfShowItem } from '../types';

describe('Timeline Engine Tests', () => {
  it('correctly parses 24-hr and 12-hr time strings to minutes', () => {
    expect(parseTimeToMinutes('00:00')).toBe(0);
    expect(parseTimeToMinutes('09:30')).toBe(570);
    expect(parseTimeToMinutes('14:15')).toBe(855);
    expect(parseTimeToMinutes('02:15 pm')).toBe(855);
    expect(parseTimeToMinutes('11:00 am')).toBe(660);
  });

  it('formats minutes back to clean HH:MM', () => {
    expect(formatMinutesToTime(0)).toBe('00:00');
    expect(formatMinutesToTime(570)).toBe('09:30');
    expect(formatMinutesToTime(855)).toBe('14:15');
  });

  it('detects double-booking conflict for the same responsible party', () => {
    const overlappingItems: RunOfShowItem[] = [
      {
        id: '1',
        startTime: '16:00',
        endTime: '17:00',
        title: 'Ceremony Officiating',
        description: '',
        responsibleParty: 'Lead Officiant',
        location: 'Altar',
        completed: false,
      },
      {
        id: '2',
        startTime: '16:30',
        endTime: '17:30',
        title: 'Sign Marriage License',
        description: '',
        responsibleParty: 'Lead Officiant',
        location: 'Office',
        completed: false,
      },
    ];

    const conflicts = detectTimelineConflicts(overlappingItems);
    expect(conflicts.length).toBeGreaterThan(0);
    expect(conflicts[0].reason).toContain('Double-booking conflict');
  });

  it('detects invalid negative duration where end time is before start time', () => {
    const invalidItems: RunOfShowItem[] = [
      {
        id: '1',
        startTime: '18:00',
        endTime: '17:00',
        title: 'Impossible Event',
        description: '',
        responsibleParty: 'Anyone',
        location: 'Stage',
        completed: false,
      },
    ];

    const conflicts = detectTimelineConflicts(invalidItems);
    expect(conflicts.length).toBe(1);
    expect(conflicts[0].severity).toBe('error');
  });

  it('calculates countdown days to event', () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 10);
    const dateStr = futureDate.toISOString().split('T')[0];

    const countdown = getDaysUntilEvent(dateStr);
    expect(countdown.days).toBe(10);
    expect(countdown.isPast).toBe(false);
  });
});
