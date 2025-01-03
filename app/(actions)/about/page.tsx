'use client'

import { Github, Mail, Twitter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { APP_INFO } from '@/lib/constants/app-info'
import { FeatureRequestDialog } from '@/components/about/FeatureRequestDialog'
import { AppStats } from '@/components/about/AppStats'
import { Separator } from '@radix-ui/react-dropdown-menu'


export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">{APP_INFO.name}</h1>
          <p className="text-xl text-muted-foreground mb-6">
            Streamline your workflow, enhance productivity
          </p>
          <div className="flex justify-center gap-4">
            <FeatureRequestDialog />
            <Button variant="outline" asChild>
              <a href={APP_INFO.githubRepo} target="_blank" rel="noopener noreferrer" className="gap-2">
                <Github className="h-4 w-4" />
                View on GitHub
              </a>
            </Button>
          </div>
        </div>

        <AppStats />

        <div className="mt-12 space-y-8">
          <div className="bg-card rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">About the Application</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Version</p>
                <p className="font-medium">{APP_INFO.version}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Release Date</p>
                <p className="font-medium">{APP_INFO.releaseDate}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Developer</p>
                <p className="font-medium">{APP_INFO.developer}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Maintainer</p>
                <p className="font-medium">{APP_INFO.maintainer}</p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Connect With Us</h2>
            <div className="flex gap-4">
              <Button variant="outline" className="gap-2">
                <Twitter className="h-4 w-4" />
                Follow us
              </Button>
              <Button variant="outline" className="gap-2">
                <Mail className="h-4 w-4" />
                Contact Support
              </Button>
            </div>
          </div>

          <Separator className="my-8" />

          <footer className="text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} {APP_INFO.developer}. All rights reserved.</p>
          </footer>
        </div>
      </div>
    </div>
  )
}