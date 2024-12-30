'use client'

import { ThemeSwitcher } from '@/components/theme-switcher'
import { getUser } from '@/services/users/get-user'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeftRight, ArrowRightLeft } from 'lucide-react'
import { Menu } from './menu/menu'
import { Skeleton } from './ui/skeleton'
import { MenuMobile } from './menu/menu-mobile'

interface HeaderProps {
  userId: string
}

export function Header({ userId }: HeaderProps) {
  const { data, isLoading } = useQuery({
    queryKey: [userId, 'user'],
    queryFn: () => getUser(userId),
  })

  return (
    <header className="w-full h-10 py-12 px-6 bg-zinc-300 dark:bg-zinc-800 flex items-center justify-between">
      <div className=" hidden lg:flex md:flex items-center gap-4">
        {isLoading ? (
          <Skeleton className="h-4 w-[150px]" />
        ) : (
          <span className="font-semibold">Bem vindo {data?.user.name}!</span>
        )}
      </div>

      <div className="flex items-center gap-4 lg:mr-24">
        <ArrowLeftRight className="text-emerald-600 dark:text-emerald-400" />
        <h1 className="text-lg lg:text-2xl font-bold">Finance App</h1>
        <ArrowRightLeft className="text-red-500" />
      </div>

      <div className="hidden lg:flex items-center">
        <Menu userId={userId} />
        <ThemeSwitcher />
      </div>

      <div className="flex lg:hidden items-center">
        <MenuMobile userId={userId} />
        <ThemeSwitcher />
      </div>
    </header>
  )
}
