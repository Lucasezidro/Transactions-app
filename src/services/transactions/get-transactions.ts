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
  totalCount: number
}

export async function getTransactions(
  userId: string,
  page: number = 1,
  perPage: number = 6,
): Promise<GetTransactionsResponse> {
  const result = await api.get(`/fetch/transactions/${userId}`, {
    params: {
      page,
      perPage,
    },
  })

  return result.data
}
