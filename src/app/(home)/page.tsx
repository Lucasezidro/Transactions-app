import { Totalizers } from '@/components/totalizers'
import { CreateTransaction } from './create-transaction'
import { getUserId } from '@/auth/auth'
import { TransactionsList } from './transactions-list'

export default async function Home() {
  const userId = getUserId()

  return (
    <main className="flex items-start justify-center">
      <div className="flex flex-col items-center gap-8">
        <Totalizers userId={userId} />

        <CreateTransaction userId={userId} />
        <TransactionsList userId={userId} />
      </div>
    </main>
  )
}
