'use client'

import { ArrowLeftRight, ArrowRightLeft, Menu, X } from 'lucide-react'
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '../ui/sheet'
import { Button } from '../ui/button'
import { useState } from 'react'
import Link from 'next/link'

interface MenuMobileProps {
  userId: string
}

export function MenuMobile({ userId }: MenuMobileProps) {
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  return (
    <Sheet open={isSheetOpen}>
      <SheetTrigger asChild>
        <Button
          onClick={() => setIsSheetOpen(true)}
          variant="ghost"
          className="hover:text-emerald-600 dark:hover:text-emerald-400 text-xl"
        >
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full flex flex-col items-center justify-between scroll">
        <div className="flex items-center w-full justify-between px-10">
          <SheetTitle>Configurações</SheetTitle>
          <Button
            onClick={() => setIsSheetOpen(false)}
            variant="ghost"
            className="text-muted-foreground bg-transparent"
          >
            <X />
          </Button>
        </div>

        <div>
          <ul className="flex flex-col items-start gap-8">
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href={`/user/${userId}`}>Minha conta</Link>
            </li>
            <li>
              <Link href={`/bookings/${userId}`}>Agendamentos</Link>
            </li>
          </ul>
        </div>

        <div className="flex items-center gap-4 lg:mr-24">
          <ArrowLeftRight className="text-emerald-600 dark:text-emerald-400" />
          <h1 className="text-lg lg:text-2xl font-bold">Finance App</h1>
          <ArrowRightLeft className="text-red-500" />
        </div>
      </SheetContent>
    </Sheet>
  )
}
