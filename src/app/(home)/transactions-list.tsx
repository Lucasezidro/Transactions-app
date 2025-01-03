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
import { ChangeEvent, useEffect, useState } from 'react'
import { Pagination } from '@/components/pagination'
import { Button } from '@/components/ui/button'
import { Search, Trash, X } from 'lucide-react'

dayjs.locale('pt-br')

interface TransactionsListProps {
  userId: string
}

export function TransactionsList({ userId }: TransactionsListProps) {
  const [showFilters, setShowFilters] = useState(false)

  const [searchByName, setSearchByName] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

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

  const filteredData = data?.transactions.filter((item) => {
    const transactionNameMatches =
      searchByName.length === 0 ||
      item.transactionName
        .toLowerCase()
        .replace(/[aáàãäâ]/g, 'a')
        .replace(/[eéèëê]/g, 'e')
        .replace(/[iíìïî]/g, 'i')
        .replace(/[oóòõöô]/g, 'o')
        .replace(/[uúùüû]/g, 'u')
        .includes(searchByName.toLowerCase())

    const transactionDate = dayjs(item.createdAt)
    const startDateMatches =
      !startDate || transactionDate.isAfter(dayjs(startDate))
    const endDateMatches = !endDate || transactionDate.isBefore(dayjs(endDate))

    return transactionNameMatches && startDateMatches && endDateMatches
  })

  function handleCleamFilters() {
    setSearchByName('')
    setStartDate('')
    setEndDate('')
  }

  function handleCloseFilters() {
    setShowFilters(false)

    handleCleamFilters()
  }

  if (data?.transactions.length === 0) {
    return <EmptyPage title="Não há transações cadastradas." />
  }

  return (
    <div className="pb-10">
      {!showFilters && (
        <div className="mb-8 mt-4">
          <Button variant="ghost" onClick={() => setShowFilters(true)}>
            <Search />
            Filtrar
          </Button>
        </div>
      )}

      {showFilters && (
        <div className="flex items-center gap-4 mb-8 mt-4">
          <input
            className="border-b border-b-emerald-500 py-4 outline-none bg-transparent text-sm text-muted-foreground w-full"
            type="text"
            value={searchByName}
            placeholder="Filtrar pelo nome da transação"
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setSearchByName(e.target.value)
            }
          />
          <input
            className="border-b border-b-emerald-500 py-4 outline-none bg-transparent text-sm text-muted-foreground w-full"
            type="date"
            value={startDate}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setStartDate(e.target.value)
            }
          />
          <input
            className="border-b border-b-emerald-500 py-4 outline-none bg-transparent text-sm text-muted-foreground w-full"
            type="date"
            value={endDate}
            min={startDate}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setEndDate(e.target.value)
            }
          />

          <div className="flex items-center">
            <Button
              variant="ghost"
              disabled={
                searchByName.length === 0 &&
                startDate.length === 0 &&
                endDate.length === 0
              }
              onClick={handleCleamFilters}
            >
              <Trash />
            </Button>

            <Button variant="ghost" onClick={handleCloseFilters}>
              <X />
            </Button>
          </div>
        </div>
      )}

      {filteredData?.length === 0 && (
        <EmptyPage title="Não há resultados para o filtro buscado." />
      )}

      {filteredData?.length !== 0 && (
        <>
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
              {filteredData &&
                filteredData
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
        </>
      )}
    </div>
  )
}
