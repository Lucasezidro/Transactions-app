import { use } from 'react'
import { BookingsList } from './bookings-list'
import { CreateBooking } from './create-booking'

interface BookingsProps {
  params: Promise<{ userId: string }>
}

export default function Bookings({ params }: BookingsProps) {
  const { userId } = use(params)

  return (
    <main>
      <main className="flex flex-col items-center justify-center gap-8 w-full p-8">
        <h1 className="text-2xl font font-extrabold">Agendamentos</h1>
        <CreateBooking userId={userId} />
        <BookingsList userId={userId} />
      </main>
    </main>
  )
}
