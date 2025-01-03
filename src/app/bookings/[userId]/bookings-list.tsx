'use client'

import { EmptyPage } from '@/components/empty-page'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useQuery } from '@tanstack/react-query'
import { getBookings } from '@/services/bookings/get-bookings'

import dayjs from 'dayjs'
import 'dayjs/locale/pt-br'

import { EditBooking } from './edit-booking'
import { RemoveBooking } from './remove-booking'
import { Badge } from '@/components/ui/badge'
import { translateStatus } from '@/helpers/status-badge-color'
import { TableSkeleton } from '@/components/loading/table-skeleton'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect, ChangeEvent } from 'react'
import { Pagination } from '@/components/pagination'
import { Button } from '@/components/ui/button'
import { Search, Trash, X } from 'lucide-react'

dayjs.locale('pt-br')

interface BookingsListProps {
  userId: string
}

export function BookingsList({ userId }: BookingsListProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [showFilters, setShowFilters] = useState(false)
  const [title, setTitle] = useState('')
  const [status, setStatus] = useState('')

  const currentPageParam = searchParams.get('page') || '1'
  const [currentPage, setCurrentPage] = useState(Number(currentPageParam))
  const itemsPerPage = 6

  useEffect(() => {
    setCurrentPage(Number(currentPageParam))
  }, [currentPageParam])

  const { data, isLoading } = useQuery({
    queryKey: [userId, 'bookings', currentPage],
    queryFn: () => getBookings(userId, currentPage, itemsPerPage),
  })

  const totalPages = Math.ceil((data?.totalCount || 0) / itemsPerPage)

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
    router.push(`?page=${newPage}`)
  }

  const filteredData = data?.bookings.filter((item) => {
    const transactionNameMatches =
      title.length === 0 ||
      item.title
        .toLowerCase()
        .replace(/[aáàãäâ]/g, 'a')
        .replace(/[eéèëê]/g, 'e')
        .replace(/[iíìïî]/g, 'i')
        .replace(/[oóòõöô]/g, 'o')
        .replace(/[uúùüû]/g, 'u')
        .includes(title.toLowerCase())

    const statusMatches = !status || item.status === status

    return transactionNameMatches && statusMatches
  })

  function handleCleamFilters() {
    setTitle('')
    setStatus('')
  }

  function handleCloseFilters() {
    setShowFilters(false)

    handleCleamFilters()
  }

  function handleChangeStatus(e: ChangeEvent<HTMLSelectElement>) {
    setStatus(e.target.value)
  }

  if (data?.bookings.length === 0) {
    return <EmptyPage title="Não há agendamentos cadastrados." />
  }

  return (
    <div className="pb-10">
      {!showFilters && (
        <div className="mt-4">
          <Button variant="ghost" onClick={() => setShowFilters(true)}>
            <Search />
            Filtrar
          </Button>
        </div>
      )}

      {showFilters && (
        <div className="flex items-center gap-4 mb-4 mt-4">
          <input
            className="border-b border-b-emerald-500 py-4 outline-none bg-transparent text-sm text-muted-foreground w-full"
            type="text"
            value={title}
            placeholder="Filtrar pelo nome da transação"
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setTitle(e.target.value)
            }
          />

          <div className="w-full border-b border-b-emerald-400 dark:border-b-emerald-500 mt-3">
            <select
              className="bg-transparent text-sm text-muted-foreground border-0 overflow-hidden p-3 cursor-pointer"
              onChange={handleChangeStatus}
            >
              <option className="text-sm text-muted-foreground" value="">
                Todos os Status
              </option>
              <option
                className="text-sm text-muted-foreground"
                value="finished"
              >
                Finalizado
              </option>
              <option
                className="text-sm text-muted-foreground"
                value="processing"
              >
                Em Processamento
              </option>
              <option
                className="text-sm text-muted-foreground"
                value="schedulling"
              >
                Agendado
              </option>
            </select>
          </div>

          <div className="flex items-center">
            <Button
              variant="ghost"
              disabled={title.length === 0}
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
        <Table className="mt-8">
          <TableHeader>
            <TableRow>
              <TableHead>Titulo</TableHead>
              <TableHead>Data de criação</TableHead>
              <TableHead>Data da entrega</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Status</TableHead>
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
                .map((booking) => {
                  return (
                    <TableRow key={booking.id}>
                      <TableCell>{booking.title}</TableCell>
                      <TableCell>
                        {dayjs(booking.createdAt).format('DD/MM/YYYY')}
                      </TableCell>
                      <TableCell>
                        {dayjs(booking.endDate).format('DD/MM/YYYY')}
                      </TableCell>
                      <TableCell>
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        }).format(booking.amount)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={booking.status}>
                          {translateStatus[booking.status]}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {booking.description}
                      </TableCell>
                      <TableCell className="space-x-4">
                        <EditBooking booking={booking} />
                        <RemoveBooking
                          status={booking.status}
                          bookingName={booking.title}
                          userId={booking.userId}
                          bookingId={booking.id}
                        />
                      </TableCell>
                    </TableRow>
                  )
                })}
          </TableBody>
        </Table>
      )}

      {data && data?.totalCount >= 6 && (
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
