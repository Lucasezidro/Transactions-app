import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { deleteBooking } from '@/services/bookings/delete-booking'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Trash } from 'lucide-react'
import { toast } from 'sonner'

interface RemoveBookingProps {
  status: 'schedulling' | 'processing' | 'finished'
  bookingName: string
  userId: string
  bookingId: string
}

export function RemoveBooking({
  status,
  bookingName,
  bookingId,
  userId,
}: RemoveBookingProps) {
  const queryClient = useQueryClient()

  const { mutateAsync: deleteBookingFn, isPending } = useMutation({
    mutationFn: deleteBooking,
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: [userId, 'bookings'],
        type: 'active',
      })
    },
  })

  async function handleDeleteBooking() {
    await deleteBookingFn(bookingId).then(() =>
      toast.success('Transação removida com sucesso!'),
    )
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          className="hover:text-red-600 dark:hover:text-red-400 hover:bg-transparent"
          disabled={status === 'finished'}
        >
          <Trash />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Tem certeza que deseja remover o agendamento{' '}
            <strong className="text-emerald-600 dark:text-emerald-400">
              {bookingName}
            </strong>{' '}
            ?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Ao remover o agendamento, esta ação não poderá ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            disabled={isPending}
            onClick={handleDeleteBooking}
            className="bg-red-500 hover:bg-red-500/90 text-zinc-100 dark:text-zinc-950 dark:bg-red-400 dark:hover:bg-red-400/90"
          >
            Remover
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
