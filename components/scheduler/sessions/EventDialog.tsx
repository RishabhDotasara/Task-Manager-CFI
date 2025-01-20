import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { EventForm } from './EventForm';


interface EventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EventDialog({ open, onOpenChange }: EventDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Event</DialogTitle>
        </DialogHeader>
        <EventForm onSuccess={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}