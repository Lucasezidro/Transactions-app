import { api } from '../api-client'

interface GetBookingResponse {
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
  }
}

export async function getBooking(
  bookingId: string,
): Promise<GetBookingResponse> {
  const result = await api.get(`/find/booking/${bookingId}`)

  return result.data
}
