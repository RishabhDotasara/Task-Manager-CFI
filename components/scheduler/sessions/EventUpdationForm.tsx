'use client'

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CalendarIcon, Loader2, MapPinIcon, VideoIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { z } from 'zod';
import { eventFormSchema } from '@/lib/validations';
import { useMutation } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { useRecoilValue } from 'recoil';
import { teamAtom } from '@/states/teamAtom';
import { EventType, Session } from '@prisma/client';
import { useSession } from 'next-auth/react';

interface EventFormProps {
  onSuccess?: () => void;
  event:Session
}

export function EventUpdationForm({ onSuccess, event }: EventFormProps) {
  const form = useForm<z.infer<typeof eventFormSchema>>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: event.title,
      description: event.description,
      eventType: event.eventType,
      location: event.location,
      date: new Date(event.date), // Remove default date to ensure proper initialization
      startTime:event.startTime,
      endTime:event.endTime
    },
  });
  const currentTeamId = useRecoilValue(teamAtom)

  const watchEventType = form.watch('eventType');
  const {toast} = useToast()
  const session = useSession()

  const updateSessionMutation = useMutation({
    mutationKey: ['update', 'sessionId:'+event.sessionId],
    mutationFn: async (data: z.infer<typeof eventFormSchema>) => {
      const response = await fetch(`/api/session/update?sessionId=${event.sessionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({...data, creatorId:session.data?.userId}),
      });
      if (!response.ok) {
        throw new Error('Failed to update session');
      }
      return response.json();
    },
    onError: ()=>{
      toast({
        title:"Error Updating Session",
        description:" Please Try Again!",
        variant:"destructive"
      })
    },
    onSuccess: ()=>{
      toast({
        title:"Session Updated Successfully!",
        description:"Refresh to see changes.",
        variant:"default"
      })
      if (onSuccess) onSuccess()
    }
  });

  const onSubmit = async (data:any)=>{
    if (!currentTeamId)
    {
      toast({
        title:"Select a Team",
        variant:"destructive"
      })
      return;
    }
    await updateSessionMutation.mutate({...data, teamId:currentTeamId, creatorId:session.data?.userId})
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Title</FormLabel>
              <FormControl>
                <Input placeholder="Team Meeting" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Add event description..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-6 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col justify-between">
                <FormLabel>Date</FormLabel>
                
                <Input
                  type="date"
                  value={field.value ? format(field.value, 'yyyy-MM-dd') : ''}
                  onChange={(e) => {
                    field.onChange(e.target.value ? new Date(e.target.value) : undefined);
                  }}
                  onBlur={field.onBlur}
                  name={field.name}
                  ref={field.ref}
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="eventType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Event Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select event type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={EventType.ONLINE}>
                      <div className="flex items-center">
                        <VideoIcon className="mr-2 h-4 w-4" />
                        Online Meeting
                      </div>
                    </SelectItem>
                    <SelectItem value={EventType.INPERSON}>
                      <div className="flex items-center">
                        <MapPinIcon className="mr-2 h-4 w-4" />
                        In-Person Meeting
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="startTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Time</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Time</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {watchEventType === EventType.INPERSON && (
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input placeholder="Enter meeting location" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <Button type="submit" className="w-full" disabled={updateSessionMutation.isPending}>
          Update Details {updateSessionMutation.isPending && <Loader2 className='animate-spin h-4 w-4'/>}
        </Button>
      </form>
    </Form>
  );
}