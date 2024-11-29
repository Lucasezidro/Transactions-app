import { api } from '../api-client'

interface CreateTransactionRequest {
  transactionName: string
  isIncome: boolean
  amount: number
  description: string
  userId: string
}

interface CreateTransactionResponse {
  transaction: {
    userId: string
    transactionName: string
    isIncome: boolean
    description: string
    amount: number
    id: string
    createdAt: Date
    updatedAt: Date
  }
}

export async function createTransaction({
  transactionName,
  isIncome,
  amount,
  description,
  userId,
}: CreateTransactionRequest): Promise<CreateTransactionResponse> {
  const result = await api.post(`/create/transaction/${userId}`, {
    transactionName,
    isIncome,
    amount,
    description,
  })

  return result.data
}
