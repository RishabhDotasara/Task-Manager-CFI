"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { SignUpFormValues, signUpSchema } from "@/types/signUpTypes";
import { signIn } from "next-auth/react";

export const description =
  "A signup page with two columns. The first column has the signup form with employee ID, username, email, and password. There's a link to sign in if you already have an account. The second column has a cover image.";

export default function SignUp() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      employeeId: "",
      username: "",
      email: "",
      password: "",
      permissions: [],
    },
  });

  const createUser = async (values: SignUpFormValues) => {
    try {
      setLoading(true);
      const response = await fetch("/api/signup", {
        method: "POST",
        body: JSON.stringify(values),
      });

      if (response.status === 200) {
        setLoading(false);
        toast({
          title: "User Created!",
          description: "Logging you In!",
        });
        await signIn("credentials", {
          redirect: false,
          employeeId: values.employeeId,
          password: values.password,
        });
        router.push("/task-manager");
      } else if (response.status === 400) {
        toast({
          title: "User with this EmployeeId Already Exists!",
          description: "Try Again.",
        });
        setLoading(false);
      } else {
        toast({
          title: "Error Creating User!",
          description: "Try Again.",
        });
        setLoading(false);
      }
    } catch (err) {
      setLoading(false);
      console.log("Error in server!");
    }
  };

  return (
    <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Signup</h1>
          </div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(createUser)}
              className="grid gap-4"
            >
              <FormField
                control={form.control}
                name="employeeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Employee ID</FormLabel>
                    <FormControl>
                      <Input placeholder="AE23B039" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="you@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="********"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={loading}>
                SignUp
                {loading && <Loader className="animate-spin ml-2" />}
              </Button>
            </form>
          </Form>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href="/auth/signin" className="underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
      <div className="hidden bg-muted lg:block relative max-w-full h-full">
        <Image
          src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1352&q=80"
          alt="Cover image"
          fill
          className="object-cover"
        />
      </div>
    </div>
  );
}
