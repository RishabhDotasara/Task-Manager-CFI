import * as z from 'zod';
import { EventType } from '@prisma/client';

export const eventFormSchema = z.object({
  title: z.string().min(2, {
    message: 'Title must be at least 2 characters.',
  }),
  description: z.string().optional(),
  date: z.date({
    required_error: 'A date is required.',
  }),
  startTime: z.string({
    required_error: 'Start time is required.',
  }),
  endTime: z.string({
    required_error: 'End time is required.',
  }),
  eventType: z.enum([EventType.INPERSON, EventType.ONLINE]),
  location: z.string().optional(),
});