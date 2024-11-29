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
import { deleteTransaction } from '@/services/transactions/delete-transaction'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Trash } from 'lucide-react'
import { toast } from 'sonner'

interface RemoveTransactionProps {
  transactionName: string
  userId: string
  transactionId: string
}

export function RemoveTransaction({
  transactionName,
  transactionId,
  userId,
}: RemoveTransactionProps) {
  const queryClient = useQueryClient()

  const { mutateAsync: deleteTransactionFn, isPending } = useMutation({
    mutationFn: deleteTransaction,
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: [userId, 'transactions'],
        type: 'active',
      })
    },
  })

  async function handleDeleteTransaction() {
    await deleteTransactionFn(transactionId).then(() =>
      toast.success('Transação removida com sucesso!'),
    )
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          className="hover:text-red-600 dark:hover:text-red-400 hover:bg-transparent"
        >
          <Trash />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Tem certeza que deseja remover a transação{' '}
            <strong className="text-emerald-600 dark:text-emerald-400">
              {transactionName}
            </strong>{' '}
            ?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Ao remover a transação, esta ação não poderá ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            disabled={isPending}
            onClick={handleDeleteTransaction}
            className="bg-red-500 hover:bg-red-500/90 text-zinc-100 dark:text-zinc-950 dark:bg-red-400 dark:hover:bg-red-400/90"
          >
            Remover
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
