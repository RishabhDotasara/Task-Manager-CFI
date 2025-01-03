import * as z from "zod"

export const taskFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  dueDate: z.string().refine((date) => {
    const selectedDate = new Date(date)
    const currentDate = new Date()
    currentDate.setHours(0, 0, 0, 0)
    return selectedDate > currentDate
  }, "Due date must be in the future"),
  assignees: z.array(z.string()).min(1, "At least one assignee is required"),
})

export type TaskFormValues = z.infer<typeof taskFormSchema>