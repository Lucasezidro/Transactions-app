import { api } from '../api-client'

interface GetBookingsResponse {
  bookings: {
    title: string
    description: string
    amount: number
    isIncome: boolean
    status: 'schedulling' | 'processing' | 'finished'
    id: string
    endDate: Date
    userId: string
    createdAt: Date
    updatedAt: Date
  }[]
  totalCount: number
}

export async function getBookings(
  userId: string,
  page: number = 1,
  perPage: number = 6,
): Promise<GetBookingsResponse> {
  const result = await api.get(`/fetch/bookings/${userId}`, {
    params: {
      page,
      perPage,
    },
  })

  return result.data
}
