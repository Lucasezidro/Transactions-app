import { api } from '../api-client'

export async function deleteBooking(bookingId: string): Promise<void> {
  const result = await api.delete(`/delete/booking/${bookingId}`)

  return result.data
}
