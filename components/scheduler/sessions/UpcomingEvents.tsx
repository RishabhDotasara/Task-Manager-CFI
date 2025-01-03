import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { mockEvents } from '@/mockData/data';

import { Event } from '@/types/event';
import { format } from 'date-fns';
import { CalendarIcon, MapPinIcon, Users2, VideoIcon } from 'lucide-react';

function EventCard({ event }: { event: Event }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{event.title}</CardTitle>
        <CardDescription>{event.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center text-sm">
          <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
          {format(event.date, 'PPP')} at {event.startTime} - {event.endTime}
        </div>
        <div className="flex items-center text-sm">
          {event.eventType === 'online' ? (
            <VideoIcon className="mr-2 h-4 w-4 text-primary" />
          ) : (
            <MapPinIcon className="mr-2 h-4 w-4 text-primary" />
          )}
          {event.eventType === 'online' ? 'Online Meeting' : event.location || 'In-Person Meeting'}
        </div>
        
      </CardContent>
    </Card>
  );
}

export function UpcomingEvents() {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">Upcoming Events</h3>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {mockEvents.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
}