'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
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
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { createBooking } from '@/services/bookings/create-booking'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

const bookingsSchema = z.object({
  title: z.string().min(1, { message: 'Titulo é obrigatório.' }),
  amount: z.coerce.number(),
  isIncome: z.boolean().default(false),
  description: z
    .string()
    .min(5, { message: 'Dogite pelo menos 5 caracteres.' }),
  endDate: z.coerce.date().transform((date) => {
    return dayjs(date).utc().startOf('day').toDate()
  }),
  status: z
    .enum(['schedulling', 'processing', 'finished'])
    .default('schedulling'),
})

type BookingFormData = z.infer<typeof bookingsSchema>

interface CreateBookingProps {
  userId: string
}

export function CreateBooking({ userId }: CreateBookingProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const queryClient = useQueryClient()
  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingsSchema),
  })

  const { mutateAsync: createBookingFn } = useMutation({
    mutationFn: createBooking,
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: [userId, 'bookings'],
        type: 'active',
      })
    },
  })

  const today = dayjs().format('YYYY-MM-DD')

  async function handleCreateBooking(data: BookingFormData) {
    const { description, endDate, status, title, amount, isIncome } = data

    const formattedEndDate = new Date(endDate).toISOString().split('T')[0]

    await createBookingFn({
      title,
      description,
      amount,
      isIncome,
      endDate: new Date(formattedEndDate),
      status: status ?? 'schedulling',
      userId,
    })
      .then(() => {
        toast.success('Agendamento cadastrado com sucesso!')
      })
      .catch(() => {
        toast.error(
          'Houve um erro ao cadastrar o agendamento, por favor tente novamente mais tarde.',
        )
      })
      .finally(() => setIsModalOpen(false))
  }

  return (
    <Dialog open={isModalOpen}>
      <DialogTrigger asChild>
        <Button
          onClick={() => setIsModalOpen(true)}
          variant="secondary"
          className="max-w-[680px] w-full"
        >
          Cadastrar agendamento
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cadastre um novo agendamento</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleCreateBooking)}
            className="flex flex-col gap-4 mt-4"
          >
            <Label>Titulo</Label>
            <Input {...form.register('title')} />

            <Label>Data da entrega</Label>
            <Input {...form.register('endDate')} type="date" min={today} />

            <Label>Valor</Label>
            <div className="flex items-center gap-2 h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm">
              <span className="text-muted-foreground text-sm">R$</span>
              <input
                className="border-0 outline- bg-transparent"
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
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
              >
                Cencelar
              </Button>
              <Button disabled={form.formState.isSubmitting} type="submit">
                Criar agendamento
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
