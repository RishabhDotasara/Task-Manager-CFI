'use client'

import { useState } from 'react'
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Task, User } from '@prisma/client'
import { useSession } from 'next-auth/react'
import { Loader2, X } from 'lucide-react'
import { useRecoilValue } from 'recoil'
import { teamAtom } from '@/states/teamAtom'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { taskFormSchema, TaskFormValues } from '@/lib/schemas/add-task-form-schema'
import { useQueryClient } from '@tanstack/react-query'

interface TaskDialogProps {
  trigger: React.ReactNode
  triggerFunc: () => void
  tasks: Task[]
  allUsers: User[]
}

export default function TaskDialog({ trigger, triggerFunc, tasks, allUsers }: TaskDialogProps) {
  const [open, setOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const { toast } = useToast()
  const session = useSession()
  const teamId = useRecoilValue(teamAtom)
  const currentTeamId = useRecoilValue(teamAtom)
  const router = useRouter()

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: "",
      description: "",
      dueDate: "",
      assignees: [],
    },
  })
  const queryClient = useQueryClient()

  const onSubmit = async (values: TaskFormValues) => {
    try {
      setIsCreating(true)
      if (!currentTeamId)
      {
        toast({
          title:"Select a Team!",
          description:"Please select a team to create a task",
          variant:"destructive"
        })
        return;
      }

      const body: Omit<Task, "taskId" | "assigneeId"> & { assigneeIds: string[] } = {
        title: values.title,
        description: values.description || "",
        createdById: session.data?.userId as string,
        assigneeIds: values.assignees,
        deadline: new Date(values.dueDate),
        status: 'PENDING',
        teamId: teamId
      }

      const response = await fetch("/api/task/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        throw new Error('Failed to create task')
      }

      const data = await response.json()
      
      toast({
        title: "Task Created Successfully!",
      })

      queryClient.invalidateQueries({queryKey:["tasks", currentTeamId]})
      
      triggerFunc()
      setOpen(false)
      form.reset()
    } catch (err: any) {
      toast({
        title: 'Error creating task',
        description: err.message,
        variant: 'destructive',
      })
    } finally {
      setIsCreating(false)
    }
  }

  const handleAssigneeChange = (userId: string) => {
    const currentAssignees = form.getValues("assignees")
    const newAssignees = currentAssignees.includes(userId)
      ? currentAssignees.filter((id:any) => id !== userId)
      : [...currentAssignees, userId]
    form.setValue("assignees", newAssignees)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="w-[95vw] max-w-[425px] bg-background text-foreground sm:w-full">
        <DialogHeader>
          <DialogTitle>Add New Task</DialogTitle>
          <DialogDescription>
            Fill in the details for the new task. Click add when you're done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Due Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="assignees"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assignees</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      handleAssigneeChange(value)
                      // Prevent the Select from closing
                      const event = new Event('keydown', { bubbles: true })
                      Object.defineProperty(event, 'keyCode', { get: () => 32 })
                      document.dispatchEvent(event)
                    }}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select assignees" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-background">
                      {allUsers.map((user) => (
                        <SelectItem
                          key={user.userId}
                          value={user.userId}
                          className={field.value.includes(user.userId) ? "bg-secondary" : ""}
                        >
                          {user.username} | {user.employeeId}
                        </SelectItem>
                      ))}
                      {!currentTeamId && <SelectItem value="unique">Select a team to assign tasks</SelectItem>}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.watch("assignees").length > 0 && (
              <div className="flex flex-wrap gap-2">
                {form.watch("assignees").map((userId:string) => {
                  const user = allUsers.find(u => u.userId === userId)
                  return (
                    <div
                      key={userId}
                      className="bg-secondary text-secondary-foreground rounded-full px-3 py-1 text-sm flex items-center"
                    >
                      <span className="truncate max-w-[150px]">
                        {user ? `${user.username} | ${user.employeeId}` : userId}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="ml-2 h-4 w-4 p-0"
                        onClick={() => handleAssigneeChange(userId)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  )
                })}
              </div>
            )}

            <DialogFooter>
              <Button type="submit" disabled={isCreating}>
                Add Task
                {isCreating && <Loader2 className="animate-spin ml-2" />}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}