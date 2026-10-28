import { EventProject, RunOfShowItem } from '../types';

function formatIcsDate(dateStr: string, timeStr: string): string {
  // dateStr is YYYY-MM-DD
  // timeStr is HH:MM (24-hr)
  const [year, month, day] = dateStr.split('-').map(Number);
  const [hours, mins] = timeStr.split(':').map(Number);
  
  const d = new Date(year, month - 1, day, hours || 0, mins || 0);
  const pad = (n: number) => n.toString().padStart(2, '0');

  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;
}

export function generateIcsCalendar(project: EventProject): string {
  const { event, runOfShow } = project;
  const eventDate = event.date || new Date().toISOString().split('T')[0];

  let icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//CelebrationOS//Event Planner Copilot//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${event.title} - Run of Show`,
    'X-WR-TIMEZONE:UTC',
  ];

  runOfShow.forEach((item: RunOfShowItem, idx: number) => {
    const startTimeStr = item.startTime || '09:00';
    let endTimeStr = item.endTime;
    if (!endTimeStr) {
      // Default 45 minutes later
      const [h, m] = startTimeStr.split(':').map(Number);
      const totalM = (h * 60 + m + 45) % 1440;
      endTimeStr = `${Math.floor(totalM / 60).toString().padStart(2, '0')}:${(totalM % 60).toString().padStart(2, '0')}`;
    }

    const dtStart = formatIcsDate(eventDate, startTimeStr);
    const dtEnd = formatIcsDate(eventDate, endTimeStr);
    const summary = `${item.startTime} - ${item.title}`;
    const description = `${item.description}\\n\\nResponsible: ${item.responsibleParty || 'Event Team'}\\nLocation: ${item.location || event.location}`;
    const location = item.location ? `${item.location}, ${event.location}` : event.location;

    icsContent.push(
      'BEGIN:VEVENT',
      `UID:celebrationos-${event.id}-${item.id || idx}@celebrationos.app`,
      `DTSTAMP:${formatIcsDate(new Date().toISOString().split('T')[0], '12:00')}`,
      `DTSTART:${dtStart}`,
      `DTEND:${dtEnd}`,
      `SUMMARY:${summary}`,
      `DESCRIPTION:${description}`,
      `LOCATION:${location}`,
      'STATUS:CONFIRMED',
      'END:VEVENT'
    );
  });

  icsContent.push('END:VCALENDAR');
  return icsContent.join('\r\n');
}

export function downloadIcsFile(project: EventProject): void {
  const ics = generateIcsCalendar(project);
  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${project.event.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_run_of_show.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
