import { use } from 'react'
import { UserForm } from './user-form'

interface UserDetailsProps {
  params: Promise<{ userId: string }>
}

export default function UserDetails({ params }: UserDetailsProps) {
  const { userId } = use(params)

  return (
    <main className="flex flex-col items-center justify-center gap-8 w-full p-8">
      <h1 className="text-2xl font font-extrabold">Seu perfil</h1>
      <UserForm userId={userId} />
    </main>
  )
}
