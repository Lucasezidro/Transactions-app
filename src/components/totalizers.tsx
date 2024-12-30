'use client'

import { getTransactions } from '@/services/transactions/get-transactions'
import { useQuery } from '@tanstack/react-query'
import { TotalizersSkeleton } from './loading/totalizers-skeleton'

interface TotalizersProps {
  userId: string
}

export function Totalizers({ userId }: TotalizersProps) {
  const { data, isLoading } = useQuery({
    queryFn: () => getTransactions(userId),
    queryKey: [userId, 'transactions'],
  })

  function sumTotalsByIncomeType() {
    const totals = {
      incomes: 0,
      outcomes: 0,
      balance: 0,
    }

    data?.transactions.forEach((transaction) => {
      if (transaction.isIncome) {
        totals.incomes += transaction.amount
        totals.balance += transaction.amount
      } else {
        totals.outcomes += transaction.amount
        totals.balance -= transaction.amount
      }
    })

    return totals
  }

  if (isLoading) return <TotalizersSkeleton />

  return (
    <div className="flex items-center gap-12 mt-16">
      <div className="w-[200px] h-[100px] border border-emerald-500 rounded-lg p-4 flex flex-col items-center justify-between">
        <h1>Entradas</h1>
        <span className="text-zinc-700 dark:text-zinc-300 font-semibold">
          {new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }).format(sumTotalsByIncomeType().incomes)}
        </span>
      </div>
      <div className="w-[200px] h-[100px] border border-red-500 rounded-lg p-4 flex flex-col items-center justify-between">
        <h1>Saídas</h1>
        <span className="text-zinc-700 dark:text-zinc-300 font-semibold">
          {new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }).format(sumTotalsByIncomeType().outcomes)}
        </span>
      </div>
      <div className="w-[200px] h-[100px] border border-blue-500 rounded-lg p-4 flex flex-col items-center justify-between">
        <h1>Total</h1>
        <span className="text-zinc-700 dark:text-zinc-300 font-semibold">
          {new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }).format(sumTotalsByIncomeType().balance)}
        </span>
      </div>
    </div>
  )
}
