import { Attendee, Event } from '@/types/event';

export const mockAttendees: Attendee[] = [
  { id: '1', name: 'John Doe', email: 'john@example.com' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
  { id: '3', name: 'Mike Johnson', email: 'mike@example.com' },
  { id: '4', name: 'Sarah Williams', email: 'sarah@example.com' },
];

export const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Weekly Team Sync',
    description: 'Regular team sync to discuss progress and blockers',
    date: new Date(Date.now() + 86400000), // Tomorrow
    startTime: '10:00',
    endTime: '11:00',
    eventType: 'online',
    attendees: mockAttendees.slice(0, 3),
  },
  {
    id: '2',
    title: 'Product Review',
    description: 'Monthly product review meeting',
    date: new Date(Date.now() + 172800000), // Day after tomorrow
    startTime: '14:00',
    endTime: '15:30',
    eventType: 'inPerson',
    location: 'Conference Room A',
    attendees: mockAttendees,
  },
];