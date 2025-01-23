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
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { useRecoilValue } from 'recoil';
import { teamAtom } from '@/states/teamAtom';
import { EventType } from '@prisma/client';
import { useSession } from 'next-auth/react';

interface EventFormProps {
  onSuccess?: () => void;
}

export function EventForm({ onSuccess }: EventFormProps) {
  const form = useForm<z.infer<typeof eventFormSchema>>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: '',
      description: '',
      eventType: EventType.INPERSON,
      location: 'Video Conferencing',
      date: undefined, // Remove default date to ensure proper initialization
    },
  });
  const currentTeamId = useRecoilValue(teamAtom)

  const watchEventType = form.watch('eventType');
  const {toast} = useToast()
  const session = useSession()
  const queryClient = useQueryClient()

  const createSessionMutation = useMutation({
    mutationKey: ['create', 'session'],
    mutationFn: async (data: z.infer<typeof eventFormSchema>) => {
      const response = await fetch('/api/session/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Failed to create session');
      }
      return response.json();
    },
    onError: ()=>{
      toast({
        title:"Error Creating Session",
        description:" Please Try Again!",
        variant:"destructive"
      })
    },
    onSuccess: ()=>{
      toast({
        title:"Session Created Successfully!",
        variant:"default"
      })
      queryClient.invalidateQueries({queryKey:["sessions", `teamId:${currentTeamId}`]})
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
    await createSessionMutation.mutate({...data, teamId:currentTeamId, creatorId:session.data?.userId})
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
                <Textarea placeholder="Add event description..." {...field} maxLength={100}/>
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

        <Button type="submit" className="w-full" disabled={createSessionMutation.isPending}>
          Create Event {createSessionMutation.isPending && <Loader2 className='animate-spin h-4 w-4'/>}
        </Button>
      </form>
    </Form>
  );
}