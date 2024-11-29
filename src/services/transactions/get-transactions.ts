import { api } from '../api-client'

interface GetTransactionsResponse {
  transactions: {
    userId: string
    transactionName: string
    isIncome: boolean
    description: string
    amount: number
    id: string
    createdAt: Date
    updatedAt: Date
  }[]
}

export async function getTransactions(
  userId: string,
): Promise<GetTransactionsResponse> {
  const result = await api.get(`/fetch/transactions/${userId}`)

  return result.data
}
