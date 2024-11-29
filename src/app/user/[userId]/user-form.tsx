'use client'

import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { getUser } from '@/services/users/get-user'

import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import 'dayjs/locale/pt-br'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

dayjs.locale('pt-br')

const userSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
})

type UserFormData = z.infer<typeof userSchema>

interface UserFormProps {
  userId: string
}

export function UserForm({ userId }: UserFormProps) {
  const { data } = useQuery({
    queryKey: [userId, 'user'],
    queryFn: () => getUser(userId),
  })

  const form = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
  })

  return (
    <Form {...form}>
      <form className="flex flex-col gap-4 max-w-[680px] w-full">
        <div className="mb-8 flex flex-col gap-2">
          <h1 className="text-xl font-bold">Dados do uauário</h1>
          <span className="text-sm text-zinc-700 dark:text-zinc-400">
            Usuário criado em{' '}
            {dayjs(data?.user.createdAt).format('DD [de] MMMM [de] YYYY')}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex flex-col gap-2 w-full">
            <Label className="dark:text-zinc-400 font-semibold">
              Nome do usuário
            </Label>
            <Input defaultValue={data?.user.name} {...form.register('name')} />
          </div>

          <div className="flex flex-col gap-4 w-full">
            <Label className="dark:text-zinc-400 font-semibold">E-mail</Label>
            <Input
              defaultValue={data?.user.email}
              type="email"
              {...form.register('email')}
            />
          </div>

          <div className="flex flex-col gap-2 w-full">
            <Label className="dark:text-zinc-400 font-semibold">Senha</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Input
                    defaultValue={data?.user.password}
                    type="password"
                    disabled
                    {...form.register('password')}
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <span>Clique em alterar a senha para ter acessa a senha</span>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        <Button variant="outline">Alterar senha</Button>

        <Button>Alterar dados de usuário</Button>
      </form>
    </Form>
  )
}
