'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { useFormState } from '@/hooks/use-form-state'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signUpAction } from './actions'

export function SignUpForm() {
  const router = useRouter()

  const [{ errors }, handleSubmit, isPending] = useFormState(
    signUpAction,
    () => {
      router.push('/auth/sign-in')
    },
  )

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col gap-4">
        <h1 className="text-xl font-semibold mb-8">
          Crie uma conta para ter acesso a plataforma!
        </h1>

        <div className="w-full flex flex-col gap-4">
          <Label className="font-semibold" htmlFor="name">
            Nome Completo
          </Label>
          <Input
            name="name"
            placeholder="Digite o seu nome completo"
            id="name"
          />

          {errors?.name && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400">
              {errors.name[0]}
            </p>
          )}

          <Label className="font-semibold" htmlFor="email">
            E-mail
          </Label>
          <Input
            name="email"
            type="email"
            placeholder="Digite o seu e-mail"
            id="email"
          />

          {errors?.email && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400">
              {errors.email[0]}
            </p>
          )}

          <Label className="font-semibold" htmlFor="password">
            Senha
          </Label>
          <Input
            name="password"
            type="password"
            placeholder="Digite a sua senha"
            id="password"
          />

          {errors?.password && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400">
              {errors.password[0]}
            </p>
          )}

          <Label htmlFor="password_confirmation">Confirm your Password</Label>
          <Input
            name="password_confirmation"
            type="password"
            placeholder="Confirme a senha"
            id="password_confirmation"
          />

          {errors?.confirm_password && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400">
              {errors.confirm_password[0]}
            </p>
          )}
        </div>

        <Separator />

        <div>
          <span className="text-sm text-zinc-400">
            Já possui uma conta ?{' '}
            <Link
              className="text-emerald-400 hover:text-emerald-300 hover:underline underline-offset-2"
              href="/auth/sign-in"
            >
              Acessar conta
            </Link>
          </span>
        </div>

        <Button type="submit" disabled={isPending} className="w-full mt-8">
          Cadastrar
        </Button>
      </div>
    </form>
  )
}
