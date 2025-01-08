import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";

export default function PasswordReset() {
    return (
      <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800 p-4 md:p-8">
        <div className="max-w-md mx-auto">
          <Card className="backdrop-blur-sm bg-white/90 dark:bg-neutral-900/90 shadow-xl">
            <CardHeader className="space-y-2">
              <CardTitle className="text-2xl font-bold text-center">Reset Password</CardTitle>
              <CardDescription className="text-center">
                Enter the OTP sent to your email to reset your password
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-center gap-2">
                {[...Array(6)].map((_, i) => (
                  <input
                    key={i}
                    type="text"
                    maxLength={1}
                    className="w-12 h-12 text-center text-lg font-bold border rounded-lg bg-background focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                ))}
              </div>
              <button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-md transition-colors">
                Verify OTP
              </button>
              <p className="text-sm text-center text-muted-foreground">
                Didn't receive the code? <button className="text-primary hover:underline">Resend</button>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  