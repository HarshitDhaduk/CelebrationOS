import { describe, it, expect } from 'vitest';
import { generateIcsCalendar } from '../services/calendarExport';
import { weddingPreset } from '../data/defaultPresets';

describe('Calendar Export Suite (RFC 5545 iCalendar)', () => {
  it('generates a valid iCalendar header and footer', () => {
    const ics = generateIcsCalendar(weddingPreset);
    expect(ics).toContain('BEGIN:VCALENDAR');
    expect(ics).toContain('VERSION:2.0');
    expect(ics).toContain('PRODID:-//CelebrationOS//Event Planner Copilot//EN');
    expect(ics).toContain('END:VCALENDAR');
  });

  it('generates VEVENT blocks for each run of show item', () => {
    const ics = generateIcsCalendar(weddingPreset);
    const veventCount = (ics.match(/BEGIN:VEVENT/g) || []).length;
    expect(veventCount).toBe(weddingPreset.runOfShow.length);
    expect(veventCount).toBeGreaterThan(0);
  });

  it('includes proper summary, date timestamps, location, and description', () => {
    const ics = generateIcsCalendar(weddingPreset);
    const firstItem = weddingPreset.runOfShow[0];

    expect(ics).toContain(`SUMMARY:${firstItem.startTime} - ${firstItem.title}`);
    expect(ics).toContain('STATUS:CONFIRMED');
    expect(ics).toContain('DTSTART:');
    expect(ics).toContain('DTEND:');
    expect(ics).toContain('LOCATION:');
  });

  it('handles default end time calculation if endTime is omitted', () => {
    const customProject = {
      ...weddingPreset,
      runOfShow: [
        {
          id: 'test-1',
          startTime: '10:00',
          title: 'Morning Setup',
          description: 'No explicit end time',
          responsibleParty: 'Crew',
          location: 'Hall',
          completed: false,
        },
      ],
    };

    const ics = generateIcsCalendar(customProject);
    expect(ics).toContain('SUMMARY:10:00 - Morning Setup');
    // Default 45 minutes -> 104500
    expect(ics).toContain('T104500');
  });
});
