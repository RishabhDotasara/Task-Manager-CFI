'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Loader2, Trash } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Role } from '@prisma/client'
import { useSession } from 'next-auth/react'
import { useRecoilValue } from 'recoil'
import { permissionAtom } from '@/states/permissionAtom'
import { hasPermission, permissions } from '@/permissionManager/permissions'

type DeleteTeamDialogProps = {
  teamName: string
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onDelete: () => void
  isDeleting: boolean
}

export function DeleteTeamDialog({
  teamName,
  isOpen,
  onOpenChange,
  onDelete,
  isDeleting,
}: DeleteTeamDialogProps) {
  const session = useSession()
  const userPermissions = useRecoilValue(permissionAtom)
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogTrigger asChild>
       
          <Button variant="outline" size="icon" disabled={isDeleting}>
            {isDeleting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash className="h-4 w-4" />
            )}
          </Button>
        
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete the team "{teamName}"? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              onDelete()
              onOpenChange(false)
            }}
            disabled={isDeleting}
          >
            {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Delete'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}