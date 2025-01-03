import * as z from "zod"

export const signUpSchema = z.object({
  employeeId: z.string().min(1, "Employee ID is required"),
  username: z.string().min(1, "Username is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  permissions: z.array(z.string())
})

export type SignUpFormValues = z.infer<typeof signUpSchema>

