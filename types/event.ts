export interface Attendee {
    id: string;
    name: string;
    email: string;
  }
  
  export interface Event {
    id: string;
    title: string;
    description?: string;
    date: Date;
    startTime: string;
    endTime: string;
    eventType: 'online' | 'inPerson';
    location?: string;
    attendees: Attendee[];
  }