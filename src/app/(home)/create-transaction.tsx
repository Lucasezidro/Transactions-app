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
import { useState } from 'react'

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
  const [isModalOpen, setIsModalOpen] = useState(false)
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
      .finally(() => setIsModalOpen(false))
  }

  return (
    <Dialog open={isModalOpen}>
      <DialogTrigger asChild>
        <Button
          onClick={() => setIsModalOpen(true)}
          variant="ghost"
          className="w-full"
        >
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
            <div className="flex items-center gap-2 h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm">
              <span className="text-muted-foreground text-sm">R$</span>
              <input
                className="border-0 outline-none bg-transparent w-full"
                {...form.register('amount')}
              />
            </div>

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

            <div className="flex items-center justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsModalOpen(false)}
                type="button"
              >
                Cancelar
              </Button>
              <Button disabled={isPending} type="submit">
                Cadastrar
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
