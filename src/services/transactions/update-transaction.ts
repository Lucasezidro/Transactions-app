import { api } from '../api-client'

interface UpdateTransactionRequest {
  transactionName: string
  isIncome: boolean
  amount: number
  description: string
  transactionId: string
}

interface UpdateTransactionResponse {
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

export async function updateTransaction({
  transactionName,
  isIncome,
  amount,
  description,
  transactionId,
}: UpdateTransactionRequest): Promise<UpdateTransactionResponse> {
  const result = await api.put(`/update/transaction/${transactionId}`, {
    transactionName,
    isIncome,
    amount,
    description,
  })

  return result.data
}
