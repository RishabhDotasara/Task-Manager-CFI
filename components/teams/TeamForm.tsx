import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SearchableMultiSelect } from "@/components/ui/searchable-multi-select";
import { Team, User } from "@prisma/client";
import { useEffect } from "react";

const formSchema = z.object({
  teamName: z.string().min(2, {
    message: "Team name must be at least 2 characters.",
  }),
  members: z.array(z.string()).min(1, {
    message: "Please select at least one team member.",
  }),
  leaders: z.array(z.string()),
});

interface TeamFormProps {
  onSubmit: (data: z.infer<typeof formSchema>) => void;
  teamData: Team & { leaders: User[]; members: User[] };
  users: User[];
  disabled: boolean;
}

export function TeamForm({
  onSubmit,
  teamData,
  users,
  disabled,
}: TeamFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      teamName: teamData.name,
      members: teamData.members.map((member: User) => member.userId),
      leaders: teamData.leaders.map((member: User) => member.userId),
    },
  });

  useEffect(() => {
    form.reset({
      teamName: teamData.name,
      members: teamData.members.map((member: User) => member.userId),
      leaders: teamData.leaders.map((member: User) => member.userId),
    });
  }, [teamData]);

  const userOptions = users.map((user) => ({
    value: user.userId,
    label: user.username,
  }));

  const memberOptions = teamData.members.map((user) => ({
    value: user.userId,
    label: user.username,
  }));

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="teamName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Team Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter team name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="members"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Team Members</FormLabel>
              <FormControl>
                <SearchableMultiSelect
                  options={userOptions}
                  value={field.value}
                  onValueChange={(value) => form.setValue("members", value)}
                  placeholder="Select team members"
                  searchPlaceholder="Search users..."
                  emptyText="No user found."
                  disabled={disabled}
                />
              </FormControl>
              <FormDescription>
                You can select multiple team members.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="leaders"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Team Leaders</FormLabel>
              <FormControl>
                <SearchableMultiSelect
                  options={memberOptions}
                  value={field.value}
                  onValueChange={(value) => form.setValue("leaders", value)}
                  placeholder="Select team leaders"
                  searchPlaceholder="Search members..."
                  emptyText="No member found."
                  disabled={disabled}
                />
              </FormControl>
              <FormDescription>
                You can select multiple team leaders.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={disabled}>
          Update Team
          {disabled && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
        </Button>
      </form>
    </Form>
  );
}