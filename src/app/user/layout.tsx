import { isAuthenticated, getUserId } from '@/auth/auth'
import { redirect } from 'next/navigation'
import { Header } from '../../components/header'

export default async function UsersLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  if (!isAuthenticated()) {
    redirect('/auth/sign-in')
  }

  const userId = await getUserId()

  return (
    <body>
      <Header userId={userId} />
      {children}
    </body>
  )
}
