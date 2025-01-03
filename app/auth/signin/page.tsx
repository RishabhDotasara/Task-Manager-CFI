"use client"

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { signIn, useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader } from 'lucide-react'

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { LoginFormValues, loginSchema } from "@/types/signInTypes"


export default function Login() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const session = useSession()

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      employeeId: "",
      password: "",
    },
  })

  const handleSignIn = async (values: LoginFormValues) => {
    try {
      setLoading(true)
      const result = await signIn("credentials", {
        redirect: false,
        employeeId: values.employeeId,
        password: values.password,
      })

      if (result?.error) {
        setLoading(false)
        console.error("Error:", result.error)
        toast({
          title: "Incorrect Credentials or Slow Internet!",
          description: "Try Again!",
          variant: "destructive",
        })
      } else if (!result) {
        toast({
          title: "Incorrect Credentials or Slow Internet!",
          description: "Try Again!",
          variant: "destructive",
        })
      } else {
        console.log("Successfully signed in!")
        toast({
          title: "Successfully signed in!",
          description: "Loading Task Manager!",
        })
        setLoading(false)
        router.push("/task-manager")
      }
    } catch (error) {
      console.error("Sign-in error", error)
      toast({
        title: "Error Signing in!",
        description: "Try Again!",
      })
    }
  }


  useEffect(()=>{
    if (session.status === "authenticated") {
      router.push("/task-manager");
    }
  })

  return (
    <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Login</h1>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSignIn)} className="grid gap-4">
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
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center">
                      <FormLabel>Password</FormLabel>
                      <Link
                        href="/forgot-password"
                        className="ml-auto inline-block text-sm underline"
                      >
                        Forgot your password?
                      </Link>
                    </div>
                    <FormControl>
                      <Input type="password" placeholder="Password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={loading}>
                Login
                {loading && <Loader className="ml-2 animate-spin" />}
              </Button>
            </form>
          </Form>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/auth/signup" className="underline">
              Sign up
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
  )
}

