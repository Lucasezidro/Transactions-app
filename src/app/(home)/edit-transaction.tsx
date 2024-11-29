import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { updateTransaction } from '@/services/transactions/update-transaction'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Edit } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

interface EditTransactionProps {
  transaction: {
    userId: string
    transactionName: string
    isIncome: boolean
    description: string
    amount: number
    id: string
    createdAt: Date
    updatedAt: Date
  }
}

const updateTransactionSchema = z.object({
  transactionName: z.string(),
  amount: z.coerce.number(),
  description: z.string(),
  isIncome: z.boolean().default(false),
})

type UpdateTransactionDataType = z.infer<typeof updateTransactionSchema>

export function EditTransaction({ transaction }: EditTransactionProps) {
  const queryClient = useQueryClient()
  const form = useForm<UpdateTransactionDataType>({
    resolver: zodResolver(updateTransactionSchema),
    defaultValues: {
      transactionName: transaction.transactionName,
      amount: transaction.amount,
      description: transaction.description,
      isIncome: transaction.isIncome,
    },
  })

  const { mutateAsync: updateTransactionFn, isPending } = useMutation({
    mutationFn: updateTransaction,
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: [transaction.userId, 'transactions'],
        type: 'active',
      })
    },
  })

  async function handleUpdateTransaction(data: UpdateTransactionDataType) {
    const { transactionName, amount, description, isIncome } = data

    await updateTransactionFn({
      transactionName,
      amount,
      description,
      isIncome,
      transactionId: transaction.id,
    })
      .then(() => {
        toast.success('Transação cadastrada com sucesso!')
      })
      .catch(() => {
        toast.error(
          'Houve um erro ao cadastrar a transação, por favor tente novamente mais tarde.',
        )
      })
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-transparent"
        >
          <Edit />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Editar dados da transação</SheetTitle>
        </SheetHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleUpdateTransaction)}
            className="flex flex-col justify-between gap-4"
          >
            <Label>Nome da transação</Label>
            <Input {...form.register('transactionName')} />

            <Label>Valor</Label>
            <Input {...form.register('amount')} placeholder="R$" />

            <Label>Descrição</Label>
            <Textarea {...form.register('description')} />

            <div>
              <FormField
                control={form.control}
                name="isIncome"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Entrada</FormLabel>
                      <FormDescription>
                        Selecione para indicar que são valores entrando na conta
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <Button disabled={isPending} type="submit">
              Concluir edição
            </Button>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}
