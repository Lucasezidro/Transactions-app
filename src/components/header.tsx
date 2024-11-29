'use client'

import { ThemeSwitcher } from '@/components/theme-switcher'
import { getUser } from '@/services/users/get-user'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeftRight, ArrowRightLeft, LogOut } from 'lucide-react'
import { Menu } from './menu'

interface HeaderProps {
  userId: string
}

export function Header({ userId }: HeaderProps) {
  const { data } = useQuery({
    queryKey: [userId, 'user'],
    queryFn: () => getUser(userId),
  })

  return (
    <header className="w-full h-10 py-12 px-6 bg-zinc-300 dark:bg-zinc-800 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <span className="font-semibold">Bem vindo {data?.user.name}!</span>
      </div>

      <div className="flex items-center gap-4">
        <ArrowLeftRight className="text-emerald-600 dark:text-emerald-400" />
        <h1 className="text-2xl font-bold">Finance App</h1>
        <ArrowRightLeft className="text-red-500" />
      </div>

      <div className="flex items-center gap-4">
        <Menu userId={userId} />
        <ThemeSwitcher />
        <a
          className="flex items-center gap-2 hover:underline hover:text-emerald-600 dark:hover:text-emerald-400"
          href="/api/sign-out"
        >
          Sair
          <LogOut className="size-4" />
        </a>
      </div>
    </header>
  )
}
