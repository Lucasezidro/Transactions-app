'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { getTransactions } from '@/services/transactions/get-transactions'
import { useQuery } from '@tanstack/react-query'

import dayjs from 'dayjs'
import 'dayjs/locale/pt-br'
import { EditTransaction } from './edit-transaction'
import { RemoveTransaction } from './remove-transactions'
import { EmptyPage } from '@/components/empty-page'
import { TableSkeleton } from '../../components/loading/table-skeleton'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Pagination } from '@/components/pagination'

dayjs.locale('pt-br')

interface TransactionsListProps {
  userId: string
}

export function TransactionsList({ userId }: TransactionsListProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentPageParam = searchParams.get('page') || '1'
  const [currentPage, setCurrentPage] = useState(Number(currentPageParam))
  const itemsPerPage = 6

  useEffect(() => {
    setCurrentPage(Number(currentPageParam))
  }, [currentPageParam])

  const { data, isLoading } = useQuery({
    queryFn: () => getTransactions(userId, currentPage, itemsPerPage),
    queryKey: [userId, 'transactions', currentPage],
  })

  const totalPages = Math.ceil((data?.totalCount || 0) / itemsPerPage)

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
    router.push(`?page=${newPage}`)
  }

  if (data?.transactions.length === 0) {
    return <EmptyPage title="Não há transações cadastradas." />
  }

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome da transação</TableHead>
            <TableHead>Data de criação</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead>Tipo de transação</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading && <TableSkeleton />}
          {data?.transactions
            .sort(
              (a, b) =>
                new Date(a.createdAt).getTime() -
                new Date(b.createdAt).getTime(),
            )
            .map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>{transaction.transactionName}</TableCell>
                <TableCell>
                  {dayjs(transaction.createdAt).format('DD/MM/YYYY')}
                </TableCell>
                <TableCell>
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  }).format(transaction.amount)}
                </TableCell>
                <TableCell
                  data-income={transaction.isIncome}
                  className="data-[income=true]:text-emerald-600 dark:data-[income=true]:text-emerald-400 data-[income=false]:text-red-500"
                >
                  {transaction.isIncome ? 'Entrada' : 'Saída'}
                </TableCell>
                <TableCell className="max-w-[200px] truncate">
                  {transaction.description}
                </TableCell>
                <TableCell className="space-x-4">
                  <EditTransaction transaction={transaction} />
                  <RemoveTransaction
                    transactionName={transaction.transactionName}
                    userId={transaction.userId}
                    transactionId={transaction.id}
                  />
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>

      {data && data.totalCount > 6 && (
        <>
          <Pagination
            currentPage={currentPage}
            totalCount={data?.totalCount ?? 0}
            totalPages={totalPages}
            handlePageChange={handlePageChange}
          />
        </>
      )}
    </div>
  )
}
