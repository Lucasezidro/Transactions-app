import { api } from '../api-client'

export async function deleteTransaction(transactionId: string): Promise<void> {
  const result = await api.delete(`/delete/transaction/${transactionId}`)

  return result.data
}
