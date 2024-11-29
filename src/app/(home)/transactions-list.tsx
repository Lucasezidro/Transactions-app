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

dayjs.locale('pt-br')

interface TransactionsListProps {
  userId: string
}

export function TransactionsList({ userId }: TransactionsListProps) {
  const { data } = useQuery({
    queryFn: () => getTransactions(userId),
    queryKey: [userId, 'transactions'],
  })

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
          {data?.transactions.map((transaction) => {
            return (
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
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
