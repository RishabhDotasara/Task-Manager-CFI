import { Plus, PresentationIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

import { useState } from 'react';

import { UpcomingEvents } from './UpcomingEvents';
import { EventDialog } from './EventDialog';

export function SessionsTab() {
  const [showEventDialog, setShowEventDialog] = useState(false);

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex gap-2 items-center">
            <PresentationIcon className='text-primary'/>
            Sessions</h2>
          <p className="text-muted-foreground">
            Manage your upcoming sessions and events
          </p>
        </div>
        <Button onClick={() => setShowEventDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Event
        </Button>
      </div>

      <UpcomingEvents />
      
      <EventDialog 
        open={showEventDialog} 
        onOpenChange={setShowEventDialog}
      />
    </div>
  );
}