'use client'

import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Users } from 'lucide-react'
import { Team } from '@prisma/client'
import { TeamMembersTable } from './TeamMembersTable'


type TeamMembersDialogProps = {
  team: Team
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export function TeamMembersDialog({ team, isOpen, onOpenChange }: TeamMembersDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Users className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold mb-4">
            Team Members - {team.name}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <TeamMembersTable title="Team Leaders" members={team.leaders} role="Leader" />
          <TeamMembersTable title="Team Members" members={team.members} role="Member" />
        </div>
      </DialogContent>
    </Dialog>
  )
}