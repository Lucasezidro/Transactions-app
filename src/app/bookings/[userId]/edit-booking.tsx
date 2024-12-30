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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Textarea } from '@/components/ui/textarea'
import { updateBooking } from '@/services/bookings/update-booking'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Edit } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import dayjs from 'dayjs'

import 'dayjs/locale/pt-br'

import utc from 'dayjs/plugin/utc'
import { Switch } from '@/components/ui/switch'
dayjs.locale('pt-br')
dayjs.extend(utc)

interface EditBookingProps {
  booking: {
    title: string
    description: string
    endDate: Date
    status: 'schedulling' | 'processing' | 'finished'
    amount: number
    isIncome: boolean
    id: string
    createdAt: Date
    updatedAt: Date
    userId: string
  }
}

const bookingsSchema = z.object({
  title: z.string().min(1, { message: 'Título é obrigatório.' }),
  amount: z.coerce.number(),
  isIncome: z.boolean().default(false),
  description: z
    .string()
    .min(5, { message: 'Digite pelo menos 5 caracteres.' }),
  endDate: z.coerce.date().transform((date) => {
    return dayjs(date).utc().startOf('day').toDate()
  }),
  status: z
    .enum(['schedulling', 'processing', 'finished'])
    .default('schedulling'),
})

type UpdateBookingDataType = z.infer<typeof bookingsSchema>

export function EditBooking({ booking }: EditBookingProps) {
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const queryClient = useQueryClient()
  const form = useForm<UpdateBookingDataType>({
    resolver: zodResolver(bookingsSchema),
    defaultValues: {
      title: booking.title,
      status: booking.status,
      amount: booking.amount,
      isIncome: booking.isIncome ?? false,
      description: booking.description,
    },
  })

  const { mutateAsync: updateBookingFn, isPending } = useMutation({
    mutationFn: updateBooking,
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: [booking.userId, 'bookings'],
        type: 'active',
      })
    },
  })

  const today = dayjs().format('YYYY-MM-DD')

  async function handleUpdateBooking(data: UpdateBookingDataType) {
    const { title, description, endDate, status, amount, isIncome } = data

    const formattedEndDate = new Date(endDate).toISOString().split('T')[0]

    await updateBookingFn({
      title,
      description,
      amount,
      isIncome,
      endDate: new Date(formattedEndDate),
      status,
      bookingId: booking.id,
    })
      .then(() => {
        toast.success('Agendamento atualizado com sucesso!')
      })
      .catch(() => {
        toast.error(
          'Houve um erro ao atualizar o agendamento, por favor tente novamente mais tarde.',
        )
      })
      .finally(() => setIsSheetOpen(false))
  }

  return (
    <Sheet open={isSheetOpen}>
      <SheetTrigger asChild>
        <Button
          onClick={() => setIsSheetOpen(true)}
          variant="ghost"
          className="hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-transparent"
        >
          <Edit />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Editar dados do agendamento</SheetTitle>
        </SheetHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleUpdateBooking)}
            className="flex flex-col justify-between gap-4"
          >
            <Label>Título</Label>
            <Input {...form.register('title')} />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={form.getValues('status') === 'finished'}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="schedulling">Agendado</SelectItem>
                      <SelectItem value="processing">
                        Em processamento
                      </SelectItem>
                      <SelectItem value="finished">Finalizado</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <Label>Data de entrega</Label>
            <Input
              defaultValue={
                new Date(booking.endDate).toISOString().split('T')[0]
              }
              {...form.register('endDate')}
              type="date"
              min={today}
            />

            <Label>Valor</Label>
            <div className="flex items-center gap-2 h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm">
              <span className="text-muted-foreground text-sm">R$</span>
              <input
                className="border-0 outline-none bg-transparent"
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

            <Button disabled={isPending} type="submit">
              Concluir edição
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsSheetOpen(false)}
            >
              Cancelar
            </Button>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}
