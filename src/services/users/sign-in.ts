import { api } from '../api-client'

interface SignInRequest {
  email: string
  password: string
}

interface SignInResponse {
  token: string
  user: {
    email: string
    password: string
    name: string
    id: string
    createdAt: Date
    updatedAt: Date
  }
}

export async function signIn({
  email,
  password,
}: SignInRequest): Promise<SignInResponse> {
  const result = await api.post('/user/auth', {
    email,
    password,
  })

  return result.data
}
