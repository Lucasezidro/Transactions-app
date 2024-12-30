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
import { useState, useEffect } from 'react'
import { Pagination } from '@/components/pagination'

dayjs.locale('pt-br')

interface BookingsListProps {
  userId: string
}

export function BookingsList({ userId }: BookingsListProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

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

  if (data?.bookings.length === 0) {
    return <EmptyPage title="Não há agendamentos cadastrados." />
  }

  return (
    <div>
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
          {data?.bookings.map((booking) => {
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
