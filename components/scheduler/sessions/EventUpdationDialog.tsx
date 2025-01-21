import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { EventForm } from './EventForm';
import { EventUpdationForm } from './EventUpdationForm';
import { Session } from '@prisma/client';
import { ScrollArea } from '@/components/ui/scroll-area';


interface EventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event:Session
}

export function EventUpdationDialog({ open, onOpenChange, event}: EventDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
     
      <DialogContent className="md:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{"Update Event"}</DialogTitle>
        </DialogHeader>
        <EventUpdationForm event={event} onSuccess={()=>{onOpenChange(false)}}/>
      </DialogContent>
      
    </Dialog>
  );
}