import { describe, it, expect } from 'vitest';
import {
  parseTimeToMinutes,
  formatMinutesToTime,
  detectTimelineConflicts,
  getDaysUntilEvent,
  PHASE_LABELS,
  PHASE_ORDER,
} from '../utils/timelineEngine';
import { RunOfShowItem } from '../types';

describe('Timeline Engine Tests', () => {
  it('correctly parses 24-hr and 12-hr time strings to minutes', () => {
    expect(parseTimeToMinutes('00:00')).toBe(0);
    expect(parseTimeToMinutes('09:30')).toBe(570);
    expect(parseTimeToMinutes('14:15')).toBe(855);
    expect(parseTimeToMinutes('02:15 pm')).toBe(855);
    expect(parseTimeToMinutes('11:00 am')).toBe(660);
    expect(parseTimeToMinutes('12:00 pm')).toBe(720);
    expect(parseTimeToMinutes('12:00 am')).toBe(0);
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

  it('detects location overlap conflict at the same venue zone', () => {
    const locationConflictItems: RunOfShowItem[] = [
      {
        id: '1',
        startTime: '18:00',
        endTime: '19:00',
        title: 'Band Soundcheck',
        description: '',
        responsibleParty: 'Audio Crew',
        location: 'Main Ballroom Stage',
        completed: false,
      },
      {
        id: '2',
        startTime: '18:30',
        endTime: '19:30',
        title: 'VIP Cocktail Greeting',
        description: '',
        responsibleParty: 'Host Committee',
        location: 'Main Ballroom Stage',
        completed: false,
      },
    ];

    const conflicts = detectTimelineConflicts(locationConflictItems);
    expect(conflicts.some((c) => c.reason.includes('Location overlap'))).toBe(true);
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

  it('returns empty conflicts array for clean, non-overlapping schedules or empty lists', () => {
    expect(detectTimelineConflicts([])).toEqual([]);

    const cleanItems: RunOfShowItem[] = [
      {
        id: '1',
        startTime: '10:00',
        endTime: '11:00',
        title: 'Welcome',
        description: '',
        responsibleParty: 'Host',
        location: 'Foyer',
        completed: false,
      },
      {
        id: '2',
        startTime: '11:00',
        endTime: '12:00',
        title: 'Keynote',
        description: '',
        responsibleParty: 'Speaker',
        location: 'Auditorium',
        completed: false,
      },
    ];

    expect(detectTimelineConflicts(cleanItems)).toEqual([]);
  });

  it('calculates countdown days to event and handles past dates', () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 10);
    const dateStr = futureDate.toISOString().split('T')[0];

    const countdown = getDaysUntilEvent(dateStr);
    expect(countdown.days).toBe(10);
    expect(countdown.isPast).toBe(false);

    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 5);
    const pastStr = pastDate.toISOString().split('T')[0];

    const pastCountdown = getDaysUntilEvent(pastStr);
    expect(pastCountdown.isPast).toBe(true);
    expect(pastCountdown.label).toContain('ago');
  });

  it('has consistent phase orders and phase labels', () => {
    expect(PHASE_ORDER.length).toBe(7);
    PHASE_ORDER.forEach((phase) => {
      expect(PHASE_LABELS[phase]).toBeDefined();
      expect(PHASE_LABELS[phase].length).toBeGreaterThan(0);
    });
  });
});
