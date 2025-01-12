"use client";

import { AlertCircle, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";

export default function NotLoggedInMessage() {
    const router = useRouter();
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div>
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-center flex items-center justify-center space-x-2">
              <AlertCircle className="w-6 h-6 text-warning" />
              <span>Access Denied</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground">
              You are not logged in. Please sign in to access this resource.
            </p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button className="w-full" onClick={()=>{router.push("/auth/signin")}}>
              <LogIn className="w-4 h-4 mr-2" />
              Sign In
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
