import { api } from '../api-client'

interface SignUpRequest {
  name: string
  email: string
  password: string
}

interface SignUpResponse {
  name: string
  email: string
  password: string
  id: string
  createdAt: Date
  updatedAt: Date
}

export async function signUp({
  name,
  email,
  password,
}: SignUpRequest): Promise<SignUpResponse> {
  const result = await api.post('/create/user', {
    name,
    email,
    password,
  })

  return result.data
}
