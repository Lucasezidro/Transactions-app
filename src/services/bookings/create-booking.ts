import { api } from '../api-client'

interface CreateBookingRequest {
  title: string
  endDate: Date
  status: 'schedulling' | 'processing' | 'finished'
  description: string
  amount: number
  isIncome: boolean
  userId: string
}

interface CreateBookingResponse {
  booking: {
    title: string
    description: string
    amount: number
    isIncome: boolean
    endDate: Date
    status: 'schedulling' | 'processing' | 'finished'
    id: string
    createdAt: Date
    updatedAt: Date
  }
}

export async function createBooking({
  title,
  status,
  endDate,
  amount,
  isIncome,
  description,
  userId,
}: CreateBookingRequest): Promise<CreateBookingResponse> {
  const result = await api.post(`/create/booking/${userId}`, {
    title,
    status,
    amount,
    isIncome,
    endDate,
    description,
  })

  return result.data
}
