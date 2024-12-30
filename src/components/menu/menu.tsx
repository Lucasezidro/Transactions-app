import {
  Bolt,
  CalendarCheck,
  Home,
  LogOut,
  User,
  Menu as LucideMenu,
} from 'lucide-react'
import { Button } from '../ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import Link from 'next/link'

interface MenuProps {
  userId: string
}

export function Menu({ userId }: MenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="hover:text-emerald-600 dark:hover:text-emerald-400 text-xl"
        >
          <LucideMenu />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel className="flex items-center gap-4">
          <Bolt />
          Configurações
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link href="/">
            <DropdownMenuItem className="cursor-pointer">
              <Home />
              Home
              <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
            </DropdownMenuItem>
          </Link>
          <Link href={`/user/${userId}`}>
            <DropdownMenuItem className="cursor-pointer">
              <User />
              Minha conta
              <DropdownMenuShortcut>⇧⌘L</DropdownMenuShortcut>
            </DropdownMenuItem>
          </Link>
          <Link href={`/bookings/${userId}`}>
            <DropdownMenuItem className="cursor-pointer">
              <CalendarCheck />
              Agendamentos
              <DropdownMenuShortcut>⇧⌘M</DropdownMenuShortcut>
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <a href="/api/sign-out">
            <DropdownMenuItem className="cursor-pointer">
              <LogOut />
              Sair
            </DropdownMenuItem>
          </a>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
