import { api } from '../api-client'

interface UpdateBookingRequest {
  title: string
  endDate: Date
  status: 'schedulling' | 'processing' | 'finished'
  description: string
  amount: number
  isIncome: boolean
  bookingId: string
}

interface UpdateBookingResponse {
  booking: {
    title: string
    description: string
    amount: string
    isIncome: boolean
    endDate: Date
    status: 'schedulling' | 'processing' | 'finished'
    id: string
    createdAt: Date
    updatedAt: Date
  }
}

export async function updateBooking({
  title,
  status,
  endDate,
  amount,
  isIncome,
  description,
  bookingId,
}: UpdateBookingRequest): Promise<UpdateBookingResponse> {
  const result = await api.put(`/update/booking/${bookingId}`, {
    title,
    status,
    amount,
    isIncome,
    endDate,
    description,
  })

  return result.data
}
