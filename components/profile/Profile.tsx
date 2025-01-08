import { UserCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Label } from "../ui/label";
import { Skeleton } from "../ui/skeleton";

export default function ProfileView({username="John Doe", employeeId="XXXXXXX", email="ae23b039@smail.iitm.ac.in"}:{username:string, employeeId:string, email:string}) {
    return (
      <div className="bg-gradient-to-b w-full p-4 md:p-8">
        <div className="max-w-2xl mx-auto">
          <Card className="backdrop-blur-sm bg-white/90 dark:bg-neutral-900/90 shadow-xl">
            <CardHeader className="space-y-4">
              <div className="w-24 h-24 mx-auto bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center">
                <UserCircle className="w-16 h-16 text-neutral-500" />
              </div>
              <div className="text-center space-y-2">
                <CardTitle className="text-2xl font-bold">Profile Information</CardTitle>
                <CardDescription>Your account details</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-1">
                <Label className="text-sm text-muted-foreground">Username</Label>
                <p className="text-lg font-medium">{username}</p>
              </div>
              <div className="space-y-1">
                <Label className="text-sm text-muted-foreground">Employee ID</Label>
                <p className="text-lg font-medium ">{employeeId.toUpperCase()}</p>
              </div>
              <div className="space-y-1">
                <Label className="text-sm text-muted-foreground">Email</Label>
                <p className="text-lg font-medium ">{email}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  