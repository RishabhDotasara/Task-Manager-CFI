import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { GhostIcon, HomeIcon } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 text-foreground">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold">404 - Page Not Found</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="text-center">
          <GhostIcon className="mx-auto mb-4 h-24 w-24 animate-bounce text-primary" />
          <p className="mb-4 text-lg">Oops! Looks like this page took a detour to the digital afterlife.</p>
          <p className="italic text-muted-foreground">
            "I see dead links" - The Sixth Sense of Web Browsing
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button asChild>
            <Link href="/task-manager" className="flex items-center">
              <HomeIcon className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

