'use client'

import { Button } from '@/components/ui/button'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { z } from 'zod'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form'
import { Switch } from '@/components/ui/switch'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createTransaction } from '@/services/transactions/create-transaction'
import { toast } from 'sonner'

const createTransactionSchema = z.object({
  transactionName: z.string(),
  amount: z.coerce.number(),
  description: z.string(),
  isIncome: z.boolean().default(false),
})

type CreateTransactionDataType = z.infer<typeof createTransactionSchema>

interface CreateTransactionsProps {
  userId: string
}

export function CreateTransaction({ userId }: CreateTransactionsProps) {
  const queryClient = useQueryClient()
  const form = useForm<CreateTransactionDataType>({
    resolver: zodResolver(createTransactionSchema),
  })

  const { mutateAsync: createTransactionFn, isPending } = useMutation({
    mutationFn: createTransaction,
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: [userId, 'transactions'],
        type: 'active',
      })
    },
  })

  async function handleCreateTransaction(data: CreateTransactionDataType) {
    const { transactionName, amount, description, isIncome } = data

    await createTransactionFn({
      transactionName,
      amount,
      description,
      isIncome,
      userId,
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
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" className="w-full">
          Adicionar transação
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="mb-8">
          <DialogTitle>Adicionar nova transação</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleCreateTransaction)}
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
              Cadastrar
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
