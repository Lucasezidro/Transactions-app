import { api } from '../api-client'

interface GetUserResponse {
  user: {
    email: string
    password: string
    name: string
    id: string
    createdAt: Date
    updatedAt: Date
  }
}

export async function getUser(userId: string): Promise<GetUserResponse> {
  const result = await api.get(`/find/user/${userId}`)

  return result.data
}
