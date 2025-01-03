import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useToast } from '@/hooks/use-toast'

export function useDeleteTeam() {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const deleteTeam = async (teamId: string) => {
    const response = await fetch('/api/teams/delete', {
      method: 'DELETE',
      body: JSON.stringify({ teamId }),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Failed to delete the team')
    }
    return response.json()
  }

  return useMutation({
    mutationKey: ['deleteTeam'],
    mutationFn: deleteTeam,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams', 'all'] })
      toast({
        title: 'Team Deleted!',
        description: 'All members and leaders have been removed from the team!',
      })
    },
    onError: () => {
      toast({
        title: 'Error Deleting Team!',
        description: 'Try Again!',
        variant: 'destructive',
      })
    },
  })
}