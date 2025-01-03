'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from './ui/skeleton'



interface TeamSelectorProps {
  onTeamSelect: (team: Team) => void;
  title?: string;
}

// Simulated API call
const fetchTeams = () => new Promise<Team[]>(resolve => {
  setTimeout(() => {
    resolve([
      { id: '1', name: 'Team Alpha', logo: '/placeholder.svg?height=40&width=40', memberCount: 8 },
      { id: '2', name: 'Team Beta', logo: '/placeholder.svg?height=40&width=40', memberCount: 12 },
      { id: '3', name: 'Team Gamma', logo: '/placeholder.svg?height=40&width=40', memberCount: 6 },
      { id: '4', name: 'Team Delta', logo: '/placeholder.svg?height=40&width=40', memberCount: 10 },
    ])
  }, 1500)
})

export default function TeamSelector({ onTeamSelect, title = "Select a Team" }: TeamSelectorProps) {
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchTeams()
      .then(fetchedTeams => {
        setTeams(fetchedTeams)
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to fetch teams:', err)
        setError('Failed to load teams. Please try again later.')
        setLoading(false)
      })
  }, [])

  const handleTeamSelect = (team: Team) => {
    onTeamSelect(team)
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <p className="text-center text-red-500">{error}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-6">
          <h1 className="text-2xl font-bold mb-6 text-center">{title}</h1>
          {loading ? (
            // Skeleton loading state
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[200px]" />
                    <Skeleton className="h-4 w-[100px]" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Team list
            <div className="space-y-4">
              {teams.map(team => (
                <Button
                  key={team.id}
                  variant="outline"
                  className="w-full justify-start text-left h-auto py-3"
                  onClick={() => handleTeamSelect(team)}
                >
                  <div className="flex items-center space-x-4">
                    <Image
                      src={team.logo}
                      alt={`${team.name} logo`}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                    <div>
                      <div className="font-medium">{team.name}</div>
                      <div className="text-sm text-muted-foreground">{team.memberCount} members</div>
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}