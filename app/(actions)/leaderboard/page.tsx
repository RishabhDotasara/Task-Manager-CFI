"use client";


export const dynamic = "force-dynamic"; 

import { Progress } from "@/components/ui/progress"; // Assuming you have a ShadCN progress component
import { useToast } from "@/hooks/use-toast";
import { Task, User } from "@prisma/client";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";

const CardCompo = ({
  empId,
  Tasks,
 
}: {
  empId: string;
  Tasks: Task[];
 
}) => {
  const totalTasks = Tasks.length;
    const completedTasks = Tasks.filter((task)=>task.status=="COMPLETED").length;

  const percentage = totalTasks > 0 ? Math.floor(
    completedTasks * 100 / totalTasks
  ) : 0;
  return (
    <div className="flex  justify-between rounded-lg border p-4">
      <div className="w-full">
        <div className="font-medium">{empId.toUpperCase()}</div>
        <div className="flex gap-4">
          <div className="text-sm text-muted-foreground">
            Total Tasks: {totalTasks}
          </div>
          <div className="text-sm text-muted-foreground">
            Completed Tasks: {completedTasks}
          </div>
        </div>
        <div className="flex gap-4 w-full">
          <Progress value={percentage} className="mt-2" />
          <div className="font-medium">{percentage}%</div>
        </div>
        {/* Progress bar with 83% completion */}
      </div>
    </div>
  );
};

export default function Home()
{
  return <h1>Leaderboard page.</h1>
}

function LeaderBoard() {
    const [users, setUsers] = useState<User[]>();
    const [loading, setLoading] = useState(false);
   
    const { toast } = useToast();
  
    const getUsers = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/users/getAll");
        if (response.ok) {
          const data = await response.json();
          
          const sortedUsers = data.users.sort((u1: User, u2: User) => {
            const t1Completed = u1.tasks.filter(
              (task: Task) => task.status === "COMPLETED"
            ).length;
            const t2Completed = u2.tasks.filter(
              (task: Task) => task.status === "COMPLETED"
            ).length;
            
            return t2Completed - t1Completed;
          });
          setUsers(sortedUsers.slice(0,5));
        }
        setLoading(false);
      } catch (err) {
        setLoading(false);
        console.log(err)
        toast({
          title: "Error fetching Leaderboard, Please Refresh The Page.",
        });
      }
    };
  
    useEffect(() => {
      getUsers();
    }, []);
  
    if (loading) {
      return <Loader className="animate-spin"></Loader>;
    }
  
    return (
      <main className="max-w-3xl mx-auto py-8 h-full w-full px-4 sm:py-12 sm:px-6 lg:py-16 lg:px-8 ">
        <div className="mb-4">
          <h2 className="font-bold text-2xl">Leaderboard</h2>
        </div>
        <div className="gap-4 w-full h-full flex flex-col justify-start ">
          {users &&
            users.map((user: User) => {
              return (
                <CardCompo
                  key={user.employeeId} // Add a unique key for each element
                  empId={user.employeeId}
                  Tasks={user.tasks}
                />
              );
            })}
        </div>
      </main>
    );
  }
  