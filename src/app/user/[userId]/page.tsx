import { Separator } from '@/components/ui/separator'
import { JobForm } from './job-form'
import { UserForm } from './user-form'

interface UserDetailsProps {
  params: {
    userId: string
  }
}

export default function UserDetails({ params }: UserDetailsProps) {
  const userId = params.userId

  return (
    <main className="flex flex-col items-center justify-center gap-8 w-full p-8">
      <h1 className="text-2xl font font-extrabold">Seu perfil</h1>
      <UserForm userId={userId} />

      <Separator className="w-[680px]" />

      <JobForm userId={userId} />
    </main>
  )
}
